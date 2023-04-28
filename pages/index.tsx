import Head from "next/head";
import React, { createContext, useState, useEffect } from "react";
import Table from "../components/table/table";
import CategoryTotals from "../components/table/categoryTotals";
import { nanoid } from "nanoid";

import utilStyles from "/styles/utils.module.css";
import {
  User,
  Expenses,
  Category,
  Categories,
  Users,
  Expense,
  TrackerContext,
} from "../types";
import categoryTotals from "../components/table/categoryTotals";

const USER_COLUMNS = [
  { label: "First Name", type: "input", id: "firstName" },
  { label: "Last Name", type: "input", id: "lastName" },
  { label: "Total Expenses", type: "text", id: "expenses" },
];

const EXPENSES_COLUMNS: {
  label: string;
  type: string;
  options?: [];
  id: string;
}[] = [
  { label: "Full Name", type: "select", options: [], id: "userId" },
  {
    label: "Category",
    type: "select",
    options: [],
    id: "category",
  },
  { label: "Description", type: "input", id: "description" },
  { label: "Cost", type: "number", id: "cost" },
];

export default function Tracker() {
  const [users, setUsers] = useState<Users>({});
  const [expenses, setExpenses] = useState<Expenses>({});
  const [categoryTotals, setCategoryTotals] = useState<Categories>({
    food: 0,
    travel: 0,
    equipment: 0,
  });

  useEffect(() => {
    const usersLength = Object.keys(users).length;
    if (usersLength === 0) {
      addNewUser();
    }
  }, [Object.keys(users).length]);

  useEffect(() => {
    const expensesLength = Object.keys(expenses).length === 0;
    if (expensesLength) {
      addNewExpense();
    }
  }, [Object.keys(expenses).length]);

  const saveUser = (user: User) => {
    user.fullName = `${user.firstName} ${user.lastName}`;
    setUsers({ ...users, [user.id]: user });
  };

  //Recount total expenses for each category to update 3rd table
  const countCategoryTotals = (copy: Expenses) => {
    let values = Object.values(copy);
    let newTotal: Categories = {
      food: 0,
      travel: 0,
      equipment: 0,
    };
    if (values.length) {
      values.forEach((value) => {
        let category = value.category;
        if (newTotal[category] > -1) {
          newTotal[category] = newTotal[category] + parseFloat(value.cost);
        }
      });
    }
    setCategoryTotals(newTotal);
  };

  const saveExpense = (data: Expense) => {
    let userId = data.userId;
    let oldId = expenses[data.id]?.userId;
    let oldExpenses = expenses[data.id]?.cost;
    let newExpenses = data.cost;
    let userCopy = { ...users };
    let categoryCopy = { ...categoryTotals };
    let expensesCopy = { ...expenses };

    //Changed users
    if (oldId.length && oldId !== userId) {
      userCopy[oldId].expenses =
        parseFloat(userCopy[oldId].expenses) - parseFloat(oldExpenses);
      userCopy[userId].expenses =
        parseFloat(userCopy[userId].expenses) + parseFloat(data.cost);
    }
    //update existing expense
    else if (expenses[data.id].userId.length > 0) {
      let diff = parseFloat(newExpenses) - parseFloat(oldExpenses);
      userCopy[oldId].expenses = parseFloat(userCopy[oldId].expenses) + diff;
    } else {
      //added new expense
      let user = userCopy[data.userId];
      user.expenses = parseFloat(user.expenses) + parseFloat(data.cost);
    }
    setUsers(userCopy);
    setExpenses({ ...expenses, [data.id]: data });
    countCategoryTotals({ ...expensesCopy, [data.id]: data });
  };

  const addNewUser = () => {
    let userId = nanoid();
    const newUser = {
      id: userId,
      firstName: "",
      lastName: "",
      fullName: "",
      expenses: 0,
    };
    setUsers({ ...users, [userId]: newUser });
  };

  const deleteExpense = (id: string) => {
    let userCopy = { ...users };
    let exp = { ...expenses };
    let expense = exp[id];
    if (!expense.userId) {
      delete exp[id];
      setExpenses(exp);
      return;
    }
    let userId = expense.userId;
    let user = userCopy[expense.userId];
    userCopy[expense.userId].expenses =
      parseFloat(user.expenses) - parseFloat(expense.cost);
    delete exp[id];
    setUsers(userCopy);
    countCategoryTotals(exp);
    setExpenses({ ...exp });
  };

  const addNewExpense = () => {
    let expenseId = nanoid();
    setExpenses({
      ...expenses,
      [expenseId]: {
        id: expenseId,
        userId: "",
        category: "",
        description: "",
        cost: "",
      },
    });
  };

  const deleteUser = (id: string) => {
    let usersCopy = { ...users };
    let expensesCopy = { ...expenses };
    let entries = [...Object.keys(expenses)];
    if (entries.length > 0) {
      entries.forEach((key) => {
        if (expensesCopy[key].userId === id) {
          delete expensesCopy[key];
        }
      });
    }
    countCategoryTotals(expensesCopy);
    setExpenses(expensesCopy);
    delete usersCopy[id];
    setUsers(usersCopy);
  };

  return (
    <div className={utilStyles.formComponent}>
      <TrackerContext.Provider value={{ users, categoryTotals }}>
        <div>
          <Head>
            <title>Tracker</title>
          </Head>
          <div id="users-table">
            <div className={utilStyles.header}>Users</div>
            <Table
              title=""
              rows={users}
              saveRow={saveUser}
              addRow={addNewUser}
              deleteRow={deleteUser}
              columnHeaders={USER_COLUMNS}
            ></Table>
          </div>
          <div id="expenses-table">
            <div className={utilStyles.header}>Expenses</div>
            <Table
              title=""
              rows={expenses}
              saveRow={saveExpense}
              addRow={addNewExpense}
              deleteRow={deleteExpense}
              columnHeaders={EXPENSES_COLUMNS}
            ></Table>
          </div>
          <div id="categories-table">
            <div className={utilStyles.header}>Categories</div>
            <CategoryTotals />
          </div>
        </div>
      </TrackerContext.Provider>
    </div>
  );
}
