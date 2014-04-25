@echo off

if exist "%~dp0\jaderun.js" (

  node "%~dp0\jaderun.js" %*
  echo.
  echo Yes, all is OK!

) else (

  echo.
  echo      Can't find jaderun.js in %~dp0
  echo.

)

pause
