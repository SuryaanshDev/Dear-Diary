import * as yup from 'yup';

export const authSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
});

export const entrySchema = yup.object({
  date: yup
    .string()
    .matches(/^\d{2}\/\d{2}\/\d{4}$/, 'Date must be dd/mm/yyyy')
    .required('Date is required'),
  title: yup.string().max(120, 'Title is too long').nullable(),
  content: yup.string().min(5, 'Content is too short').required('Content is required')
});

export async function validate(schema, data) {
  try {
    const value = await schema.validate(data, { abortEarly: false, stripUnknown: true });
    return value;
  } catch (error) {
    const validationError = new Error(error.errors?.[0] || 'Validation failed');
    validationError.statusCode = 400;
    throw validationError;
  }
}

