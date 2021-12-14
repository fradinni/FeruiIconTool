import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { Logger, LogLevel } from './logger';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

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

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));