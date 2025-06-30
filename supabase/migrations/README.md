# Database Migrations

This directory contains all database schema changes for the MovieThresh application.

## Migration Files

- `20240620000000_create_users_table.sql` - Creates the users table with RLS policies and triggers

## How to apply migrations

### Local Development
```bash
# Apply all migrations
supabase db reset

# Apply new migrations only
supabase db push
```

### Production
```bash
# Apply migrations to production
supabase db push --db-url "your-production-db-url"
```

## Migration Naming Convention

Use the format: `YYYYMMDDHHMMSS_description.sql`

Example: `20240620143000_add_user_preferences.sql`

## Best Practices

1. **Always test migrations locally first**
2. **Use descriptive names** for migration files
3. **Include rollback instructions** in comments if needed
4. **Never modify existing migration files** - create new ones instead
5. **Use transactions** for complex migrations

## Rollback

To rollback a migration:
```bash
supabase db reset --db-url "your-db-url"
```

**Note:** This will reset the entire database. For production, use proper backup/restore procedures. 