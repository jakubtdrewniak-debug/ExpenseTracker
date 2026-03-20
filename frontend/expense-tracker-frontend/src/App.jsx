import { use, useState, useEffect } from "react";
import "./App.css";
import { expenseService } from "./utils/getData";

function App() {
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [categoryTotals, setCategoryTotals] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await expenseService.getAll();
    setExpenses(data);
    console.log(data);
  };
  
  const loadAllTotals = async () => {
    const categories = ["FOOD", "UTILITIES", "ENTERTAINMENT", "TRANSPORT", "CLOTHING", "RENT"]
    let results = {};

    for (const cat of categories) {
      const total = await expenseService.getCategoryTotal(cat);
      results[cat] = total;
    }

    setCategoryTotals(results);
  }

  return (
    <>
      <div style={{ padding: "20px" }}></div>
      <h1>My Expenses</h1>
      <table
        border="1px"
        style={{
          borderRadius: "2px",
          width: "100%",
          textAlign: "left",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
      </table>
    </>
  );
}

export default App;
