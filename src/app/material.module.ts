import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatInputModule} from '@angular/material/input';

@NgModule({
  exports: [
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    MatSidenavModule,
    MatCardModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatInputModule
  ]
})
export class MaterialModule {}