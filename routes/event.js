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
 *               type: object
 *               required:
 *                  - name
 *                  - date
 *                  - time
 *                  - eventType
 *                  - subject
 *               properties:
 *                  name:
 *                      description: Nombre del evento
 *                      type: String
 *                  date:
 *                      description: Fecha del evento (YYYY-MM-DD).
 *                      type: String
 *                      format: date
 *                  time:
 *                      description: Hora del evento (HH:MM).
 *                      type: String
 *                      format: date
 *                  eventType:
 *                      description: Tipo de evento.
 *                      type: String
 *                      enum: [parcial, entrega, obligatorio, recuperacion]
 *                  subject:
 *                      description: Nombre de la materia asociada.
 *                      type: String
 *                  approved:
 *                      description: Evento validado por un administrador.
 *                      type: Boolean
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

/**
 * @swagger
 * /event/approved:
 *   get:
 *     summary: Obtener todos los eventos aprobados.
 *     tags: [Event]
 *     responses:
 *       200:
 *         description: Array con los eventos aprobados en formato JSON.
 *         content:
 *           application/json:
 *             schema:
 *               type: Array
 *               items: 
 *                  $ref: '#/components/schemas/Event'
 *       404:
 *         description: No se encontraron los eventos.
 *       500:
 *         description: Error inesperado.
 *
 */
router.get('/approved', eventController.getApprovedEvents);

/**
 * @swagger
 * /event/pending:
 *   get:
 *     summary: Obtener todos los eventos pendientes.
 *     tags: [Event]
 *     responses:
 *       200:
 *         description: Array con los eventos pendientes en formato JSON.
 *         content:
 *           application/json:
 *             schema:
 *               type: Array
 *               items: 
 *                  $ref: '#/components/schemas/Event'
 *       404:
 *         description: No se encontraron los eventos.
 *       500:
 *         description: Error inesperado.
 *
 */
router.get('/pending', eventController.getPendingEvents);

router.put('/', eventController.updateEvent);

module.exports = router;