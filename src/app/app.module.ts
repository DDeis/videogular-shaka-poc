import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';
import { VgStreamingModule } from 'videogular2/streaming';

import { AppComponent } from './app.component';
import { VgDASH } from './shaka.directive';

@NgModule({
  declarations: [AppComponent, VgDASH],
  imports: [
    BrowserModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule
    // VgStreamingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
