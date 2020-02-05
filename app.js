const mysqldump = require('mysqldump');
const azure = require('azure-storage');
const uniqid = require('uniqid');
const cron = require('node-cron');
const moment = require('moment-timezone');
const fs = require('fs');

require('dotenv').config();

const blob = azure.createBlobService(process.env.AZURE_CONNECTION_STRING);

cron.schedule('10 15 * * *', () => {
    const now = new Date;
    const backupName = 'backup_' + now.getDate() + "-" + (now.getMonth() + 1) + "-" + now.getFullYear() + '_' + uniqid.time() + '.sql.gz';
    backup(backupName);
},{
    scheduled: true,
    timezone: "America/Sao_Paulo"
});

let backup = async (backupName) => {
    await mysqldump({
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
        retention();
      } catch(err) {
        
      }
}

let retention = () => {
    blob.listBlobsSegmented(process.env.AZURE_CONTAINER_NAME, null, function(error, blobs, response){
        blobs.entries.forEach(file => {
    
            let today = moment();
            let created = moment(file.creationTime);
    
            today.tz('America/Sao_Paulo');
            created.tz('America/Sao_Paulo');
    
            let diff = today.diff(created, 'days');
    
            if (diff > process.env.AZURE_RETENTION_POLICY){
                console.log(file.name);
                blob.deleteBlobIfExists(process.env.AZURE_CONTAINER_NAME, file.name, function(error, result, response){
                    if (!error){
                        console.log(result);
                    } else {
                        console.log(error);
                    }
                })
            }
        })
    });    
}

