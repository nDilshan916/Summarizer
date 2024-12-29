import { Component, OnInit} from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [HttpClientModule],
  template: '<h1>{{ message }}</h1>',
  templateUrl: './document-upload.component.html',
  styleUrl: './document-upload.component.css'
})
export class DocumentUploadComponent implements OnInit {
  selectedFile: File | null = null;
  message = '';

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

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<{ message: string }>('/api/test').subscribe((response) => {
      this.message = response.message;
    });
  }

}
