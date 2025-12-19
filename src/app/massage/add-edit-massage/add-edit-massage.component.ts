import { Component, Input, OnInit } from '@angular/core';
import { MassageModel } from '../models/MassageModel';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormErrorComponent } from '../../shared/components/form-error/form-error.component';
import { MassageService } from '../massage.service';
import { ToastMessage, ToastType } from '../../shared/models/ToastMessage';
import { UtilityService } from '../../shared/services/utility.service';

@Component({
  selector: 'app-add-edit-massage',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, FormErrorComponent],
  templateUrl: './add-edit-massage.component.html',
  styleUrl: './add-edit-massage.component.css'
})
export class AddEditMassageComponent implements OnInit {

  massageForm: any;
  @Input() massageModeText = "";
  @Input() refresMassageList: any;
  @Input() massageId?: number;

  constructor(private _massageService: MassageService, private _utilityService: UtilityService) {
    this.initMassageFormGroup(new MassageModel());
  }

  ngOnInit() {

  }

  initMassageFormGroup(massage: MassageModel) {
    this.massageForm = new FormGroup({
      id: new FormControl(massage.Id),
      name: new FormControl(massage.Name, Validators.required),
      type: new FormControl(massage.Type, Validators.required),
      purpose: new FormControl(massage.Purpose),
      description: new FormControl(massage.Description),
      bestFor: new FormControl(massage.BestFor),
      outcome: new FormControl(massage.Outcome),
      includes: new FormControl(massage.Includes),
      duration: new FormControl(massage.Duration, Validators.required),
      price: new FormControl(massage.Price, [Validators.required, Validators.min(0)]),
    });
  }

  onSubmitUserForm() {
    if (this.massageForm.valid) {
      const massageData = this.massageForm.value;
      this._massageService.saveMassage(massageData).subscribe({
        next: (response) => {
          if (response.Success) {
            this.onSuccessfulSave(response);
          } else {
            this._utilityService.showToast(new ToastMessage(ToastType.Error, response.ErrorMessage, "Massage"));
          }
        },
        error: (error) => {
          console.error('Error saving massage:', error);
        }
      });
    } else {
      this.massageForm.markAllAsTouched();
    }
  }

  onSuccessfulSave(response: any) {
    this.massageForm.reset();
    this.initMassageFormGroup(new MassageModel());
    if (this.refresMassageList) {
      this.refresMassageList();
    }
    this._utilityService.showModal(false, "massage-add-edit");
    this._utilityService.showToast(new ToastMessage(ToastType.Success, response.SuccessMessage, "Massage"));
  }
}
