import { z } from 'zod';

export const ticketSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  age: z.number().min(0, 'Age must be a positive number'),
});

export type Ticket = z.infer<typeof ticketSchema>;
