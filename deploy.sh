#!/bin/bash
echo "Deploying BlueLogic Digital (Sky Blue Edition) to GitHub..."
git init || true
git branch -M main
git add .
read -p "Commit message: " msg
if [ -z "$msg" ]; then msg="Deploy BlueLogic Sky Blue Edition"; fi
git commit -m "$msg" || true
git remote add origin git@github.com:Pushkar268/BlueLogic.git || true
git push -u origin main
echo "Deployed. Visit: https://pushkar268.github.io/BlueLogic"
