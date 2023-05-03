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

const EXPENSES_COLUMNS = [
  { label: "Full Name", type: "select", options: [], id: "userId" },
  { label: "Category", type: "select", options: [], id: "category" },
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
  const usersLength = Object.keys(users).length;
  const expensesLength = Object.keys(expenses).length === 0;

  useEffect(() => {
    if (usersLength === 0) {
      addNewUser();
    }
  }, [usersLength]);

  useEffect(() => {
    if (expensesLength) {
      addNewExpense();
    }
  }, [expensesLength]);

  const saveUser = (user: User) => {
    user.fullName = `${user.firstName} ${user.lastName}`;
    setUsers({ ...users, [user.id]: user });
  };

  const saveExpense = (data: Expense) => {
    let userCopy = { ...users };
    let categoryCopy = { ...categoryTotals };
    let expensesCopy = { ...expenses };
    //update existing expense
    if (expenses[data.id].userId.length > 0) {
      const currentExpense = expenses[data.id];
      let oldCategory = expenses[data.id].category;
      userCopy[currentExpense.userId].expenses =
        parseFloat(userCopy[currentExpense.userId].expenses) -
        parseFloat(currentExpense.cost);
      userCopy[data.userId].expenses =
        parseFloat(userCopy[data.userId].expenses) + parseFloat(data.cost);
      categoryCopy[oldCategory] -= parseFloat(currentExpense.cost);
      categoryCopy[data.category] += parseFloat(data.cost);
    } else {
      //added new expense
      let user = userCopy[data.userId];
      user.expenses = parseFloat(user.expenses) + parseFloat(data.cost);
      categoryCopy[data.category] =
        categoryCopy[data.category] + parseFloat(data.cost);
    }
    setUsers(userCopy);
    setCategoryTotals(categoryCopy);
    setExpenses({ ...expenses, [data.id]: data });
  };

  const addNewUser = () => {
    let userId = nanoid(6);
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
    let categoryCopy = { ...categoryTotals };
    let expense = exp[id];
    if (!expense.userId) {
      delete exp[id];
      setExpenses(exp);
      return;
    }
    let user = userCopy[expense.userId];
    userCopy[expense.userId].expenses =
      parseFloat(user.expenses) - parseFloat(expense.cost);
    // //subtract cost of the deleted expense from the corresponding category in categoriesTotal
    categoryCopy[expense.category] -= parseFloat(expense.cost);
    delete exp[id];
    setUsers(userCopy);
    setCategoryTotals(categoryCopy);
    setExpenses({ ...exp });
  };

  const addNewExpense = () => {
    let expenseId = nanoid(6);
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
    //If a user's total expenses is equal to 0 then they have no expenses to delete
    if (users[id].expenses > 0) {
      let expensesCopy = { ...expenses };
      let categoryCopy = { ...categoryTotals };
      let entries = [...Object.keys(expenses)];
      entries.forEach((key) => {
        if (expensesCopy[key].userId === id) {
          let category = expensesCopy[key].category;
          let cost = expensesCopy[key].cost;
          //subtract cost of the deleted expense from the corresponding category in categoriesTotal
          categoryCopy[category] = categoryCopy[category] - parseFloat(cost);
          delete expensesCopy[key];
        }
      });
      setExpenses(expensesCopy);
      setCategoryTotals(categoryCopy);
    }
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
