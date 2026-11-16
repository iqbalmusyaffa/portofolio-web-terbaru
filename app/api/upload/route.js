import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { requireAdminAuth } from '@/lib/security';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif',
  'image/x-icon',
  'application/pdf'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request) {
  const auth = requireAdminAuth(request);
  if (!auth.authenticated) {
    return NextResponse.json(auth.response, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const customSubfolder = formData.get('folder') || 'uploads'; // 'uploads' or 'skills'

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { success: false, error: 'File gambar wajib dipilih' },
        { status: 400 }
      );
    }

    // Validate mime type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Format file tidak didukung. Harap upload file JPG, PNG, WebP, atau SVG.' },
        { status: 400 }
      );
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Ukuran file terlalu besar (maksimal 10MB)' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize subfolder to prevent directory traversal
    const safeSubfolder = customSubfolder === 'skills' ? 'skills' : 'uploads';

    // Target directory
    const targetDir = path.join(process.cwd(), 'public', 'assets', safeSubfolder);
    await mkdir(targetDir, { recursive: true });

    // Sanitize original filename
    const originalName = file.name || 'image.png';
    const ext = path.extname(originalName).toLowerCase() || '.png';
    const baseName = path.basename(originalName, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 50);

    const uniqueFileName = `${Date.now()}-${baseName || 'upload'}${ext}`;
    const filePath = path.join(targetDir, uniqueFileName);

    await writeFile(filePath, buffer);

    const publicUrl = `/assets/${safeSubfolder}/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      message: 'File berhasil di-upload ke assets',
      url: publicUrl,
      filename: uniqueFileName,
      size: file.size,
      mimeType: file.type
    });
  } catch (error) {
    console.error('Error handling upload:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengunggah file: ' + error.message },
      { status: 500 }
    );
  }
}
