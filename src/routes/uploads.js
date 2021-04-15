const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields, validateFileUpload } = require('../middlewares');
const { 
    uploadFiles, 
    updateImage, 
    showImage, 
    updateImageCloudinary 
} = require('../controllers/uploads');
const { validCollections } = require('../helpers');

const router = Router();

router.post('/', validateFileUpload, uploadFiles);

router.put('/:collection/:id', [
    validateFileUpload,
    check('id', 'No es un id válido').isMongoId(),
    check('collection').custom(c => validCollections(c, ['users', 'products'])),
    validateFields
], updateImageCloudinary);

router.get('/:collection/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('collection').custom(c => validCollections(c, ['users', 'products'])),
    validateFields
], showImage)

module.exports = router;