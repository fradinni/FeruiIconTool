import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { Logger, LogLevel } from './logger';
import { AppV0Module } from './app_v0/app.module';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';

window.console = new Logger(console);

if (environment.production) {
  window.console.setLogLevel(LogLevel.ERROR);
  enableProdMode();
} else {
  window.console.setLogLevel(LogLevel.DEBUG);
}

// Prevent drop event on browser window.
// Drop event will be handled by Angular components.
window.ondrop = function(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
  event.stopPropagation();
}

// TODO: Remove this before v1.x Release
const appVersion: number = 1;

platformBrowserDynamic().bootstrapModule(appVersion === 0 ? AppV0Module : AppModule)
  .catch(err => console.error(err));