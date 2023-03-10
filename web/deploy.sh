#!/bin/bash
set -xe

DEPLOY_REPO='../../app/'

# build artifacts
npm run build
# add custom 404s
cp ./build/index.html ./build/form/index.html

# cleanup deploy repository
rm -rf $DEPLOY_REPO/static
rm -f $DEPLOY_REPO/*.json
rm -f $DEPLOY_REPO/*.txt
rm -f $DEPLOY_REPO/*.png
rm -f $DEPLOY_REPO/*.html
rm -f $DEPLOY_REPO/*.ico

# move to deploy repository
cp -r build/* $DEPLOY_REPO

cd $DEPLOY_REPO
git add .
git commit -m "deploying code..."
git push

echo 'Complete'
