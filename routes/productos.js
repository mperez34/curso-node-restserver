import { Router } from 'express';
import {  check } from 'express-validator';
import { esAdminRole, validarCampos, validarJWT } from '../middlewares/index.js';
import { existeCategoriaPorNombre, 
        existeProductoPorId, 
        existeProductoPorNombre } from '../helpers/db-validators.js';
import {crearProducto, 
        obtenerProductos, 
        obtenerProducto, 
        actualizarProducto, 
        borrarProducto } from '../controllers/productos.js';


const router = Router();

//Obtener todos los productos - publico

router.get('/', obtenerProductos);

//Obtener un producto por id - publico

router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
],obtenerProducto);

//Crear producto - privado - cualquier persona con un token válido
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre del producto obligatorio').not().isEmpty(),
    check('nombre').custom( existeProductoPorNombre ),
    check('categoria', 'La categoria es obligatoria').not().isEmpty(),
    check('categoria').custom( existeCategoriaPorNombre ),
    check('precio', 'El precio debe ser numerico').isNumeric(),
    validarCampos
],crearProducto);

//Actualizar - privado - cualquiera con token valido

router.put('/:id', [
    validarJWT,
    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    check('nombre','El nombre del producto es obligatorio').not().isEmpty(),
    check('categoria', 'La categoria es obligatoria').not().isEmpty(),
    check('categoria').custom(existeCategoriaPorNombre),
    check('precio','El precio debe ser numerico').isNumeric(),
    validarCampos
],actualizarProducto);

//Borrar un producto - Admin

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], borrarProducto);

export { router} ;