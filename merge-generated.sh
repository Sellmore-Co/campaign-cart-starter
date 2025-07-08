#!/bin/bash

# Script to merge only generated files from files branch to current branch

# Array of directories/files to merge
GENERATED_DIRS=(
    "components"
    "css"
    "js"
    "templates"
    "demo"
)

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)

echo "Merging generated files from 'files' branch to '$CURRENT_BRANCH'"

# Checkout each directory from files branch
for dir in "${GENERATED_DIRS[@]}"; do
    if git ls-tree -r files --name-only | grep -q "^$dir/"; then
        echo "Merging $dir/..."
        git checkout files -- "$dir/"
    fi
done

echo "Generated files merged. Review changes and commit when ready."