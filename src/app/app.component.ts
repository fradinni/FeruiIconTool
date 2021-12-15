import { Component } from '@angular/core';
import { FileDialogService } from "@shared/services/file-dialog.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private fileDialogService: FileDialogService) {
    // Create an empty menubar
    const menu = new window.nw.Menu({type: 'menubar'});

    // Create a submenu as the 2nd level menu
    const submenu = new window.nw.Menu();
    submenu.append(new window.nw.MenuItem({ label: 'New file' }));
    submenu.append(new window.nw.MenuItem({ label: 'Open file...', click: () => {
      this.fileDialogService.openFile().then((file) => console.log(file));
    }}));

    // Create and append the 1st level menu to the menubar
    menu.append(new window.nw.MenuItem({
      label: 'File',
      submenu: submenu
    }));

    // Assign it to `window.menu` to get the menu displayed
    window.nw.Window.get().menu = menu;
  }
}
