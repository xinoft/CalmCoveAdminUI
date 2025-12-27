import { PromotionModel } from "./PromotionModel";

export class PromotionItemModel {
    Id: number = 0;
    Coupon: string = '';
    Promotion:PromotionModel = new PromotionModel();
    SpecificCustomerAccount:any = null;
    AppliedCustomerAccount:any = null;
    AppliedDate:any = null;
}