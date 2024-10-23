import IBill from '../interfaces/IBill';
import Category from '../enums/Category';
import ChargeType from "../enums/ChargeType";

export class Bill {
  public name?: string;
  public amount?: string;
  public date?: Date;
  public necessity?: boolean;
  public category?: Category;
  public chargeType?: ChargeType;

  constructor();
  constructor(name: string, amount: string, date: Date, necessity: boolean, category: Category, chargeType: ChargeType);
  constructor(name?: string, amount?: string, date?: Date, necessity?: boolean, category?: Category, chargeType?: ChargeType) {
    this.name = name;
    this.amount = amount;
    this.date = date;
    this.necessity = necessity;
    this.category = category;
    this.chargeType = chargeType;
  }
}
