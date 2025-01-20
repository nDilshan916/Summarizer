import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TopicService } from '../topic.service'; 
import { TopicUpdateService } from '../topic-update.service';
@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.css'],
})
export class DocumentUploadComponent {
  isDragging = false;
  selectedFile: File | null = null;
  uploadStatus: 'success' | 'error' | null = null;
  uploadMessage: string = '';

  constructor(private topicService: TopicService, private topicUpdateService: TopicUpdateService) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('File is too large!');
        return;
      }
      if (
        ![
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ].includes(file.type)
      ) {
        alert('Invalid file type! Only PDF and Word documents are allowed.');
        return;
      }
      this.selectedFile = file;
    }
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      alert('No file selected!');
      return;
    }

    console.log('Uploading file:', this.selectedFile);

    // Assuming this is the file upload logic
    this.topicService.uploadFile(this.selectedFile).subscribe({
      next: (response: any) => {
        console.log('Upload successful:', response);

        // Notify the sidebar component about the topic update
        this.topicUpdateService.notifyTopicUpdate();
      },
      error: (error: any) => {
        console.error('Error uploading file:', error);
      },
    });
  }
}