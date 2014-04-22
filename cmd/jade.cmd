@echo off
title Jade compile
::compile
for %%f in (*.jade) do (
  if exist %%~nf%.json (
    echo compile with json
    call jade -P %%f -O %%~nf%.json :: -o ..
  ) else (
    echo compile without json
    call jade -P %%f ::-o ..
  )
)

::for %i in (*.*") do (echo %~fi)
REM set /p a=input something...
echo all done!!
pause
