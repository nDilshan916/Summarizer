import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TopicService {
  private apiUrl = 'http://localhost:3000/get_topics';
  constructor(private http: HttpClient) { }

  getTopics(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  renameTopic(id: string, newName: string){
    return this.http.post('http://127.0.0.1:5000/rename_topic', {id, new_name: newName});
  }

  deleteTopic(id: string) {
    return this.http.delete('http://127.0.0.1:5000/delete_topic', {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: { id }
    });
  }
}
