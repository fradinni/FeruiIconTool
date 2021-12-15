import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainModule } from "@modules/main/main.module";

@NgModule({
  imports: [
    // Angular modules
    BrowserModule,
    BrowserAnimationsModule,
    // Application modules
    CoreModule,
    SharedModule,
    AppRoutingModule,
    MainModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
