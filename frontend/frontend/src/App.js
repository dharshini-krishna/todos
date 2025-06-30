import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);

  const API_URL = "http://localhost:8000/todos/";

  useEffect(() => {
    axios.get(API_URL)
      .then((res) => {
        setTodos(res.data.todos || []);
      })
      .catch((err) => console.error("GET error:", err.message));
  }, []);

  const addOrUpdateTodo = () => {
    if (!input.trim()) return;

    if (editingId) {
      const todo = todos.find((t) => t.id === editingId);
      axios
        .put(`${API_URL}${editingId}/`, { ...todo, title: input })
        .then((res) => {
          setTodos(todos.map((t) => (t.id === editingId ? res.data : t)));
          setEditingId(null);
          setInput("");
        })
        .catch((err) => console.error("UPDATE error:", err.message));
    } else {
      const newTodo = { title: input.trim(), completed: false };
      axios
        .post(API_URL, newTodo)
        .then((res) => {
          setTodos([res.data, ...todos]);
          setInput("");
        })
        .catch((err) => console.error("POST error:", err.message));
    }
  };

  const toggleTodo = (todo) => {
    axios
      .put(`${API_URL}${todo.id}/`, {
        ...todo,
        completed: !todo.completed,
      })
      .then((res) => {
        setTodos(todos.map((t) => (t.id === todo.id ? res.data : t)));
      })
      .catch((err) => console.error("PUT error:", err.message));
  };

  const deleteTodo = (id) => {
    axios
      .delete(`${API_URL}${id}/`)
      .then(() => {
        setTodos(todos.filter((t) => t.id !== id));
        if (editingId === id) {
          setEditingId(null);
          setInput("");
        }
      })
      .catch((err) => console.error("DELETE error:", err.message));
  };

  const startEdit = (todo) => {
    setInput(todo.title);
    setEditingId(todo.id);
  };

  return (
    <div className="main-container">
      <h1 className="main-title">⚡ Gamer To-Do Console ⚡</h1>
      <div className="input-section">
        <input
          type="text"
          placeholder="Enter mission..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addOrUpdateTodo()}
        />
        <button onClick={addOrUpdateTodo}>
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-entry">
            <span
              className={`todo-text ${todo.completed ? "completed" : ""}`}
              onClick={() => toggleTodo(todo)}
            >
              {todo.title}
            </span>
            <div className="button-group">
              <button onClick={() => toggleTodo(todo)}>
                {todo.completed ? "Undo" : "Done"}
              </button>
              <button onClick={() => startEdit(todo)}>Edit</button>
              <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
