#!/bin/bash

# Stop and remove existing container
docker stop missioncompleteweb || true
docker rm missioncompleteweb || true

# Pull latest changes
git pull origin main

# Build new image
docker build -t missioncompleteweb:latest .

# Run new container
docker run -d \
  --name missioncompleteweb \
  --restart unless-stopped \
  --env-file env.docker \
  -p 8085:80 \
  missioncompleteweb:latest

# Clean up old images
docker image prune -f 