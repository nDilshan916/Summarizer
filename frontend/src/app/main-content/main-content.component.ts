import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryService } from '../summary.service';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.css'],
})
export class MainContentComponent {
  @Input() selectedTopic: any = null; // Currently selected topic
  summaries: { [key: string]: any[] } = {}; // Store summaries by topic ID
  isLoading: boolean = false; // Loading state for summary generation

  constructor(private summaryService: SummaryService) {}

  generateSummary() {
    if (!this.selectedTopic || !this.selectedTopic.id) return; // Ensure a valid topic is selected

    this.isLoading = true;

    // Call API to generate the summary for the selected topic
    this.summaryService.generateSummary(this.selectedTopic.id).subscribe(
      () => {
        // Fetch the summary after it is generated
        this.getSummary();
      },
      (error) => {
        console.error('Error generating summary:', error);
        this.isLoading = false; // Reset loading state on error
      }
    );
  }

  getSummary() {
    if (!this.selectedTopic || !this.selectedTopic.id) return; // Ensure a valid topic is selected

    // Call API to fetch the summary for the selected topic
    this.summaryService.getSummary(this.selectedTopic.id).subscribe(
      (res) => {
        // Save the fetched summaries in the dictionary keyed by topic ID
        this.summaries[this.selectedTopic.id] = res.summaries;
        this.isLoading = false; // Reset loading state
      },
      (error) => {
        console.error('Error fetching summary:', error);
        this.isLoading = false; // Reset loading state on error
      }
    );
  }
}
