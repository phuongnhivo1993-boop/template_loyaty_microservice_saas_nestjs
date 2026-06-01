#!/bin/bash
# =============================================================================
# Run All Tests
# =============================================================================
# 1. Unit tests (12 suites)
# 2. API flow integration test (132 cases - skipped/todo until endpoints exist)
# =============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo "========================================================================"
echo "  Loyalty Platform - Running Tests"
echo "========================================================================"
echo ""

echo "[1/2] Running unit tests..."
npx jest --passWithNoTests 2>&1 | tail -5

echo ""
echo "[2/2] Running API flow e2e tests..."
npx jest --config ./apps/api-gateway/test/jest-e2e.json --testPathPatterns "api-flow" 2>&1 | tail -5

echo ""
echo "========================================================================"
echo "  Tests complete!"
echo "========================================================================"
