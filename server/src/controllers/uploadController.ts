import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';

export const uploadCoverImage = async (req: Request, res: Response) => {
  try {
    const file = req.body.coverImageBase64 as string;
    if (!file) return res.status(400).json({ error: 'No file provided' });

    const matches = file.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3)
      throw new Error('Invalid base64 string');

    const buffer = Buffer.from(matches[2], 'base64');
    const uploadDir = path.join(__dirname, '../../public/uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const filename = `cover-${Date.now()}.png`;
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);

    res.json({ url: `/uploads/${filename}` });
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};
