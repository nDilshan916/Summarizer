import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TopicUpdateService {

  private topicUpdatedSource = new Subject<void>();
  topicUpdated$ = this.topicUpdatedSource.asObservable();

  // Method to trigger the update
  notifyTopicUpdate(): void {
    this.topicUpdatedSource.next();
  }
}
