const mongoose = require('mongoose');

// Connection to the database
const connection = async () => {
    try {

        await mongoose.connect(
            process.env.MONGODB_CONNECTION,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false
            }
        );

        console.log('Conexión a la base de datos realizada con éxito');

    } catch (error) {
        console.log(error);
        throw new Error('No se ha podido realizar la conexión a la base de datos');
    }
}

module.exports = {
    connection
}