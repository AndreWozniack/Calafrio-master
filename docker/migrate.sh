#!/bin/sh
set -e
cd /app/apps/web
pnpm run db:migrate
