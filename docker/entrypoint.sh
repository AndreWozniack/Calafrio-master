#!/bin/sh
set -e
cd /app/apps/web
exec pnpm exec next start --port "${PORT:-3001}"
