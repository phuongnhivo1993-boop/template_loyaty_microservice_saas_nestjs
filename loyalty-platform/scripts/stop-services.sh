#!/bin/bash
# =============================================================================
# Stop All Microservices (NestJS)
# =============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "Stopping all NestJS microservices..."

# Kill all nest start processes
pkill -f "nest start" 2>/dev/null || true
pkill -f "nest build" 2>/dev/null || true

# Kill any node processes running our services
for port in 3001 3002 3003 3004 3005 3006 3007 3008 3009 3010 3011 3012; do
  pid=$(lsof -ti :$port 2>/dev/null) || true
  if [ -n "$pid" ]; then
    kill "$pid" 2>/dev/null || true
  fi
done

echo "All microservices stopped."
