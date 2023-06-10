/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           description: Id autogenerada por MongoDB
 *           type: ObjectId
 *         name:
 *           description: Nombre completo del usuario
 *           type: String
 *         email:
 *           description: Email con dominio de la UM del usuario.
 *           type: String
 *           format: email
 *         password:
 *           description: Contraseña encryptada del usuario.
 *           type: String
 *           format: password
 *         subjects:
 *           description: Lista de _ids de las materias a las que esta anotado el usuario.
 *           type: Array
 *           items: [ObjectId]
 *         isAdmin:
 *           type: Boolean
 *           description: Rol del usuario (admin o no).
 */
/**
 * @swagger
 * tags:
 *   name: User
 *   description: La API que maneja los usuarios
 */

const express = require('express');
const router = express.Router();
const passportConfig = require('../config/passport.js');
const userController = require('../controllers/user.js');

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Obtener información del usuario logueado.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Objecto del usuario en formato JSON.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Error inesperado.
 *
 */
router.get('/', passportConfig.isAuthenticated, (req, res) => {
    res.json(req.user);
});

/**
 * @swagger
 * /user/subjects:
 *   get:
 *     summary: Obtener información de las materias a las que el usuario está anotado.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Array con las materias en formato JSON.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: {$ref: '#/components/schemas/Subject'}
 *       500:
 *         description: Error inesperado.
 */
router.get('/subjects', passportConfig.isAuthenticated, userController.getAllSubjects);

/**
 * @swagger
 * /user/subjects/{name}:
 *   put:
 *     summary: Anotarse a una materia.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: name
 *     responses:
 *       200:
 *         description: Se guarda el _id de la materia y retorna el usuario.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: La materia especificada no se encontró en la base de datos.
 *       500:
 *         description: Error inesperado.
 */
router.put('/subject/:name', passportConfig.isAuthenticated, userController.putSubject);

// Auth
/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Registrar un usuario a la base de datos.
 *     tags: [User]
 *     requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: El usuario se registro correctamente. Se inicia sesión automaticamente.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       409:
 *         description: El email ya esta registrado.
 *       412:
 *         description: El email no pertenece a la UM.
 *       500:
 *         description: Error inesperado.
 */
router.post('/signup', userController.postSignUp);
/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Inicio de sesión de un usuario en el servidor.
 *     tags: [User]
 *     requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - email
 *                 - password
 *               properties:
 *                 email:
 *                   type: String
 *                 password:
 *                   type: String
 *                   format: password
 *     responses:
 *       200:
 *         description: El usuario inició sesión correctamente.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       400:
 *         description: Los datos enviados no son correctos.
 *       500:
 *         description: Error inesperado.
 */
router.post('/login', userController.postLogin);
/**
 * @swagger
 * /user/logout:
 *   get:
 *     summary: Cerrar sesión del servidor.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Se cerró sesión correctamente.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.get('/logout', passportConfig.isAuthenticated, userController.logout);

// Admin
router.get('/admin', passportConfig.isAdmin, (req, res) => res.send("Hola Admin!"));

module.exports = router;