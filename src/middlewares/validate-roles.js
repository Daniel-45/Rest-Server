
const isAdminRole = (req, res, next) => {

    if (!req.user) {
        return res.status(500).json({
            message: 'Internal Server Error. Se quiere verificar el rol sin validar el token'
        });
    }

    const {name, role} = req.user;

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            message: `401 Unauthorized!! ${name} no es administrador`
        });
    }

    next();
}

const hasRole = (...roles) => {

    return (req, res, next) => {

        if (!req.user) {
            return res.status(500).json({
                message: 'Internal Server Error. Se quiere verificar el rol sin validar el token'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(401).json({
                message: `401 Unauthorized!! El servicio requiere uno de estos roles ${roles}`
            })
        }
        
        next();
    }
}

module.exports = {
    isAdminRole,
    hasRole
}