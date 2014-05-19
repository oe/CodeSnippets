:: This batch file can remove precompile files, such as coffee, less
:: could be used in front-end development
@echo off
set npath=%cd%_publish__
:: remove the dest director 
rd "%npath%" /s/q
:: copy file to dest
xcopy "%cd%" "%npath%" /e/i/q
cd "%npath%"
:: delete precompile file
del *.coffee /f/s/q
del *.less /f/s/q
del "publish.cmd" /f/s/q
:: open dests
start explorer "%npath%"