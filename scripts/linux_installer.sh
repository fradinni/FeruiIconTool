#!/bin/bash

echo ""
echo "Ferui Icon Tool - Command Line Installer"
echo ""
USER_DIR="$(getent passwd $SUDO_USER | cut -d: -f6)"

# Create destination folder
DESTINATION="/opt/{{PACKAGE_NAME}}"
mkdir -p ${DESTINATION}

# Find __ARCHIVE__ maker, read archive content and decompress it
ARCHIVE=$(awk '/^__ARCHIVE__/ {print NR + 1; exit 0; }' "${0}")
tail -n+${ARCHIVE} "${0}" | tar xpJv -C ${DESTINATION}

# Create desktop file entry
DESKTOP_FILE="$USER_DIR/.local/share/applications/{{PACKAGE_NAME}}-{{PACKAGE_VERSION}}.desktop"
echo "[Desktop Entry]
Name=FerUI Icon Tool (v{{PACKAGE_VERSION}})
Comment=FerUI Icon Tool
Icon=${DESTINATION}/{{APP_DIR}}/assets/icon.png
Exec=${DESTINATION}/{{APP_DIR}}/FeruiIconTool
Terminal=false
Type=Application
Categories=Development;IDE;
StartupWMClass=FeruiIconTool
StartupNotify=true
" > "$DESKTOP_FILE"

chown $SUDO_USER:$SUDO_USER "$DESKTOP_FILE"
chmod a+x "$DESKTOP_FILE"

echo ""
echo "Installation complete."
echo ""

# Exit from the script with success (0)
exit 0

__ARCHIVE__
