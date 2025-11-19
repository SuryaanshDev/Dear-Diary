import { useState } from 'react';
import dayjs from 'dayjs';
import { validate, entrySchema } from '../utils/validators.js';

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const rowStyle = {
  display: 'flex',
  gap: '1rem',
  flexWrap: 'wrap'
};

const textareaStyle = {
  minHeight: '220px',
  resize: 'vertical'
};

function EntryForm({ initialValues, onSubmit, pending, serverError }) {
  const [values, setValues] = useState(() => ({
    date: initialValues?.date || dayjs().format('DD/MM/YYYY'),
    title: initialValues?.title || '',
    content: initialValues?.content || ''
  }));
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { data, errors: validationErrors } = await validate(entrySchema, values);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    onSubmit(data);
  };

  return (
    <form style={formStyle} onSubmit={handleSubmit} noValidate>
      <div style={rowStyle}>
        <div style={{ flex: 1, minWidth: '180px' }}>
          <label htmlFor="date" style={{ display: 'block', marginBottom: '0.3rem' }}>
            Date (dd/mm/yyyy)
          </label>
          <input
            id="date"
            name="date"
            type="text"
            className="input"
            value={values.date}
            onChange={handleChange}
            placeholder="e.g. 24/11/2025"
          />
          {errors.date ? <p className="error-text">{errors.date}</p> : null}
        </div>

        <div style={{ flex: 1, minWidth: '180px' }}>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '0.3rem' }}>
            Title (optional)
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className="input"
            value={values.title}
            onChange={handleChange}
            placeholder="A day to remember"
          />
          {errors.title ? <p className="error-text">{errors.title}</p> : null}
        </div>
      </div>

      <div>
        <label htmlFor="content" style={{ display: 'block', marginBottom: '0.3rem' }}>
          Entry
        </label>
        <textarea
          id="content"
          name="content"
          className="input"
          style={textareaStyle}
          value={values.content}
          onChange={handleChange}
          placeholder="Pour your thoughts here..."
        />
        {errors.content ? <p className="error-text">{errors.content}</p> : null}
      </div>

      {serverError ? <p className="error-text">{serverError}</p> : null}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? 'Saving…' : 'Save entry'}
        </button>
      </div>
    </form>
  );
}

export default EntryForm;

