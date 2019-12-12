#!/bin/sh
set -e

export FLASK_ENV=testing
export FLASK_APP=./run.py
export PYTHONDONTWRITEBYTECODE=1
rm -r ./migrations
flask db init
flask db migrate
flask db upgrade
flask seed roles
flask seed tags
python -m pytest 
