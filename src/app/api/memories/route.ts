import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { Memory } from '@/app/types/memory';
import { supabase } from '@/app/lib/supabase/supabase';

export const dynamic = 'force-dynamic'; // Garante que a rota não seja cacheada no build

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