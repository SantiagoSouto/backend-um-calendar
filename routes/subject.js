/**
 * @swagger
 * components:
 *   schemas:
 *     Subject:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           description: Id autogenerada por MongoDB
 *           type: ObjectId
 *         name:
 *           description: Nombre de la materia
 *           type: String
 *         career:
 *           description: Carrera asignada de la materia.
 *           type: String
 *         year:
 *           description: Año recomendado para cursarla.
 *           type: Number
 *         events:
 *           description: Lista de _ids de los eventos de la materia.
 *           type: Array
 *           items: [ObjectId]
 */
/**
 * @swagger
 * tags:
 *   name: Subject
 *   description: La API que maneja las materias
 */

const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const Event = require('../models/Event');
const subjectController = require('../controllers/subject');

/**
 * @swagger
 * /subject/all:
 *   get:
 *     summary: Obtener todas las materias.
 *     tags: [Subject]
 *     responses:
 *       200:
 *         description: Array con las materias en formato JSON.
 *         content:
 *           application/json:
 *             schema:
 *               type: Array
 *               items: 
 *                  $ref: '#/components/schemas/Subject'
 *       404:
 *         description: No se encontraron las materias.
 *       500:
 *         description: Error inesperado.
 *
 */
router.get('/all', subjectController.getAllSubjects);

/**
 * @swagger
 * /subject/{name}:
 *   get:
 *     summary: Obtener información de una materia.
 *     tags: [Subject]
 *     parameters:
 *       - in: path
 *         name: name
 *     responses:
 *       200:
 *         description: Objecto de la materia en formato JSON.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       404:
 *         description: No se encontró la materia.
 *       500:
 *         description: Error inesperado.
 *
 */
router.get('/:name', subjectController.getByName);

/**
 * @swagger
 * /subject/{name}/events:
 *   get:
 *     summary: Obtener todos los eventos asociados a la materia.
 *     tags: [Subject]
 *     parameters:
 *       - in: path
 *         name: name
 *     responses:
 *       200:
 *         description: Array con los eventos en formato JSON.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: {$ref: '#/components/schemas/Event'}
 *       404:
 *         description: No se encontró la materia.
 *       500:
 *         description: Error inesperado.
 *
 */
router.get('/:name/events', subjectController.getAllEvents);

/**
 * @swagger
 * /subject:
 *   post:
 *     summary: Crear una nueva materia.
 *     tags: [Subject]
 *     requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *     responses:
 *       200:
 *         description: La materia se creó correctamente.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       409:
 *         description: La materia ya existe.
 *       500:
 *         description: Error inesperado.
 */
router.post('/', subjectController.postCreateSubject);

module.exports = router;