@echo off
echo ========================================
echo   SAJU AI - GitHub Push Script
echo ========================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo Git이 설치되어 있지 않습니다.
    echo https://git-scm.com/download/win 에서 다운로드하세요.
    echo 설치 후 이 스크립트를 다시 실행하세요.
    pause
    exit /b
)

echo Git 확인 완료!
echo.

REM Initialize and push
git init
git add .
git commit -m "saju-ai v3 complete"

echo.
echo ========================================
echo  GitHub 저장소 URL을 입력하세요
echo  예: https://github.com/Wedsaqwe/saju-ai.git
echo ========================================
set /p REPO_URL="URL: "

git remote add origin %REPO_URL%
git branch -M main
git push -u origin main --force

echo.
echo ========================================
echo  완료! Vercel에서 자동으로 재배포됩니다.
echo ========================================
pause
