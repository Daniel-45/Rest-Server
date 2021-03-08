const { Router } = require('express');
const { check } = require('express-validator');

// Middlewares
const { 
    validateFields, 
    validateJWT,
    isAdminRole
} = require('../middlewares');

// Helpers
const { categoryExists, productExists } = require('../helpers/database-validators');

// Controllers
const {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct
} = require('../controllers/products.controller');

const router = Router();

router.get('/get-products', getProducts);

router.get('/get-product/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(productExists),
    validateFields
], getProduct);

router.post('/create', [
    validateJWT,
    check('name', 'El nombre del producto es obligatorio').not().isEmpty(),
    check('category', 'No es un id válido').isMongoId(),
    check('category').custom(categoryExists),
    validateFields
], createProduct);

// Private any user with a valid token
router.put('/update/:id', [
    validateJWT,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(productExists),
    validateFields
], updateProduct);

// Private admin user
router.delete('/delete/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(productExists),
    validateFields
], deleteProduct);

module.exports = router;