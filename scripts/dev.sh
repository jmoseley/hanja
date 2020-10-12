#!/usr/bin/env bash
set -e

if vercel whoami 2>&1 | grep "The specified token is not valid" ; then
  vercel login
fi

yarn concurrently --kill-others "yarn:dev-*"
