import * as yup from 'yup';

export const authSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Minimum 6 characters').required('Password is required')
});

export const entrySchema = yup.object({
  date: yup
    .string()
    .matches(/^\d{2}\/\d{2}\/\d{4}$/, 'Use dd/mm/yyyy format')
    .required('Date is required'),
  title: yup.string().max(120, 'Title is too long').nullable(),
  content: yup.string().min(5, 'Content is too short').required('Content is required')
});

export async function validate(schema, values) {
  try {
    const data = await schema.validate(values, { abortEarly: false });
    return { data, errors: null };
  } catch (error) {
    const errors = {};
    error.inner.forEach((issue) => {
      errors[issue.path] = issue.message;
    });
    return { data: null, errors };
  }
}

