#!/bin/bash

# List of usernames
USERNAMES=("user1" "user2" "user3")

# Iterate over each username
for USERNAME in "${USERNAMES[@]}"
do
    echo "Processes for user: $USERNAME"
    sudo -u $USERNAME pm2 list
    echo
done

