# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a Companion module for ModuloPi ModuloPlayer - a media server control system. The module provides integration between Bitfocus Companion and ModuloPlayer/Spydog systems via WebSocket connections.

## Architecture

### Core Components

- **MPinstance** (`src/main.ts`): Main instance class extending Companion's InstanceBase
- **MPconnection** (`src/mpconnection.ts`): WebSocket connection management for ModuloPlayer 
- **SDconnection** (`src/sdconnection.ts`): WebSocket connection management for Spydog
- **ModuloPlayer** (`src/moduloplayer.ts`): Handles ModuloPlayer-specific JSON-RPC commands and data processing
- **SpyDog** (`src/spydog.ts`): Manages Spydog system integration

### Connection Management

The module supports dual connections:
1. **ModuloPlayer connection**: Core media control functionality
2. **Spydog connection**: Optional monitoring system (can be disabled via config)

Connection states are tracked independently, with the module status reflecting both connections when Spydog is enabled.

### Data Flow

1. WebSocket connections established on init/config update
2. Periodic polling retrieves tasks, playlists, and current cue information  
3. JSON-RPC messages sent for control actions (play, pause, goto cue, etc.)
4. Received data updates internal state and triggers variable/feedback updates

### Key Data Structures

- `tasksList`: Available tasks from ModuloPlayer
- `playLists`: Playlist data with cues and current state
- `states`: Runtime state including current cue indices and fader levels
- `dropdownPlayList`: Formatted playlist data for action dropdowns

## Common Development Commands

```bash
# Install dependencies
yarn

# Development (watch mode)
yarn dev

# Build for production
yarn build

# Package module for Companion
yarn package

# Linting
yarn lint

# Format code
yarn format
```

## Configuration

Key config fields defined in `src/configFields.ts`:
- `host`: Target IP address
- `mpPort`: ModuloPlayer WebSocket port
- `sdPort`: Spydog WebSocket port  
- `sdEnable`: Enable/disable Spydog connection
- `pollInterval`: Polling interval in milliseconds (0 = disabled)

## Testing

No specific test commands are defined. The module is tested through Companion integration.