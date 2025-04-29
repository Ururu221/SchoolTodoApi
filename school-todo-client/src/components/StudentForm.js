import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function StudentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    grade: '',
    schoolId: ''
  });
  const [loading, setLoading] = useState(isEditMode);
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    fetchSchools();
    if (isEditMode) fetchStudent();
  }, [id, isEditMode]);

  const fetchSchools = async () => {
    try {
      const { data } = await api.get('/schools');
      setSchools(data);
    } catch (err) {
      console.error('Error fetching schools:', err);
    }
  };

  const fetchStudent = async () => {
    try {
      const { data } = await api.get(`/students/${id}`);
      setFormData({
        name: data.name,
        age: data.age,
        grade: data.grade,
        schoolId: data.schoolId || ''
      });
    } catch (err) {
      console.error('Error fetching student:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await api.put(`/students/${id}`, formData);
      } else {
        await api.post('/students', formData);
      }
      navigate('/students');
    } catch (err) {
      console.error('Error saving student:', err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>{isEditMode ? 'Edit Student' : 'Add Student'}</h2>
      <form onSubmit={handleSubmit}>
        {['name','age','grade'].map(field => (
          <div className="mb-3" key={field}>
            <label htmlFor={field} className="form-label">{field.charAt(0).toUpperCase()+field.slice(1)}</label>
            <input
              type={field==='age'?'number':'text'}
              className="form-control"
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <div className="mb-3">
          <label htmlFor="schoolId" className="form-label">School</label>
          <select
            className="form-select"
            id="schoolId"
            name="schoolId"
            value={formData.schoolId}
            onChange={handleChange}
          >
            <option value="">Select a School</option>
            {schools.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <button type="submit" className="btn btn-primary me-2">Save</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/students')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default StudentForm;
