const { ObjectId } = require("mongoose").Types;

const { User, Category, Product } = require('../models');

const allowedCollections = [
    'users',
    'categories',
    'products',
    'roles'
]

const searchUsers = async (searchterm = '', res) => {

    // Check if search term is Mongo id
    const isMongoID = ObjectId.isValid(searchterm); // true

    // Search by user id
    if (isMongoID) {
        const user = await User.findById(searchterm);

        return res.status(200).json({
            results: (user) ? [user] : []
        })
    }

    // Case insensitive
    const regex = new RegExp(searchterm, 'i')

    // Search by name or email
    const users = await User.find({
        $or: [{ name: regex }, { email: regex }],
        $and: [{ status: true }]
    });

    return res.status(200).json({
        results: users
    })
}

const searchCategories = async (searchterm = '', res) => {

    const esMongoID = ObjectId.isValid(searchterm); // true

    if (esMongoID) {
        const category = await Category.findById(searchterm)
            .populate('user', 'name');

        return res.json({
            results: (category) ? [category] : []
        });
    }

    const regex = new RegExp(searchterm, 'i');

    const categories = await Category.find({ name: regex, status: true })
        .populate('user', 'name');

    return res.json({
        results: categories
    });

}

const searchProducts = async (searchterm = '', res) => {

    const esMongoID = ObjectId.isValid(searchterm); // true

    if (esMongoID) {
        const product = await Product.findById(searchterm)
            .populate('category', 'name');

        return res.json({
            results: (product) ? [product] : []
        });
    }

    const regex = new RegExp(searchterm, 'i');

    const products = await Product.find({ name: regex, status: true })
        .populate('category', 'name');

    return res.json({
        results: products
    });

}

const search = (req, res = response) => {

    const { collection, searchterm } = req.params;

    if (!allowedCollections.includes(collection)) {
        return res.status(400).json({
            message: `Las colecciones permitidas son ${allowedCollections}`
        })
    }

    switch (collection) {
        case 'users':
            searchUsers(searchterm, res);
            break;
        case 'categories':
            searchCategories(searchterm, res);
            break;
        case 'products':
            searchProducts(searchterm, res);
            break;
        default:
            res.status(500).json({
                message: 'No está implementada esta búsqueda'
            });
            break;
    }
}

module.exports = {
    search
}