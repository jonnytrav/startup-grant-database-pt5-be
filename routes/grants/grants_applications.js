const db = require('../../database/DbConfig.js');

module.exports = {
    find
}

function find() {
    return db('grant_applications');
}