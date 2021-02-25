const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateJWT } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res) => {

    const { email, password } = req.body;

    try {

        // Check if the email exists
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: 'El email no es correcto'
            });
        }

        // Check if user is active
        if (!user.status) {
            return res.status(400).json({
                message: 'El usuario no está activo'
            });
        }

        // Check password
        const validPassword = bcrypt.compareSync(password, user.password);

        if (!validPassword) {
            return res.status(400).json({
                message: 'La contraseña no es correcta'
            })
        }

        // Generate JWT
        const token = await generateJWT(user.id);

        res.status(200).json({
            user,
            token,
            message: 'OK'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error. Hable con el administrador'
        })
    }
}

const googleSignin = async (req, res) => {

    const { id_token } = req.body;

    try {
        const { email, name, image } = await googleVerify(id_token);

        let user = await User.findOne({ email });

        if (!user) {
            const data = {
                name,
                email,
                password: '$2a$10$SYUJA7qTG.N1zOgrfEybce480lS2aubLBwsuzzOxEn78TImdli04T',
                image,
                google: true
            }

            user = new User(data);

            await user.save();
        }

        if (!user.status) {
            return res.status(401).json({
                message: '401 Unauthorized!! Hable con el administrador, usuario bloqueado'
            });
        }

        // Generate JWT
        const token = await generateJWT(user.id);

        res.status(200).json({
            user,
            token,
            message: 'Acceso concedido. Google SignIn'
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: 'Token de Google no válido'
        });
    }

}

module.exports = {
    login,
    googleSignin
}