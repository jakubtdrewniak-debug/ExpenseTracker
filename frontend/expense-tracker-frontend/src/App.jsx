import { use, useState, useEffect } from "react";
import "./App.css";
import { expenseService } from "./utils/getData";

function App() {
  const [filterCategory, setFilterCategory] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState("ANY");
  const [loading, setLoading] = useState(true);

  const initialForm = {
    id: null,
    description: "",
    amount: "",
    category: "ANY",
  };

  const categories = [
    "FOOD",
    "UTILITIES",
    "ENTERTAINMENT",
    "TRANSPORT",
    "CLOTHING",
    "RENT",
  ];

  const [formData, setFormData] = useState(initialForm);
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await expenseService.getAll();
      setExpenses(data);
      console.log(data);
    } catch (err) {
      setError("Failed to connect to Java backend.");
    } finally {
      setLoading(false);
    }
  };

  async function handleAdd() {
    const savedItem = await expenseService.create(formData);
    setExpenses([...expenses, savedItem]);
  }

  async function handleEdit() {
    try {
      const updatedItem = await expenseService.update(formData.id, formData);

      const newExpenseList = expenses.map((item) => {
        if (item.id === updatedItem) {
          return updatedItem;
        } else {
          return item;
        }
      });

      setExpenses(newExpenseList);
    } catch (error) {
      console.error("Update failed:" + error);
      alert("Could not update item, server not doing it's job");
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Delete this expense permanently?")) {
      await expenseService.delete(id);
      setExpenses(expenseService.filter((e) => e.id !== id));
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();

    if (formData.id === null) {
      await handleAdd();
    } else {
      await handleEdit();
    }
    setShowForm(false);
    setFormData(initialForm);
  }

  function openEditForm(item) {
    setFormData(item);
    setShowForm(true);
  }

  const filteredExpenses =
    filterCategory === "ANY"
      ? expenses
      : expenses.filter((e) => e.category === filterCategory);

  let totalValue = 0;
  filteredExpenses.forEach((item) => {
    totalValue += Number(item.amount);
  });

  if (loading) return <h1>Loading your expenses...</h1>;

  return (
    <>
      <div style={{ minHeight: "100vh", fontFamily: "sans-serif" }}>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h1 style={{ margin: 0 }}>Expense Tracker</h1>
        </div>
        <div
          style={{ maxWidth: "800px", margin: "20px auto", padding: "20px" }}
        >
          <h2 style={{ margin: 0 }}>Total</h2>
          <h2 style={{ margin: 0 }}>${totalValue.toFixed(2)}</h2>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <h3>My Expenses</h3>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="ANY">Category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr>
              <th style={cellStyle}>Description</th>
              <th style={cellStyle}>Amount</th>
              <th style={cellStyle}>Category</th>
              <th style={cellStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid" }}>
                <td style={cellStyle}>{item.description}</td>
                <td style={cellStyle}>${Number(item.amount).toFixed(2)}</td>
                <td style={cellStyle}>{item.category}</td>
                <td style={cellStyle}>
                  <button
                    onClick={() => openEditForm(item)}
                    style={{ marginRight: "5px", color: "white" }}
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{ color: "red" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              width: "100%",
              margintop: "20px",
              padding: "15px",
              color: "white",
              border: "none",
              borderRadius: "50px",
              fontSize: "20px",
              cursor: "pointer",
            }}
          >
            + Add New Expense
          </button>
        )}
        {showForm && (
          <div
            style={{ marginTop: "20px", padding: "20px", borderRadius: "8px" }}
          >
            <h3>{formData.id ? "Update Expense" : "New Expense"}</h3>
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                <input
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  style={inputStyle}
                  required
                />
                <input
                  placeholder="Price"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  style={inputStyle}
                  required
                />
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  style={inputStyle}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <input
                  placeholder="Date of purchase"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  style={inputStyle}
                  required
                />
              </div>
              <div style={{ marginTop: "15px", textAlign: "right" }}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{ marginRight: "10px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}

const cellStyle = { padding: "12px", textAlign: "left" };
const inputStyle = {
  padding: "10px",
  borderRadius: "4px",
  border: "1px solid",
};

export default App;
