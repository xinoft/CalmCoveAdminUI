import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ReviewService } from '../services/review.service';
import { ReviewModel } from '../models/ReviewModel';
import { UtilityService } from '../../shared/services/utility.service';
import { ToastMessage, ToastType } from '../../shared/models/ToastMessage';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, DialogModule],
  templateUrl: './review-list.component.html',
  styleUrl: './review-list.component.css'
})
export class ReviewListComponent implements OnInit {

  reviewList: ReviewModel[] = [];
  selectedApprovalStatus: number = 0;
  showDetailsModal: boolean = false;
  selectedReview: ReviewModel | null = null;

  approvalStatusOptions = [
    { label: 'Pending', value: 0 },
    { label: 'Approved', value: 1 },
    { label: 'Declined', value: 2 }
  ];

  constructor(
    private _reviewService: ReviewService,
    private _utilityService: UtilityService
  ) { }

  ngOnInit(): void {
    this.getReviewList();
  }

  getReviewList(): void {
    this._utilityService.showLoader(true);
    this._reviewService.getReviewList(this.selectedApprovalStatus).subscribe({
      next: (response) => {
        if (response.Success) {
          this.reviewList = response.Result;
          console.log(this.reviewList);
        } else {
          this._utilityService.showToast(new ToastMessage(ToastType.Error, response.ErrorMessage, 'Reviews'));
        }
        this._utilityService.showLoader(false);
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this._utilityService.showToast(new ToastMessage(ToastType.Error, 'Failed to load reviews', 'Reviews'));
        this._utilityService.showLoader(false);
      }
    });
  }

  onApprovalStatusChange(): void {
    this.getReviewList();
  }

  openDetailsModal(review: ReviewModel): void {
    this.selectedReview = review;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedReview = null;
  }

  approveReview(): void {
    if (!this.selectedReview) return;
    this.setReviewApprovalStatus(this.selectedReview.Id, 1); // 1 = Approved
  }

  declineReview(): void {
    if (!this.selectedReview) return;
    this.setReviewApprovalStatus(this.selectedReview.Id, 2); // 2 = Declined
  }

  setReviewApprovalStatus(reviewId: number, approvalStatus: number): void {
    this._utilityService.showLoader(true);
    this._reviewService.setReviewApprovalStatus(reviewId, approvalStatus).subscribe({
      next: (response) => {
        if (response.Success) {
          const statusLabel = approvalStatus === 1 ? 'Approved' : 'Declined';
          this._utilityService.showToast(new ToastMessage(ToastType.Success, `Review ${statusLabel}`, 'Review Status Updated'));
          this.closeDetailsModal();
          this.getReviewList();
        } else {
          this._utilityService.showToast(new ToastMessage(ToastType.Error, response.ErrorMessage, 'Error'));
        }
        this._utilityService.showLoader(false);
      },
      error: (error) => {
        console.error('Error updating review status:', error);
        this._utilityService.showToast(new ToastMessage(ToastType.Error, 'Failed to update review status', 'Error'));
        this._utilityService.showLoader(false);
      }
    });
  }

  getApprovalStatusLabel(status: number): string {
    const statusObj = this.approvalStatusOptions.find(s => s.value === status);
    return statusObj ? statusObj.label : 'Unknown';
  }

  getApprovalStatusClass(status: number): string {
    switch (status) {
      case 0:
        return 'badge-warning';
      case 1:
        return 'badge-success';
      case 2:
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  getStarColor(star: number): string {
    switch (star) {
      case 5:
      case 4:
        return '#FDB913';
      case 3:
        return '#FF9800';
      case 2:
      case 1:
        return '#F44336';
      default:
        return '#BDBDBD';
    }
  }

}
