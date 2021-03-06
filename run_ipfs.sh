#!/bin/bash

dir=`pwd`
ipfs_staging="$dir/data/staging"
ipfs_data="$dir/data"

echo $ipfs_staging
echo `pwd`

docker run -d --name ipfs_host -v $ipfs_staging:/export -v $ipfs_data:/data/ipfs -p 4001:4001 -p 127.0.0.1:8080:8080 -p 127.0.0.1:5001:5001 ipfs/go-ipfs:latest
