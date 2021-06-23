#!/usr/bin/env fish
npm run build
npm run dev
yes | pipenv run python manage.py collectstatic
pipenv run eb deploy
