import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SvgSettings } from '../../interfaces/common-interfaces';

@Component({
  selector: 'svg-settings',
  templateUrl: './svg-settings.component.html',
  styleUrls: ['./svg-settings.component.css']
})
export class SvgSettingsComponent implements OnInit {

  @Output() change: EventEmitter<SvgSettings> = new EventEmitter<SvgSettings>();
  @Output() settingsChange: EventEmitter<SvgSettings> = new EventEmitter<SvgSettings>();
  @Input('settings') _settings!: SvgSettings;

  constructor() {
  }

  ngOnInit(): void {}

  /** Merge Paths */
  set mergePaths(value: boolean) {
    this._settings.mergePaths = value;
    this.settingsChange.emit(this._settings);
    this.change.emit(this._settings);
  }
  get mergePaths(): boolean {
    return this._settings.mergePaths;
  }

  /** Merge Paths Force */
  set mergePathsForce(value: boolean) {
    this._settings.mergePathsForce = value;
    this.settingsChange.emit(this._settings);
    this.change.emit(this._settings);
  }
  get mergePathsForce(): boolean {
    return this._settings.mergePathsForce;
  }

  /** Merge Paths Precision */
  set mergePathsPrecision(value: number) {
    this._settings.mergePathsPrecision = value;
    this.settingsChange.emit(this._settings);
    this.change.emit(this._settings);
  }
  get mergePathsPrecision(): number {
    return this._settings.mergePathsPrecision;
  }

  /** Optimize */
  set optimize(value: boolean) {
    this._settings.optimize = value;
    this.settingsChange.emit(this._settings);
    this.change.emit(this._settings);
  }
  get optimize(): boolean {
    return this._settings.optimize;
  }

  /** Precision */
  set precision(precision: number) {
    this._settings.precision = precision;
    this.settingsChange.emit(this._settings);
    this.change.emit(this._settings);
  }
  get precision(): number {
    return this._settings.precision;
  }

  /** Remove fill */
  set removeFill(value: boolean) {
    this._settings.removeFill = value;
    this.settingsChange.emit(this._settings);
    this.change.emit(this._settings);
  }
  get removeFill(): boolean {
    return this._settings.removeFill;
  }

  /** Remove clip-rule */
  set removeClipRule(value: boolean) {
    this._settings.removeClipRule = value;
    this.settingsChange.emit(this._settings);
    this.change.emit(this._settings);
  }
  get removeClipRule(): boolean {
    return this._settings.removeClipRule;
  }

  /** Remove fill-rule */
  set removeFillRule(value: boolean) {
    this._settings.removeFillRule = value;
    this.settingsChange.emit(this._settings);
    this.change.emit(this._settings);
  }
  get removeFillRule(): boolean {
    return this._settings.removeFillRule;
  }

  /** Remove XMLNS */
  set removeXmlns(value: boolean) {
    this._settings.removeXmlns = value;
    this.settingsChange.emit(this._settings);
    this.change.emit(this._settings);
  }
  get removeXmlns(): boolean {
    return this._settings.removeXmlns;
  }

  /** Remove SVG Width/Height */
  set removeSvgWidthHeight(value: boolean) {
    this._settings.removeSvgWidthHeight = value;
    this.settingsChange.emit(this._settings);
    this.change.emit(this._settings);
  }
  get removeSvgWidthHeight(): boolean {
    return this._settings.removeSvgWidthHeight;
  }

  /** Remove SVG ViewBox */
  set removeSvgViewBox(value: boolean) {
    this._settings.removeSvgViewBox = value;
    this.settingsChange.emit(this._settings);
    this.change.emit(this._settings);
  }
  get removeSvgViewBox(): boolean {
    return this._settings.removeSvgViewBox;
  }

  /** Add Background crisp-edge attribute */
  set addBackgroundCrispEdgeAttribute(value: boolean) {
    this._settings.addBackgroundCrispEdge = value;
    this.settingsChange.emit(this._settings);
    this.change.emit(this._settings);
  }
  get addBackgroundCrispEdgeAttribute(): boolean {
    return this._settings.addBackgroundCrispEdge;
  }

  /** Add Ferui Classes */
  set addFeruiClasses(value: boolean) {
    this._settings.addFeruiClasses = value;
    this.settingsChange.emit(this._settings);
    this.change.emit(this._settings);
  }
  get addFeruiClasses(): boolean {
    return this._settings.addFeruiClasses;
  }

  /** Add Ferui Classes Path Names */
  set addFeruiClassesPathNames(value: boolean) {
    this._settings.addFeruiClassesPathNames = value;
    this.settingsChange.emit(this._settings);
    this.change.emit(this._settings);
  }
  get addFeruiClassesPathNames(): boolean {
    return this._settings.addFeruiClassesPathNames;
  }

  /** Add Ferui Icon Type Classes */
  set addFeruiIconTypeClasses(value: boolean) {
    this._settings.addFeruiIconTypeClasses = value;
    this.settingsChange.emit(this._settings);
    this.change.emit(this._settings);
  }
  get addFeruiIconTypeClasses(): boolean {
    return this._settings.addFeruiIconTypeClasses;
  }


}
