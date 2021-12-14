import { ChangeDetectorRef, Component, HostListener, ViewChild } from '@angular/core';
import { SvgFile } from '../models/svg-file';
import { SvgFileReaderService } from '../services/svg-file-reader.service';
import { TabsComponent } from './tabs/tabs.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {

  @ViewChild(TabsComponent, { static: false }) fileTabs: TabsComponent;
  files: SvgFile[] = [];

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private svgFileReaderService: SvgFileReaderService) { }

  /**
   * Returns true if files are opened.
   */
  hasFilesOpened(): boolean {
    return this.files.length > 0;
  }

  /**
   * Remove file at index from files list.
   * @param index
   */
  removeFile(index: number): void {
    this.files = this.files.filter((item, itemIndex) => itemIndex !== index);
  }

  /**
   * Listen and prevent "dragover" to allow "drop" event to be fired.
   * Drop will not fire unless we prevent the default behavior on over.
   * @param event
   */
  @HostListener('dragover', ['$event']) onDragOver(event) {
    // Prevent default behavior
    event.preventDefault();
  }

  /**
   * Listen "drop" event.
   * @param event
   */
  @HostListener('drop', ['$event']) onDrop(event): void {
    // Prevent default behavior (open file in new window)
    event.preventDefault();
    // Read files
    const items = event.dataTransfer.items as DataTransferItemList;
    for (var i = 0; i < items.length; i++) {
      const entry = event.dataTransfer.items[i].webkitGetAsEntry();
      // If dropped item is a file
      if (entry.isFile) {
        this.parseDroppedFile(items[i].getAsFile());
      }
    }
  }

  /**
   * Parse dropped file
   * @param file
   */
  parseDroppedFile(file: File): void {
    this.svgFileReaderService.readSvgFile(file).then((svgFile: SvgFile) => {
      // Reassign files array to trigger ngOnChange event of children components.
      this.files = [...this.files, svgFile];
      // If fileTabs components was not loaded, run detection changes to
      // load the ViewChild elementRef.
      if (!this.fileTabs) {
        this.changeDetectorRef.detectChanges();
      }
    });
  }
}
