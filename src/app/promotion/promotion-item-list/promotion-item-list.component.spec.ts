import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionItemListComponent } from './promotion-item-list.component';

describe('PromotionItemListComponent', () => {
  let component: PromotionItemListComponent;
  let fixture: ComponentFixture<PromotionItemListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionItemListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotionItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
