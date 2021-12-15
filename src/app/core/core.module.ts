import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleLoadedOnceGuard } from './module-loaded-once.guard';

/**
 * Core Module
 */
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class CoreModule extends ModuleLoadedOnceGuard {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule);
    console.info('[CoreModule] Loaded');
  }
}
