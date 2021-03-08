const Category = require('../models/category');

const getCategories = async (req, res) => {
    // Optional arguments Query String
    const { limit = 6, offset = 0 } = req.query;

    const query = { status: true };

    const [total, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
            .populate('user', 'name')
            .skip(Number(offset))
            .limit(Number(limit))
    ]);

    res.status(200).json({
        total,
        pages: Math.ceil(total / limit),
        categories
    })
}

const getCategory = async (req, res) => {

    const { id } = req.params;

    const category = await Category.findById(id).populate('user', 'name');

    if (!category) {
        res.status(400).json({
            message: `No existe ninguna categoría con id ${id} en la base de datos`
        })
    }

    if (!category.status) {
        res.status(404).json({
            message: `La categoría con id ${id} ha sido bloqueada. Hable con el administrador`
        });
    }

    res.status(200).json({ category });
}

const createCategory = async (req, res) => {

    const { name } = req.body;

    const categoryDB = await Category.findOne({ name });

    if (categoryDB) {
        return res.status(400).json({
            message: `La categoría ${categoryDB.name} ya existe`
        });
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

const updateCategory = async (req, res) => {

    const { id } = req.params;

    const { status, user, ...data } = req.body;

    data.user = req.user._id;

    const category = await Category.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json({ category });
}

const deleteCategory = async (req, res) => {

    const { id } = req.params;

    // Delete category
    // const category = Category.findByIdAndDelete(id);

    // Maintain referential integrity
    const category = await Category.findByIdAndUpdate(id, { status: false }, { new: true });

    res.status(200).json({
        category,
        message: 'Categoría eliminada correctamente'
    });

}

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
}