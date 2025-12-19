import { Component, ViewChild } from '@angular/core';
import { MassageService } from '../massage.service';
import { UtilityService } from '../../shared/services/utility.service';
import { MassageModel } from '../models/MassageModel';
import { ApiResponse } from '../../shared/models/ApiResponse';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { MassageTypePipe } from '../../shared/pipes/massage-type.pipe';
import { PricePipe } from '../../shared/pipes/price.pipe';
import { AddEditMassageComponent } from '../add-edit-massage/add-edit-massage.component';

@Component({
  selector: 'app-massage-list',
  standalone: true,
  imports: [TableModule, FormsModule, MassageTypePipe, PricePipe, AddEditMassageComponent],
  templateUrl: './massage-list.component.html',
  styleUrl: './massage-list.component.css'
})
export class MassageListComponent {

  @ViewChild("massageAddEdit") massageAddEdit: any;

  massageModeText = "Create";
  massageMode = 1; // 1 - Create, 2 - Update
  selectedMassageId?: number;

  constructor(private _massageService: MassageService,
    private _utilityService: UtilityService) {
    this.getMassageList();
  }

  searchKeyword = "";
  massageList: MassageModel[] = [];

  clearMassageListFilter() {
    this.searchKeyword = "";
    this.getMassageList();
  }

  getMassageList() {
    this._utilityService.showLoader(true);
    this._massageService.getMassageList(this.searchKeyword).subscribe((response: ApiResponse<MassageModel[]>) => {
      if (response.Success) {
        this.massageList = response.Result;
      }
      this._utilityService.showLoader(false);
    });
  }

  get getMassageListFromChild() {
    return this.getMassageList.bind(this);
  }

  startCreateMassageProcess() {
    this.massageModeText = "Create";
    this.selectedMassageId = undefined;
    this.massageAddEdit?.initMassageFormGroup(new MassageModel());
    this._utilityService.showModal(true, "massage-add-edit");
  }

  startUpdateMassageProcess(massageId: number) {
    this.massageModeText = "Update";
    this.selectedMassageId = massageId;
    this._massageService.getMassageById(massageId).subscribe({
      next: (response) => {
        if (response.Success && response.Result) {
          this.massageAddEdit?.initMassageFormGroup(response.Result);
        }
      },
      error: (error) => {
        console.error('Error loading massage:', error);
      }
    });
    this._utilityService.showModal(true, "massage-add-edit");
  }

  removeMassage(massageId: number) {
    if (confirm('Are you sure you want to delete this massage?')) {
      this._utilityService.showLoader(true);
      this._massageService.deleteMassage(massageId).subscribe({
        next: (response) => {
          if (response.Success) {
            this.getMassageList(); // Refresh the list
          } else {
            console.error('Failed to delete massage:', response.Message);
          }
          this._utilityService.showLoader(false);
        },
        error: (error) => {
          console.error('Error deleting massage:', error);
          this._utilityService.showLoader(false);
        }
      });
    }
  }
}
