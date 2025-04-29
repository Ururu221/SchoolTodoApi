import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Import components
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import SchoolList from './components/SchoolList';
import SchoolForm from './components/SchoolForm';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
          <div className="container-fluid">
            <Link to="/" className="navbar-brand">School Todo App</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link to="/" className="nav-link">Home</Link>
                </li>
                <li className="nav-item">
                  <Link to="/students" className="nav-link">Students</Link>
                </li>
                <li className="nav-item">
                  <Link to="/schools" className="nav-link">Schools</Link>
                </li>
                <li className="nav-item">
                  <Link to="/todos" className="nav-link">Todo Items</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/students/add" element={<StudentForm />} />
          <Route path="/students/edit/:id" element={<StudentForm />} />
          <Route path="/schools" element={<SchoolList />} />
          <Route path="/schools/add" element={<SchoolForm />} />
          <Route path="/schools/edit/:id" element={<SchoolForm />} />
          <Route path="/todos" element={<TodoList />} />
          <Route path="/todos/add" element={<TodoForm />} />
          <Route path="/todos/edit/:id" element={<TodoForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
