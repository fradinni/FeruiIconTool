import {
  AfterViewInit,
  Component, ElementRef,
  EventEmitter,
  Input, NgZone,
  OnChanges,
  Output,
  SimpleChanges, TemplateRef,
  ViewChild
} from '@angular/core';
import { TsObject } from '../../interfaces/common-interfaces';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { Editor, EditorFromTextArea } from 'codemirror';
import { SvgFile } from '../../models/svg-file';

export enum EditorViewType {
  ORIGINAL = 'ORIGINAL',
  OPTIMIZED = 'OPTIMIZED',
  TYPESCRIPT = 'TYPESCRIPT'
}

export interface IgnoredLinesChangeEvent {
  ignoredLines: Set<number>;
  data: string;
}

@Component({
  selector: 'file-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements AfterViewInit, OnChanges {

  @ViewChild(CodemirrorComponent) codeMirrorComponent: CodemirrorComponent;

  @Output() dataChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() onIgnoredLinesChange: EventEmitter<IgnoredLinesChangeEvent> = new EventEmitter<IgnoredLinesChangeEvent>();

  @Input() viewType: EditorViewType;
  @Input('data') _data: string;
  editorOptions: TsObject;
  editorError: Error;
  nativeCodeMirror: EditorFromTextArea;
  ignoredLines: Set<number> = new Set<number>();


  // ------------------------------------------------------------------------
  // Getters & Setters
  //
  set data(value: string) {
    this._data = value;
    this.dataChange.emit(value);
  }
  get data(): string {
    return this._data
  }

  constructor(private ngZone: NgZone) { }

  /**
   * Called when view and components are initialized
   */
  ngAfterViewInit(): void {
    if (!this.codeMirrorComponent) {
      this.editorError = new Error('Editor is not available');
      return;
    }
    // Timeout to let time to native CodeMirror object to be initialized.
    setTimeout(() => {
      if (this.codeMirrorComponent?.codeMirror) {
        this.nativeCodeMirror = this.codeMirrorComponent.codeMirror;
        this.onAfterCodeMirrorInit();
      } else {
        this.editorError = new Error('Editor is not available');
      }
    });
  }

  /**
   * Called when native CodeMirror is initialized
   */
  onAfterCodeMirrorInit(): void {
    this.nativeCodeMirror.on('gutterClick', (codeMirror, lineIndex) => {
      if (this.viewType === EditorViewType.OPTIMIZED) {
        // Native CodeMirror events are executed outside of Angular context, use ngZone.run() to execute
        // callback code in the Angular context.
        this.ngZone.run(() => this.onGutterClick(codeMirror, lineIndex));
      }
    });
  }

  /**
   * Called when Inputs are updated
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.viewType) {
      this.onViewTypeChange(changes.viewType.currentValue);
    }
    // If optimized data has changed, re-add exiting gutter markers for ignored lines.
    if (changes._data && this.viewType === EditorViewType.OPTIMIZED) {
      // Timeout to let time to editor to be initialized with new changes.
      setTimeout(() =>this.addGutterMarkers());
    }
  }

  /**
   * Called when viewType has changed
   */
  onViewTypeChange(viewType: EditorViewType): void {
    switch (viewType) {
      case EditorViewType.ORIGINAL:
        this.editorOptions = this.getSvgEditorOptions();
        this.clearGutterMarkers();
        break;
      case EditorViewType.OPTIMIZED:
        this.editorOptions = this.getSvgEditorOptions();
        // If switched to OPTIMIZED view, re-add exiting gutter markers for ignored lines.
        // Timeout to let time to editor to be initialized with new options.
        setTimeout(() => this.addGutterMarkers());
        break;
      case EditorViewType.TYPESCRIPT:
        this.editorOptions = this.getTypescriptEditorOptions();
        this.clearGutterMarkers();
        break;
    }
  }

  /**
   * Called when editor gutter is clicked
   * @param codeMirror
   * @param lineIndex
   */
  onGutterClick(codeMirror: Editor, lineIndex: number): void {
    const gutterMarkers = codeMirror.lineInfo(lineIndex)?.gutterMarkers;
    // If an 'ignoredLines' marker already exist on current line -> delete it
    if (gutterMarkers?.ignoredLines) {
      codeMirror.setGutterMarker(lineIndex, "ignoredLines", null);
      this.ignoredLines.delete(lineIndex);
    }
    // else add a new marker on current line
    else {
      codeMirror.setGutterMarker(lineIndex, "ignoredLines", this.getIgnoredLineMarker());
      this.ignoredLines.add(lineIndex);
    }
    // Emit ignoredLines change event
    this.emitIgnoredLinesChangeEvent();
  }

  /**
   * Remove all gutter markers from editor.
   */
  clearGutterMarkers(clearIgnoredLinesSet?: boolean): void {
    // Remove 'ignoredLines' markers
    for (let lineIndex of this.ignoredLines) {
      this.nativeCodeMirror.setGutterMarker(lineIndex, "ignoredLines", null);
    }
    if (clearIgnoredLinesSet) {
      // Clear ignoredLines Set
      this.ignoredLines.clear();
      this.emitIgnoredLinesChangeEvent();
    }
  }

  /**
   * Add gutter markers to editor
   */
  addGutterMarkers(): void {
    for (let lineIndex of this.ignoredLines) {
      this.nativeCodeMirror.setGutterMarker(lineIndex, "ignoredLines", this.getIgnoredLineMarker());
    }
  }

  /**
   * Generate ignored line marker that is inserted in editor gutter
   */
  getIgnoredLineMarker(): HTMLElement {
    const marker = document.createElement('div');
    marker.innerHTML = '🚫';
    marker.style.fontSize = '12px'
    return marker;
  }

  /**
   * Emit IgnoredLinesChangeEvent
   */
  emitIgnoredLinesChangeEvent() {
    this.onIgnoredLinesChange.emit({
      ignoredLines: this.ignoredLines,
      data: this.generateDataWithoutIgnoredLines()
    });
  }

  /**
   * Returns editor data without ignored lines or 'null' if no line is ignored.
   */
  generateDataWithoutIgnoredLines(): string {
    let data;
    // If we have ignored lines, generate data.
    if (this.ignoredLines.size > 0) {
      data = '';
      this.nativeCodeMirror.eachLine((line) => {
        const lineInfo = this.nativeCodeMirror.lineInfo(line);
        // If line doesn't have an 'ignoredLines' marker, add line to data.
        if (!lineInfo.gutterMarkers?.ignoredLines) {
          data += line.text + '\n';
        }
      });
    }
    return data;
  }

  /**
   * Get editor options for SVG
   */
  getSvgEditorOptions(): TsObject {
    return {
      lineNumbers: true,
      //lineWrapping: true,
      theme: 'material',
      scrollbarStyle: 'overlay',
      mode: 'xml',
      dragDrop: false,
      tabSize: 2,
      gutters: ['ignoredLines', 'CodeMirror-linenumbers']
    }
  }

  /**
   * Get editor options for Typescript
   */
  getTypescriptEditorOptions(): TsObject {
    return {
      lineNumbers: true,
      //lineWrapping: true,
      theme: 'material',
      scrollbarStyle: 'overlay',
      mode: 'text/typescript',
      dragDrop: false,
      tabSize: 2,
      gutters: ['ignoredLines', 'CodeMirror-linenumbers']
    }
  }
}
