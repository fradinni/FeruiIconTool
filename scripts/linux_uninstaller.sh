#!/bin/bash

USER_DIR="$(getent passwd $SUDO_USER | cut -d: -f6)"

# Delete installation folder
INSTALL_DIR="/opt/{{PACKAGE_NAME}}/{{PACKAGE_NAME}}-{{PACKAGE_VERSION}}-linux-x64"
rm -rf "$INSTALL_DIR"

# Remove desktop file
DESKTOP_FILE="$USER_DIR/.local/share/applications/{{PACKAGE_NAME}}-{{PACKAGE_VERSION}}.desktop"
rm "$DESKTOP_FILE"