import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionAddEditComponent } from './promotion-add-edit.component';

describe('PromotionAddEditComponent', () => {
  let component: PromotionAddEditComponent;
  let fixture: ComponentFixture<PromotionAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionAddEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotionAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
