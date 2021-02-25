const Category = require('../models/category');

const createCategory = async (req, res) => {

    const { name } = req.body;

    const categoryDB = await Category.findOne({ name });

    if (categoryDB) {
        return res.status(400).json({
            message: `La categoría ${categoryDB.name} ya existe`
        })
    }

    // Generate data to save
    const data = {
        name,
        user: req.user._id
    }

    const category = new Category(data);

    await category.save();

    res.status(201).json(category)
}

module.exports = {
    createCategory
}