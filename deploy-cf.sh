#!/usr/bin/env bash
# Manual deploy: santaclaritaopenhouses.com -> Cloudflare Pages.
# Host = Cloudflare Pages, project "santaclaritaopenhouses", account
# 8d19fd09c66903840c347da43306673e. The repo's netlify.toml and
# .github/deploy.yml.HOLD are Netlify-era leftovers and mean nothing now.
#
# Ships a CLEAN tree via `git archive`, so .git and internal files never reach
# the live site. Run after committing new posts.
#
# TWO GATES BEFORE YOU RUN THIS. `git archive HEAD` is a FULL-TREE REPLACE:
#   1. Sync gate. `git fetch` then confirm
#      `git rev-list --left-right --count origin/main...HEAD` returns `0 0`.
#      Deploying from a tree behind origin silently reverts other machines.
#   2. Live-only audit. Diff the live sitemap against the repo. Anything live
#      but not in the repo gets mirrored in FIRST, or this deploy deletes it.
#      On 2026-08-12 that audit found 25 live posts missing from this repo.
#
# Verify by CONTENT, never by status code. Cloudflare Pages serves its 404 page
# with HTTP 200 and a full HTML body, so a 200 proves nothing.
set -euo pipefail
cd "$(dirname "$0")"

# Two Cloudflare accounts are visible to this token (personal + honorelevate),
# so wrangler aborts in non-interactive mode unless the account is pinned.
export CLOUDFLARE_ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:-8d19fd09c66903840c347da43306673e}"

STAGE="$(mktemp -d)"
git archive HEAD | tar -x -C "$STAGE"
rm -f "$STAGE/netlify.toml" "$STAGE/README.md"
rm -rf "$STAGE/.github"

npx wrangler pages deploy "$STAGE" \
  --project-name santaclaritaopenhouses \
  --branch main \
  --commit-dirty=true
