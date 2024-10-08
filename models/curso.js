const mongoose = require('mongoose');

//se crea un modelo del producto, acorde a la db

const CursosSchema = mongoose.model('cursos_publicados', {
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

module.exports = CursosSchema;