#!/usr/bin/env bash

set -o errexit  # exit on error

pip install -r requirements.txt

npm install --force

python genomics_browser_django_project/manage.py migrate