import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerProfileService {
  private apiUrl = 'https://jjzn5w4qbl.execute-api.us-east-1.amazonaws.com/dev/customerprofile'; // Replace with your API Gateway URL

  constructor(private http: HttpClient) {}

  // This service fetches customer profile data from the API Gateway using the provided email.
  getCustomerProfile(channel: string, value: string): Observable<any> {
    console.log('Fetching customer profile for channel:', channel, 'value:', value);
    const params = new HttpParams().set('channel', channel).set('value', value);
    return this.http.get<any>(this.apiUrl, { params });
  }
}
