import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { MainComponent } from './main.component';
import { SvgPreviewComponent } from './svg-preview/svg-preview.component';
import { SvgSettingsComponent } from './svg-settings/svg-settings.component';
import { EditorComponent } from './editor/editor.component';
import { FileTabComponent } from './file-tab/file-tab.component';
import { DropPlaceholderComponent } from './drop-placeholder/drop-placeholder.component';
import { TabsComponent } from './tabs/tabs.component';
import { MaterialModule } from '../material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    CodemirrorModule
  ],
  declarations: [
    MainComponent,
    SvgPreviewComponent,
    SvgSettingsComponent,
    EditorComponent,
    FileTabComponent,
    DropPlaceholderComponent,
    TabsComponent
  ]
})
export class MainModule {
  constructor() {
    console.log('Init main module');
  }
}
