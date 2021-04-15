const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFile = (files, validExtensions = ['png', 'jpg', 'jpeg', 'gif'], folder = '') => {

    return new Promise((resolve, reject) => {
        const { file } = files;
        const cutName = file.name.split('.');
        const extension = cutName[cutName.length - 1];

        if (!validExtensions.includes(extension)) {
            return reject(`La extensión ${extension} no está permitida, las extensiones permitidas son ${validExtensions}`);
        }

        const fileName = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', folder, fileName);

        file.mv(uploadPath, (error) => {
            if (error) {
                reject(error);
            }

            resolve(fileName);
        });
    });

}

module.exports = {
    uploadFile
}