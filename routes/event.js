/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - name
 *         - date
 *         - eventType
 *         - subject
 *       properties:
 *         _id:
 *           description: Id autogenerada por MongoDB
 *           type: ObjectId
 *         name:
 *           description: Nombre del evento
 *           type: String
 *         date:
 *           description: Fecha del evento.
 *           type: String
 *           format: date
 *         eventType:
 *           description: Tipo de evento.
 *           type: String
 *           enum: [parcial, entrega, obligatorio, recuperacion]
 *         subject:
 *           description: _id de la materia asociada.
 *           type: ObjectId
 *         approved:
 *           description: Evento validado por un administrador.
 *           type: Boolean
 */
/**
 * @swagger
 * tags:
 *   name: Event
 *   description: La API que maneja los eventos
 */

const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const eventController = require('../controllers/event');

/**
 * @swagger
 * /event:
 *   post:
 *     summary: Crear un evento asociado a una materia.
 *     tags: [Event]
 *     requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: El evento se creó correctamente.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       404:
 *         description: La materia asignada al evento no existe.
 *       409:
 *         description: El evento asociado a la materia ya fue creado.
 *       500:
 *         description: Error inesperado.
 */
router.post('/', eventController.postCreateEvent);

module.exports = router;