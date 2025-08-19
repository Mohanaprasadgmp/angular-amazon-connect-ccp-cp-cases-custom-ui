// ccp-panel.ts
import { Component, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CcpEventsService } from '../services/ccp-events.service';

declare const connect: any;

@Component({
  selector: 'ccp-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ccp-panel.html',
  styleUrls: ['./ccp-panel.scss'],
})
export class CcpPanel implements AfterViewInit {
  constructor(private ccpEvents: CcpEventsService, private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    if (typeof window === 'undefined' || typeof connect === 'undefined') return;

    connect.core.initCCP(document.getElementById('ccpContainer'), {
      ccpUrl: 'https://cct-lab-hexabanking.my.connect.aws/ccp-v2/',
      loginPopup: true,
      loginPopupAutoClose: true,
      softphone: { allowFramedSoftphone: true },
    });

    connect.contact((contact: any) => {
      // Handle call connected - load customer data
      contact.onConnected(async () => {
        try {
          const attrs = await contact.getAttributes();
          console.log('Call connected with attributes:', attrs);
          
          if(attrs?.channel?.value === 'VOICE'){
            const phonenumber = attrs?.phonenumber?.value || '';
            this.ngZone.run(() => this.ccpEvents.notifyCallConnected('Voice', phonenumber));
          }
          else{
            const email = attrs?.email?.value || '';
            this.ngZone.run(() => this.ccpEvents.notifyCallConnected('Email', email));
          }
          this.ccpEvents.passCustomAttributes(attrs);
        } catch (e) {
          console.error('getAttributes failed', e);
        }
      });

      // Handle call ended - reset to default empty values
      contact.onEnded(() => {
        // this.ngZone.run(() => this.ccpEvents.notifyCallReset());
        
      });

      // Handle after call work (ACW) - reset to default empty values
      contact.onACW(() => {
        this.ngZone.run(() => this.ccpEvents.notifyCallReset());
        this.ccpEvents.passCustomAttributes({});
        this.ccpEvents.passDataToCases([]);
      });

      // Optional: Handle call destroyed (cleanup)
      contact.onDestroy(() => {
        this.ngZone.run(() => this.ccpEvents.notifyCallReset());
      });
    });
  }
}
