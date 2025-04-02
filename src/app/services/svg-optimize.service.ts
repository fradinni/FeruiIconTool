import { Injectable } from '@angular/core';
import { SvgSettings, TsObject } from '../interfaces/common-interfaces';
import { optimize } from 'svgo/dist/svgo.browser';

@Injectable({
  providedIn: 'root'
})
export class SvgOptimizeService {

  constructor() { }

  /**
   * Optimize SVG code with given settings.
   * @param svg
   * @param fileName
   * @param settings
   */
  optimize(svg: string, fileName: string, settings: SvgSettings): string {
    if (!this.validateSvg(svg)) {
      return svg;
    }
    const result = optimize(svg, {
      plugins: settings ? this.getPluginsConfiguration(fileName, settings) : [],
      multipass: true,
      js2svg: { pretty: true, indent: 2 }
    })?.data;
    return result?.endsWith('\n') ? result.substr(0, result.length - 1) : result;
  }

  /**
   * Pretty SVG code.
   * @param svg
   */
  prettify(svg: string): string {
    if (!this.validateSvg(svg)) {
      return svg;
    }
    const result = optimize(svg, {
      plugins: [],
      multipass: true,
      js2svg: { pretty: true, indent: 2 }
    })?.data;
    return result?.endsWith('\n') ? result.substr(0, result.length - 1) : result;
  }

  /**
   * Get plugins configuration
   * @param fileName
   * @param settings
   */
  getPluginsConfiguration(fileName: string, settings: SvgSettings) {
    const plugins: Array<string|TsObject> = [
      "cleanupIDs",
      "collapseGroups",
      "removeStyleElement",
      {
        name: "removeAttrs",
        params: this.getRemoveAttrParams(settings)
      }
    ];
    if (settings.mergePaths) {
      plugins.push(this.getMergePathsPlugin(settings));
    }
    if (settings.optimize) {
      plugins.push(this.getOptimizePlugin(settings));
    }
    if (settings.removeXmlns) {
      plugins.push('removeXMLNS');
    }
    if (settings.addBackgroundCrispEdge) {
      plugins.push(this.getBackgroundCrispEdgePlugin());
    }
    if (settings.addFeruiClasses) {
      plugins.push(this.getFeruiClassesPlugin(fileName, settings));
    }
    return plugins;
  }

  /**
   * Returns default SVG settings.
   */
  getDefaultSettings(): SvgSettings {
    return {
      mergePaths: false,
      mergePathsForce: true,
      mergePathsPrecision: 5,
      optimize: true,
      precision: 3,
      removeFill: true,
      removeClipRule: true,
      removeFillRule: false,
      removeXmlns: true,
      removeSvgWidthHeight: true,
      removeSvgViewBox: true,
      addBackgroundCrispEdge: false,
      addFeruiClasses: true,
      addFeruiClassesPathNames: true,
      addFeruiIconTypeClasses: false
    };
  }

  /**
   * Get params for 'removeAttrs' plugin.
   * @param tab
   * @private
   */
  private getRemoveAttrParams(settings: SvgSettings) {
    const attrs = [
      "id",
      "data-name"
    ];
    if (settings.removeClipRule) {
      attrs.push("clip-rule");
    }
    if (settings.removeFillRule) {
      attrs.push("fill-rule");
    }
    if (settings.removeFill) {
      attrs.push("*:fill:(#((?!(fff(fff)?)|white).)*|none)");
    }
    if (settings.removeSvgWidthHeight) {
      attrs.push("svg:(width|height)")
    }
    if (settings.removeSvgViewBox) {
      attrs.push("svg:viewBox")
    }
    return {
      attrs: attrs
    };
  }

  private getBackgroundCrispEdgePlugin(): TsObject {
    return {
      name: 'addBackgroundCrispEdgeProperties',
      type: 'full',
      params: {
        attrs: {
          'shape-rendering': 'crispEdges'
        }
      },
      fn: (root, params, info) => {
        const svg = root.children.find(it => it.name === 'svg');
        if (svg) {
          try {
            for (let index = 0; index < svg.children.length-1; index++) {
              const current = svg.children[index];
              if (current.attributes['fill-opacity']) {
                current.attributes = {...params.attrs, ...current.attributes};
                if (index > 0) {
                  const previous = svg.children[index-1];
                  previous.attributes = {...params.attrs, ...previous.attributes};
                }
              }
            }
          } catch (error) {
            return root;
          }
        }
        return root;
      }
    };
  }

  private getOptimizePlugin(settings: SvgSettings): object {
    return {
      name: 'convertPathData',
      params: {
        floatPrecision: settings.precision
      }
    };
  }

  private getMergePathsPlugin(settings: SvgSettings): object {
    return {
      name: 'mergePaths',
      params: {
        force: settings.mergePathsForce,
        floatPrecision: settings.mergePathsPrecision
      }
    }
  }

  private getFeruiClassesPlugin(fileName: string, settings: SvgSettings): TsObject {
    let iconName = this.getIconName(fileName);
    iconName = iconName.replace(/[^\w\.\s-]+/g, '').replace(/[\s_]/g, '-');
    //let index = 1;
    return {
      name: 'addFeruiClasses',
      type: 'full',
      params: {
        attrs: {
          'classes': [`fui-${iconName}{{className}}`],
          'path-classes': ['fui-i-path-{{index}}'],
          'two-tone-classes': ['fui-i-two-tone'],
          'solid-classes': ['fui-i-solid'],
          'outline-classes': ['fui-i-outline']
        }
      },
      fn: (root, params) => {
        const svg = root.children.find(it => it.name === 'svg');
        if (svg) {
          try {
            let current, next, currentClasses, nextClasses, pathIndex;
            let classes = [
              ...params.attrs['classes'],
              ...params.attrs['path-classes']
            ];
            for (let index = 0; index < svg.children.length;) {
              current = svg.children[index];
              next = (index + 1) < svg.children.length ? svg.children[index + 1] : null;
              pathIndex = index + 1;
              currentClasses = this.replaceInStringOrArray(classes, '{{index}}', pathIndex);
              nextClasses = next ? this.replaceInStringOrArray(classes, '{{index}}', pathIndex + 1) : [];

              if (next && settings.addFeruiClassesPathNames && next.attributes['fill-opacity']) {
                currentClasses = this.replaceInStringOrArray(currentClasses, '{{className}}', '-background');
                current.attributes = {
                  'class': [
                    ...currentClasses,
                    //...params.attrs['two-tone-classes'],
                    ...settings.addFeruiIconTypeClasses ? params.attrs['outline-classes'] : params.attrs['outline-classes']
                  ].join(' '),
                  ...current.attributes
                };
                nextClasses = this.replaceInStringOrArray(nextClasses,'{{className}}', '-overlay');
                next.attributes = {
                  'class': [
                    ...nextClasses,
                    //...params.attrs['two-tone-classes']
                    ...settings.addFeruiIconTypeClasses ? [] : params.attrs['outline-classes']
                  ].join(' '),
                  ...next.attributes
                };
              } else {
                const className = settings.addFeruiClassesPathNames ? '-outline' : '';
                currentClasses = this.replaceInStringOrArray(currentClasses,'{{className}}', className);
                current.attributes = {
                  'class': [
                    ...currentClasses,
                    //...params.attrs['two-tone-classes'],
                    ...settings.addFeruiIconTypeClasses ? [...params.attrs['solid-classes'], ...params.attrs['outline-classes']] : [...params.attrs['outline-classes']]
                  ].join(' '),
                  ...current.attributes
                };
                if (next) {
                  nextClasses = nextClasses? this.replaceInStringOrArray(nextClasses,'{{className}}', className) : [];
                  next.attributes = {
                    'class': [
                      ...nextClasses,
                      //...params.attrs['two-tone-classes'],
                      ...settings.addFeruiIconTypeClasses ? [...params.attrs['solid-classes'], ...params.attrs['outline-classes']] : [...params.attrs['outline-classes']]
                    ].join(' '),
                    ...next.attributes
                  };
                }
              }
              // Increment index
              index = next ? index + 2 : index + 1;
            }
          } catch (error) {
            return root;
          }
        }
        return root;
      }
    };
  }

  /**
   * Generate FerUI code from svg data
   * @param fileName
   * @param svg
   * @private
   */
   generateFeruiCode(fileName: string, svg: string): string {
    let iconName = this.getIconName(fileName).replace(/[^\w]+/g, ' ').trim();
    const shapeName = 'FuiShape' + this.camelize(iconName, true);
    const exportName = 'fui-' + this.feruize(iconName);

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(svg, 'text/xml');
    const svgPaths = xmlDoc.children[0].children;
    let paths = '';
    if (svgPaths) {
      for (let i = 0; i < svgPaths.length; i++) {
        paths += svgPaths[i].outerHTML;
        if (i < svgPaths.length - 1) {
          paths += '\n';
        }
      }
    }
    return `// FerUI Shape definition
export const ${shapeName} = fuiIconSVG(\`
${paths}
\`);

// FerUI Shape export
'${exportName}': ${shapeName}
`;
  }

  /**
   * Transform text to CamelCase.
   * @param text
   * @param capitalize
   * @private
   */
  camelize(text: string, capitalize: boolean = false): string {
    text = text.replace(/[-_\s.]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
    if (capitalize) {
      text = text.substr(0, 1).toUpperCase() + text.substr(1);
    } else {
      text = text.substr(0, 1).toLowerCase() + text.substr(1);
    }
    return text;
  }

  /**
   * Transform text to ferui icon name
   * @param text
   * @param capitalize
   * @private
   */
  feruize(text: string): string {
    text = text.toLowerCase();
    text = text.replace(/[-_\s.]+(.)?/g, (_, c) => c ? '-' + c : '');
    return text;
  }

  /**
   * Returns true if SVG is valid.
   * @param svg
   */
  validateSvg(svg: string): boolean {
    const div = document.createElement('div');
    div.innerHTML = svg;
    if (div.querySelector('svg') && div.querySelectorAll('path').length) {
      return Array.from(div.querySelectorAll('path')).every(it => it.getTotalLength() > 0);
    }
    return false;
  }

  /**
   * Return the number of paths of a SVG file.
   * @param svg
   */
  getSvgPathCount(svg: string): number {
    if (this.validateSvg(svg)) {
      const div = document.createElement('div');
      div.innerHTML = svg;
      return div.querySelector('svg')
          .querySelectorAll('circle, ellipse, line, path, polygon, polyline, rect, text').length;
    }
    return 0;
  }

  getIconName(name: string): string {
    let result = name;
    if (result.endsWith('.svg')) {
      result = result.substr(0, result.lastIndexOf('.'));
    }
    return this.feruize(result);
  }

  /**
   * Replace token in string or array of string
   * @param data
   * @param token
   * @param replacement
   * @private
   */
  private replaceInStringOrArray(data: string | string[], token: string, replacement: string): string | string[] {
    if (data instanceof Array) {
      return data.map(it => it.replace(token, replacement));
    } else {
      return data.replace(token, replacement);
    }
  }
}
