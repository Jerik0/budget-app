import Category from "../enums/Category";

interface IBill {
  name: string;
  amount: number;
  date: string;
  necessity: boolean;
  category: Category;
}

export default IBill;
