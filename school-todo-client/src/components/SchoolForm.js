import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function SchoolForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) fetchSchool();
  }, [id]);

  const fetchSchool = async () => {
    try {
      const { data } = await api.get(`/schools/${id}`);
      setFormData({
        name: data.name,
        address: data.address,
        phoneNumber: data.phoneNumber
      });
    } catch (err) {
      console.error('Error fetching school:', err);
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
        await api.put(`/schools/${id}`, formData);
      } else {
        await api.post('/schools', formData);
      }
      navigate('/schools');
    } catch (err) {
      console.error('Error saving school:', err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>{isEditMode ? 'Edit School' : 'Add School'}</h2>
      <form onSubmit={handleSubmit}>
        {['name','address','phoneNumber'].map(field => (
          <div className="mb-3" key={field}>
            <label htmlFor={field} className="form-label">
              {field === 'phoneNumber' ? 'Phone Number' : field.charAt(0).toUpperCase()+field.slice(1)}
            </label>
            <input
              type="text"
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
          <button type="submit" className="btn btn-primary me-2">Save</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/schools')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default SchoolForm;
