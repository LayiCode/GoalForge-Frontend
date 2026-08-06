#!/bin/sh
set -e

API_URL="${API_URL:-http://localhost:8080}"

cat > /usr/share/nginx/html/config.js <<EOF
window.APP_CONFIG = {
  VITE_API_URL: "${API_URL}"
};
EOF

echo "Generated /usr/share/nginx/html/config.js with API_URL=${API_URL}"
