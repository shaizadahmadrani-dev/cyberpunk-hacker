# Plays the theme's typing sounds on Windows, where the engine has no audio player of its own.
# The mod writes a line, a stamp then a sound name, to the signal file on each key; this plays that sound's .wav
# from the sounds folder when the line changes.
# Inputs, from the environment: TYPING_SOUNDS (folder of .wav files), TYPING_SIGNAL (the file), TYPING_PARENT (a pid
# to outlive: when it is gone, this ends too).
$ErrorActionPreference = 'Stop'

$soundsDir = $env:TYPING_SOUNDS
$signal = $env:TYPING_SIGNAL
$parentId = 0
[void][int]::TryParse($env:TYPING_PARENT, [ref]$parentId)

$players = @{}
foreach ($file in Get-ChildItem -LiteralPath $soundsDir -Filter '*.wav') {
  $player = New-Object System.Media.SoundPlayer $file.FullName
  $player.Load()
  $players[$file.BaseName] = $player
}

$folder = [IO.Path]::GetDirectoryName($signal)
[void][IO.Directory]::CreateDirectory($folder)
if (-not [IO.File]::Exists($signal)) {
  [IO.File]::WriteAllText($signal, '0 none')
}

# What the file already says was played before this started.
$last = [IO.File]::ReadAllText($signal)

$watcher = New-Object System.IO.FileSystemWatcher $folder, ([IO.Path]::GetFileName($signal))
$watcher.NotifyFilter = [IO.NotifyFilters]'LastWrite, Size, FileName'
Write-Output ('ready: ' + $players.Count + ' sounds')

while ($true) {
  # Wakes on a change, or every 250 ms to catch one it missed and to check the parent.
  $change = $watcher.WaitForChanged([IO.WatcherChangeTypes]::All, 250)

  try {
    $text = [IO.File]::ReadAllText($signal)
  } catch {
    continue
  }

  if ($text -ne $last) {
    $last = $text
    $sound = ($text -split ' ', 2)[1]

    if ($sound) {
      $sound = $sound.Trim()
      if ($players.ContainsKey($sound)) {
        $players[$sound].Play()
      }
    }
  }

  if ($change.TimedOut -and $parentId -gt 0 -and -not (Get-Process -Id $parentId -ErrorAction SilentlyContinue)) {
    break
  }
}
