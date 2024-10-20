import { Component, OnInit } from '@angular/core';
import { BillService } from "../../services/bill.service";
import { MatButton } from "@angular/material/button";
import { Bill } from "../../models/Bill";
import Category from "../../enums/Category";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable, MatTableDataSource
} from "@angular/material/table";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatButton,
    MatTable,
    MatCellDef,
    MatHeaderCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    ReactiveFormsModule,
    MatFormField,
    MatInput
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  date = new Date();
  selectedBill: number | null = null;
  billsToDelete: number[] = [];
  dataSource = new MatTableDataSource<any>();
  columnsToDisplay = ['name', 'amount', 'date', 'necessity', 'category'];
  billForm: FormGroup;

  constructor(private billService: BillService, public fb: FormBuilder) {
    this.billForm = fb.group({
      name: ['', Validators.required],
      amount: ['', Validators.required],
      date: ['', Validators.required],
      necessity: ['', Validators.required],
      category: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.getBillsList();
  }

  onAddBill() {
    let currentDate = this.date.toISOString();
    let bill = new Bill('test name', '$10.00', currentDate, true, Category.General);

    this.billService.createBill(bill).subscribe(res => {
      // copy data, update it, assign back to dataSource.data
      let updatedData = this.dataSource.data;
      updatedData.push(res);
      this.dataSource.data = updatedData;
      console.log('bill created:', res);
    });
  }

  getBillsList() {
    this.billService.getAllBills().subscribe(res => {
      // @ts-ignore
      this.dataSource.data = res;
      console.log('bills:', res);
    })
  }

  onSelectBill(bill: any) {
    let filteredArray = this.billsToDelete;
    if (this.selectedBill === +bill.id) {
      this.selectedBill = null;
      this.billsToDelete = filteredArray.filter(item => item !== +bill.id);
    } else {
      this.selectedBill = +bill.id;
      this.billsToDelete.push(+bill.id);
    }

    console.log(this.selectedBill);
    console.log(this.billsToDelete);
  }

  onUpdateBill(bill: any) {
    const updatedBill = new Bill(bill.name, bill.amount, bill.date, !!bill.necessity, bill.category);
    console.log(updatedBill);
    console.log('bill id:', +bill.id);
  }

  deleteSelectedBills() {
    console.log('bills to delete:', this.billsToDelete);
    if (this.billsToDelete.length !== 0) {
      this.billService.delete(this.billsToDelete).subscribe(res => {
        console.log(res);
        this.billsToDelete = [];
        this.selectedBill = null;
        this.getBillsList();
      });
    }
  }
}
