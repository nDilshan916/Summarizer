import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {
  private baseUrl = 'http://127.0.0.1:5000'; // Replace with your Flask backend URL

  constructor(private http: HttpClient) {}

  generateSummary(topicId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/generate_summary`, { id: topicId });
  }

  getSummary(topicId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/get_summary/${topicId}`);
  }
}
