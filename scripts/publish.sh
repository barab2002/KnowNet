#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# publish.sh — Build and push KnowNet Docker images to GHCR
#
# Usage:
#   ./scripts/publish.sh              # builds both images, tags as :latest
#   ./scripts/publish.sh --tag v1.2   # also tags with a custom version tag
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Config ────────────────────────────────────────────────────────────────────
REGISTRY="ghcr.io"
OWNER="barab2002"
API_IMAGE="${REGISTRY}/${OWNER}/knownet-api"
CLIENT_IMAGE="${REGISTRY}/${OWNER}/knownet-client"
ENV_FILE="$(dirname "$0")/../.env.production"

# ── Parse args ────────────────────────────────────────────────────────────────
EXTRA_TAG=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --tag|-t) EXTRA_TAG="$2"; shift 2 ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

# ── Load VITE_ vars from .env.production ──────────────────────────────────────
if [[ ! -f "$ENV_FILE" ]]; then
  echo "❌  .env.production not found at $ENV_FILE"
  exit 1
fi

VITE_FIREBASE_API_KEY=$(grep -E '^VITE_FIREBASE_API_KEY=' "$ENV_FILE" | cut -d= -f2-)
VITE_FIREBASE_AUTH_DOMAIN=$(grep -E '^VITE_FIREBASE_AUTH_DOMAIN=' "$ENV_FILE" | cut -d= -f2-)
VITE_FIREBASE_PROJECT_ID=$(grep -E '^VITE_FIREBASE_PROJECT_ID=' "$ENV_FILE" | cut -d= -f2-)
VITE_FIREBASE_APP_ID=$(grep -E '^VITE_FIREBASE_APP_ID=' "$ENV_FILE" | cut -d= -f2-)

# ── GHCR login check ──────────────────────────────────────────────────────────
echo "🔐  Checking GHCR login..."
if ! docker info 2>/dev/null | grep -q "Username"; then
  if [[ -z "${GHCR_TOKEN:-}" ]]; then
    echo ""
    echo "   Not logged in to GHCR. Options:"
    echo "   1. Run:  export GHCR_TOKEN=<your_pat>  then re-run this script"
    echo "   2. Or:   echo YOUR_PAT | docker login ghcr.io -u ${OWNER} --password-stdin"
    echo ""
    read -rsp "   Paste your GitHub PAT now (hidden): " pat
    echo ""
    echo "$pat" | docker login "${REGISTRY}" -u "${OWNER}" --password-stdin
  else
    echo "$GHCR_TOKEN" | docker login "${REGISTRY}" -u "${OWNER}" --password-stdin
  fi
else
  echo "   Already logged in."
fi

# ── Helper: build + push one image ───────────────────────────────────────────
build_and_push() {
  local name="$1"
  local dockerfile="$2"
  local image="$3"
  shift 3
  local extra_args=("$@")

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🔨  Building ${name} image..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  docker build \
    -f "$dockerfile" \
    -t "${image}:latest" \
    "${extra_args[@]}" \
    .

  if [[ -n "$EXTRA_TAG" ]]; then
    docker tag "${image}:latest" "${image}:${EXTRA_TAG}"
  fi

  echo ""
  echo "📤  Pushing ${name} image..."
  docker push "${image}:latest"
  if [[ -n "$EXTRA_TAG" ]]; then
    docker push "${image}:${EXTRA_TAG}"
    echo "   Also pushed: ${image}:${EXTRA_TAG}"
  fi

  echo "✅  ${name} done → ${image}:latest"
}

# ── Build from repo root ──────────────────────────────────────────────────────
cd "$(dirname "$0")/.."

# ── API ───────────────────────────────────────────────────────────────────────
build_and_push "API" "Dockerfile" "$API_IMAGE"

# ── Client ───────────────────────────────────────────────────────────────────
build_and_push "Client" "Dockerfile.client" "$CLIENT_IMAGE" \
  --build-arg "VITE_FIREBASE_API_KEY=${VITE_FIREBASE_API_KEY}" \
  --build-arg "VITE_FIREBASE_AUTH_DOMAIN=${VITE_FIREBASE_AUTH_DOMAIN}" \
  --build-arg "VITE_FIREBASE_PROJECT_ID=${VITE_FIREBASE_PROJECT_ID}" \
  --build-arg "VITE_FIREBASE_APP_ID=${VITE_FIREBASE_APP_ID}"

# ── Done ─────────────────────────────────────────────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀  All images pushed to GHCR:"
echo "    ${API_IMAGE}:latest"
echo "    ${CLIENT_IMAGE}:latest"
if [[ -n "$EXTRA_TAG" ]]; then
  echo "    (also tagged :${EXTRA_TAG})"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
