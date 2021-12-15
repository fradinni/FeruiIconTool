import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Shared Module
 */
@NgModule({
  imports: [CommonModule, RouterModule],
  exports: [CommonModule, RouterModule],
  declarations: []
})
export class SharedModule {}