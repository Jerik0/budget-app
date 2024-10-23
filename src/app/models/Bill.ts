import Category from '../enums/Category';
import ChargeType from "../enums/ChargeType";
import {Frequency} from "../enums/Frequency";

export class Bill {
  public name?: string;
  public amount?: string;
  public date?: Date;
  public necessity?: boolean;
  public category?: Category;
  public chargeType?: ChargeType;
  public frequency?: Frequency;

  constructor();
  constructor(name: string, amount: string, date: Date, necessity: boolean, category: Category, chargeType: ChargeType, frequency: Frequency);
  constructor(name?: string, amount?: string, date?: Date, necessity?: boolean, category?: Category, chargeType?: ChargeType, frequency?: Frequency) {
    this.name = name;
    this.amount = amount;
    this.date = date;
    this.necessity = necessity;
    this.category = category;
    this.chargeType = chargeType;
    this.frequency = frequency;
  }
}
