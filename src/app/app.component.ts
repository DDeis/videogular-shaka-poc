import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  sources = [
    'https://storage.googleapis.com/shaka-demo-assets/sintel-mp4-only/dash.mpd',
    'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd'
  ];

  stream = {
    source:
      'https://storage.googleapis.com/shaka-demo-assets/sintel-mp4-only/dash.mpd',
    // 'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd',
    // 'https://storage.googleapis.com/shaka-demo-assets/angel-one-widevine/dash.mpd',
    licenseServers: {
      'com.widevine.alpha': {
        serverURL: 'https://widevine-proxy.appspot.com/proxy'
      }
    },
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  };
}
