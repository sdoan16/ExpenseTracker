
//field types to dyncamically render input fields in row.tsx
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

//USERS data structure
const users = {
  "XlFX99": {
    id: "XlFX99",
    firstName: "Shirley",
    lastName: "Doan",
    expenses: 500,
    fullName: "Shirley Doan",
  },
  "VN0fWn": {
    id: "VN0fWn",
    firstName: "Test",
    lastName: "User",
    expenses: 3000,
    fullName: "Test User",
  },
};

//EXPENSES DATA STRUCTURE
const expenses = {
  "L-0Mi1": {
    id: "L-0Mi1",
    userId: "XlFX99",
    category: "1",
    description: "total spent on food",
    cost: "500",
  },
  "h4RHe9": {
    id: "h4RHe9",
    userId: "VN0fWn",
    category: "2",
    description: "total spent on traveling",
    cost: "3000",
  },
};

//CATEGORIES DATA STRUCTURE
const categories = {
  food: 500,
  traveling: 3000,
  equipment: 0,
};
