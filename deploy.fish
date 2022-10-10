#!/usr/bin/env fish
npm run build
npm run dev
pipenv run python manage.py collectstatic --no-input
pipenv run eb deploy
