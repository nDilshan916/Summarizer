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
  summaries: { [key: string]: any[] } = {}; // Store content-wise summaries by topic ID
  combinedSummary: string | null = null; // Store the combined summary
  isLoading: boolean = false; // Loading state for content-wise summary generation
  isCombinedLoading: boolean = false; // Loading state for combined summary generation
  activeSummaryType: 'content' | 'combined' | null = null; // Track which summary type is active

  constructor(private summaryService: SummaryService) {}

  generateSummary() {
    if (!this.selectedTopic || !this.selectedTopic.id) return; // Ensure a valid topic is selected

    this.isLoading = true;
    this.activeSummaryType = 'content'; // Set active summary type to content-wise

    // Call API to generate the summary for the selected topic
    this.summaryService.generateSummary(this.selectedTopic.id).subscribe(
      () => {
        // Fetch the summary after it is generated
        this.getSummary();
      },
      (error) => {
        console.error('Error generating summary:', error);
        this.isLoading = false; // Reset loading state on error
        this.activeSummaryType = null; // Reset active summary type
      }
    );
  }

  generateCombinedSummary() {
    if (!this.selectedTopic || !this.selectedTopic.id) return; // Ensure a valid topic is selected

    this.isCombinedLoading = true;
    this.activeSummaryType = 'combined'; // Set active summary type to combined

    // Call API to generate the combined summary for the selected topic
    this.summaryService.generateCombinedSummary(this.selectedTopic.id).subscribe(
      (res) => {
        // Save the combined summary
        this.combinedSummary = res.combined_summary;
        this.isCombinedLoading = false; // Reset loading state
      },
      (error) => {
        console.error('Error generating combined summary:', error);
        this.isCombinedLoading = false; // Reset loading state on error
        this.activeSummaryType = null; // Reset active summary type
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
        this.activeSummaryType = null; // Reset active summary type
      }
    );
  }
}