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

  updateBill(id: number, bill: Bill) {
    return this.http.put(`http://localhost:3000/bills/${id}`, bill);
  }

  delete(ids: number[]): Observable<any> {
    console.log('ids joined:', ids.join(','));
    return this.http.delete('http://localhost:3000/bills/many', {
      params: { ids: ids.join(',') }
    });
  }
}
