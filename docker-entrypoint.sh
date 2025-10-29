#!/bin/sh
set -e

cat > /usr/share/nginx/html/env.js <<EOF
window.__env = {
  API_URL: "${API_URL:-http://localhost:8000/agenticai/api/v1/}"
};
EOF

exec nginx -g "daemon off;"
