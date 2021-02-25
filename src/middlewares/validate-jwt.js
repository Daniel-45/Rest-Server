const jwt = require('jsonwebtoken');
const User = require('../models/user')

const validateJWT = async (req, res, next) => {

    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({
            message: 'No hay token en la petición'
        });
    }

    try {
        // Validate token
        const { uid } = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findById(uid);

        // Check if the user exists
        if (!user) {
            res.status(401).json({
                message: 'El usuario no existe en la base de datos'
            });  
        }

        // Check if user is active
        if (!user.status) {
            return res.status(401).json({
                message: 'El token no es válido - estado: inactivo'
            });
        }

        req.user = user;
        
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            message: 'El token no es válido'
        });   
    }

}

module.exports = {
    validateJWT
}