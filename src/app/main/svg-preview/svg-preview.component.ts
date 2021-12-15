import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import * as svgPanZoom from 'svg-pan-zoom/dist/svg-pan-zoom.min';
import { SvgSettings } from '../../interfaces/common-interfaces';

@Component({
  selector: 'svg-preview',
  templateUrl: './svg-preview.component.html',
  styleUrls: ['./svg-preview.component.scss']
})
export class SvgPreviewComponent implements AfterViewInit, OnChanges {

  @ViewChild('svgContainer') container: ElementRef;
  @Input('svg') svg: string;
  @Input('svgSettings') settings: SvgSettings;

  panZoom: any;
  panZoomInitialized: boolean = false;
  svgElement: HTMLElement;
  invalidSvg: boolean = false;
  currentZoomValue: number = 0;
  currentPanValue: object;
  buttonOrInternalZoom: boolean = false;

  FillColors = [
    '#03A6FF',  // FerUI Blue
    '#F76464',  // FerUI Red
    '#FAA638',  // FerUI Orange
    '#5BCD5D',  // FerUI Green
    '#87a1b5',  // FerUI Gray
  ];
  BgColors = [
      '#FFFFFF',  // FerUI White Background
      '#191C28',  // FerUI Dark Background
      '#03A6FF'   // FerUI Blue
  ];
  fillColor: string;
  bgColor: string;
  twoToneIcon: boolean;
  solidIcon: boolean;
  outlineIcon: boolean;

  constructor() {
    this.fillColor = this.FillColors[0];
    this.bgColor = this.BgColors[0];
    this.twoToneIcon = true;
    this.solidIcon = false;
    this.outlineIcon = false;
  }

  ngAfterViewInit(): void {
    this.updateSvgPreview();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.container && changes.svg) {
      this.updateSvgPreview();
    }
  }

  setTwoToneIcon() {
    this.twoToneIcon = true;
    this.solidIcon = false;
    this.outlineIcon = false;
  }

  setSolidIcon() {
    this.twoToneIcon = false;
    this.solidIcon = true;
    this.outlineIcon = false;
  }

  setOutlineIcon() {
    this.twoToneIcon = false;
    this.solidIcon = false;
    this.outlineIcon = true;
  }

  /**
   * Reset zoom
   */
  zoomReset() {
    if (this.panZoom) {
      this.execButtonOrInternalZoom(() => {
        this.panZoom.center();
        this.panZoom.fit();
        this.zoomOut();
        //this.saveZoomAndPanValues();
      });
    }
  }

  /**
   * Zoom In
   */
  zoomIn() {
    this.execButtonOrInternalZoom(() => {
      this.panZoom.zoomIn();
      this.saveZoomAndPanValues();
    })
  }

  /**
   * Zoom Out
   */
  zoomOut() {
    this.execButtonOrInternalZoom(() => {
      this.panZoom.zoomOut();
      this.saveZoomAndPanValues();
    });
  }

  /**
   * Return current file size
   */
  getFileSize(): string {
    // @ts-ignore
    const buffer = Buffer.from(this.svg);
    return this.bytesToSize(buffer.length);
  }

  /**
   * Convert bytes to more human readable unit.
   * @param bytes
   * @private
   */
  private bytesToSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    const i: number = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
  }

  private updateSvgPreview() {
    if (this.svg) {
      if (this.panZoom) {
        svgPanZoom(this.svgElement).destroy();
        this.container.nativeElement.removeChild(this.svgElement);
      }
      this.panZoom = null;
      this.svgElement = null;
      if (this.validateSvg(this.svg)) {
        this.invalidSvg = false;
        this.displaySvgPreview();
      } else {
        this.invalidSvg = true;
      }
    } else {
      if (this.panZoom) {
        svgPanZoom(this.svgElement).destroy();
        this.container.nativeElement.removeChild(this.svgElement);
        this.svgElement = null;
        this.panZoom = null;
      }
      this.invalidSvg = true;
    }
  }

  private displaySvgPreview() {
    this.svgElement = this.createElementFromHtml(this.svg);
    if (!this.svgElement?.setAttribute) {
      return
    }
    this.svgElement.setAttribute('id', 'svg-image');
    this.svgElement.setAttribute('style', 'width: 100%; height: 100%;');
    this.container.nativeElement.appendChild(this.svgElement);
    setTimeout(() => {
      this.panZoom = svgPanZoom(this.svgElement, {
        zoomEnabled: true,
        controlIconsEnabled: false,
        fit: true,
        center: true,
        minZoom: 0.01,
        maxZoom: 200,
        zoomScaleSensitivity: 0.2,
        onZoom: (value: number) => {
          if (this.panZoomInitialized && !this.buttonOrInternalZoom) {
            this.onWheelZoom(value);
          }
        },
        onPan: (value) => {
          if (this.panZoomInitialized && (value.x != 0 && value.y != 0)) {
            this.currentPanValue = value;
          }
        },
        customEventsHandler: {
          haltEventListeners: [],
          init: (options) => {
            this.panZoomInitialized = true;
          },
          destroy: () => {
            this.panZoomInitialized = false;
          }
        }
      });
      if (this.currentZoomValue > 0 && this.currentPanValue) {
        // On refresh, re-apply previous zoom and pan values.
        this.execButtonOrInternalZoom(() => {
          this.panZoom.zoom(this.currentZoomValue);
          this.panZoom.pan(this.currentPanValue);
        });
      } else {
        // On first load, zoom out to avoid svg to touch borders.
        this.zoomOut();
      }
    });
  }

  /**
   * Save current Zoom and Pan values.
   * @private
   */
  private saveZoomAndPanValues() {
    this.currentPanValue = this.panZoom.getPan();
    this.currentZoomValue = this.panZoom.getZoom();
  }

  /**
   * Handler for Mouse Wheel Zoom
   * @param value
   * @private
   */
  private onWheelZoom(value) {
    this.saveZoomAndPanValues();
  }

  /**
   * Function wrapper for button or internal Zoom calls.
   * This wrapper will set a boolean before calling the function then revert it.
   * This is used to isolate and detect mouse wheel events.
   * This wrapper must be used ech time you want to execute zoom actions that are not mouse wheel actions.
   * @param func
   */
  private execButtonOrInternalZoom = (func: Function): void => {
    this.buttonOrInternalZoom = true;
    func();
    this.buttonOrInternalZoom = false;
  }

  /**
   * Create a HTMLElement from inline html code.
   * @param html Inline html code
   * @returns HTML Element
   */
  private createElementFromHtml(html: string): HTMLElement {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.firstChild as HTMLElement;
  }

  private validateSvg(svg: string): boolean {
    const div = document.createElement('div');
    div.innerHTML = svg;
    if (div.querySelector('svg') && div.querySelectorAll('path').length) {
      return Array.from(div.querySelectorAll('path')).every(it => it.getTotalLength() > 0);
    }
    return false;
  }

}
