import { Component } from '@angular/core';
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
  selectedFiles: File[] = [];
  uploadStatus: 'success' | 'error' | null = null;
  uploadMessage: string = '';
  isUploading: boolean = false; 

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
      this.handleFiles(event.dataTransfer.files);
    }
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.handleFiles(target.files);
    }
  }

  handleFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large!`);
        continue;
      }

      if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        alert(`Invalid file type: ${file.name}. Only PDF and Word documents are allowed.`);
        continue;
      }

      this.selectedFiles.push(file);
    }
  }

  uploadFiles(): void {
    if (this.selectedFiles.length === 0) {
      alert('No files selected!');
      return;
    }

    this.isUploading = true;
    this.uploadStatus = null;
    this.uploadMessage = 'Uploading...';

    const uploadPromises = this.selectedFiles.map(file => 
      this.topicService.uploadFile(file).toPromise()
    );

    Promise.all(uploadPromises)
      .then(responses => {
        console.log('Upload successful:', responses);
        this.uploadStatus = 'success';
        this.uploadMessage = 'All files uploaded successfully!';
        this.isUploading = false;
        this.topicUpdateService.notifyTopicUpdate();
        this.selectedFiles = []; // Clear after upload
      })
      .catch(error => {
        console.error('Error uploading files:', error);
        this.uploadStatus = 'error';
        this.uploadMessage = 'Failed to upload some files.';
        this.isUploading = false;
      });
  }
}
