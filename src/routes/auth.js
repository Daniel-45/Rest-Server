const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares');
const { login, googleSignin } = require('../controllers/auth.controller');

const router = Router();

router.post('/login',[
    check('email', 'El email es obligatorio y debe ser un email válido').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validateFields
],login);

router.post('/google',[
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validateFields
], googleSignin);

module.exports = router;