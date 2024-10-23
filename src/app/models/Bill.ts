import IBill from '../interfaces/IBill';
import Category from '../enums/Category';

export class Bill {
  public name?: string;
  public amount?: string;
  public date?: string;
  public necessity?: boolean;
  public category?: Category;

  constructor();
  constructor(name: string, amount: string, date: string, necessity: boolean, category: Category);
  constructor(name?: string, amount?: string, date?: string, necessity?: boolean, category?: Category) {
    this.name = name;
    this.amount = amount;
    this.date = date;
    this.necessity = necessity;
    this.category = category;
  }
}
