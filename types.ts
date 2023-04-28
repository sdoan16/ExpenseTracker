import { createContext } from "react";

export type User= {
    id: string;
    firstName?: string;
    lastName?: string;
    expenses?:  any;
    fullName?: string;
  
  }
  export type TrackerContextType = {
    users: Users;
    categoryTotals: Categories;

  }
  export const TrackerContext = createContext<TrackerContextType>({
    users: {},
    categoryTotals: {}
  });

  export type Expense =  {
    id: string;
    userId: string;
    category: string;
    description: string;
    cost:  string;
  
  }
  
  export type Expenses = {
    [key: string]: Expense;
  }
  
  export type Category = {
    food: number | string;
    travel: number | string;
    equipment: number | string;
  }
  
  export type Categories = {
    [key: string]: number ;
  }
  
  export type Users = {
    [key: string | number]: User;
  }

  export type Row = {
    [key: string | number]: string | number;
  }

  export type ColumnType = {
    label: string;
    type: string;
    options?: any;
    id: string
  }

  export type RowType = {
    index: number;
    columns: ColumnType[];
    user?: Row;
    onSave: React.Dispatch<React.SetStateAction<any>>;
    onDelete: React.Dispatch<React.SetStateAction<any>>;
  }
 
  export type TableType  = {
    title: string;
    rows: Users | Expenses;
    saveRow: React.Dispatch<React.SetStateAction<any>>;
    addRow: React.Dispatch<React.SetStateAction<any>>;
    deleteRow: React.Dispatch<React.SetStateAction<any>>;
    columnHeaders: ColumnType[];

  }

