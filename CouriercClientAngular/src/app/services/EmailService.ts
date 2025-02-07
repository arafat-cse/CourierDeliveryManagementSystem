import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ParcelService {
  private apiUrl = 'http://localhost:5041/api/Parcels';
private  apiUrlEmail = 'http://localhost:5041/api/Email/send';
  constructor(private http: HttpClient) {}

  getReceiverEmail(parcelId: number) {
    return this.http.get<string>(`${this.apiUrl}/GetReceiverEmail/${parcelId}`);
  }

  sendParcel(parcelData: any): Observable<any> {
    return this.http.post<any>(this.apiUrlEmail, parcelData);
  }
}
