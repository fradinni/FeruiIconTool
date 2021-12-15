import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileDialogService {

  constructor() { }

  /**
   * Open file from disk
   * @param {string[]} accept List of accepted file formats.
   * @returns {Promise<File>} Promise that resolves with selected file.
   */
  openFile(accept?: string[]): Promise<File> {
    return this.openFiles(accept, false).then(files => files[0]);
  }

  /**
   * Open multiple files from disk
   * @param {string[]} accept List of accepted file formats.
   * @param {boolean} multi If set to true, user can select multiple files.
   * @returns {Promise<File[]>} Promise that resolves with selected files list.
   */
  openFiles(accept?: string[], multi: boolean = true): Promise<File[]> {
    return new Promise<File[]>((resolve) => {
      let fileSelected = false;
      // Create file input
      const fileInput = this.createFileInput(accept, multi);

      // Listen input "change" event to catch when files are selected.
      fileInput.addEventListener('change', (event) => {
        fileSelected = true;
        fileInput.remove();
        return resolve(Array.from(fileInput.files));
      }, { once: true });

      // Listen window's "focus" event to know when select file window is closed.
      window.addEventListener('focus', () => {
        if (!fileSelected) {
          fileInput.remove();
        }
      }, { once: true });

      // Open select file window.
      fileInput.click();
    });
  }

  /**
   * Create File Input
   * @param {string[]} accept List of accepted file formats.
   * @param {boolean} multi If set to true, user can select multiple files.
   * @returns {HTMLInputElement} File input element.
   * @protected
   */
  protected createFileInput(accept?: string[], multi?: boolean): HTMLInputElement {
    const fileInput = document.createElement('input');
    fileInput.id = "openFileDialog";
    fileInput.type = 'file';
    if (multi) {
      fileInput.multiple = true;
    }
    if (accept && accept.length) {
      fileInput.accept = accept.join(',');
    }
    return fileInput;
  }
}
