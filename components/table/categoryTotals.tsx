import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";
import { Table } from "evergreen-ui";
import tableStyles from "./table.module.css";

import {
  User,
  Expenses,
  Category,
  Categories,
  Users,
  Expense,
  TrackerContextType,
  TableType,
  TrackerContext,
} from "../../types";
export default function CategoryTotals() {
  let { categoryTotals } = useContext(TrackerContext);

  const defaultTotal: Category = {
    food: 0,
    travel: 0,
    equipment: 0,
  };
  let totals = Object.entries(categoryTotals ? categoryTotals : defaultTotal);
  return (
    <div className={tableStyles.totalsTable}>
      <Table>
        <Table.Head className={tableStyles.tableHeader}>
          <Table.TextHeaderCell>CATEGORY</Table.TextHeaderCell>
          <Table.TextHeaderCell>TOTAL($)</Table.TextHeaderCell>
        </Table.Head>
        <Table.Body>
          {totals.map((total, i) => (
            <Table.Row key={i}>
              <Table.TextCell>{total[0]}</Table.TextCell>
              <Table.TextCell isNumber>{total[1]}</Table.TextCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}
