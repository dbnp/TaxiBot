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

If you want to have it fill out default values, simply enter:

2. `npm init -y`

# Install discord.js & SQLite3

1. `npm install discord.js`

# Modify variables

You will need to define paths and variable IDs for certain functions or the bot won't work. To quickly find what you need to edit, ctrl + f search '_here' to identify them. 

main.js needs your bot's token as well, or it will be angry and spit errors at you.

# Set up your Discord Bot:

1. First, we need to create a new application on the Discord Developer Portal and get the bot token:
   - Visit https://discord.com/developers/applications.
   - Click on `New Application`.
   - Name your application and click `Create`.
   - Go to `Bot` tab on the left and click `Add Bot`. Confirm the popup by clicking `Yes, do it!`.
   - Note down the bot token, you'll need it later.

2. Second, we need to invite the bot to your server:
   - In the same application page, go to the `OAuth2` tab.
   - In the `Scopes` section, check `bot`.
   - In the `Bot Permissions` section, check `Send Messages`, `Read Message History`, `Mention Everyone`, and `Embed Links`.
   - Copy the generated URL and open it in your web browser to invite the bot to your server.

# Test the bot

You should now be able to run `node main.js` in your terminal from the project directory. If there are errors, the console will let you know.

# PM2

To setup PM2 for easier process management, follow these steps:

1. `pm2 start "node /path/to/main.js" --name foundry`

The `--name` parameter will simply name the process, identifying the process by the specified name when listed.

Setting up PM2 isn't difficult, but may be outside of the scope of this installation and instruction. If you have made it this far and wish to set up PM2 and use the scripts I have provided, reach out to me and I will see about making it work for you.