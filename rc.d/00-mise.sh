#!/usr/bin/env bash
# Auto-install and activate mise

if command -v mise &> /dev/null; then
  eval "$(mise activate bash)"
  mise install --yes
else
  echo "⚠️  mise not found. Install from https://mise.jdx.dev"
fi
