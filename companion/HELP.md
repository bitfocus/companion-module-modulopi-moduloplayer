## Modulo PI | Modulo Player

This module connects to a Modulo Player and optionally to a Spydog monitoring daemon.

## ACTIONS

#### Task

- Launch Task

#### Playlist

- Goto Cue
- Preload Cue
- Next Cue
- Prev Cue
- Play
- Pause
- Grand Master Fader (set value)
- Grand Master Fader Add (rotary +)
- Grand Master Fader Remove (rotary -)
- Audio Master (set value)
- Audio Master Add (rotary +)
- Audio Master Remove (rotary -)

#### Show

- Save
- Backup
- Rescan Medias
- Rescan Medias Force
- Remove Missing Medias
- Send Show to All Remotes

#### Spydog

- Start Modulo Player
- Stop Modulo Player
- Reboot Modulo Player
- Power Off Modulo Player

## FEEDBACKS

#### Task

- Color Task — sets button background color from the task's color in ModuloPlayer

#### Playlist

- Color Cue — sets button background color from the cue's color in ModuloPlayer
- PlayList Current Cue — highlights the button when the cue is the active one

#### Spydog

- Modulo Player Status — highlights based on offline / launching / online state
- Modulo Player Master — highlights based on master or slave role
- Color Player — sets button background from the server's assigned color
- FPS Player — green when FPS is correct, red otherwise
- Memory Use — green < 50 %, orange 50–90 %, red > 90 %
- CPU Use — green < 50 %, orange 50–90 %, red > 90 %

## PRESETS

#### Tasks List

- One button per task — launches the task, shows its name and color

#### Playlist (one category per playlist)

- Play
- Pause
- Next Cue (with icon)
- Prev Cue (with icon)
- Grand Master Fader 0%
- Grand Master Fader 100%
- Grand Master Fader Rotate (rotary encoder)
- Audio Master 0%
- Audio Master 100%
- Audio Master Rotate (rotary encoder)
- Goto Cue — one button per cue
- Preload Cue — one button per cue
- Grand Master Fader variable display
- Audio Master variable display

#### Show

- Save
- Backup
- Rescan Medias
- Rescan Medias Force
- Remove Missing Medias
- Send Show to All Remotes

#### Spydog

- Reboot Server
- Power Off Server
- Start Modulo Player
- Stop Modulo Player

#### Variables

- Status (offline / launching / online feedback)
- Server Name — Master or Slave
- FPS
- Memory Use
- CPU Use
- One button per dynamic info field
- One button per static info field

## VARIABLES

#### Per Playlist (UUID-based)

- `pl_<uuid>_currentIndex` — current active cue index
- `pl_<uuid>_grandMasterFader` — Grand Master Fader value (0–100)
- `pl_<uuid>_audioMaster` — Audio Master value (0–100)

#### Per Cue (UUID-based)

- `cue_<uuid>_name` — cue name
- `cue_<uuid>_color` — cue color (integer)

#### Per Task (UUID-based)

- `tl_<uuid>_name` — task name
- `tl_<uuid>_color` — task color (integer)

#### Spydog Static Info

- `CPU` — CPU model
- `GpuBrand` — GPU manufacturer
- `GpuDriver` — GPU driver version
- `GpuName` — GPU model name
- `ModuloPlayer` — ModuloPlayer application version
- `OS` — Windows version
- `processorCount` — number of logical processor cores
- `totalMemory` — total RAM (GB)

#### Spydog Dynamic Info

- `clusterId` — cluster ID of the server
- `color` — color assigned to the server
- `cpuTemperature` — CPU temperature
- `cpuUse` — CPU usage (%)
- `detacastTemperature` — Deltacast card temperature (or "No Deltacast")
- `fps` — current FPS output
- `fpsOk` — whether FPS output is correct
- `gpuTemperature` — GPU temperature
- `lockStatus` — genlock status
- `master` — master/slave role
- `maxAutocalibOutputs` — max autocalibration outputs (license)
- `maxOutputs` — max outputs (license)
- `memoryUse` — memory usage (%)
- `motherboardTemperature` — motherboard sensor temperature
- `serverIp` — server IP address
- `serverName` — server name for the current project
- `serverTime` — server date and time
- `status` — offline, launching or online
- `upTime` — time since last boot

*
