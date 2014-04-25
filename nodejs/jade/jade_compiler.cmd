@echo off
title Jade compile
::compile
set np=
set op=
for %%f in (*.jade) do (
  if exist "%%~nf%"*.json (
    echo compile with json
    for %%i in ("%%~nf%"*.json) do (
      REM -o ..
      echo oh  %%i
      call jade -P %%f -O "%%i%"
      :: error when rename T_T
      if exist "%%~nf%.html" rename "%%~nf%.html" "%%~ni%.html"
    )
  ) else (
    echo compile without json
    REM -o ..
    call jade -P %%f 
  )
)



echo "all done!!"
pause
