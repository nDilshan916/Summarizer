import { Component} from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  template: '<h1>{{ message }}</h1>',
  templateUrl: './document-upload.component.html',
  styleUrl: './document-upload.component.css'
})
export class DocumentUploadComponent  {
  isDragging = false;
  selectedFile: File | null = null; // File | null = null means that selectedFile can be either a File object or null
  uploadStatus: 'success' | 'error' | null = null; // 'success' | 'error' | null means that uploadStatus can be either 'success', 'error' or null
  uploadMessage: string = '';

  constructor(private http: HttpClient) {}

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
      if (file.size > 5 * 1024 * 1024) { // Limit size to 5MB
        alert('File is too large!');
        return;
      }
      if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
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

  uploadFile() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post('http://localhost:3000/upload', formData).subscribe({
      next: (response: any) => {
        this.uploadStatus = 'success';
        this.uploadMessage = response.message;
      },
      error: (error) => {
        this.uploadStatus = 'error';
        this.uploadMessage = error.message;
      }
    });
  }

}
