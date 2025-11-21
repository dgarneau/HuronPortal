#!/bin/bash

# Kudu deployment script for Node.js

# Helpers
exitWithMessageOnError () {
  if [ ! $? -eq 0 ]; then
    echo "An error has occurred during web site deployment."
    echo $1
    exit 1
  fi
}

# Prerequisites
if [[ ! -d node_modules ]]; then
  echo "Installing dependencies..."
  npm install --production
  exitWithMessageOnError "Failed to install dependencies"
fi

echo "Deployment successful!"
