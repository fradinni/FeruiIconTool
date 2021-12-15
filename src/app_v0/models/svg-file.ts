import { SvgSettings } from '../interfaces/common-interfaces';

export class SvgFile {
    // File name
    name: string;
    // Raw data from imported file
    rawData: string;
    // Current data, can be edited in code editor
    data: string;
    // Optimized SVG data
    optimizedData: string;
    // FerUI generated code
    feruiData: string;

    constructor(_name: string, _data: string, _settings?: SvgSettings) {
        this.name = _name;
        this.rawData = _data;
        this.data = _data;
    }

    /**
     * Reset data, will replace current/edited data by raw file data.
     */
    reset(): void {
        this.data = this.rawData;
    }
}