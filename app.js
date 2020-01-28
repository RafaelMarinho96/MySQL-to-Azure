const mysqldump = require('mysqldump');
const azure = require('azure-storage');
const uniqid = require('uniqid');
const cron = require('node-cron');
const fs = require('fs');
const blob = azure.createBlobService('<azure-blob-connection-string>');

cron.schedule('* * * * *', () => {
    console.log('Running schedule job');
    const now = new Date;
    const backupName = 'backup_' + now.getDate() + "-" + now.getMonth() + 1 + "-" + now.getFullYear() + '_' + uniqid.time() + '.sql.gz';
    backup(backupName);
},{
    scheduled: true,
    timezone: "America/Sao_Paulo"
});

// Dump File
let backup = async (backupName) => {
    const result = await mysqldump({
        connection: {
            host: '<database-host>',
            user: '<database-user>',
            password: '<database-pass>',
            database: '<database-name>',
        },
        dumpToFile: backupName,
        compressFile: true,
    });

    upload(backupName);
}

let upload = (backupName) => {
    blob.createBlockBlobFromLocalFile('<azure-container-name>', backupName, backupName, function(error, result, response) {
        if (!error) {
          console.log('Upload has been send');
          console.log(result);
          remove(backupName);
        } else {
            console.log('Upload failed');
            console.log(error);
        }
    });
}

let remove = (backupName) => {
    try {
        fs.unlinkSync(backupName)
        console.log('Removing');
      } catch(err) {
        console.error(err)
      }
}

