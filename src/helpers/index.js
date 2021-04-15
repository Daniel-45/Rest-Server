const databaseValidators = require('./database-validators');
const generateJWT = require('./generate-jwt');
const googleVerify = require('./google-verify');
const uploadFile = require('./upload-file');

module.exports = {
    ...databaseValidators,
    ...generateJWT,
    ...googleVerify,
    ...uploadFile
}