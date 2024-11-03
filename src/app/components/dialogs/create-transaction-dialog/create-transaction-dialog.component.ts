import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatOption} from "@angular/material/autocomplete";
import {MatFormField, MatSelect} from "@angular/material/select";
import {Transaction} from "../../../models/Transaction";
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
import {Frequency} from "../../../enums/Frequency";

@Component({
  selector: 'app-create-transaction-dialog',
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
  templateUrl: './create-transaction-dialog.component.html',
  styleUrl: './create-transaction-dialog.component.scss'
})
export class CreateTransactionDialogComponent implements OnInit {
  protected readonly chargeType = ChargeType;
  protected readonly frequency = Frequency;
  protected readonly category = category;
  readonly dialog = inject(MatDialog);
  transaction = new Transaction();
  transactionForm = new FormGroup(
    {
      name: new FormControl(this.transaction.name, [Validators.required]),
      amount: new FormControl(this.transaction.amount, [Validators.required]),
      date: new FormControl(this.transaction.date, [Validators.required]),
      necessity: new FormControl(this.transaction.necessity, [Validators.required]),
      category: new FormControl(this.transaction.category, [Validators.required]),
      chargeType: new FormControl(this.transaction.chargeType, [Validators.required]),
      frequency: new FormControl(this.transaction.frequency, [Validators.required])
    }
  )

  ngOnInit() {
    this.transactionForm.valueChanges.subscribe((transaction) => {
      this.transaction = transaction as Transaction;
    })
  }
}
