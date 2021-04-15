const { Collection } = require('mongoose');
const { User, Role, Category, Product } = require('../models');

// User validations
const emailExists = async (email = '') => {
    // Check if email exists
    const emailExists = await User.findOne({ email });

    if (emailExists) {
        throw new Error(`El email ${email} ya está registrado en base de datos`);
    }
}

const isValidRole = async (role = '') => {
    // Check if role is valid
    const roleExists = await Role.findOne({ role });

    if (!roleExists) {
        throw new Error(`El rol ${role} no está registrado en base de datos`);
    }
}

const userExistsById = async (id) => {
    // Check if username exists
    const userExists = await User.findById(id);

    if (!userExists) {
        throw new Error(`El id ${id} no existe en base de datos`);
    }
}

// Categories validations
const categoryExists = async (id) => {
    // Check if category exists
    const categoryExists = await Category.findById(id);

    if (!categoryExists) {
        throw new Error(`El id ${id} no existe en base de datos`);
    }
}

// Product validations
const productExists = async (id) => {
    // Check if category exists
    const productExists = await Product.findById(id);

    if (!productExists) {
        throw new Error(`El id ${id} no existe en base de datos`);
    }
}

// Collection validations
const validCollections = (collection = '', collections = []) => {
    const collectionIncluded = collections.includes(collection)

    if (!collectionIncluded) {
        throw new Error(`La colección ${collection} no existe, las colecciones son ${collections}`)
    }

    // If all goes well
    return true;
}

module.exports = {
    emailExists,
    isValidRole,
    userExistsById,
    categoryExists,
    productExists,
    validCollections
}