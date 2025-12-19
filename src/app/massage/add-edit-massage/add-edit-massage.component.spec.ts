import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditMassageComponent } from './add-edit-massage.component';

describe('AddEditMassageComponent', () => {
  let component: AddEditMassageComponent;
  let fixture: ComponentFixture<AddEditMassageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditMassageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditMassageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
