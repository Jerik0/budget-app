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
    MatRowDef
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  bill = new Bill();
  date = new Date();
  currentDate = this.date.toISOString();
  dataSource = new MatTableDataSource<any>();
  columnsToDisplay = ['name', 'amount', 'date', 'necessity', 'category'];

  constructor(private billService: BillService) {
  }

  ngOnInit(): void {
    this.bill.name = 'test name';
    this.bill.amount = '$10.00';
    this.bill.date = this.currentDate;
    this.bill.necessity = true;
    this.bill.category = Category.General;

    this.billService.getAllBills().subscribe(res => {
      // @ts-ignore
      this.dataSource.data = res;
      console.log(this.dataSource.data);
    });
  }

  onButtonClick() {
    this.billService.createBill(this.bill).subscribe(res => {
      let updatedData = this.dataSource.data;
      updatedData.push(res);

      this.dataSource.data = updatedData;
      console.log('bill created:', res);
    });
  }

  getId(bill: any) {
    const updatedBill = new Bill();
    updatedBill.name = bill.name;
    updatedBill.amount = bill.amount;
    updatedBill.date = bill.date;
    // !! parses string into boolean
    updatedBill.necessity = !!bill.necessity;
    updatedBill.category = bill.category;
    console.log(updatedBill);
  }
}
