@echo off
echo.
echo ========================================
echo 欢迎使用 EPUB 电子书阅读器
echo ========================================
echo.

:: 检查 Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 请先安装 Node.js (v16 或更高版本)
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [信息] Node.js 已安装: %NODE_VERSION%

:: 检查 npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 请先安装 npm
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo [信息] npm 已安装: %NPM_VERSION%

:: 安装前端依赖
echo.
echo [信息] 正在安装前端依赖...
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 前端依赖安装失败
    pause
    exit /b 1
)
echo [成功] 前端依赖安装完成
cd ..

:: 安装后端依赖
echo.
echo [信息] 正在安装后端依赖...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 后端依赖安装失败
    pause
    exit /b 1
)
echo [成功] 后端依赖安装完成
cd ..

echo.
echo ========================================
echo [成功] 安装完成！
echo ========================================
echo.
echo 接下来请在两个不同的终端中运行:
echo.
echo 终端 1 - 前端开发服务器:
echo   cd frontend ^&^& npm run dev
echo.
echo 终端 2 - 后端开发服务器:
echo   cd backend ^&^& npm run dev
echo.
echo 然后在浏览器中打开: http://localhost:3000
echo.
pause
