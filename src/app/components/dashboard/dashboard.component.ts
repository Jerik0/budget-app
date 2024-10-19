import { Component, OnInit } from '@angular/core';
import { BillService } from "../../services/bill.service";
import {MatButton} from "@angular/material/button";
import {Bill} from "../../models/Bill";
import Category from "../../enums/Category";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatButton
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  response: any;
  bill = new Bill();
  currentDate = '20241019';

  constructor(private billService: BillService) {
  }

  ngOnInit(): void {
    this.bill.name = 'test name';
    this.bill.amount = '$10.00';
    this.bill.date = this.currentDate;
    this.bill.necessity = true;
    this.bill.category = Category.General;
  }

  onButtonClick() {
    this.billService.test().subscribe(res => {
      this.response = res.message;
      console.log(res)
    });

    this.billService.getAllBills().subscribe(res => {console.log(res)});

    this.billService.createBill(this.bill).subscribe(res => {console.log(res)});
  }
}
