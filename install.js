const service = require('node-windows').Service;

let svc = new service({
    name: 'mysqlblobdump',
    description: 'Upload mysql backups to azure blob',
    script: ''
})

svc.on('install', function() {
    svc.start();
})

svc.install();