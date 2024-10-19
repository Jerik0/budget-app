import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Bill } from "../models/Bill";

@Injectable({
  providedIn: 'root'
})
export class BillService {

  constructor(private http: HttpClient) { }

  test(): Observable<any> {
    console.log('test was called');
    return this.http.get('http://localhost:3000/api/test');
  }

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

  updateBill(bill: Bill) {
    return this.http.put('http://localhost:3000/bills/', bill);
  }
}
