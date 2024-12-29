import { Component } from '@angular/core';

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [],
  templateUrl: './document-upload.component.html',
  styleUrl: './document-upload.component.css'
})
export class DocumentUploadComponent {
  selectedFile: File | null = null;

  // This function handles the file input change event
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedFile = input.files[0]; // Store the first selected file
    }
  }

  // This function handles the form submission
  onSubmit(): void {
    if (this.selectedFile) {
      // Logic to upload the file will go here
      console.log('File selected:', this.selectedFile);
      // Call your service to upload the file to the backend or API
    }
  }
}
