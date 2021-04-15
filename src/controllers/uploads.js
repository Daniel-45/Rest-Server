const fs = require('fs');
const path = require('path');
const { uploadFile } = require('../helpers');
const { User, Product } = require('../models');
const cloudinary = require('cloudinary').v2

cloudinary.config(process.env.CLOUDINARY_URL);

const uploadFiles = async (req, res) => {

    try {
        const image = await uploadFile(req.files, undefined, 'images');
        res.json({ image });
    } catch (message) {
        res.status(400).json({ message });
    }
}

const updateImage = async (req, res) => {

    const { collection, id } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model =  await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    message: `No existe el usuario con el id ${id}`
                });
            }
            break;

        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    message: `No existe el producto con el id ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({ message: 'Internal Server Error' });
    }

    // Delete previous images
    if (model.image) {
        // Remove the image from the server
        const imagePath = path.join(__dirname, '../uploads', collection, model.image);

        if (fs.existsSync(imagePath))  {
            fs.unlinkSync(imagePath);
        }
    }

    // Allowed files are png, jpg, jpeg and gif.
    // Creates a folder with the name of the collection inside the uploads folder
    const image = await uploadFile(req.files, undefined, collection);

    model.image = await image;

    await model.save();

    res.json({ model });
}

const updateImageCloudinary = async (req, res) => {

    const { collection, id } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model =  await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    message: `No existe el usuario con el id ${id}`
                });
            }
            break;

        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    message: `No existe el producto con el id ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({ message: 'Internal Server Error' });
    }

    // Delete previous images
    if (model.image) {
        const array = model.image.split('/');
        const name = array[array.length -1];
        const [public_id] = name.split('.');
        cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.file;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    model.image = await secure_url;

    await model.save();

    res.json({ model });
}

const showImage = async (req, res) =>  {

    const { collection, id } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model =  await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    message: `No existe el usuario con el id ${id}`
                });
            }
            break;

        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    message: `No existe el producto con el id ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({ message: 'Internal Server Error' });
    }

    // Delete previous images
    if (model.image) {
        // Remove the image from the server
        const imagePath = path.join(__dirname, '../uploads', collection, model.image);

        if (fs.existsSync(imagePath))  {
            return res.sendFile(imagePath);
        }
    }

    const noImagePath = path.join(__dirname, '../assets/no-image.jpg');

    res.sendFile(noImagePath);
}

module.exports = {
    uploadFiles,
    updateImage,
    updateImageCloudinary,
    showImage
}