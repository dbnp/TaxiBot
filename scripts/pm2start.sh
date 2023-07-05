#!/bin/bash

# Define an associative array where the key is the username and the value is an array of process names
declare -A processes=(
#    ["user1"]="process1"
    ["user2"]="process2"
    ["user3"]="process3"
#    ["user4"]="process4 process5"
)

# Loop through the users and start the specified processes with PM2 using sudo
for user in "${!processes[@]}"; do
    process_names=${processes[$user]}
    read -ra process_array <<< "$process_names"
    for process in "${process_array[@]}"; do
        sudo -u "$user" pm2 start "$process"
    done
done

