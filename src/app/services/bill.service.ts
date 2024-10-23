import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Bill } from "../models/Bill";

@Injectable({
  providedIn: 'root'
})
export class BillService {

  constructor(private http: HttpClient) { }

  createBill(bill: Bill) {
    console.log('createBill called');
    return this.http.post('http://localhost:3000/bills', bill);
  }

  getAllBills() {
    return this.http.get('http://localhost:3000/bills');
  }

  getBillById(id: number) {
    return this.http.get(`http://localhost:3000/bills/${id}`);
  }

  updateBill(bill: any) {
    console.log(bill.id);
    return this.http.put(`http://localhost:3000/bills/${bill.id}`, bill);
  }

  delete(ids: number[]): Observable<any> {
    return this.http.delete('http://localhost:3000/bills', {
      params: { ids: ids.join(',') }
    });
  }

   isValid(bill: Bill): boolean {
    return (
      bill.name !== undefined && bill.name.trim().length > 0 &&
      bill.amount !== undefined && bill.amount.trim().length > 0 &&
      bill.date !== undefined &&
      bill.necessity !== undefined &&
      bill.category !== undefined &&
      bill.chargeType !== undefined
    );
  }
}
