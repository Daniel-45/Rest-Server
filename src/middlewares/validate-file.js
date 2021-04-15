const validateFileUpload = (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        return res.status(400).json({
            message: 'No se ha cargado ningún archivo'
        });
    }
    next();
}

module.exports = {
    validateFileUpload
}