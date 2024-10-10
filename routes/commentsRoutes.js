const express = require('express');
const jwt = require('jsonwebtoken');

const { verifyToken } = require('../controllers/controllers');

const CommentsSchema = require('../models/comments');
const CourseSchema = require('../models/curso');
const UserSchema = require('../models/user');

const router = express.Router();

// Módulo Carrito de Compra
router.get('/comments/:courseId', verifyToken, async (req, res) => {
    const { courseId } = req.params;
    try {
        const comments = await CommentsSchema.aggregate([
            {
                $match: { "id_curso": courseId }
            },
            {
                $lookup: {
                    from: "usuarios",
                    localField: "dpi_usuario",
                    foreignField: "dpi",
                    as: "user_info"
                }
            },
            {
                $unwind: "$user_info"
            },
            {
                $project: {
                    _id: 1,
                    id_curso: 1,
                    recomendado: 1,
                    texto: 1,
                    "user_info.nombres": 1,
                }
            }
        ]);


        if (comments !== null) {
            res.json(comments);
        } else {
            res.status(404).json({ error: 'Comments not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// GET - AGREGA PRODUCTOS AL CARRITO
router.post('/comment', verifyToken, async (req, res) => {

    try {
        const Course = await CourseSchema.findOne({ "_id": req.body.courseId });

        if (Course === null) {
            return res.status(404).json({ error: 'Course not found' });
        }

        user = jwt.decode(req.headers['authorization']).usuarioEncontrado;

        comment = new CommentsSchema({
            dpi_usuario: user.dpi,
            id_curso: req.body.courseId,
            recomendado: req.body.rating,
            texto: req.body.comment
        });

        await comment.save();

        return res.status(200).json({ mensaje: 'Comment added!' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;