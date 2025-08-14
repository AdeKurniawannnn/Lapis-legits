import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key for admin operations to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Add detailed logging
    console.log('Login attempt:', { username, password });

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // First, let's check what data exists in the table
    console.log('Checking all records in Login table...');
    const { data: allRecords, error: allError } = await supabaseAdmin
      .from('Login')
      .select('*');
    
    console.log('All records:', allRecords);
    console.log('All records error:', allError);

    // Query the Login table in Supabase with exact match
    console.log('Querying with:', { username, password });
    const { data, error } = await supabaseAdmin
      .from('Login')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();

    console.log('Query result:', { data, error });

    if (error) {
      console.error('Supabase query error:', error);
      
      // Try alternative query without single() to see all matches
      const { data: alternativeData, error: altError } = await supabaseAdmin
        .from('Login')
        .select('*')
        .eq('username', username);
      
      console.log('Alternative query (username only):', { alternativeData, altError });
      
      return NextResponse.json(
        { 
          error: 'Invalid credentials',
          debug: {
            originalError: error.message,
            allRecords: allRecords?.length || 0,
            usernameMatches: alternativeData?.length || 0
          }
        },
        { status: 401 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'No matching credentials found' },
        { status: 401 }
      );
    }

    // Login successful
    console.log('Login successful for user:', data.username);
    return NextResponse.json(
      { 
        success: true, 
        message: 'Login successful',
        user: {
          id: data.id,
          username: data.username
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}