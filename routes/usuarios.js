import { Router } from 'express';
import {  check } from 'express-validator';
// import { validarCampos } from '../middlewares/validar-campos.js';
// import { validarJWT } from '../middlewares/validar-jwt.js';
// import { esAdminRole, tieneRole } from '../middlewares/validar-roles.js';
import { validarCampos, validarJWT, esAdminRole, tieneRole } from '../middlewares/index.js';
import { emailExiste, esRoleValido, existeUsuarioPorId } from '../helpers/db-validators.js';
import { usuariosDelete,
        usuariosGet,
        usuariosPatch,
        usuariosPost,
        usuariosPut } from '../controllers/usuarios.js';


const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('rol').custom( esRoleValido ),
    validarCampos
], usuariosPut);

router.post('/',[
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('password','El password es obligatorio y mas de 6 caracteres').isLength({ min:6 }),
    check('correo','El correo no es válido').isEmail(),
    check('correo').custom( emailExiste ),
//     check('rol','No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom( esRoleValido ),
    validarCampos 
], usuariosPost);

router.patch('/', usuariosPatch);

router.delete('/:id',[
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE','VENTAS_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
], usuariosDelete);



export { router} ;