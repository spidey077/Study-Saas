import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

function createMissingClient(label: string): SupabaseClient {
	return new Proxy({} as SupabaseClient, {
		get() {
			throw new Error(`${label} is required.`)
		},
	})
}

// Client for browser use
export const supabase: SupabaseClient =
	supabaseUrl && supabaseAnonKey
		? createClient(supabaseUrl, supabaseAnonKey)
		: createMissingClient('NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')

// Admin client for server-side use (bypasses RLS)
export const supabaseAdmin: SupabaseClient =
	supabaseUrl && supabaseServiceKey
		? createClient(supabaseUrl, supabaseServiceKey)
		: createMissingClient('SUPABASE_SERVICE_ROLE_KEY')
