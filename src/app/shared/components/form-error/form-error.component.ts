import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-form-error',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
         *ngIf="control?.invalid && control?.touched && getErrorMessage()">
      {{ getErrorMessage() }}
    </div>
  `,
    styles: []
})
export class FormErrorComponent {
    @Input() control!: AbstractControl;
    @Input() customMessages: { [key: string]: string } = {};
    @Input() type?: string;

    private defaultMessages: { [key: string]: string } = {
        required: 'This field is required',
        email: 'Please enter a valid email address',
        minlength: 'Value is too short',
        maxlength: 'Value is too long',
        pattern: 'Invalid format',
        min: 'Value is too small',
        max: 'Value is too large'
    };

    private customValidators: { [key: string]: (value: any) => string | null } = {
        pincode: (value: string) => {
            if (!value) return null;
            const pincodeRegex = /^[1-9][0-9]{5}$/;
            return pincodeRegex.test(value) ? null : 'Please enter a valid 6-digit pincode';
        },
        phone: (value: string) => {
            if (!value) return null;
            const phoneRegex = /^[6-9]\d{9}$/;
            return phoneRegex.test(value) ? null : 'Please enter a valid 10-digit mobile number';
        },
        // Add more custom validators here
    };

    getErrorMessage(): string | null {
        if (!this.control?.errors) return null;

        const errors = this.control.errors;
        const value = this.control.value;

        // Check custom type validation first
        if (this.type && this.customValidators[this.type]) {
            const customError = this.customValidators[this.type](value);
            if (customError) return customError;
        }

        // Check custom messages
        const errorKeys = Object.keys(errors);
        for (const key of errorKeys) {
            if (this.customMessages[key]) {
                return this.customMessages[key];
            }
        }

        // Check default messages
        for (const key of errorKeys) {
            if (this.defaultMessages[key]) {
                return this.defaultMessages[key];
            }
        }

        return 'Invalid value';
    }
}

// <app-form-error [control]="massageForm.get('pincode')" [type]="'pincode'"></app-form-error>