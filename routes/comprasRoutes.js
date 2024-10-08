const express = require('express');
const { verifyToken } = require('../controllers/controllers');

const CarritoSchema = require('../models/cart');
const BitacoraSchema = require('../models/bitacora');
const { json } = require("body-parser");
const CursosSchema = require('../models/curso');

const router = express.Router();

// Módulo Compra
// GET - TODAS LAS COMPRAS DE UN CLIENTE
router.get('/compra', verifyToken, async (req, res) => {
    try {
        const carritoEncontrado = await BitacoraSchema.find({ "usuario.dpi_usuario": req.dpi });
        if (carritoEncontrado !== null) {
            res.json(carritoEncontrado);
        } else {
            res.status(404).json({ error: 'No se encontraron productos' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


router.post('/compra', verifyToken, async (req, res) => {
    try {
        const { idCurso } = req.body;

        const productoEncontrado = await CursosSchema.findOne({ "_id": idCurso });
        if (!productoEncontrado) {
            return res.status(404).json({ error: 'Curso no encontrado' });
        }

        const usuarioDpi = req.dpi;
        const usuarioNombre = req.nombres;
        const id2 = productoEncontrado._id.toString();

        const compraExistente = await BitacoraSchema.findOne({
            "usuario.dpi_usuario": usuarioDpi,
            "id2": id2,
            "usuario.usuario": usuarioNombre
        });

        if (compraExistente) {
            return res.status(400).json({ error: 'El usuario ya ha comprado este curso.' });
        }

        const cursoModificado = productoEncontrado.toObject();

        cursoModificado.id2 = id2;

        cursoModificado.usuario = [
            {
                dpi_usuario: usuarioDpi,
                usuario: usuarioNombre
            }
        ];

        // Eliminar el _id original, para que MongoDB genere uno nuevo
        delete cursoModificado._id;

        // Guardar el curso modificado en la colección de Bitacora
        const nuevoCursoEnBitacora = new BitacoraSchema(cursoModificado);
        await nuevoCursoEnBitacora.save();

        res.status(201).json({ mensaje: 'Producto creado con éxito en la bitácora' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});




module.exports = router;