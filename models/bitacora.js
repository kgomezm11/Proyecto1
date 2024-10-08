const mongoose = require('mongoose');

//se crea un modelo de la bitácora, acorde a la db

const BitacoraSchema = mongoose.model('bitacoras', {
    id2: {type: String, require: false},
    usuario: [{
        dpi_usuario: Number,
        usuario: String,
    }],
    imagen: String,
    titulo: String,
    descripcion: String,
    recursos: [{
        video: String,
        audio: String,
        documento: String,
        varios: String
    }],
    categorias: [String],
    tokens: Number,
});

module.exports = BitacoraSchema;