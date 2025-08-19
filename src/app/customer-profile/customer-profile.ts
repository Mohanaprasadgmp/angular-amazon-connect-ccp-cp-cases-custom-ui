// customer-profile.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  map,
  filter,
  distinctUntilChanged,
  switchMap,
  shareReplay,
  of,
} from 'rxjs';
import { CustomerProfileService } from '../services/customer-profile.service';
import { CcpEventsService } from '../services/ccp-events.service';

@Component({
  selector: 'customer-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-profile.html',
  styleUrls: ['./customer-profile.scss'],
})
export class CustomerProfile {
  private ccpEvents = inject(CcpEventsService);
  private profileApi = inject(CustomerProfileService);

  isExpanded = true;

  toggleAttributes() {
    this.isExpanded = !this.isExpanded;
  }
  // Stream of mapped customer model
  customer$ = this.ccpEvents.callConnected$.pipe(
    distinctUntilChanged(),
    switchMap((data) => {
      console.log('Call connected data:', data);
      // If data is null or a string, handle accordingly
      if (!data || typeof data === 'string') {
        const value = data as string | null;
        if (!value || value.trim().length === 0) {
          return of(null);
        }
        // Provide a default channel if needed, or handle error
        return this.profileApi.getCustomerProfile('defaultChannel', value);
      }
      // If data is an object with channel and value
      const { channel, value } = data as { channel: string; value: string };
      if (!value || value.trim().length === 0) {
        return of(null);
      }
      return this.profileApi.getCustomerProfile(channel, value);
    }),
    map((res) => {
      // If res is null (reset case), return null
      if (!res) return null;

      // Passing Cases Data.
   
      this.ccpEvents.passDataToCases(res?.data?.Cases || []);

      const p = res?.data?.customerProfile?.Items?.[0];
      if (!p) return null;
      const fmt = (a: any) =>
        a ? `${a.Address1}, ${a.City}, ${a.Province} - ${a.PostalCode}` : '';
      return {
        firstName: p.FirstName || '',
        lastName: p.LastName || '',
        profileId: p.ProfileId || '',
        phone: p.PhoneNumber || '',
        birthDate: p.BirthDate || '',
        email: p.EmailAddress || '',
        gender: p.GenderString || '',
        billingAddress: fmt(p.BillingAddress),
        mailingAddress: fmt(p.MailingAddress),
        additionalInfo: p.AdditionalInformation || '',
      };
    }),
    shareReplay(1)
  );
}
