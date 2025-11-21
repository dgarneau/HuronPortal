import { z } from 'zod';
import { messages } from './messages';

// User schemas
export const userCreateSchema = z.object({
  username: z.string()
    .min(3, messages.user.usernameMin)
    .max(50, messages.user.usernameMax)
    .regex(/^[a-z0-9._-]+$/, messages.user.usernameFormat),
  email: z.string()
    .min(1, messages.user.emailRequired)
    .email(messages.user.emailInvalid)
    .max(100, messages.user.emailMax),
  name: z.string()
    .min(1, messages.user.nameRequired)
    .max(100, messages.user.nameMax),
  password: z.string()
    .min(8, messages.password.minLength)
    .max(128, messages.password.maxLength),
  role: z.enum(['Admin', 'Contrôleur', 'Utilisateur'], {
    message: messages.user.roleInvalid,
  }),
  isActive: z.boolean().default(true),
});

export const userUpdateSchema = z.object({
  username: z.string()
    .min(3, messages.user.usernameMin)
    .max(50, messages.user.usernameMax)
    .regex(/^[a-z0-9._-]+$/, messages.user.usernameFormat)
    .optional(),
  email: z.string()
    .email(messages.user.emailInvalid)
    .max(100, messages.user.emailMax)
    .optional(),
  name: z.string()
    .min(1, messages.user.nameRequired)
    .max(100, messages.user.nameMax)
    .optional(),
  password: z.string()
    .min(8, messages.password.minLength)
    .max(128, messages.password.maxLength)
    .optional(),
  role: z.enum(['Admin', 'Contrôleur', 'Utilisateur'], {
    message: messages.user.roleInvalid,
  }).optional(),
  isActive: z.boolean().optional(),
});

export const loginSchema = z.object({
  username: z.string().min(1, 'Le nom d\'utilisateur ou courriel est requis'),
  password: z.string().min(1, messages.password.required),
});

// Machine schemas
export const machineCreateSchema = z.object({
  numeroOL: z.string()
    .min(1, messages.machine.numeroOLRequired)
    .max(50, messages.machine.numeroOLMax)
    .regex(/^[A-Z0-9-]+$/, messages.machine.numeroOLFormat),
  type: z.string()
    .min(1, messages.machine.typeRequired)
    .max(200, messages.machine.typeMax),
  clientId: z.string()
    .uuid(messages.machine.clientInvalid),
});

export const machineUpdateSchema = z.object({
  numeroOL: z.string()
    .min(1, messages.machine.numeroOLRequired)
    .max(50, messages.machine.numeroOLMax)
    .regex(/^[A-Z0-9-]+$/, messages.machine.numeroOLFormat)
    .optional(),
  type: z.string()
    .min(1, messages.machine.typeRequired)
    .max(200, messages.machine.typeMax)
    .optional(),
  clientId: z.string()
    .uuid(messages.machine.clientInvalid)
    .optional(),
});

// Client schemas
export const clientCreateSchema = z.object({
  companyName: z.string()
    .min(1, messages.client.companyNameRequired)
    .max(200, messages.client.companyNameMax),
  address: z.string()
    .min(1, messages.client.addressRequired)
    .max(300, messages.client.addressMax),
  province: z.enum(['QC', 'ON', 'AB', 'BC', 'MB', 'NB', 'NL', 'NT', 'NS', 'NU', 'PE', 'SK', 'YT'], {
    message: messages.client.provinceInvalid,
  }),
  postalCode: z.string()
    .regex(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, messages.client.postalCodeFormat)
    .transform(val => val.replace(/[ -]/g, '').toUpperCase()),
});

export const clientUpdateSchema = z.object({
  companyName: z.string()
    .min(1, messages.client.companyNameRequired)
    .max(200, messages.client.companyNameMax)
    .optional(),
  address: z.string()
    .min(1, messages.client.addressRequired)
    .max(300, messages.client.addressMax)
    .optional(),
  province: z.enum(['QC', 'ON', 'AB', 'BC', 'MB', 'NB', 'NL', 'NT', 'NS', 'NU', 'PE', 'SK', 'YT'], {
    message: messages.client.provinceInvalid,
  }).optional(),
  postalCode: z.string()
    .regex(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, messages.client.postalCodeFormat)
    .transform(val => val.replace(/[ -]/g, '').toUpperCase())
    .optional(),
});

// Export type inference
export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type MachineCreateInput = z.infer<typeof machineCreateSchema>;
export type MachineUpdateInput = z.infer<typeof machineUpdateSchema>;
export type ClientCreateInput = z.infer<typeof clientCreateSchema>;
export type ClientUpdateInput = z.infer<typeof clientUpdateSchema>;
