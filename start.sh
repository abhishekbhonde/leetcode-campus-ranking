#!/usr/bin/env bash
set -e

# ──────────────────────────────────────────────
# LeetCode Campus Leaderboard — One-Click Start
# ──────────────────────────────────────────────

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

# Colors for pretty output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log()  { echo -e "${CYAN}[INFO]${NC}  $1"; }
ok()   { echo -e "${GREEN}[  OK]${NC}  $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC}  $1"; }
err()  { echo -e "${RED}[FAIL]${NC}  $1"; }

cleanup() {
  echo ""
  log "Shutting down services..."
  kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
  log "Stopping PostgreSQL container..."
  docker compose -f "$ROOT_DIR/docker-compose.yml" down 2>/dev/null || true
  ok "All services stopped. Bye! 👋"
}
trap cleanup EXIT INT TERM

# ─── 1. Check prerequisites ──────────────────
log "Checking prerequisites..."

if ! command -v docker &>/dev/null; then
  err "Docker is not installed. Please install Docker Desktop first."
  exit 1
fi

if ! command -v node &>/dev/null; then
  err "Node.js is not installed. Please install Node.js 18+ first."
  exit 1
fi

ok "Prerequisites look good (Docker + Node.js found)"

# ─── 2. Install dependencies if needed ───────
if [ ! -d "$BACKEND_DIR/node_modules" ]; then
  log "Installing backend dependencies..."
  (cd "$BACKEND_DIR" && npm install)
  ok "Backend dependencies installed"
else
  ok "Backend dependencies already installed"
fi

if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
  log "Installing frontend dependencies..."
  (cd "$FRONTEND_DIR" && npm install)
  ok "Frontend dependencies installed"
else
  ok "Frontend dependencies already installed"
fi

# ─── 3. Start PostgreSQL via Docker ──────────
log "Starting PostgreSQL container..."
docker compose -f "$ROOT_DIR/docker-compose.yml" up -d

# Wait for PostgreSQL to be ready
log "Waiting for PostgreSQL to be ready..."
RETRIES=30
until docker exec leetcode_campus_db pg_isready -U postgres -q 2>/dev/null; do
  RETRIES=$((RETRIES - 1))
  if [ $RETRIES -le 0 ]; then
    err "PostgreSQL did not become ready in time."
    exit 1
  fi
  sleep 1
done
ok "PostgreSQL is running on port 5432"

# ─── 4. Run Prisma migrations & seed ─────────
log "Running Prisma migrations..."
(cd "$BACKEND_DIR" && npx prisma migrate dev --name init --skip-generate 2>/dev/null || npx prisma migrate deploy)
ok "Database migrated"

log "Generating Prisma client..."
(cd "$BACKEND_DIR" && npx prisma generate)
ok "Prisma client generated"

log "Seeding database..."
(cd "$BACKEND_DIR" && node prisma/seed.js)
ok "Database seeded with colleges"

# ─── 5. Start backend & frontend ─────────────
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  🚀 Starting LeetCode Campus Leaderboard${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  Backend  → ${CYAN}http://localhost:5000${NC}"
echo -e "  Frontend → ${CYAN}http://localhost:3000${NC}"
echo -e "  Database → ${CYAN}postgresql://postgres:postgres@localhost:5432/leetcode_campus${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  Press ${YELLOW}Ctrl+C${NC} to stop all services"
echo ""

# Start backend in background
(cd "$BACKEND_DIR" && node src/index.js) &
BACKEND_PID=$!

# Start frontend in foreground (keeps the terminal alive)
(cd "$FRONTEND_DIR" && npm run dev) &
FRONTEND_PID=$!

# Wait for either to exit
wait $BACKEND_PID $FRONTEND_PID
