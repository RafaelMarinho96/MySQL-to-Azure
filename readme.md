# MySQL Dump to Azure Storage Blob
##### A windows service builded with nodejs

This service was created to run on a Windows machine. Below are the requirements.

- Windows Machine
- Nodejs 
- MySQL

## How to configure?


##### Step 1
Clone or download this repository, then create a file with the extension .env in the root path, the file must contain the following parameters.

AZURE_CONNECTION_STRING=<Connection string from your blob storage>
AZURE_CONTAINER_NAME=<Name of your azure container>
DB_HOST=<Host from MySQL>
DB_USER=<User from MySQL>
DB_PASS=<Password from MySQL>
DB_DATABASE=<Database from MySQL>
SERVICE_NAME=<Windows Service Name>
SERVICE_DESCRIPTION=<Description of your service>
SCRIPT_NAME=<Script name, default value is app.js>

Replace all values between <>.

##### Step 2
On app.js file find to cron schedule function, and replace the followings parameters.

`* * * * *`

This link contains the description to each * parameter.
Link: https://www.npmjs.com/package/node-cron

##### Step 3
Open nodejs terminal and navigate to code path, after that run the following command.

`node install.js`

For uninstall just run this command.

`node uninstall.js`

This command will create the windows service.

##### Step 4
Get into on windows services and find to "MySQL Blob", check if it is running.

So, that is it.



