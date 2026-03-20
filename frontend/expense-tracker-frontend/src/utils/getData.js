const BASE_URL = "http://localhost:8080/api/expenses";

export const expenseService = {
  //CRUD
  getAll: () => fetch(BASE_URL).then((res) => res.json()),

  getById: (id) => fetch(`${BASE_URL}/${id}`).then((res) => res.json()),

  create: (expense) =>
    fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expense),
    }).then((res) => res.json()),

  update: (id, updatedExpense) =>
    fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedExpense),
    }).then((res) => res.json()),

  delete: (id) => fetch(`${BASE_URL}/${id}`, { method: "DELETE" }),

  //CUSTOM METHODS

  getMonthlyTotal: (year, month) =>
    fetch(`${BASE_URL}/total/${year}/${month}`).then((res) => res.json()),

  getByCategory: (category) =>
    fetch('${BASE_URL}/category/${category}').then((res) => res.json()),

  getCategoryTotal: (year, month) =>
    fetch('${BASE_URL}/category/${category}/total').then((res) => res.json()),
};
