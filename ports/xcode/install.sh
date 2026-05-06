#!/usr/bin/env bash
# Install Makinda Themes for Xcode.
#
# Copies both .xccolortheme files into Xcode's user themes directory:
#   ~/Library/Developer/Xcode/UserData/FontAndColorThemes/
#
# Run from this directory:
#   chmod +x install.sh && ./install.sh

set -euo pipefail

DEST="$HOME/Library/Developer/Xcode/UserData/FontAndColorThemes"
SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

mkdir -p "$DEST"

for f in "Makinda Light.xccolortheme" "Makinda Dark.xccolortheme"; do
    if [[ ! -f "$SRC/$f" ]]; then
        echo "missing: $SRC/$f" >&2
        exit 1
    fi
    cp "$SRC/$f" "$DEST/$f"
    echo "installed: $DEST/$f"
done

echo
echo "Restart Xcode, then choose: Xcode → Settings → Themes → Makinda Light / Dark."
