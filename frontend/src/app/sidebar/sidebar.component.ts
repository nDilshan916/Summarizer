import { Component, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';
import { OnInit } from '@angular/core';
import { TopicService } from '../topic.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TopicUpdateService } from '../topic-update.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  topics: any[] = [];
  filteredTopics: any[] = [];
  menuVisible: { [key: string]: boolean } = {};
  menuOpen: { [key: string]: boolean } = {};
  isRenaming: { [key: string]: boolean } = {};
  renameValues: { [key: string]: string } = {};
  selectedTopic: any = null;
  @Output() topicSelected = new EventEmitter<any>();
  searchVisible: boolean = false;
  searchQuery: string = '';
  isConfirmingDelete: boolean = false;
  topicToDelete: string | null = null;


  constructor(
    private topicService: TopicService,
    private topicUpdateService: TopicUpdateService,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.loadTopics();

    this.topicUpdateService.topicUpdated$.subscribe(() => {
      this.loadTopics();
    });
  }

  openSearch(): void {
    this.searchVisible = !this.searchVisible;
    this.searchQuery = '';
    this.filteredTopics = this.topics;
  }

  filterTopics(): void {
    this.filteredTopics = this.topics.filter((topic) =>
      topic.topic.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  loadTopics(): void {
    this.topicService.getTopics().subscribe({
      next: (data) => {
        this.topics = data.documents || [];
        this.filteredTopics = this.topics;
      },
      error: (error) => {
        console.error('Error fetching topics:', error);
      },
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filteredTopics = this.topics;
  }
  

  selectTopic(topic: any): void {
    this.topicSelected.emit(topic);
    this.selectedTopic = topic;
    console.log('Topic selected:', topic);
  }

  toggleMenu(topicId: string): void {
    this.menuVisible[topicId] = !this.menuVisible[topicId];
    console.log(`Toggled menu for topicId: ${topicId}`);
  }

  openMenu(event: MouseEvent, topicId: string): void {
    event.stopPropagation();
    this.menuOpen = { [topicId]: !this.menuOpen[topicId] };
  }

  @HostListener('document:click', ['$event'])
  closeMenuOnClickOutside(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.menuOpen = {};
    }
  }

  startRenaming(topicId: string): void {
    this.isRenaming[topicId] = true;
    this.renameValues[topicId] = '';
    this.menuOpen[topicId] = false;
  }

  cancelRenaming(topicId: string): void {
    this.isRenaming[topicId] = false;
    this.renameValues[topicId] = '';
  }

  renameTopic(id: string, newName: string): void {
    if (!newName) {
      console.error('New name cannot be empty');
      return;
    }

    this.topicService.renameTopic(id, newName).subscribe({
      next: () => {
        console.log('Topic renamed successfully');
        this.loadTopics();
        this.isRenaming[id] = false;
        this.menuOpen = {};
      },
      error: (error) => {
        console.error('Error renaming topic:', error);
      },
    });

    this.renameValues[id] = '';
  }

  deleteTopic(id: string): void {
    if (!id) {
      console.error('ID cannot be empty');
      return;
    }
  
    const confirmDelete = window.confirm('Are you sure you want to delete this topic?');
    if (!confirmDelete) return;
  
    this.topicService.deleteTopic(id).subscribe({
      next: () => {
        console.log('Topic deleted successfully');
        this.loadTopics();
      },
      error: (error) => {
        console.error('Error deleting topic:', error);
      },
    });
  }
  
  openDeleteConfirmation(id: string): void {
    this.isConfirmingDelete = true;
    this.topicToDelete = id;
  }
  
  confirmDelete(): void {
    if (!this.topicToDelete) return;
  
    this.topicService.deleteTopic(this.topicToDelete).subscribe({
      next: () => {
        console.log('Topic deleted successfully');
        this.loadTopics();
        this.isConfirmingDelete = false;
        this.topicToDelete = null;
      },
      error: (error) => {
        console.error('Error deleting topic:', error);
      },
    });
  }
  
  cancelDelete(): void {
    this.isConfirmingDelete = false;
    this.topicToDelete = null;
  }
  
  formatTitle(title: string): string {
    if (!title) return '';
    return title
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
