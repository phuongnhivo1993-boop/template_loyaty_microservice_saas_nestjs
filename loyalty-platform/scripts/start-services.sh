#!/bin/bash
# =============================================================================
# Start All Microservices (NestJS)
# =============================================================================
# Starts all 12 microservice applications in development mode.
# Each service runs on a unique port (3001-3012).
# =============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "========================================================================"
echo "  Loyalty Platform - Starting All Microservices"
echo "========================================================================"

cd "$PROJECT_DIR"

echo "[STEP 1/3] Installing dependencies..."
npm install --silent

echo "[STEP 2/3] Building all services..."
npx nest build 2>&1 | tail -1

echo "[STEP 3/3] Starting all services in background..."
echo "(Check logs/nest-*.log for details)"

mkdir -p logs

# Start each service in background
SERVICES=(
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

for service_entry in "${SERVICES[@]}"; do
  service_name="${service_entry%%:*}"
  service_port="${service_entry##*:}"
  echo "  Starting $service_name on port $service_port..."
  SERVICE_PORT=$service_port npx nest start "$service_name" --watch > "logs/nest-$service_name.log" 2>&1 &
  sleep 1
done

echo ""
echo "========================================================================"
echo "  All services started!"
echo "  API Gateway: http://localhost:3001"
echo "  API Docs:    http://localhost:3001/api/docs"
echo "  Logs:        ./logs/nest-*.log"
echo "========================================================================"
echo ""
echo "To view logs for a specific service:"
echo "  tail -f logs/nest-api-gateway.log"
echo ""
echo "To stop all services:"
echo "  ./scripts/stop-services.sh"
