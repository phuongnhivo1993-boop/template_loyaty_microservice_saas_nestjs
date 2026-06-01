#!/bin/bash
# =============================================================================
# Start Infrastructure Services (Docker)
# =============================================================================
# Starts PostgreSQL, Redis, Kafka, MinIO, Keycloak, ClickHouse, Elasticsearch
# =============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "========================================================================"
echo "  Loyalty Platform - Starting Infrastructure"
echo "========================================================================"

cd "$PROJECT_DIR"

# Create .env symlink if needed
if [ ! -f .env ]; then
  echo "[INFO] Creating .env file..."
  cp .env.example .env 2>/dev/null || true
fi

echo "[STEP 1/1] Starting Docker containers..."
docker compose up -d

echo ""
echo "========================================================================"
echo "  Infrastructure Status"
echo "========================================================================"
docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "  PostgreSQL:  postgresql://loyalty:loyalty_secret@localhost:5432"
echo "  Redis:       redis://localhost:6379"
echo "  Kafka:       localhost:9092"
echo "  MinIO API:   http://localhost:9000"
echo "  MinIO Admin: http://localhost:9001 (admin / minio_secret_123)"
echo "  Keycloak:    http://localhost:8080 (admin / admin123)"
echo "  ClickHouse:  http://localhost:8123"
echo "  Elasticsearch: http://localhost:9200"
echo "========================================================================"
