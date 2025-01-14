import * as yup from 'yup';
import { VALIDATION_MESSAGES } from './validationMessages';

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED_EMAIL)
    .email(VALIDATION_MESSAGES.VALID_EMAIL),
  password: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED_PASSWORD)
    .min(6, VALIDATION_MESSAGES.MIN_PASSWORD),
});
