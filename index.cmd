@echo off
cls
pushd root
where node >nul 2>&1 && call :runScript || goto no_node
popd
exit/b
:runScript
node index.js
exit/b
:no_node
echo Please install NodeJS. Redirecting ...
start https://nodejs.org/
echo Press any key to exit.
popd
pause>nul
