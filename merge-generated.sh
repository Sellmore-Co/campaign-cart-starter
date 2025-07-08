#!/bin/bash

# Script to merge only the dist folder from files branch to current branch

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)

echo "Merging dist folder from 'files' branch to '$CURRENT_BRANCH'"

# Check if dist folder exists in files branch
if git ls-tree -r files --name-only | grep -q "^dist/"; then
    echo "Merging dist/..."
    git checkout files -- "dist/"
    echo "✅ dist folder merged successfully"
else
    echo "❌ No dist folder found in files branch"
    exit 1
fi

echo "Generated files merged. Review changes and commit when ready."