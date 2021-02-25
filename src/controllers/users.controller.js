const bcrypt = require('bcryptjs');
const User = require('../models/user');

const getUsers = async (req, res) => {

    // Optional arguments Query String
    const { limit = 6, offset = 0 } = req.query;

    const query = { status: true };

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(offset))
            .limit(Number(limit))
    ])

    res.status(200).json({
        total,
        pages: Math.ceil(total / limit),
        users
    });
}

const getUser = async (req, res) => {

    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
        res.status(404).json({ 
            message: `No existe ningún usuario con id ${id} en la base de datos`
         });
    }

    if (!user.status) {
        res.status(404).json({ 
            message: `El usuario con id ${id} ha sido bloqueado. Hable con el administrador`
         });
    }

    res.status(200).json({ user });
}

const createUser = async (req, res) => {

    const { name, email, password, role } = req.body;

    const user = new User({ name, email, password, role });

    // Encrypt password
    const salt = bcrypt.genSaltSync();

    user.password = bcrypt.hashSync(password, salt);

    // Save to database
    await user.save();

    res.status(201).json({
        user
    });
}

const updateUser = async (req, res) => {

    const { id } = req.params;

    const { _id, password, google, ...rest } = req.body;

    if (password) {
        // Encrypt password
        const salt = bcrypt.genSaltSync();
        rest.password = bcrypt.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, rest, { new: true });

    res.status(200).status(200).json({ user });
}

const deleteUser = async (req, res) => {

    const { id } = req.params;

    // Delete user
    // const user = await User.findByIdAndDelete(id)

    // Maintain referential integrity
    const user = await User.findByIdAndUpdate(id, { status: false }, { new: true });

    const authenticatedUser = req.user;

    res.status(200).json({
        user,
        message: 'Usuario eliminado correctamente'
    });
}

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
}