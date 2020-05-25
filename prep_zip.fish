npm run build
mkdir -p  /tmp/privacy-code-tools-zip
cp -nR .ebextensions /tmp/privacy-code-tools-zip
cp -nR coder /tmp/privacy-code-tools-zip
pipenv run pip freeze > /tmp/privacy-code-tools-zip/requirements.txt
cp -nR manage.py /tmp/privacy-code-tools-zip
rm -rf /tmp/privacy-code-tools-zip/coder/frontend/src
cp -n .prodenv /tmp/privacy-code-tools-zip/coder/.env
zip -r /tmp/privacy-code-tools.zip /tmp/privacy-code-tools-zip
