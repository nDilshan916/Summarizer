import { Component, ElementRef, HostListener, output, Renderer2 } from '@angular/core';
import { OnInit, Output, EventEmitter } from '@angular/core';
import { TopicService } from '../topic.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TopicUpdateService } from '../topic-update.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, HttpClientModule,  FormsModule,],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
openSearch() {
throw new Error('Method not implemented.');
}
  topics: any[] = [];
  menuVisible: { [key: string]: boolean } = {};
  menuOpen: { [key: string]: boolean } = {}; //menuOpen is a dictionary that stores the state of the menu (open or closed) for each topic.
  isRenaming: { [key: string]: boolean } = {}; //isRenaming is a dictionary that stores the state of the renaming input field for each topic.
  renameValues: { [key: string]: string } = {}; //renameValues is a dictionary that stores the new name for each topic.
  selectedTopic: any = null;
  @Output() topicSelected = new EventEmitter<any>();
  

  constructor(private topicService: TopicService, private topicUpdateService: TopicUpdateService, renderer: Renderer2, private el: ElementRef) { }

  ngOnInit(): void {  //NGoNInit is a lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
    this.loadTopics();

    this.topicUpdateService.topicUpdated$.subscribe(() => {
      this.loadTopics(); // Reload topics when notified
    });
  }
  

  

  //load all the topics
 loadTopics(): void {
  this.topicService.getTopics().subscribe({
    next: (data) => {
      this.topics = data.documents || [];
    },
    error: (error) => {
      console.error('Error fetching topics:', error);
    }
  });
 }

 //select a topic
  selectTopic(topic: any): void {
    this.topicSelected.emit(topic);
    this.selectedTopic = topic; // Set the selected topic to the clicked topic
    console.log('Topic selected:', topic);
  }

  showMenu(topicId: string): void {
    this.menuVisible[topicId] = true;
    
  }

  toggleMenu(topicId: string): void {
    this.menuVisible[topicId] = !this.menuVisible[topicId];
    console.log(`Toggled menu for topicId: ${topicId}`);
  }

  preventHideMenu(topicId:  string): void {
    this.menuVisible[topicId] = true;
    
  }
  
  hideMenu(topicId: string): void {
    this.menuVisible[topicId] = false;
  }
  
  openMenu(event: MouseEvent, topicId: string) {
    // Prevents the event from propagating to the document body and triggering the outside click
    event.stopPropagation();
  
    // Close any other open menu and open the clicked menu
    this.menuOpen = { [topicId]: !this.menuOpen[topicId] };
  }
  
  // Close the menu if click is outside
  @HostListener('document:click', ['$event'])
  closeMenuOnClickOutside(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.menuOpen = {}; // Close all menus
    }
  }

  //open the renaming input field for a topic
  startRenaming(topicId: string): void{
    this.isRenaming[topicId] =  true;
    this.renameValues[topicId] = '';
    this.menuOpen[topicId] = false; //close the menu when renaming starts
  }

  //cancel renaming a topic
  cancelRenaming(topicId: string) {
    this.isRenaming[topicId] = false; // Disable renaming mode
    this.renameValues[topicId] = ''; // Clear input
  }

  //rename a topic
  renameTopic(id: string, newName: string): void{
    if(!newName){
      console.error('New name cannot be empty');
      return; //return statement is used to end the execution of the function and specifies a value to be returned to the function caller.
    }

    this.topicService.renameTopic(id,newName).subscribe({ //subscribe is used to subscribe to an observable which means that it will listen to the observable and whenever the observable emits a value, it will be sent to the subscriber.
      next: () => {
        console.log('Topic renamed successfully');
        this.loadTopics(); //reload the topics after renaming
        this.isRenaming[id] = false; // Disable renaming mode
        this.menuOpen = {}; // Close the menu
      },
      error: (error) => {
        console.error('Error renaming topic:', error);
      }
    })
    this.renameValues[id] = ''; // Clear input
  }

  //delete a topic
  deleteTopic(id: string) : void{
      if(!id){
        console.error('ID cannot be empty');
        return;
      }


      this.topicService.deleteTopic(id).subscribe({
        next: () => {
          console.log('Topic deleted successfully');
          this.loadTopics(); //reload the topics after deleting
        },
        error: (error) => {
          console.error('Error deleting topic:', error);
        }
      })
  }

}
