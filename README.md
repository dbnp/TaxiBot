# TaxiBot

This Bot requires the latest discord.js (v14), SQLite3, Node.js & NPM. PM2 is a process manager that I utilize and have provided scripts for as well.

SQLite will handle our user database, while our bot will exist on and communicate through our Node server. PM2 is a process manager that allows us to control node processes in a more user-friendly way. More on this later.

# To install Node:

1. `sudo apt update`

2. `sudo apt upgrade -y`

3. `sudo apt install nodejs`

4. `node -v`
This line tells us whether it installed properly and displays the version

# Install NPM

1. `sudo apt install npm`

# Setup your project folder

We need to create a project folder. If you want to specify project details, run:

1. `npm init`

2. If you want to have it fill out default values, simply enter:

3. `npm init -y`

# Install discord.js & SQLite3

1. `npm install discord.js`