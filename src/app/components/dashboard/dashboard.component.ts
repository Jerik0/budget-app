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
  date = new Date();
  currentDate = this.date.toISOString();
  bill = new Bill('test name', '$10.00', this.currentDate, true, Category.General);
  selectedBill: number | null = null;

  dataSource = new MatTableDataSource<any>();
  columnsToDisplay = ['name', 'amount', 'date', 'necessity', 'category'];

  constructor(private billService: BillService) {
  }

  ngOnInit(): void {
    this.getBillsList();
  }

  onAddBill() {
    this.billService.createBill(this.bill).subscribe(res => {
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
    if (this.selectedBill === +bill.id) {
      this.selectedBill = null;
    } else {
      this.selectedBill = +bill.id;
    }

    console.log(this.selectedBill);
  }

  onUpdateBill(bill: any) {
    const updatedBill = new Bill(bill.name, bill.amount, bill.date, !!bill.necessity, bill.category);
    console.log(updatedBill);
    console.log('bill id:', +bill.id);
  }

  onDeleteBill(id: number | null) {
    if (this.selectedBill !== null) {
      this.billService.deleteBill(id).subscribe(res => {
        let updatedData = this.dataSource.data;
        this.dataSource.data = updatedData.filter(bill => bill.id !== id);
        console.log(res);
        this.selectedBill = null;
      });
    }
  }
}
