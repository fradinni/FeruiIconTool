# Ferui Icon Tool

# Install

## macOS x64
1. Download the `*-mac-x64.tar.xz` archive.
2. Extract the archive.
3. Move `*.app` directory to `Applications` folder.

## Linux x64

### Run portable archive
1. Download the `*-linux-x64.tar.xz` archive.
1. Extract the `tar.xz` archive
2. Run `./FeruiIconTool` executable

### Install on system
1. Download the `installer-*-linux-x64.run` file.
2. Run it as sudo: `sudo ./installer-*-linux-x64.run`.
3. FeruiIconTool is now available from application menu.

### Uninstall
1. Run as sudo: `sudo /opt/FeruiIconTool/FeruiIconTool-*-linux-x64/uninstall.sh`
2. Remove `/opt/FeruiIconTool` directory.

# Running Locally for development

## Requirements

Using NVM is highly recommended for managing multiple versions of Node/NPM.
- NodeJS v12.16.0

## Development

1. `nvm use` ( if you use NVM )
2. `npm install`
3. `npm run start`
4. Webpack will spin up (takes a moment) then a window will pop up


## Building for distribution

Run the `./build.sh` script. This will build Linux and macOS binaries.

# **IMPORTANT NOTE ABOUT BUILDS!!!**

They take a long time !