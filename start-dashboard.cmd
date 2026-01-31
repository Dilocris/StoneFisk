@echo off
setlocal
cd /d "%~dp0"

rem Start Next.js dev server in a minimized window.
start "StoneFisk Dev" /min cmd /c "call npm.cmd run dev"

rem Wait for the server to be reachable.
powershell -NoProfile -Command "for ($i=0; $i -lt 30; $i++) { try { $r=Invoke-WebRequest -UseBasicParsing http://localhost:3000; if ($r.StatusCode -ge 200) { break } } catch {} ; Start-Sleep -Milliseconds 500 }"

rem Launch app window in Edge and wait for it to close.
powershell -NoProfile -Command "$edge=(Get-Command msedge.exe -ErrorAction SilentlyContinue); if (-not $edge) { Start-Process 'http://localhost:3000'; Write-Host 'Close this window to stop the server.'; exit 0 }; $p=Start-Process msedge.exe -ArgumentList '--app=http://localhost:3000' -PassThru; Wait-Process -Id $p.Id"

rem Stop the dev server when the app window closes.
powershell -NoProfile -Command "Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'node.exe' -and $_.CommandLine -match 'next\\s+dev' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"
