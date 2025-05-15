#!/bin/bash
# release.sh - Helper script to release a new version of the extension

# Check if a version argument was provided
if [ -z "$1" ]; then
  echo "Usage: ./release.sh <version>"
  echo "Example: ./release.sh 1.0.0"
  exit 1
fi

VERSION=$1
TAG_NAME="v$VERSION"

# Update version in manifest.json
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  sed -i '' "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" manifest.json
else
  # Linux/others
  sed -i "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" manifest.json
fi

echo "Updated manifest.json version to $VERSION"

# Commit the version change
git add manifest.json
git commit -m "Release version to $VERSION"

# Create and push the tag
git tag $TAG_NAME
git push origin main
git push origin $TAG_NAME

echo "✅ Released version $VERSION!"
echo "  - Created and pushed tag: $TAG_NAME"
echo "  - The GitHub workflow will now create the release automatically"
echo "  - Check the workflow status at: https://github.com/kzamanbd/ai-extension/actions"
