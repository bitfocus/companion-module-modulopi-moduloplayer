# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a Bitfocus Companion module for ModuloPi ModuloPlayer - a media server control system. It integrates Companion with ModuloPlayer and an optional Spydog monitoring daemon via WebSocket/JSON-RPC connections.

## Commands

```bash
yarn          # Install dependencies (requires yarn 4, node ^22.14)
yarn dev      # Watch mode (TypeScript compile to dist/)
yarn build    # Production build (cleans dist/ first)
yarn package  # Build + package for Companion distribution
yarn lint     # ESLint
yarn format   # Prettier
```

## Architecture

### Module entry point

`src/main.ts` — `MPinstance` extends `InstanceBase<ModuloPlayConfig>`. All shared state lives here and is accessed by all other classes via `this.instance`. Companion calls `init()` → `configUpdated()` → `updateInstance()`.

### Connection classes

`MPconnection` (port `config.mpPort`) and `SDconnection` (port `config.sdPort`) manage WebSocket lifecycle:
- Auto-reconnect on close/error with exponential back-off (100ms → 16.5s)
- On open: sets `instance.mpConnected`/`sdConnected`, calls `instance.isConnected()` and `instance.initPolling()`
- Incoming messages are delegated to `ModuloPlayer.messageManager()` or `SpyDog.messageManager()`

### JSON-RPC message routing

`ModuloPlayer` and `SpyDog` parse the `id` field of incoming JSON-RPC responses to route them:

| id  | Meaning |
|-----|---------|
| 1   | Task list response |
| 3   | Playlist+cues response |
| 110 | Current cue / goto response (also updates fader/audio variables) |
| 120 | Grand Master Fader response |
| 130 | Audio Master response |
| 200 | Spydog dynamic info |
| 201 | Spydog static info |

Outgoing commands with `"id": 0` don't expect a tracked response.

### State and variable naming convention

Runtime state is stored in `instance.states` (flat key-value dict). Variables and state keys follow UUID-based naming (curly braces stripped via `cleanUUID()`):

- `pl_<uuid>_currentIndex` — current cue index for a playlist
- `pl_<uuid>_grandMasterFader` — GM fader (0–100)
- `pl_<uuid>_audioMaster` — audio master (0–100)
- `cue_<uuid>_name` / `cue_<uuid>_color`
- `tl_<uuid>_name` / `tl_<uuid>_color`
- Spydog dynamic/static keys map directly from API response field names (`cpuUse`, `fps`, `serverName`, etc.)

The Companion variable prefix is `Modulo_Player` (e.g. `$(Modulo_Player:fps)`).

### UI refresh flow

Whenever `tasksList` or `playLists` data changes, `moduloplayer.tasksListManager()` / `playListCuesManager()` compares with the existing array before calling `instance.updateInstance()`, which re-registers all actions, feedbacks, variables, and presets. This is necessary because actions use `instance.dropdownPlayList` (built from `playLists`) as dropdown choices.

### Action pattern for playlist-scoped actions

Actions store the playlist as a numeric dropdown index (`pl: "0"`, `"1"`, …). At callback time they look up `instance.dropdownPlayList[id]` to get the UUID for the JSON-RPC call. The hidden `plUUID` fields in action options are legacy/unused.

### Spydog integration

Spydog is optional (`config.sdEnable`). When enabled, `SDconnection` connects to a separate port and `SpyDog` provides computer monitoring (CPU, GPU, memory, FPS, temperatures) and OS-level actions (start/stop ModuloPlayer, reboot, power off). Spydog variables and presets are only registered when `sdConnected` is true.

### Polling

`instance.initPolling()` sets up a `setInterval` (minimum 100ms, 0 = disabled) that calls `updatPolling()`, which polls current cues, tasks, playlists (MP) and dynamic info (Spydog) on each tick.

## Configuration fields (`src/configFields.ts`)

- `host`: Target IP
- `mpPort`: ModuloPlayer WebSocket port
- `sdPort`: Spydog WebSocket port
- `sdEnable`: Enable Spydog connection
- `pollInterval`: ms between polls (0 = disabled)

## Adding new actions / feedbacks

1. Add the send method to `ModuloPlayer` or `SpyDog`
2. If it expects a response, assign a new unique `id` and add a case in `messageManager()`
3. Register the action in `src/actions.ts` → `UpdateActions()`
4. Register any feedback in `src/feedbacks.ts` → `UpdateFeedbacks()`
5. Add a preset to `src/presets.ts` if applicable
6. Add variable definitions in `src/variables.ts` if new variables are introduced

## Testing

No automated tests. Testing requires a running Companion instance with the module loaded.
