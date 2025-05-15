#!/bin/bash
# release.sh - Helper script to release a new version of the extension

# Function to generate a changelog between two tags or commits
generate_changelog() {
    local previous_tag=$1
    local current=$2
    local changelog=""

    if [ -z "$previous_tag" ]; then
        echo "## 🚀 First Release $current"
        return
    fi

    echo "## 🚀 Changes since $previous_tag"
    echo ""

    # Group by conventional commit types
    # Check for new features
    local features=$(git log "$previous_tag".."$current" --pretty=format:"- %s" --grep="^feat")
    if [ -n "$features" ]; then
        echo "### ✨ New Features"
        echo "$features"
        echo -e "\n"
    fi

    # Check for bug fixes
    local fixes=$(git log "$previous_tag".."$current" --pretty=format:"- %s" --grep="^fix")
    if [ -n "$fixes" ]; then
        echo "### 🐛 Bug Fixes"
        echo "$fixes"
        echo -e "\n"
    fi

    # Check for documentation changes
    local docs=$(git log "$previous_tag".."$current" --pretty=format:"- %s" --grep="^docs")
    if [ -n "$docs" ]; then
        echo "### 📝 Documentation"
        echo "$docs"
        echo -e "\n"
    fi

    # Check for other changes
    local others=$(git log "$previous_tag".."$current" --pretty=format:"- %s" --grep="^refactor\|^chore\|^style\|^test\|^perf")
    if [ -n "$others" ]; then
        echo "### 🧹 Other Changes"
        echo "$others"
        echo -e "\n"
    fi

    # Full change log
    local full_changes=$(git log "$previous_tag".."$current" --pretty=format:"- %h %s" | grep -v "^- [a-f0-9]* Merge ")
    if [ -n "$full_changes" ]; then
        echo "### 📦 Full Change Log"
        echo "$full_changes"
    fi
}

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

# Parse command line options
generate_only=false
changelog_file=""

while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
    --generate-changelog)
        generate_only=true
        shift
        ;;
    --output)
        changelog_file="$2"
        shift
        shift
        ;;
    *)
        VERSION="$1"
        shift
        ;;
    esac
done

# Check if version is provided when not just generating changelog
if [ "$generate_only" = false ] && [ -z "$VERSION" ]; then
    echo "Usage: ./release.sh <version> [--generate-changelog] [--output filename]"
    echo "Examples:"
    echo "  ./release.sh 1.0.0                            # Create a release with version 1.0.0"
    echo "  ./release.sh --generate-changelog             # Only generate changelog without creating a release"
    echo "  ./release.sh 1.0.0 --output CHANGELOG.md      # Create release and save changelog to CHANGELOG.md"
    exit 1
fi

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

# If only generating changelog
if [ "$generate_only" = true ]; then
    # Get the latest tag for the current version
    LATEST_TAG=$(git tag --sort=-v:refname | grep "^v" | head -n 1)
    PREV_TAG=$(git tag --sort=-v:refname | grep "^v" | head -n 2 | tail -n 1)

    if [ -z "$LATEST_TAG" ]; then
        LATEST_TAG="HEAD"
    fi

    CHANGELOG=$(generate_changelog "$PREV_TAG" "$LATEST_TAG")

    if [ -n "$changelog_file" ]; then
        echo "$CHANGELOG" >"$changelog_file"
        echo "✅ Changelog generated and saved to $changelog_file"
    else
        echo "$CHANGELOG"
    fi

    exit 0
fi

# Regular release process
# Generate changelog first
PREV_TAG=$(git tag --sort=-v:refname | grep "^v" | head -n 1)
CHANGELOG=$(generate_changelog "$PREV_TAG" "HEAD")

# Save changelog to file if specified
if [ -n "$changelog_file" ]; then
    echo "$CHANGELOG" >"$changelog_file"
    echo "✅ Changelog saved to $changelog_file"
fi

# Commit the version change
git add manifest.json
if [ -n "$changelog_file" ]; then
    git add "$changelog_file"
fi
git commit -m "Release version to $VERSION"

# Create and push the tag
git tag $TAG_NAME
git push origin main
git push origin $TAG_NAME

echo "✅ Released version $VERSION!"
echo "  - Created and pushed tag: $TAG_NAME"
echo "  - The GitHub workflow will now create the release automatically"
echo "  - Check the workflow status at: https://github.com/kzamanbd/ai-extension/actions"

# Display preview of the changelog
echo ""
echo "📝 Changelog Preview:"
echo "$CHANGELOG"
