import { Router } from 'express';
import {  check } from 'express-validator';
import { esAdminRole, validarCampos, validarJWT } from '../middlewares/index.js';
import { crearCategoria, 
        obtenerCategorias, 
        obtenerCategoria, 
        actualizarCategoria,
        borrarCategoria } from '../controllers/categorias.js';
import { existeCategoriaPorId } from '../helpers/db-validators.js'


const router = Router();

/*
* {{url}}/api/catagorias
*/

//Obtener todas las categorias - publico
router.get('/', obtenerCategorias);

//Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
],obtenerCategoria);

//Crear categoria - privado - cualquier persona con un token válido
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
],crearCategoria);

//Actualizar - privado - cualquiera con token valido
router.put('/:id', [
    validarJWT,
    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
],actualizarCategoria);

//Borrar una categria - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], borrarCategoria);

export { router} ;