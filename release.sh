#!/bin/bash
# release.sh - Helper script to release a new version of the extension

# Function to compare semantic versions
# Returns 1 if version1 > version2, 0 if equal, -1 if version1 < version2
compare_versions() {
    if [[ $1 == $2 ]]; then
        echo 0
        return
    fi

    local IFS=.
    local i ver1=($1) ver2=($2)

    # Fill empty positions with zeros
    for ((i = ${#ver1[@]}; i < ${#ver2[@]}; i++)); do
        ver1[i]=0
    done
    for ((i = ${#ver2[@]}; i < ${#ver1[@]}; i++)); do
        ver2[i]=0
    done

    # Compare version numbers
    for ((i = 0; i < ${#ver1[@]}; i++)); do
        if [[ -z ${ver2[i]} ]]; then
            echo 1 # ver1 has more segments, so it's newer
            return
        fi

        if ((10#${ver1[i]} > 10#${ver2[i]})); then
            echo 1 # ver1 > ver2
            return
        elif ((10#${ver1[i]} < 10#${ver2[i]})); then
            echo -1 # ver1 < ver2
            return
        fi
    done

    if [[ ${#ver1[@]} -lt ${#ver2[@]} ]]; then
        echo -1 # ver2 has more segments, so it's newer
    else
        echo 0 # They're equal
    fi
}

# Check if a version argument was provided
if [ -z "$1" ]; then
    echo "Usage: ./release.sh <version>"
    echo "Example: ./release.sh 1.0.0"
    exit 1
fi

VERSION=$1
TAG_NAME="v$VERSION"

# Get the current version from manifest.json
CURRENT_VERSION=$(grep -o '"version": "[^"]*' manifest.json | cut -d '"' -f 4)
echo "Current version: $CURRENT_VERSION"
echo "New version: $VERSION"

# Compare versions
VERSION_COMPARE=$(compare_versions "$VERSION" "$CURRENT_VERSION")

if [[ $VERSION_COMPARE -le 0 ]]; then
    echo "❌ Error: New version ($VERSION) must be greater than the current version ($CURRENT_VERSION)"
    exit 1
fi

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
