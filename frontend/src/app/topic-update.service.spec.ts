import { TestBed } from '@angular/core/testing';

import { TopicUpdateService } from './topic-update.service';

describe('TopicUpdateService', () => {
  let service: TopicUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopicUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
