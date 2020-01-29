const mysqldump = require('mysqldump');
const azure = require('azure-storage');
const uniqid = require('uniqid');
const cron = require('node-cron');
const fs = require('fs');

require('dotenv').config();

const blob = azure.createBlobService(process.env.AZURE_CONNECTION_STRING);

cron.schedule('* * * * *', () => {
    const now = new Date;
    const backupName = 'backup_' + now.getDate() + "-" + now.getMonth() + 1 + "-" + now.getFullYear() + '_' + uniqid.time() + '.sql.gz';
    backup(backupName);
},{
    scheduled: true,
    timezone: "America/Sao_Paulo"
});

let backup = async (backupName) => {
    const result = await mysqldump({
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE,
        },
        dumpToFile: backupName,
        compressFile: true,
    });

    upload(backupName);
}

let upload = (backupName) => {
    blob.createBlockBlobFromLocalFile(process.env.AZURE_CONTAINER_NAME, backupName, backupName, function(error, result, response) {
        if (!error) {
          remove(backupName);
        }
    });
}

let remove = (backupName) => {
    try {
        fs.unlinkSync(backupName);
      } catch(err) {
        
      }
}

