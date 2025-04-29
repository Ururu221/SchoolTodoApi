import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function TodoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isCompleted: false,
    dueDate: '',
    relatedEntityId: '',
    relatedEntityType: 'Student'
  });
  const [loading, setLoading] = useState(isEditMode);
  const [students, setStudents] = useState([]);
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [sRes, schRes] = await Promise.all([
          api.get('/students'),
          api.get('/schools')
        ]);
        setStudents(sRes.data);
        setSchools(schRes.data);

        if (isEditMode) {
          const { data } = await api.get(`/todoitems/${id}`);
          setFormData({
            title: data.title,
            description: data.description,
            isCompleted: data.isCompleted,
            dueDate: new Date(data.dueDate).toISOString().split('T')[0],
            relatedEntityId: data.relatedEntityId || '',
            relatedEntityType: data.relatedEntityType || 'Student'
          });
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEditMode]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await api.put(`/todoitems/${id}`, formData);
      } else {
        await api.post('/todoitems', formData);
      }
      navigate('/todos');
    } catch (err) {
      console.error('Error saving todo:', err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>{isEditMode ? 'Edit Todo Item' : 'Add Todo Item'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text" id="title" name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description" name="description"
            className="form-control" rows="3"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox" id="isCompleted" name="isCompleted"
            className="form-check-input"
            checked={formData.isCompleted}
            onChange={handleChange}
          />
          <label htmlFor="isCompleted" className="form-check-label">Completed</label>
        </div>
        <div className="mb-3">
          <label htmlFor="dueDate" className="form-label">Due Date</label>
          <input
            type="date" id="dueDate" name="dueDate"
            className="form-control"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="relatedEntityType" className="form-label">Related To</label>
          <select
            id="relatedEntityType" name="relatedEntityType"
            className="form-select"
            value={formData.relatedEntityType}
            onChange={handleChange}
          >
            <option value="Student">Student</option>
            <option value="School">School</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="relatedEntityId" className="form-label">
            {formData.relatedEntityType}
          </label>
          <select
            id="relatedEntityId" name="relatedEntityId"
            className="form-select"
            value={formData.relatedEntityId}
            onChange={handleChange}
            required
          >
            <option value="">Select {formData.relatedEntityType}</option>
            {formData.relatedEntityType === 'Student'
              ? students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)
              : schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)
            }
          </select>
        </div>
        <div className="mb-3">
          <button type="submit" className="btn btn-primary me-2">Save</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/todos')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default TodoForm;
