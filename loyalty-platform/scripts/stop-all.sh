#!/bin/bash
# =============================================================================
# Stop Everything - Microservices + Infrastructure
# =============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "========================================================================"
echo "  Loyalty Platform - Stopping Everything"
echo "========================================================================"
echo ""

echo "[1/2] Stopping microservices..."
bash "$SCRIPT_DIR/stop-services.sh"

echo ""
echo "[2/2] Stopping infrastructure (Docker)..."
bash "$SCRIPT_DIR/stop-infra.sh"

echo ""
echo "All systems stopped."
