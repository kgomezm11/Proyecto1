const mongoose = require('mongoose');

//se crea un modelo del usuario, acorde a la db

const CommentsSchema = mongoose.model('comentarios', {
    dpi_usuario: Number,
    id_curso: String,
    recomendado: Number,
    texto: String,
});

module.exports = CommentsSchema;
