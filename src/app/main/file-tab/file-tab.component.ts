import { Component, Input, OnInit } from '@angular/core';
import { SvgFile } from '../../models/svg-file';
import { SvgSettings } from '../../interfaces/common-interfaces';
import { EditorViewType, IgnoredLinesChangeEvent } from '../editor/editor.component';
import { SvgOptimizeService } from '../../services/svg-optimize.service';

@Component({
  selector: 'file-tab',
  templateUrl: './file-tab.component.html',
  styleUrls: ['./file-tab.component.css']
})
export class FileTabComponent implements OnInit {

  @Input() file: SvgFile;
  viewType: EditorViewType;
  pathCount: number = 0;

  private _iconName: string;
  private _optimizeSettings: SvgSettings;
  private _ignoredLinesData: string;

  // ------------------------------------------------------------------------
  // Getters & Setters
  //
  /**
   * Editor Data
   */
  get iconName(): string {
    return this._iconName;
  }
  set iconName(value: string) {
    this._iconName = value || this.svgOptimizeService.getIconName(this.file.name);
  }

  /**
   * Editor Data
   */
  get editorData(): string {
    switch (this.viewType) {
      case EditorViewType.ORIGINAL:
        return this.file.data;
      case EditorViewType.OPTIMIZED:
        return this.file.optimizedData;
      case EditorViewType.TYPESCRIPT:
        return this.file.feruiData;
    }
  }
  set editorData(value: string) {
    this.onEditorDataChange(value);
  }

  /**
   * Preview data
   */
  get previewData(): string {
    return this._ignoredLinesData || this.file.optimizedData;
  }

  /**
   * Optimize Settings
   */
  get optimizeSettings(): SvgSettings {
    return this._optimizeSettings;
  }
  set optimizeSettings(value: SvgSettings) {
    this._optimizeSettings = value;
    this.onSettingsChange();
  }

  // ------------------------------------------------------------------------
  // Constructor & Public Methods
  //
  constructor(private svgOptimizeService: SvgOptimizeService) {
    this.optimizeSettings = this.svgOptimizeService.getDefaultSettings();
    this.viewType = EditorViewType.OPTIMIZED;
  }

  ngOnInit() {
    this.iconName = this.svgOptimizeService.getIconName(this.file.name);
    this.generateFileData();
  }

  /**
   * Generate Optimized and FerUI data.
   */
  generateFileData(): void {
    this.file.optimizedData = this.svgOptimizeService.optimize(this.file.data, this.iconName, this.optimizeSettings);
    this.file.feruiData = this.svgOptimizeService.generateFeruiCode(this.iconName, this.file.optimizedData);
  }

  /**
   * Called when editor data has changed
   * @param data
   */
  onEditorDataChange(data: string) {
    switch (this.viewType) {
      case EditorViewType.ORIGINAL:
        this.file.data = data;
        if (this.svgOptimizeService.validateSvg(data)) {
          this.file.optimizedData = this.svgOptimizeService.optimize(this.file.data, this.iconName, this.optimizeSettings);
          this.file.feruiData = this.svgOptimizeService.generateFeruiCode(this.iconName, this.file.optimizedData);
        }
        break;
      case EditorViewType.OPTIMIZED:
        this.file.optimizedData = data;
        if (this.svgOptimizeService.validateSvg(data)) {
          this.file.feruiData = this.svgOptimizeService.generateFeruiCode(this.iconName, this.file.optimizedData);
        }
        break;
      case EditorViewType.TYPESCRIPT:
        this.file.feruiData = data;
    }
  }

  /**
   * Called when optimizeSettings has changed
   */
  onSettingsChange(): void {
    if (this.file) {
      this.generateFileData();
    }
  }

  /**
   * Called when ignored lines has changed
   * @param event
   */
  onIgnoredLinesChange(event: IgnoredLinesChangeEvent) {
    this._ignoredLinesData = event.data;
  }

  /**
   * Returns SVG paths count for current editor data.
   */
  getPathCount() {
    switch (this.viewType) {
      case EditorViewType.ORIGINAL:
        return this.svgOptimizeService.getSvgPathCount(this.file.data);
      default:
        return this.svgOptimizeService.getSvgPathCount(this.file.optimizedData);
    }
  }

  /**
   * Check if current editor data can be reset
   */
  canResetRawData(): boolean {
    return this.file.data !== this.file.rawData;
  }

  /**
   * Reset current editor data changes
   */
  resetRawDataChanges(): void {
    this.file.reset();
    this.generateFileData();
  }
}
