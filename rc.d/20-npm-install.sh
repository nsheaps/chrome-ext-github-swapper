#!/usr/bin/env bash
# Dry-run notification for npm install

PACKAGE_JSON="${PWD}/package.json"
PACKAGE_LOCK="${PWD}/package-lock.json"
NODE_MODULES="${PWD}/node_modules"

if [ -f "$PACKAGE_JSON" ]; then
  # Check if node_modules is missing or package files changed
  if [ ! -d "$NODE_MODULES" ] || \
     [ "$PACKAGE_JSON" -nt "$NODE_MODULES" ] || \
     [ "$PACKAGE_LOCK" -nt "$NODE_MODULES" ]; then
    echo "📦 Dependencies may need updating. Run: npm install"
  fi
fi
