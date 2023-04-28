import React, { useState, useEffect, useContext } from "react";
import tableStyles from "./table.module.css";
import {
  User,
  Expense,
  TrackerContextType,
  TrackerContext,
  RowType,
  Row,
} from "../../types";
import {
  SelectField,
  TextInputField,
  TrashIcon,
  TickIcon,
  IconButton,
  TextInput,
  majorScale,
  Dialog,
} from "evergreen-ui";
const CATEGORIES = { 1: "FOOD", 2: "TRAVEL", 3: "EQUIPMENT" };

export default function Row({
  index,
  columns,
  user,
  onSave,
  onDelete,
}: RowType) {
  let [row, setRow] = useState<Row>({ ...user });
  let [nameOptions, setNameOptions] = useState<any[]>([]);
  let [isChanged, setIsChanged] = useState<boolean>(false);
  let [disableSave, setDisableSave] = useState<boolean>(true);
  const categoryOptions = Object.entries(CATEGORIES);
  const { users }: TrackerContextType = useContext(TrackerContext);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  useEffect(() => {
    let userIds: any[] = Object.keys(users);
    if (users[userIds[0]]?.fullName) {
      setNameOptions([...userIds]);
    }
  }, [users]);

  useEffect(() => {
    let copy: Row = { ...user };
    setRow(copy);
  }, [user?.id, user?.firstName, user?.lastName, user?.expenses]);

  const onSaveClick = () => {
    //Check for missing fields
    let index = columns.findIndex((col, i) => row[col.id] === "");
    if (index > -1) {
      setShowAlert(true);
      return;
    }
    onSave(row);
    setDisableSave(true);
    setIsChanged(false);
  };

  const updateRow = (event: any, columnId: string) => {
    let copy: Row = { ...row };
    setIsChanged(true);
    copy[columnId] = event.target.value;
    setRow(copy);
  };
  return (
    <div>
      <Dialog
        isShown={showAlert}
        title="Missing Fields"
        intent="danger"
        onCloseComplete={() => setShowAlert(false)}
        confirmLabel="  OK"
      >
        Fill out all missing fields
      </Dialog>

      <div className={tableStyles.userRow}>
        {columns?.length &&
          columns.map((col, i) => (
            <div className={tableStyles.field}>
              {col.type === "text" && (
                <div>
                  <div className={tableStyles.label}>
                    {index === 0 ? col.label : ""}
                  </div>
                  <div className={tableStyles.number}>{row[col.id]}</div>
                </div>
              )}
              {col.type === "number" && (
                <div>
                  <div className={tableStyles.label}>
                    {index === 0 ? col.label : ""}
                  </div>
                  <input
                    className={tableStyles.integer}
                    type="number"
                    name="test_name"
                    min="0"
                    onChange={(e: any) => updateRow(e, col.id)}
                    oninput="validity.valid||(value='');"
                  ></input>
                </div>
              )}
              {col.type === "input" && (
                <TextInputField
                  onChange={(e: any) => updateRow(e, col.id)}
                  isInvalid={isChanged && row[col.id] === ""}
                  label={index === 0 ? col.label : ""}
                  placeholder={col.label}
                />
              )}
              {col.options && col.type === "select" && (
                <SelectField
                  className={tableStyles.dropDown}
                  isInvalid={isChanged && row[col.id] === ""}
                  onChange={(e) => updateRow(e, col.id)}
                  label={index === 0 ? col.label : ""}
                >
                  <option value="">Please select a value</option>
                  {col.id === "category" &&
                    categoryOptions.length &&
                    categoryOptions.map((opt) => (
                      <option value={opt[1].toLowerCase()}>{opt[1]}</option>
                    ))}
                  {col.id === "userId" &&
                    nameOptions?.length &&
                    nameOptions.map((opt) => (
                      <option
                        selected={users[opt]?.id === row[col.id]}
                        value={users[opt]?.id}
                      >
                        {users[opt]?.fullName}
                      </option>
                    ))}
                </SelectField>
              )}
            </div>
          ))}
        <div className={tableStyles.buttonGroup}>
          <IconButton
            icon={TickIcon}
            intent="primary"
            disabled={!isChanged}
            onClick={() => onSaveClick()}
            marginRight={majorScale(2)}
          />
          <IconButton
            icon={TrashIcon}
            intent="danger"
            onClick={() => onDelete(row.id)}
            marginRight={majorScale(2)}
          />
        </div>
      </div>
    </div>
  );
}
