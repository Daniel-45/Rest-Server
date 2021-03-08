const Product = require('../models/product');

const getProducts = async (req, res) => {
    // Optional arguments Query String
    const { limit = 6, offset = 0 } = req.query;

    const query = { status: true };

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate('user', 'name')
            .populate('category', 'name')
            .skip(Number(offset))
            .limit(Number(limit))
    ]);

    res.status(200).json({
        total,
        pages: Math.ceil(total / limit),
        products
    })
}

const getProduct = async (req, res) => {

    const { id } = req.params;

    const product = await Product.findById(id)
        .populate('user', 'name')
        .populate('category', 'name');

    if (!product) {
        res.status(400).json({
            message: `No existe ningún producto con id ${id} en la base de datos`
        })
    }

    if (!product.status) {
        res.status(404).json({
            message: `El producto con id ${id} ha sido bloqueado. Hable con el administrador`
        });
    }

    res.status(200).json({ product });
}

const createProduct = async (req, res) => {

    const { status, user, ...body } = req.body;

    const productDB = await Product.findOne({ name: body.name });

    if (productDB) {
        return res.status(400).json({
            message: `El producto ${productDB.name} ya existe`
        });
    }

    // Generate data to save
    const data = {
        ...body,
        user: req.user._id
    }

    const product = new Product(data);

    await product.save();

    res.status(201).json(product)
}

const updateProduct = async (req, res) => {

    const { id } = req.params;

    const { status, user, ...data } = req.body;

    data.user = req.user._id;

    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json({ product });
}

const deleteProduct = async (req, res) => {

    const { id } = req.params;

    // Delete product
    // const product = Product.findByIdAndDelete(id);

    // Maintain referential integrity
    const product = await Product.findByIdAndUpdate(id, { status: false }, { new: true });

    res.status(200).json({
        product,
        message: 'Producto eliminado correctamente'
    });

}

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}