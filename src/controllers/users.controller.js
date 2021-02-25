const getUsers = (req, res) => {

    // Optional arguments Query String
    const {limit = 6, offset = 0 } = req.query;

    res.status(200).json({
        message: 'Get - Controlador'
    });
}

const getUser = (req, res) => {

    const { id } = req.params;

    const {username, email } = req.body;

    res.status(200).json({
        id,
        username,
        email,
        message: 'Get - Controlador'
    });
}

const createUser = (req, res) => {

    const { id, username, password, email } = req.body;

    res.status(201).json({
        id,
        username,
        password,
        email,
        message: 'Post - Controlador'
    });
}

const updateUser = (req, res) => {

    const { id } = req.params;

    const { username, email } = req.body;

    res.status(200).status(200).json({
        id,
        username,
        email,
        message: 'Put - Controlador'
    });
}

const deleteUser = (req, res) => {

    const { id } = req.params;

    res.status(200).json({
        id,
        message: 'Delete - Controlador'
    });
}

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
}