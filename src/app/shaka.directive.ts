import {
  Directive,
  ElementRef,
  Input,
  SimpleChanges,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import { Subscription } from 'rxjs';

import { VgAPI } from 'videogular2/core';

// import * as shaka from 'shaka-player';
import { shaka } from 'shaka-player/dist/shaka-player.compiled.debug';

@Directive({
  selector: '[vgDash]',
  exportAs: 'vgDash'
})
export class VgDASH implements OnInit, OnChanges, OnDestroy {
  @Input() vgDash: string;
  //   @Input() vgDRMToken: string;
  //   @Input() vgDRMLicenseServer: IDRMLicenseServer;

  @Output() onGetBitrates: EventEmitter<any[]> = new EventEmitter();

  vgFor: string;
  target: any;
  dash: shaka.Player;

  subscriptions: Subscription[] = [];

  constructor(private ref: ElementRef, public API: VgAPI) {}

  ngOnInit() {
    console.log('ngOnInit');
    if (this.API.isPlayerReady) {
      this.onPlayerReady();
    } else {
      this.subscriptions.push(
        this.API.playerReadyEvent.subscribe(() => this.onPlayerReady())
      );
    }
  }

  onPlayerReady() {
    console.log('onPlayerReady');
    this.vgFor = this.ref.nativeElement.getAttribute('vgFor');
    this.target = this.API.getMediaById(this.vgFor);
    this.createPlayer();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges');
    if (changes['vgDash'] && changes['vgDash'].currentValue) {
      this.createPlayer();
    } else {
      this.destroyPlayer();
    }
  }

  createPlayer() {
    console.log('createPlayer');
    if (this.dash) {
      this.destroyPlayer();
    }

    // It's a DASH source
    if (
      this.vgDash &&
      (this.vgDash.indexOf('.mpd') > -1 ||
        this.vgDash.indexOf('mpd-time-csf') > -1)
    ) {
      console.log('dash', this.vgDash);

      this.dash = this.initShakaPlayer(this.ref.nativeElement);
    } else {
      console.log('not dash');
      if (this.target) {
        this.target.pause();
        this.target.seekTime(0);
        this.ref.nativeElement.src = this.vgDash;
      }
    }
  }

  destroyPlayer() {
    if (this.dash) {
      this.dash.destroy();
      this.dash = null;
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.destroyPlayer();
  }

  initShakaPlayer(nativeElement) {
    console.log('Checking Shaka Support');
    if (!shaka || !nativeElement) {
      return;
    }
    // Install built-in polyfills to patch browser incompatibilities.
    shaka.polyfill.installAll();

    // Check to see if the browser supports the basic APIs Shaka needs.
    if (shaka.Player.isBrowserSupported()) {
      // Everything looks good!
      return this.createShakaPlayer(nativeElement);
    } else {
      // This browser does not have the minimum set of APIs we need.
      console.error('Browser not supported!');
    }

    return;
  }

  createShakaPlayer(nativeElement) {
    console.log('Init player');
    const onErrorEvent = event => {
      // Extract the shaka.util.Error object from the event.
      onError(event.detail);
    };

    const onError = error => {
      // Log the error.
      console.error('Error code', error.code, 'object', error);
    };

    // Create a Player instance.
    const shakaPlayer = new shaka.Player(nativeElement);

    // // Attach player to the window to make it easy to access in the JS console.
    // window.player = player;

    // Listen for error events.
    shakaPlayer.addEventListener('error', onErrorEvent);

    const manifestUri = this.vgDash;
    // Try to load a manifest.
    // This is an asynchronous process.
    shakaPlayer
      .load(manifestUri)
      .then(() => {
        // This runs if the asynchronous load is successful.
        console.log('The video has now been loaded!');
      })
      .catch(onError); // onError is executed if the asynchronous load fails.

    return shakaPlayer;
  }
}
