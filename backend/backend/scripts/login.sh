#!/bin/sh
# Script to perform Sanctum CSRF -> LOGIN -> test authenticated GET
set -e

echo "Reading cookie file..."
if [ ! -f /tmp/csrf_cookies ]; then
  echo "Cookie file /tmp/csrf_cookies not found" >&2
  exit 1
fi

TOKEN=$(awk '/XSRF-TOKEN/ {print $7}' /tmp/csrf_cookies | sed -n '1p')
DECODED=$(php -r "echo urldecode('$TOKEN');")
echo "Decoded XSRF token: $DECODED"

# Perform login
LOGIN_RESPONSE=$(curl -i -sS -b /tmp/csrf_cookies -c /tmp/csrf_cookies -H "X-XSRF-TOKEN: $DECODED" -H "Content-Type: application/json" -d '{"email":"admin@sistema.com","password":"password"}' http://localhost:8000/api/login)

echo "--- LOGIN RESPONSE ---"
echo "$LOGIN_RESPONSE"

# Test authenticated GET
echo "--- GET /api/resumes (authenticated) ---"
curl -i -sS -b /tmp/csrf_cookies http://localhost:8000/api/resumes
