export class PromotionModel {
  id: number = 0;
  Coupon: string = '';
  CouponType: number = 0;
  StartingDate: Date = new Date();
  EndingDate: Date = new Date();
  Count: number = 0;
  UsedCount: number = 0;
  DiscountMode: number = 0;
  Amount: number = 0;
  Percentage: number = 0;
  MinimumAmount: number = 0;
}