const { Router } = require('express');
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/users.controller');

const router = Router();

router.get('/get-users', getUsers);

router.get('/get-user/:id', getUser);

router.post('/create', createUser);

router.put('/update/:id', updateUser);

router.delete('/delete/:id', deleteUser);

module.exports = router;