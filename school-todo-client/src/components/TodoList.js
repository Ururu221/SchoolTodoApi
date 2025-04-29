import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [tRes, sRes, schRes] = await Promise.all([
        api.get('/todoitems'),
        api.get('/students'),
        api.get('/schools')
      ]);
      setTodos(tRes.data);
      setStudents(sRes.data);
      setSchools(schRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async id => {
    if (window.confirm('Delete this todo?')) {
      try {
        await api.delete(`/todoitems/${id}`);
        setTodos(t => t.filter(x => x.id !== id));
      } catch (err) {
        console.error('Error deleting todo:', err);
      }
    }
  };

  const toggleComplete = async todo => {
    try {
      await api.put(`/todoitems/${todo.id}`, { ...todo, isCompleted: !todo.isCompleted });
      setTodos(t => t.map(x => x.id === todo.id ? { ...x, isCompleted: !x.isCompleted } : x));
    } catch (err) {
      console.error('Error updating todo:', err);
    }
  };

  const getName = t =>
    t.relatedEntityType === 'Student'
      ? (students.find(s => s.id === t.relatedEntityId)?.name || 'Unknown')
      : (schools.find(s => s.id === t.relatedEntityId)?.name || 'Unknown');

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Todo Items</h2>
        <Link to="/todos/add" className="btn btn-primary">Add Todo</Link>
      </div>
      {todos.length === 0
        ? <p>No todo items found.</p>
        : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Related To</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {todos.map(t => (
                  <tr key={t.id}>
                    <td>{t.title}</td>
                    <td>{t.description}</td>
                    <td>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={t.isCompleted}
                          onChange={() => toggleComplete(t)}
                          id={`todo-${t.id}`}
                        />
                        <label htmlFor={`todo-${t.id}`} className="form-check-label">
                          {t.isCompleted ? 'Completed' : 'Pending'}
                        </label>
                      </div>
                    </td>
                    <td>{new Date(t.dueDate).toLocaleDateString()}</td>
                    <td>{t.relatedEntityType}: {getName(t)}</td>
                    <td>
                      <Link to={`/todos/edit/${t.id}`} className="btn btn-sm btn-info me-2">Edit</Link>
                      <button onClick={() => deleteTodo(t.id)} className="btn btn-sm btn-danger">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
    </div>
  );
}

export default TodoList;
