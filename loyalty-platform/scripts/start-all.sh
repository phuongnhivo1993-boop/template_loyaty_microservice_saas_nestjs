#!/bin/bash
# =============================================================================
# Start Everything - Infrastructure + Microservices
# =============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "========================================================================"
echo "  Loyalty Platform - Starting Everything"
echo "========================================================================"
echo ""

echo "[1/2] Starting infrastructure (Docker)..."
bash "$SCRIPT_DIR/start-infra.sh"

echo ""
echo "[2/2] Starting microservices (NestJS)..."
bash "$SCRIPT_DIR/start-services.sh"

echo ""
echo "========================================================================"
echo "  All systems running!"
echo "========================================================================"
