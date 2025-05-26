// Test script to verify database schema changes
import { drizzle } from 'drizzle-orm/d1'
import { sql } from 'drizzle-orm'

async function testDatabaseSchema() {
    try {
        // This will connect to the local database
        const db = drizzle(hubDatabase())

        // Check if the new columns exist in refresh_tokens table
        const result = await db.run(sql`PRAGMA table_info(refresh_tokens)`)

        console.log('Refresh tokens table schema:')
        console.log(result)

        // Check specifically for our new columns
        const columns = result.results || []
        const hasDeviceName = columns.some(col => col.name === 'device_name')
        const hasLocation = columns.some(col => col.name === 'location')
        const hasIsCurrent = columns.some(col => col.name === 'is_current')

        console.log('\nSession management columns status:')
        console.log('device_name:', hasDeviceName ? '✅ EXISTS' : '❌ MISSING')
        console.log('location:', hasLocation ? '✅ EXISTS' : '❌ MISSING')
        console.log('is_current:', hasIsCurrent ? '✅ EXISTS' : '❌ MISSING')

        if (hasDeviceName && hasLocation && hasIsCurrent) {
            console.log('\n🎉 Database migration has been successfully applied!')
        } else {
            console.log('\n⚠️ Database migration may need to be applied manually')
        }

    } catch (error) {
        console.error('Error testing database schema:', error)
    }
}

// Run the test
testDatabaseSchema()
