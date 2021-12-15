/**
 * Custom Object Type
 */
export type TsObject = { [key: string]: any; };

/**
 * SVG Settings Interface
 */
export interface SvgSettings {
  mergePaths: boolean;
  mergePathsForce: boolean;
  mergePathsPrecision: number;
  optimize: boolean;
  precision: number;
  removeFill: boolean;
  removeClipRule: boolean;
  removeFillRule: boolean;
  removeXmlns: boolean;
  removeSvgWidthHeight: boolean;
  removeSvgViewBox: boolean;
  addBackgroundCrispEdge: boolean;
  addFeruiClasses: boolean;
  addFeruiClassesPathNames: boolean;
  addFeruiIconTypeClasses: boolean;
}