import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {map, Observable} from "rxjs";
import { Transaction } from "../models/Transaction";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient) { }

  createTransaction(transaction: Transaction) {
    console.log('createTransaction called');
    return this.http.post('http://localhost:3000/transactions', transaction);
  }

  getAllTransactions() {
    return this.http.get('http://localhost:3000/transactions').pipe();
  }

  getAllTransactionsWithFormattedDate() {
    return this.http.get('http://localhost:3000/transactions').pipe(
      map((res: Transaction) => {

        return res;
      })
    );
  }

  getTransactionById(id: number) {
    return this.http.get(`http://localhost:3000/transactions/${id}`);
  }

  updateTransaction(transaction: any) {
    console.log(transaction.id);
    return this.http.put(`http://localhost:3000/transactions/${transaction.id}`, transaction);
  }

  delete(ids: number[]): Observable<any> {
    return this.http.delete('http://localhost:3000/transactions', {
      params: { ids: ids.join(',') }
    });
  }

   isValid(transaction: Transaction): boolean {
    return (
      transaction.name !== undefined && transaction.name.trim().length > 0 &&
      transaction.amount !== undefined && transaction.amount > 0 &&
      transaction.date !== undefined &&
      transaction.necessity !== undefined &&
      transaction.category !== undefined &&
      transaction.chargeType !== undefined
    );
  }
}
