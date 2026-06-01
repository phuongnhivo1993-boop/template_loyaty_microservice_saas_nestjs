#!/bin/bash
# =============================================================================
# Check Status of All Services
# =============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo "========================================================================"
echo "  Loyalty Platform - Service Status"
echo "========================================================================"
echo ""

echo "--- Docker Infrastructure ---"
if command -v docker &>/dev/null; then
  docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "  (not running)"
else
  echo "  Docker not available"
fi

echo ""
echo "--- Microservices (NestJS) ---"
services=(
  "api-gateway:3001"
  "membership-service:3002"
  "loyalty-service:3003"
  "campaign-service:3004"
  "reward-service:3005"
  "referral-service:3006"
  "voucher-service:3007"
  "promotion-service:3008"
  "gamification-service:3009"
  "notification-service:3010"
  "analytics-service:3011"
  "customer360-service:3012"
)

for entry in "${services[@]}"; do
  name="${entry%%:*}"
  port="${entry##*:}"
  if lsof -i :$port &>/dev/null 2>&1; then
    echo "  ✅ $name (port $port)"
  else
    echo "  ❌ $name (port $port) - NOT running"
  fi
done

echo ""
echo "--- Test Script Status ---"
npx jest --config ./apps/api-gateway/test/jest-e2e.json --testPathPatterns "api-flow" --quiet 2>/dev/null | tail -1 || echo "  Not run yet"

echo ""
echo "========================================================================"
