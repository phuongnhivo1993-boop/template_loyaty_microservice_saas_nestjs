#!/bin/bash
# =============================================================================
# Stop Infrastructure Services (Docker)
# =============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "Stopping all infrastructure containers..."
cd "$PROJECT_DIR"
docker compose down

echo "All infrastructure services stopped."
