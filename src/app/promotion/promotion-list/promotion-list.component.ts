import { Component, OnInit, ViewChild } from "@angular/core";
import { TableModule } from "primeng/table";
import { PromotionService } from "../promotion.service";
import { UtilityService } from "../../shared/services/utility.service";
import { ApiResponse } from "../../shared/models/ApiResponse";
import { PromotionListRequest } from "../models/PromotionListRequest";
import { ToastMessage, ToastType } from "../../shared/models/ToastMessage";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { PromotionModel } from "../models/PromotionModel";
import { PricePipe } from "../../shared/pipes/price.pipe";
import { PromotionItemListComponent } from "../promotion-item-list/promotion-item-list.component";
import { PromotionAddEditComponent } from "../promotion-add-edit/promotion-add-edit.component";

@Component({
	selector: "app-promotion-list",
	standalone: true,
	imports: [TableModule, FormsModule, CommonModule, PricePipe, PromotionItemListComponent, PromotionAddEditComponent],
	templateUrl: "./promotion-list.component.html",
	styleUrl: "./promotion-list.component.css",
})
export class PromotionListComponent implements OnInit {
	@ViewChild("promotionItemList") promotionItemListComponent: PromotionItemListComponent | null = null;
	@ViewChild("promotionAddEdit") promotionAddEditComponent: PromotionAddEditComponent | null = null;
	
	promotionList: PromotionModel[] = [];
	startingDate: string;
	endingDate: string;
	coupon: string = "";
	promotionMode = "";

	constructor(private _promotionService: PromotionService, private _utilityService: UtilityService) {
		const today = new Date();
		const nextMonth = new Date();
		nextMonth.setMonth(nextMonth.getMonth() + 1);
		this.startingDate = this.formatDateForInput(today);
		this.endingDate = this.formatDateForInput(nextMonth);
	}

	ngOnInit(): void {
		this.getPromotionList();
	}

	clearPromotionListFilter() {
		const today = new Date();
		const nextMonth = new Date();
		nextMonth.setMonth(nextMonth.getMonth() + 1);
		this.startingDate = this.formatDateForInput(today);
		this.endingDate = this.formatDateForInput(nextMonth);
		this.coupon = "";
		this.getPromotionList();
	}

	getPromotionList() {
		this._utilityService.showLoader(true);
		const request: PromotionListRequest = {
			startingDate: new Date(this.startingDate),
			endingDate: new Date(this.endingDate),
			coupon: this.coupon || undefined
		};

		this._promotionService.getPromotionList(request).subscribe((response: ApiResponse<PromotionModel[]>) => {
			if (response.Success) {
				this.promotionList = response.Result;
			} else {
				this._utilityService.showToast(new ToastMessage(ToastType.Error, response.ErrorMessage, "Promotion"));
			}
			this._utilityService.showLoader(false);
		});
	}

	get getPromotionListFromChild() {
		return this.getPromotionList.bind(this);
	}

	removePromotion(id: number) {
		if (!window.confirm("Are you sure you want to remove this Promotion")) {
			return;
		}
		this._utilityService.showLoader(true);
		// TODO: Implement removePromotion endpoint in service
		// this._promotionService.removePromotion(id).subscribe((response: ApiResponse<null>) => {
		// 	if (response.Success) {
		// 		this._utilityService.showToast(new ToastMessage(ToastType.Success, response.SuccessMessage, "Promotion"));
		// 		this.getPromotionList();
		// 	} else {
		// 		this._utilityService.showToast(new ToastMessage(ToastType.Error, response.ErrorMessage, "Promotion"));
		// 	}
		// 	this._utilityService.showLoader(false);
		// });
	}

	startCreatePromotionProcess() {
		this.promotionMode = "Create";
		this.promotionAddEditComponent?.initPromotionFormGroup(new PromotionModel());
		this._utilityService.showModal(true, "promotion-add-edit");
	}

	startUpdatePromotionProcess(id: number) {
		this.promotionMode = "Update";
		this._utilityService.showLoader(true);
		this._promotionService.getPromotion(id).subscribe((response: ApiResponse<PromotionModel>) => {
			if (response.Success) {
				const promotion = response.Result;
				this.promotionAddEditComponent?.initPromotionFormGroup(promotion);
				this._utilityService.showModal(true, "promotion-add-edit");
			}
			this._utilityService.showLoader(false);
		});
	}

	startViewPromotionItemProcess(id: number, promotionType: number, coupon: string) {
		this.promotionItemListComponent?.getPromotionItemList(id, promotionType, coupon, this.coupon);
	}

	formatDate(date: Date): string {
		return date ? new Date(date).toLocaleDateString() : '';
	}

	private formatDateForInput(date: Date): string {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}
}
