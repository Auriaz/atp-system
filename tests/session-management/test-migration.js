// Test script to check if session management migration has been applied
import { hubDatabase } from '@nuxthub/core'

const db = hubDatabase()

try {
    // Test if the new columns exist by querying the table structure
    const result = await db.prepare("PRAGMA table_info(refresh_tokens)").all()
    console.log('refresh_tokens table structure:')
    console.table(result)

    // Check specifically for our new columns
    const hasDeviceName = result.some(col => col.name === 'device_name')
    const hasLocation = result.some(col => col.name === 'location')
    const hasIsCurrent = result.some(col => col.name === 'is_current')

    console.log('\nSession Management Migration Status:')
    console.log('✓ device_name column:', hasDeviceName ? 'EXISTS' : 'MISSING')
    console.log('✓ location column:', hasLocation ? 'EXISTS' : 'MISSING')
    console.log('✓ is_current column:', hasIsCurrent ? 'EXISTS' : 'MISSING')

    if (hasDeviceName && hasLocation && hasIsCurrent) {
        console.log('\n🎉 Migration has been applied successfully!')
    } else {
        console.log('\n❌ Migration is pending or failed')
    }

} catch (error) {
    console.error('Error checking migration status:', error)
}
