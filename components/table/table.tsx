import React, { createContext, useState, useContext, useEffect } from "react";
import Row from "./row";
import {Button} from 'evergreen-ui';
import tableStyles from "./table.module.css";
import { TableType } from '../../types'
const CATEGORY = { 1: "FOOD", 2: "TRAVEL", 3: "SUPPLIES" };

export default function Table({ title, rows, saveRow, addRow, deleteRow , columnHeaders}: TableType) {
  let rowsCopy = {...rows};
  return (
    <div>
      <div id="users-table" className={tableStyles.container}>
        <div className={tableStyles.userRow}>{title}</div>
        <div>
          {Object.keys(rowsCopy).map((key, i) => (
            <Row
              key={rowsCopy[key].id}
              index={i}
              columns={columnHeaders}
              user={rowsCopy[key]}
              onSave={saveRow}
              onDelete={deleteRow}
            ></Row>
          ))}
        </div>
        <div className={tableStyles.addButton}>
        <Button marginRight={16} appearance="primary" onClick={addRow}>
        Add New Row
      </Button>
        </div>
      </div>
    </div>
  );
}
