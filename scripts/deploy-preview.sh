#!/usr/bin/env bash
# Déploie la preview sur GitHub Pages (branche gh-pages).
# Usage : pnpm deploy:preview
set -e
cd "$(dirname "$0")/.."

echo "▸ Build…"
pnpm build
touch dist/.nojekyll

echo "▸ Publication sur gh-pages…"
cd dist
rm -rf .git
git init -q -b gh-pages
git config user.name "AnonymousKane"
git config user.email "86795824+SergeiBasnya@users.noreply.github.com"
git add -A
git commit -q -m "deploy: build statique"
git remote add origin https://github.com/SergeiBasnya/etre-guerisseurs.git
git push -f origin gh-pages

echo "✓ En ligne : https://sergeibasnya.github.io/etre-guerisseurs/"
