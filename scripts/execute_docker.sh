#!/bin/bash
cd ../../
cd P_PrisionerDB
NODE_PORT=$1 DB_PORT=$2 docker-compose stop
echo "y" | NODE_PORT=$1 DB_PORT=$2 docker-compose rm
NODE_PORT=$1 DB_PORT=$2 docker-compose up -d