#!/bin/bash

if [ $# -lt 2 ]; then
    echo "Usage: $0 <user> <process>"
    exit 1
fi

user=$1
process=$2

sudo -u "$user" pm2 start "$process"

