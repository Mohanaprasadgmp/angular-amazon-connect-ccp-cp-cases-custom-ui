import { Component } from '@angular/core';
import { CcpEventsService } from '../services/ccp-events.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'custom-attributes',
  imports: [CommonModule],
  templateUrl: './custom-attributes.html',
  styleUrl: './custom-attributes.scss',
})
export class CustomAttributes {
  attributes: { [key: string]: any } = {};
  hasData = false;
  isExpanded = true;

  toggleAttributes() {
    this.isExpanded = !this.isExpanded;
  }
  constructor(private eventService: CcpEventsService) {
    this.eventService.passCustomAttributes$.subscribe((attributes) => {
      if (attributes && Object.keys(attributes).length > 0) {
      console.log('Received custom attributes:', attributes);
      this.attributes = attributes;
      this.hasData = true;
    } else {
      console.log('No attributes received or empty');
      this.attributes = {};   // or {}
      this.hasData = false;
    }
    });
  }
}
