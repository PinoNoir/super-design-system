import { NextRequest, NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define upload directory
const uploadDir = path.join(process.cwd(), 'uploads');

export async function POST(request: NextRequest) {
  try {
    // Ensure the uploads directory exists
    await mkdir(uploadDir, { recursive: true });

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Generate a unique filename
    const filename = `${uuidv4()}-${file.name}`;
    const filepath = path.join(uploadDir, filename);

    // Convert file to buffer and save it
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);

    // Return the file path for later reference
    return NextResponse.json({
      success: true,
      filename,
      filepath,
      originalName: file.name,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
