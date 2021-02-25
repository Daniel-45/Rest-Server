const { Router } = require('express');
const { check } = require('express-validator');
const { createCategory } = require('../controllers/categories.controller');
const { validateFields, validateJWT } = require('../middlewares');

const router = Router();

router.get('/get-categories', (req, res) => {
    res.status(200).json({
        message: 'Categorías'
    })
});

router.get('/get-category/:id', (req, res) => {
    res.status(200).json({
        message: 'Categoría'
    })
});


router.post('/create', [
    validateJWT,
    check('name', 'El nombre de la categoría es obligatorio').not().isEmpty(),
    validateFields
], createCategory);

// Privado cualquier usuario con un token válido
router.put('/update/:id', (req, res) => {
    res.status(200).json({
        message: 'Actualizar categoría'
    })
});

// Privado usuario administrador
router.delete('/delete/:id', (req, res) => {
    res.status(200).json({
        message: 'Eliminar categoría'
    })
});


module.exports = router;