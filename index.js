const mysqldump = require('mysqldump');
const azure = require('azure-storage');
const blob = azure.createBlobService('DefaultEndpointsProtocol=https;AccountName=reinfdb;AccountKey=uFJ7zGJpbRSY2obzU/uI/uQKpOJ9FMCfiHOzj7pl1U8zPWyAHtoiWWBQ553wGcat9G1Sph0HO98+L4QGHufuNg==;EndpointSuffix=core.windows.net');

const now = new Date;
const backupName = 'backup_' + now.getDate() + "-" + now.getMonth() + 1 + "-" + now.getFullYear() + '_' + now.getTime();

// Dump File
let backup = async () => {
    const result = await mysqldump({
        connection: {
            host: 'localhost',
            user: 'root',
            password: 'c45dm@5102',
            database: 'logs',
        },
        dumpToFile: './dump.sql.gz',
        compressFile: true,
    });

    console.log(result);
}

let upload = () => {
    blob.createBlockBlobFromLocalFile('reinf-prd', backupName, 'dump.sql.gz', function(error, result, response) {
        if (!error) {
          console.log('Upload has been send');
          console.log(result);
        } else {
            console.log('Upload failed');
            console.log(error);
        }
    });
}

backup();
upload();