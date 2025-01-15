import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { DocumentUploadComponent } from './document-upload/document-upload.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HttpClientModule } from '@angular/common/http';
import { MainContentComponent } from './main-content/main-content.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, DocumentUploadComponent,SidebarComponent, HttpClientModule, MainContentComponent, CommonModule],  
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] 
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  selectedTopic: any = null;

  onTopicSelected(topic: any): void {
    this.selectedTopic = topic;
  }
}
