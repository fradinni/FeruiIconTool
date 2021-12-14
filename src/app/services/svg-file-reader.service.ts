import { Injectable } from '@angular/core';
import { SvgFile } from '../models/svg-file';
import { optimize } from 'svgo/dist/svgo.browser';
import { SvgOptimizeService } from './svg-optimize.service';

@Injectable({
  providedIn: 'root'
})
export class SvgFileReaderService {

  constructor(private svgOptimizeService: SvgOptimizeService) {}

  async readSvgFile(file: File): Promise<SvgFile> {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = (event) => {
        const svgContent = event.target.result as string;
        const svgFile = new SvgFile(file.name, this.svgOptimizeService.prettify(svgContent));
        return resolve(svgFile);
      };
      reader.readAsText(file, 'UTF-8');
    });
  }
}
