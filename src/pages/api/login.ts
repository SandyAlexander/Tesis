import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { query } from '../../../lib/db';

interface User {
  id: number;
  email: string;
  password: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Consulta el usuario en la base de datos
    const results = await query('SELECT * FROM users WHERE email = ?', [email]);

    // Verifica si results es un array y tiene elementos
    if (!Array.isArray(results) || results.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Asume que el primer elemento es el usuario
    const user = results[0] as User;

    // Verifica la contraseña
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Usuario autenticado
    return res.status(200).json({ message: 'Login successful' });

  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
