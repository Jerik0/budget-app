import IBill from '../interfaces/IBill';
import Category from '../enums/Category';

export class Bill {
  public name: string | undefined;
  public amount: string | undefined;
  public date: string | undefined;
  public necessity: boolean | undefined;
  public category: Category | undefined;

  constructor();
  constructor(bill: Bill);
  constructor(bill?: Bill) {
    this.name = bill?.name;
    this.amount = bill?.amount;
    this.date = bill?.date;
    this.necessity = bill?.necessity;
    this.category = bill?.category;
  }
}
