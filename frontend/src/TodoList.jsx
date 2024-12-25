import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:3000/todos'; 

  useEffect(() => {
      const fetchData = async () => {
          setLoading(true);
        try{
              const result = await axios.get(API_URL);
              setTodos(result.data);
        } catch (error){
              setError(error)
        } finally {
            setLoading(false);
        }
      }
      fetchData()
  }, []);

  const handleAddTodo = async () => {
    if (!newTodo) return;
      try{
          const result = await axios.post(API_URL, {title: newTodo});
          setTodos([...todos, result.data]);
      } catch (error){
          setError(error);
      } finally {
            setNewTodo('');
      }
  };

  const handleUpdateTodo = async (id, completed) => {
    try {
        const result = await axios.put(`${API_URL}/${id}`, { completed });
        setTodos(
          todos.map((todo) => (todo.id === id ? result.data : todo))
        );
    } catch (error) {
          setError(error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
         setError(error)
    }
  };

    if (loading) {
        return <p>Loading todos...</p>;
    }

  if (error) {
        return <p>Error fetching todos: {error.message}</p>;
  }

  return (
    <div>
      <h1>Todo List</h1>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add new todo"
      />
      <button onClick={handleAddTodo}>Add</button>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              <span
                style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
              >
                {todo.title}
              </span>
              <button onClick={() => handleUpdateTodo(todo.id, !todo.completed)}>
                {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
              </button>
              <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
            </li>
          ))}
        </ul>
    </div>
  );
};

export default TodoList;