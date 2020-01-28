const Service = require('node-windows').Service;

let svc = new Service({
    name: '<script-name>',
    description: 'Upload mysql backups to azure blob',
    script: '<script-path>'
})

svc.on('install', function() {
    svc.start();
})

svc.install();