const { Router } = require('express');
const { check } = require('express-validator');

// Middlewares
const {
    validateFields,
    validateJWT,
    isAdminRole,
    hasRole
} = require('../middlewares');

// Helpers
const {
    emailExists,
    isValidRole,
    userExistsById
} = require('../helpers/database-validators');

// Controllers
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/users.controller');

const router = Router();

router.get('/get-users', getUsers);

router.get('/get-user/:id', [
    check('id', 'No es un id válido').isMongoId(),
    validateFields
], getUser);

router.post('/create', [
    check('name', 'El nombre de usuario es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('email', 'El email no es válido').isEmail(),
    check('email').custom(emailExists),
    check('password',
        'La contraseña es obligatoria y debe tener mínimo 6 caracteres')
        .isLength({ min: 6 }),
    check('role').custom(isValidRole),
    validateFields
], createUser);

router.put('/update/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(userExistsById),
    check('email').custom(emailExists),
    check('email', 'El email no es válido').isEmail(),
    check('role').custom(isValidRole),
    check('password',
        'La contraseña es obligatoria y debe tener mínimo 6 caracteres')
        .isLength({ min: 6 }),
    validateFields
], updateUser);

router.delete('/delete/:id', [
    validateJWT,
    isAdminRole,
    // hasRole('ADMIN_ROLE', 'SALES_ROLE'),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(userExistsById),
    validateFields
], deleteUser);

module.exports = router;