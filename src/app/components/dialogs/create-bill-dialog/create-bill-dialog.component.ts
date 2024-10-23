import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatOption} from "@angular/material/autocomplete";
import {MatFormField, MatSelect} from "@angular/material/select";
import {Bill} from "../../../models/Bill";
import Category from "../../../enums/Category";
import category from "../../../enums/Category";
import {KeyValuePipe, NgForOf} from "@angular/common";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatDialog, MatDialogClose} from "@angular/material/dialog";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import ChargeType from "../../../enums/ChargeType";

@Component({
  selector: 'app-create-bill-dialog',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    FormsModule,
    MatOption,
    MatSelect,
    MatInput,
    ReactiveFormsModule,
    KeyValuePipe,
    NgForOf,
    MatFormField,
    MatDialogClose,
    MatDatepicker,
    MatDatepickerToggle,
    MatDatepickerInput,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButton,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule
  ],
  templateUrl: './create-bill-dialog.component.html',
  styleUrl: './create-bill-dialog.component.scss'
})
export class CreateBillDialogComponent implements OnInit {
  protected readonly chargeType = ChargeType;
  protected readonly category = category;
  readonly dialog = inject(MatDialog);
  bill = new Bill();
  billForm = new FormGroup(
    {
      name: new FormControl(this.bill.name, [Validators.required]),
      amount: new FormControl(this.bill.amount, [Validators.required]),
      date: new FormControl(this.bill.date, [Validators.required]),
      necessity: new FormControl(this.bill.necessity, [Validators.required]),
      category: new FormControl(this.bill.category, [Validators.required]),
      chargeType: new FormControl(this.bill.chargeType, [Validators.required]),
    }
  )

  ngOnInit() {
    this.billForm.valueChanges.subscribe((value) => {
      this.bill = value as Bill;
    })
  }
}
