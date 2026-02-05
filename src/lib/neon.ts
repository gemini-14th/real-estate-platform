import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL is not defined in environment variables');
}

export const sql = neon(process.env.DATABASE_URL || '');

// Helper to initialize the table if it doesn't exist (primitive migration)
export async function initDb() {
    if (!process.env.DATABASE_URL) return;

    try {
        await sql`
            CREATE TABLE IF NOT EXISTS units (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                price DECIMAL NOT NULL,
                location TEXT NOT NULL,
                type TEXT NOT NULL,
                beds INTEGER,
                baths INTEGER,
                sqft INTEGER,
                description TEXT,
                video_url TEXT,
                thumbnail_url TEXT,
                images TEXT,
                tags TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // Ensure columns exist (in case table was created earlier without them)
        try {
            await sql`ALTER TABLE units ADD COLUMN IF NOT EXISTS video_url TEXT;`;
            await sql`ALTER TABLE units ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;`;
            await sql`ALTER TABLE units ADD COLUMN IF NOT EXISTS images TEXT;`;
            await sql`ALTER TABLE units ADD COLUMN IF NOT EXISTS tags TEXT;`;
            await sql`ALTER TABLE units ADD COLUMN IF NOT EXISTS description TEXT;`;
        } catch (e) {
            console.log("Columns might already exist or alternate error:", e);
        }

        await sql`
            CREATE TABLE IF NOT EXISTS admins (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                secret_key TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;
        console.log('Database tables initialized');
    } catch (error) {
        console.error('Failed to initialize database:', error);
    }
}
