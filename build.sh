#!/bin/bash

# Get package versions
PACKAGE_NAME=$(sed -nE 's/^\s*"name": "(.*?)",$/\1/p' package.json)
PACKAGE_VERSION=$(sed -nE 's/^\s*"version": "(.*?)",$/\1/p' package.json)

# Directories
DIST_DIR="dist"
LINUX_DIR="${PACKAGE_NAME}-${PACKAGE_VERSION}-linux-x64"
OSX_DIR="${PACKAGE_NAME}-${PACKAGE_VERSION}-mac-x64"
LINUX_ARCHIVE_FILE="${DIST_DIR}/${LINUX_DIR}.tar.xz"
OSX_ARCHIVE_FILE="${DIST_DIR}/${OSX_DIR}.tar.xz"

######################################################################
# Functions
#
make_linux_archive() {
  # Create tar.xz file
  echo "-> Create Linux_x64 archive..."
  tar -C "$DIST_DIR" -cJf "$LINUX_ARCHIVE_FILE" "$LINUX_DIR"
}

make_osx_archive() {
  # Create tar.xz file
  echo "-> Create Mac_x64 archive..."
  tar -C "$DIST_DIR/$OSX_DIR" -cJf "$OSX_ARCHIVE_FILE" "${PACKAGE_NAME}.app"
}

make_linux_installer() {
  echo "-> Create Linux_x64 installer..."
  INSTALLER_FILE="$DIST_DIR/installer-${LINUX_DIR}.run"
  cp ./scripts/linux_installer.sh "$INSTALLER_FILE"
  sed -i "s/{{PACKAGE_NAME}}/${PACKAGE_NAME}/g" "$INSTALLER_FILE"
  sed -i "s/{{PACKAGE_VERSION}}/${PACKAGE_VERSION}/g" "$INSTALLER_FILE"
  sed -i "s/{{APP_DIR}}/${LINUX_DIR}/g" "$INSTALLER_FILE"

  # Append archive to installer script
  cat "$LINUX_ARCHIVE_FILE" >> "$INSTALLER_FILE"
  chmod +x "$INSTALLER_FILE"
}

make_linux_uninstaller() {
  echo "-> Create Linux_x64 uninstaller..."
  UNINSTALL_FILE="${DIST_DIR}/${LINUX_DIR}/uninstall.sh"
  cp ./scripts/linux_uninstaller.sh "$UNINSTALL_FILE"
  sed -i "s/{{PACKAGE_NAME}}/${PACKAGE_NAME}/g" "$UNINSTALL_FILE"
  sed -i "s/{{PACKAGE_VERSION}}/${PACKAGE_VERSION}/g" "$UNINSTALL_FILE"
  chmod +x "$UNINSTALL_FILE"
}

######################################################################
# Entry Point
#

# Run build script
npm run build:x64

# Fix permissions for Linux
chmod +x "${DIST_DIR}/${LINUX_DIR}/chrome_crashpad_handler"

# Make uninstall script for linux
make_linux_uninstaller

# Remove credits files
rm "$DIST_DIR/$LINUX_DIR/credits.html"
rm "$DIST_DIR/$OSX_DIR/credits.html"

# Make archives
make_linux_archive &
make_osx_archive &
wait

# Make Installer script for linux
make_linux_installer
wait

echo ""
echo "Build complete."
echo ""
