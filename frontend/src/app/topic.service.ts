import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TopicService {
  private apiUrl = 'http://localhost:3000/get_topics';
  private renameUrl = 'http://127.0.0.1:5000/rename_topic';
  private deleteUrl = 'http://127.0.0.1:5000/delete_topic';
  private uploadUrl = 'http://localhost:3000/upload';

  constructor(private http: HttpClient) {}

  getTopics(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  renameTopic(id: string, newName: string): Observable<any> {
    return this.http.post(this.renameUrl, { id, new_name: newName });
  }

  deleteTopic(id: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete(this.deleteUrl, {
      headers,
      body: { id },
    });
  }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.uploadUrl, formData);
  }
}