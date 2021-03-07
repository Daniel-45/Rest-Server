const { Router } = require('express');
const { check } = require('express-validator');

// Middlewares
const { 
    validateFields, 
    validateJWT,
    isAdminRole
} = require('../middlewares');

// Helpers
const { categoryExists } = require('../helpers/database-validators');

// Controllers
const {
    createCategory,
    getCategory,
    getCategories,
    updateCategory,
    deleteCategory
} = require('../controllers/categories.controller');

const router = Router();

router.get('/get-categories', getCategories);

router.get('/get-category/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(categoryExists),
    validateFields
], getCategory);

router.post('/create', [
    validateJWT,
    check('name', 'El nombre de la categoría es obligatorio').not().isEmpty(),
    validateFields
], createCategory);

// Private any user with a valid token
router.put('/update/:id', [
    validateJWT,
    check('name', 'El nombre de la categoría es obligatorio').not().isEmpty(),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(categoryExists),
    validateFields
], updateCategory);

// Private admin user
router.delete('/delete/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(categoryExists),
    validateFields
], deleteCategory);


module.exports = router;