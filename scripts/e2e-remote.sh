#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $0 <BASE_URL>"
  exit 1
fi

export BASE_URL="$1"
echo "Running remote E2E against $BASE_URL"

npm run test:e2e:remote -- tests/working-cart.spec.ts --reporter=line

