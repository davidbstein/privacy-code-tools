#!/usr/bin/env fish
cp -r coder/frontend/static/ .static/; cp -r coder/static/ .static/
pipenv run eb deploy
