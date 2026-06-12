import { NextResponse, NextRequest } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { Memory, CreateMemoryResponse } from '@/types/memory';
import { supabase } from '@/app/lib/supabase/supabase';

const STORAGE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? 'bkt-remember-when';

if (!STORAGE_BUCKET) {
  throw new Error('Missing Supabase storage bucket environment variable');
}

export const dynamic = 'force-dynamic'; // Garante que a rota não seja cacheada no build

/**
 * GET /api/memories
 * Fetches a random memory
 */
export async function GET() {
  try {
    // Chamando a função RPC que criamos no banco de dados
    const { data, error } = await supabase.rpc('get_random_memory');

    if (error) {
      throw error;
    }

    // Como o RPC retorna uma lista (setof), pegamos o primeiro item
    const memory: Memory = data?.[0];

    if (!memory) {
      return NextResponse.json(
        { error: 'Nenhuma memória encontrada no banco.' },
        { status: 404 }
      );
    }

    return NextResponse.json(memory);
  } catch (error) {
    // Captura o erro automaticamente no Sentry para você monitorar
    Sentry.captureException(error);
    
    return NextResponse.json(
      { error: 'Erro interno ao buscar memória.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/memories
 * Creates a new memory with image upload
 * 
 * Expects multipart/form-data with:
 * - phrase: string - Memory text/description
 * - imageFile: File - Image file to store
 */
export async function POST(request: NextRequest): Promise<NextResponse<CreateMemoryResponse>> {
  try {
    // Parse multipart form data
    const formData = await request.formData();
    const phrase = formData.get('phrase') as string;
    const imageFile = formData.get('imageFile') as File;

    // Validation
    if (!phrase || !phrase.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Phrase is required',
            code: 'INVALID_PHRASE',
          },
        } as CreateMemoryResponse,
        { status: 400 }
      );
    }

    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Image file is required',
            code: 'INVALID_IMAGE',
          },
        } as CreateMemoryResponse,
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (imageFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'File size exceeds 5MB limit',
            code: 'FILE_TOO_LARGE',
          },
        } as CreateMemoryResponse,
        { status: 400 }
      );
    }

    // Validate file type
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!ALLOWED_TYPES.includes(imageFile.type)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Invalid file type. Allowed types: JPEG, PNG, WebP, GIF',
            code: 'INVALID_FILE_TYPE',
          },
        } as CreateMemoryResponse,
        { status: 400 }
      );
    }

    // Convert File to Buffer for storage
    const buffer = await imageFile.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);

    // Generate unique file name
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 9);
    const fileName = `memories/${timestamp}-${randomString}/${imageFile.name}`;
    console.log({ timestamp, randomString, fileName });

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, uint8Array, {
        contentType: imageFile.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Error uploading file to Supabase Storage:', uploadError);
      throw uploadError;
    }

    // Get public URL for the uploaded image
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(uploadData.path);

    if (!urlData?.publicUrl) {
      throw new Error('Unable to resolve uploaded image public URL');
    }

    // Insert memory record into database
    const { data: memoryData, error: insertError } = await supabase
      .from('memories')
      .insert([
        {
          phrase: phrase.trim(),
          image_url: urlData.publicUrl,
        },
      ])
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json(
      {
        success: true,
        data: memoryData as Memory,
      } as CreateMemoryResponse,
      { status: 201 }
    );
  } catch (error) {
    // Captura o erro automaticamente no Sentry
    Sentry.captureException(error, {
      tags: {
        endpoint: 'POST /api/memories',
        feature: 'memory_creation',
      },
    });

    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Erro ao criar memória. Tente novamente mais tarde.',
          code: 'INTERNAL_ERROR',
        },
      } as CreateMemoryResponse,
      { status: 500 }
    );
  }
}