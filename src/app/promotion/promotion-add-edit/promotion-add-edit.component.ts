import { Component, Input, OnInit } from '@angular/core';
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
export class PromotionAddEditComponent implements OnInit {
  @Input() promotionMode = '';
  @Input() refreshPromotionList: any;

  promotionForm: any;
  isCouponReadonly = false;

  constructor(private _promotionService: PromotionService, private _utilityService: UtilityService) {
    this.initPromotionFormGroup(new PromotionModel());
  }

  ngOnInit() {
    // Setup subscription for initial form
    this.setupCouponTypeListener();
  }

  setupCouponTypeListener() {
    // Subscribe to couponType changes
    this.promotionForm.get('couponType')?.valueChanges.subscribe((value: string | number) => {
      this.handleCouponTypeChange(value);
    });
    // Set initial state based on current coupon type
    this.handleCouponTypeChange(this.promotionForm.get('couponType')?.value);
  }

  handleCouponTypeChange(couponType: string | number) {
    const couponControl = this.promotionForm.get('coupon');
    // If coupon type is 2, set to "N/A" and make readonly (keep control enabled for API submission)
    if (couponType === 2 || couponType === '2') {
      couponControl?.setValue('N/A', { emitEvent: false });
      this.isCouponReadonly = true;
    } else {
      couponControl?.setValue('', { emitEvent: false });
      this.isCouponReadonly = false;
    }
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
    // Update coupon field state based on coupon type
    this.handleCouponTypeChange(promotion.CouponType);
    // Setup subscription for this form instance
    this.setupCouponTypeListener();
  }

  savePromotion() {
    if (this.promotionForm.invalid) {
      this._utilityService.showToast(new ToastMessage(ToastType.Error, 'Please fill all required fields', 'Promotion'));
      return;
    }

    // Get date values
    const startingDate = new Date(this.promotionForm.get('startingDate')?.value);
    const endingDate = new Date(this.promotionForm.get('endingDate')?.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validate starting date is today or in the future
    if (startingDate < today) {
      this._utilityService.showToast(new ToastMessage(ToastType.Error, 'Starting date must be today or in the future', 'Promotion'));
      return;
    }

    // Validate ending date is greater than starting date
    if (endingDate <= startingDate) {
      this._utilityService.showToast(new ToastMessage(ToastType.Error, 'Ending date must be greater than starting date', 'Promotion'));
      return;
    }
    debugger
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
