import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PromotionService } from '../promotion.service';
import { UtilityService } from '../../shared/services/utility.service';
import { PromotionModel } from '../models/PromotionModel';
import { ApiResponse } from '../../shared/models/ApiResponse';
import { ToastMessage, ToastType } from '../../shared/models/ToastMessage';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-promotion-add-edit',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './promotion-add-edit.component.html',
  styleUrl: './promotion-add-edit.component.css'
})
export class PromotionAddEditComponent {
  @Input() promotionMode = '';
  @Input() refreshPromotionList: any;

  promotionForm: any;

  constructor(private _promotionService: PromotionService, private _utilityService: UtilityService) {
    this.initPromotionFormGroup(new PromotionModel());
  }

  initPromotionFormGroup(promotion: PromotionModel) {
    this.promotionForm = new FormGroup({
      id: new FormControl(promotion.Id),
      coupon: new FormControl(promotion.Coupon, Validators.required),
      couponType: new FormControl(promotion.CouponType, Validators.required),
      startingDate: new FormControl(promotion.StartingDate, Validators.required),
      endingDate: new FormControl(promotion.EndingDate, Validators.required),
      count: new FormControl(promotion.Count, Validators.required),
      usedCount: new FormControl(promotion.UsedCount),
      discountMode: new FormControl(promotion.DiscountMode, Validators.required),
      amount: new FormControl(promotion.Amount),
      percentage: new FormControl(promotion.Percentage),
      minimumAmount: new FormControl(promotion.MinimumAmount),
    });
  }

  savePromotion() {
    if (this.promotionForm.invalid) {
      this._utilityService.showToast(new ToastMessage(ToastType.Error, 'Please fill all required fields', 'Promotion'));
      return;
    }

    this._utilityService.showLoader(true);
    const formData = this.promotionForm.value;

    if (this.promotionMode === 'Create') {
      this._promotionService.createPromotion(formData).subscribe((response: ApiResponse<any>) => {
        if (response.Success) {
          this._utilityService.showToast(new ToastMessage(ToastType.Success, response.SuccessMessage, 'Promotion'));
          this._utilityService.showModal(false, 'promotion-add-edit');
          this.refreshPromotionList();
        } else {
          this._utilityService.showToast(new ToastMessage(ToastType.Error, response.ErrorMessage, 'Promotion'));
        }
        this._utilityService.showLoader(false);
      });
    } else if (this.promotionMode === 'Update') {
      this._promotionService.updatePromotion(formData).subscribe((response: ApiResponse<any>) => {
        if (response.Success) {
          this._utilityService.showToast(new ToastMessage(ToastType.Success, response.SuccessMessage, 'Promotion'));
          this._utilityService.showModal(false, 'promotion-add-edit');
          this.refreshPromotionList();
        } else {
          this._utilityService.showToast(new ToastMessage(ToastType.Error, response.ErrorMessage, 'Promotion'));
        }
        this._utilityService.showLoader(false);
      });
    }
  }

  closeModal() {
    this._utilityService.showModal(false, 'promotion-add-edit');
  }
}
