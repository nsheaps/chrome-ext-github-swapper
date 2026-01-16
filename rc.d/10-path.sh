#!/usr/bin/env bash
# Add bin directory to PATH

if [ -d "${PWD}/bin" ]; then
  PATH_add "${PWD}/bin"
fi
