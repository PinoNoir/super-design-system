'use server';

import { z } from 'zod';
import { createSession, deleteSession } from '@/app/lib/session';
import { redirect } from 'next/navigation';

const testUser = {
  id: '1',
  email: process.env.TEST_USER_EMAIL,
  password: process.env.TEST_USER_PASSWORD,
};

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }).trim(),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }).trim(),
});

export async function login(prevState: any, formData: FormData) {
  console.log('Login action called with:', Object.fromEntries(formData));

  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    console.log('Validation failed:', result.error.flatten().fieldErrors);
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email, password } = result.data;
  console.log('Checking credentials:', email);

  if (email !== testUser.email || password !== testUser.password) {
    console.log('Invalid credentials');
    // Return a consistent structure with email and password fields
    return {
      errors: {
        email: ['Invalid email address or username'],
        password: [], // Include empty password array for type consistency
      },
    };
  }

  console.log('Login successful, creating session');
  await createSession(testUser.id);
  console.log('Redirecting to chat');
  redirect('/chat');
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}
