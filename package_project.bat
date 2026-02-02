@echo off
echo Packaging WebBlaster Project...
echo --------------------------------

set WINRAR_PATH="C:\Program Files\WinRAR\WinRAR.exe"

if not exist %WINRAR_PATH% (
    set WINRAR_PATH="C:\Program Files (x86)\WinRAR\WinRAR.exe"
)

if not exist %WINRAR_PATH% (
    echo [ERROR] WinRAR not found.
    pause
    exit /b
)

echo Found WinRAR at: %WINRAR_PATH%

rem Clean up
if exist "WebBlaster_Build.zip" del "WebBlaster_Build.zip"
if exist "dist" rmdir /s /q "dist"

echo.
echo [1/3] Creating Staging Area (dist)...
mkdir dist

echo [2/3] Copying Specific Files...

rem -- Root Files
copy /y manifest.json dist\
copy /y popup.html dist\
copy /y welcome.html dist\
copy /y index.html dist\

rem -- Directories
rem -- Directories
xcopy /s /y /i css dist\css
xcopy /s /y /i js dist\js
xcopy /s /y /i scenarios dist\scenarios

rem -- Sounds (Only MP3, exclude WAV dev files)
mkdir dist\sounds
copy /y sounds\*.mp3 dist\sounds\

rem -- Images (Only PNG, avoid promo GIFs)
mkdir dist\images
copy /y images\*.png dist\images\

echo.
echo [3/3] Compressing 'dist' folder...
cd dist
%WINRAR_PATH% a -afzip -r ..\WebBlaster_Build.zip *
cd ..

rem Cleanup dist
rmdir /s /q "dist"

echo.
if exist "WebBlaster_Build.zip" (
    echo [SUCCESS] Optimized Build Created: WebBlaster_Build.zip
) else (
    echo [ERROR] Build creation failed.
)

pause
