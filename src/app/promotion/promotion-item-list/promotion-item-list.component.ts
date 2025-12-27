import { Component } from "@angular/core";
import { TableModule } from "primeng/table";
import { PromotionService } from "../promotion.service";
import { UtilityService } from "../../shared/services/utility.service";
import { ApiResponse } from "../../shared/models/ApiResponse";
import { PromotionItemModel } from "../models/PromotionItemModel";
import { ToastMessage, ToastType } from "../../shared/models/ToastMessage";
import { CommonModule } from "@angular/common";

@Component({
	selector: "app-promotion-item-list",
	standalone: true,
	imports: [TableModule, CommonModule],
	templateUrl: "./promotion-item-list.component.html",
	styleUrl: "./promotion-item-list.component.css",
})
export class PromotionItemListComponent {
	promotionItemList: PromotionItemModel[] = [];
	promotionType: number = 0;
	promotionCoupon: string = '';

	constructor(private _promotionService: PromotionService, private _utilityService: UtilityService) {}

	getPromotionItemList(promotionId: number, promotionType: number = 0, promotionCoupon: string = '') {
		this.promotionType = promotionType;
		this.promotionCoupon = promotionCoupon;
		this._utilityService.showLoader(true);
		this._promotionService.getPromotionItemList(promotionId).subscribe((response: ApiResponse<PromotionItemModel[]>) => {
			if (response.Success) {
				this.promotionItemList = response.Result.sort((a, b) => {
					const dateA = a.AppliedDate ? new Date(a.AppliedDate).getTime() : 0;
					const dateB = b.AppliedDate ? new Date(b.AppliedDate).getTime() : 0;
					return dateB - dateA;
				});
				this._utilityService.showModal(true, "promotion-item-list-modal");
			} else {
				this._utilityService.showToast(new ToastMessage(ToastType.Error, response.ErrorMessage, "Promotion Items"));
			}
			this._utilityService.showLoader(false);
		});
	}

	closeModal() {
		this._utilityService.showModal(false, "promotion-item-list-modal");
	}
}
