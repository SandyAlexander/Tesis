// src/pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'Appweb',
  port: 3307,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const uploadDir = path.join(process.cwd(), 'public/uploads');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
      uploadDir: uploadDir,
      keepExtensions: true,
      multiples: true, // Allow multiple files to be handled
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      // Handle files array if multiple files are uploaded
      const uploadedFiles = files.file instanceof Array ? files.file : [files.file];

      if (uploadedFiles.length === 0) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      try {
        for (const file of uploadedFiles) {
          if (!file || Array.isArray(file)) {
            return res.status(400).json({ message: 'Invalid file data' });
          }

          const filePath = file.filepath;
          const fileData = fs.readFileSync(filePath);
          const fileName = file.originalFilename || 'unknown.pdf';

          console.log('Uploading file:', fileName);

          const userId = 7; // Replace with actual user ID retrieval
          const type = 'silabo';

          const [result]: any = await connection.execute(
            'INSERT INTO documents (user_id, type, file, filename) VALUES (?, ?, ?, ?)',
            [userId, type, fileData, fileName]
          );

          fs.unlinkSync(filePath);

          if (result.affectedRows === 0) {
            throw new Error('File not inserted into database');
          }
        }

        return res.status(200).json({ message: 'File(s) uploaded successfully' });
      } catch (error) {
        console.error('Error uploading file:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    });
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
