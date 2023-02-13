#!/bin/bash

DEPLOY_REPO='../../app/'

# build artifacts
npm run build

# cleanup deploy repository
rm -rf $DEPLOY_REPO/static
rm -f $DEPLOY_REPO/*.json
rm -f $DEPLOY_REPO/*.txt
rm -f $DEPLOY_REPO/*.png
rm -f $DEPLOY_REPO/*.html
rm -f $DEPLOY_REPO/*.ico

# move to deploy repository
cp -r build/* $DEPLOY_REPO

git add .
git commit -m "deploying code..."
git push