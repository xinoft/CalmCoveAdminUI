import { Component } from "@angular/core";
import { TableModule } from "primeng/table";
import { PromotionService } from "../promotion.service";
import { UtilityService } from "../../shared/services/utility.service";
import { TimezoneService } from "../../shared/services/timezone.service";
import { ApiResponse } from "../../shared/models/ApiResponse";
import { PromotionItemModel } from "../models/PromotionItemModel";
import { ToastMessage, ToastType } from "../../shared/models/ToastMessage";
import { CommonModule } from "@angular/common";
import { UtcToLocalPipe } from "../../shared/pipes/utc-to-local.pipe";

@Component({
	selector: "app-promotion-item-list",
	standalone: true,
	imports: [TableModule, CommonModule, UtcToLocalPipe],
	templateUrl: "./promotion-item-list.component.html",
	styleUrl: "./promotion-item-list.component.css",
})
export class PromotionItemListComponent {
	promotionItemList: PromotionItemModel[] = [];
	promotionType: number = 0;
	promotionCoupon: string = '';
	searchKeyword: string = '';

	constructor(private _promotionService: PromotionService, private _utilityService: UtilityService) {}

	getUsedCount(): number {
		return this.promotionItemList.filter(item => item.AppliedDate && item.AppliedDate !== null).length || 0;
	}

	getBalanceCount(): number {
		return (this.promotionItemList?.length || 0) - this.getUsedCount();
	}

	getPromotionItemList(promotionId: number, promotionType: number = 0, promotionCoupon: string = '', searchKeyword: string = '') {
		this.promotionType = promotionType;
		this.promotionCoupon = promotionCoupon;
		this.searchKeyword = searchKeyword;
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

	highlightKeyword(text: string): any {
		if (!this.searchKeyword || !text) {
			return text;
		}
		const regex = new RegExp(`(${this.searchKeyword})`, 'gi');
		return text.replace(regex, '<mark>$1</mark>');
	}

	closeModal() {
		this._utilityService.showModal(false, "promotion-item-list-modal");
	}
}
