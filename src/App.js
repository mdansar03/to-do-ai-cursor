import React, { useState, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

function App() {
  const [todos, setTodos] = useState(() => {
    // Initialize todos from localStorage or empty array if nothing is stored
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setTodos([...todos, { id: uuidv4(), text: input, completed: false, subtasks: [] }]);
      setInput('');
    }
  };

  const toggleComplete = (id, subtaskId = null) => {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        if (subtaskId) {
          return {
            ...todo,
            subtasks: todo.subtasks.map(subtask =>
              subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
            )
          };
        }
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    }));
  };

  const addSubtask = (todoId, subtaskText) => {
    setTodos(todos.map(todo => {
      if (todo.id === todoId) {
        return {
          ...todo,
          subtasks: [...todo.subtasks, { id: uuidv4(), text: subtaskText, completed: false }]
        };
      }
      return todo;
    }));
  };

  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const removeSubtask = (todoId, subtaskId) => {
    setTodos(todos.map(todo => {
      if (todo.id === todoId) {
        return {
          ...todo,
          subtasks: todo.subtasks.filter(subtask => subtask.id !== subtaskId)
        };
      }
      return todo;
    }));
  };

  const startEditing = (id, text, isSubtask = false) => {
    setEditingId({ id, isSubtask });
    setEditText(text);
  };

  const handleEdit = (todoId, subtaskId = null) => {
    if (editText.trim()) {
      setTodos(todos.map(todo => {
        if (todo.id === todoId) {
          if (subtaskId) {
            return {
              ...todo,
              subtasks: todo.subtasks.map(subtask =>
                subtask.id === subtaskId ? { ...subtask, text: editText } : subtask
              )
            };
          }
          return { ...todo, text: editText };
        }
        return todo;
      }));
      setEditingId(null);
      setEditText('');
    }
  };

  const completedPercentage = useMemo(() => {
    const totalTasks = todos.length + todos.reduce((acc, todo) => acc + todo.subtasks.length, 0);
    const completedTasks = todos.filter(todo => todo.completed).length +
      todos.reduce((acc, todo) => acc + todo.subtasks.filter(subtask => subtask.completed).length, 0);
    return totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  }, [todos]);

  const getProgressColor = (percentage) => {
    if (percentage <= 10) return '#FF4136'; // red
    if (percentage <= 50) return '#FFDC00'; // yellow
    if (percentage <= 80) return '#0074D9'; // blue
    return '#2ECC40'; // green
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Cursor's Todo App</h1>
      </header>
      <div className="progress-container">
        <div 
          className="progress-bar" 
          style={{ 
            width: `${completedPercentage}%`,
            backgroundColor: getProgressColor(completedPercentage)
          }}
        ></div>
        <span className="progress-text">{completedPercentage}% Completed</span>
      </div>
      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new todo"
        />
        <button type="submit">Add</button>
      </form>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <div className="todo-content">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo.id)}
              />
              {editingId && editingId.id === todo.id && !editingId.isSubtask ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={() => handleEdit(todo.id)}
                  onKeyPress={(e) => e.key === 'Enter' && handleEdit(todo.id)}
                  autoFocus
                />
              ) : (
                <span onClick={() => startEditing(todo.id, todo.text)}>{todo.text}</span>
              )}
              <button onClick={() => removeTodo(todo.id)} className="delete-btn">Delete</button>
            </div>
            <div className="subtasks">
              {todo.subtasks.map(subtask => (
                <div key={subtask.id} className={`subtask ${subtask.completed ? 'completed' : ''}`}>
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => toggleComplete(todo.id, subtask.id)}
                  />
                  {editingId && editingId.id === subtask.id && editingId.isSubtask ? (
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onBlur={() => handleEdit(todo.id, subtask.id)}
                      onKeyPress={(e) => e.key === 'Enter' && handleEdit(todo.id, subtask.id)}
                      autoFocus
                    />
                  ) : (
                    <span onClick={() => startEditing(subtask.id, subtask.text, true)}>{subtask.text}</span>
                  )}
                  <button onClick={() => removeSubtask(todo.id, subtask.id)} className="delete-btn">Delete</button>
                </div>
              ))}
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const subtaskText = e.target.elements.subtask.value.trim();
              if (subtaskText) {
                addSubtask(todo.id, subtaskText);
                e.target.reset();
              }
            }} className="subtask-form">
              <input type="text" name="subtask" placeholder="Add a subtask" />
              <button type="submit">+</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
