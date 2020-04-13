#!/bin/bash
find . -type f \
    -not -path "./.git/*" \
    -not -path "./node_modules/*" \
    -print0 | xargs -0 dos2unix