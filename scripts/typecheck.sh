#!/bin/bash
# Wrapper script for nuxt typecheck that filters out errors from
# third-party Nuxt layers (e.g., docus) in node_modules.
# These errors originate from upstream code and cannot be fixed locally.

output=$(pnpm exec nuxt typecheck --extends docus 2>&1)
exit_code=$?

if [ $exit_code -eq 0 ]; then
  echo "$output"
  exit 0
fi

# Filter lines: keep only error lines NOT in node_modules
user_errors=$(echo "$output" | grep 'error TS' | grep -v 'node_modules/')

if [ -z "$user_errors" ]; then
  echo "Typecheck passed (only third-party layer errors found, ignored)."
  exit 0
else
  echo "$output"
  exit 1
fi
