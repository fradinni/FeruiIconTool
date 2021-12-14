import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { SvgFile } from '../../models/svg-file';

@Component({
  selector: 'tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnChanges {

  @Output() onCloseFile: EventEmitter<number> = new EventEmitter<number>();
  @Input() files: SvgFile[];
  selectedTabIndex: number = 0;

  /**
   * Called when an input value has changed.
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    // If files list is updated
    if (changes.files) {
      const filesChange: SimpleChange = changes.files;
      // If a file was added, select last file tab.
      if (filesChange.currentValue?.length > filesChange.previousValue?.length) {
        this.selectedTabIndex = this.files.length - 1;
      }
    }
  }

  /**
   * Called when selected tab index has changed.
   * @param index
   */
  onSelectedTabIndexChange(index: number) {
    this.selectedTabIndex = index;
  }

  /**
   * Called when close icon is clicked.
   * @param index
   */
  onClose(index: number): void {
    this.onCloseFile.emit(index);
  }

}
