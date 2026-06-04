#!/bin/bash
# Database Backup Script for Loyalty Platform
# Usage: ./scripts/backup.sh [output-dir]
# Requires: pg_dump, aws-cli (optional, for S3 upload)

set -euo pipefail

BACKUP_DIR="${1:-./backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mkdir -p "$BACKUP_DIR"

# Load environment
if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

echo "Starting backup at $TIMESTAMP"

# Backup all PostgreSQL databases
DB_HOST="${POSTGRES_HOST:-localhost}"
DB_PORT="${POSTGRES_PORT:-5432}"
DB_USER="${POSTGRES_USER:-loyalty}"
DB_PASS="${POSTGRES_PASSWORD:-loyalty_secret}"

databases=(
  "loyalty_api_gateway"
  "loyalty_membership"
  "loyalty_campaign"
  "loyalty_notification"
  "loyalty_analytics"
  "loyalty_gamification"
)

for db in "${databases[@]}"; do
  echo "Backing up $db..."
  PGPASSWORD="$DB_PASS" pg_dump \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$db" \
    -F custom \
    -f "$BACKUP_DIR/${db}_${TIMESTAMP}.dump" \
    --verbose 2>&1 | tail -3
  
  # Compress
  gzip "$BACKUP_DIR/${db}_${TIMESTAMP}.dump"
  echo "  -> $BACKUP_DIR/${db}_${TIMESTAMP}.dump.gz"
done

# Create backup manifest
cat > "$BACKUP_DIR/manifest_${TIMESTAMP}.txt" << EOF
Backup Timestamp: $TIMESTAMP
Databases: ${databases[*]}
Node Version: $(node --version 2>/dev/null || echo 'N/A')
EOF

echo "Backup complete! Files in: $BACKUP_DIR"

# Optional: Upload to S3-compatible storage (MinIO)
if [ -n "${MINIO_ENDPOINT:-}" ] && command -v mc &>/dev/null; then
  echo "Uploading to MinIO..."
  mc alias set minio "$MINIO_ENDPOINT" "$MINIO_ACCESS_KEY" "$MINIO_SECRET_KEY"
  mc cp "$BACKUP_DIR" "minio/${MINIO_BUCKET}/backups/" --recursive
  echo "Upload complete!"
fi

# Retention: keep last 30 days
find "$BACKUP_DIR" -name "*.gz" -type f -mtime +30 -delete
echo "Cleaned up backups older than 30 days"
