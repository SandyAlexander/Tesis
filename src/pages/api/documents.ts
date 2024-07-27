// src/pages/api/documents.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'Appweb',
  port: 3307,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const [rows] = await connection.execute('SELECT * FROM documents');
      res.status(200).json({ documents: rows });
    } catch (error) {
      console.error('Error fetching documents:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: 'No document ID provided' });
    }

    try {
      const [rows]: any = await connection.execute('SELECT file FROM documents WHERE id = ?', [id]);

      if (rows.length === 0) {
        return res.status(404).json({ message: 'Document not found' });
      }

      const file = rows[0].file;
      res.setHeader('Content-Disposition', `attachment; filename=file-${id}.pdf`);
      res.setHeader('Content-Type', 'application/pdf');
      res.status(200).send(file);
    } catch (error) {
      console.error('Error fetching document:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
