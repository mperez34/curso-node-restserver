import { Role } from '../models/role.js';
import { Usuario } from "../models/usuario.js";

const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la BD`)
    }
}

const emailExiste = async (correo = '') => {

    const existeEmail = await Usuario.findOne({ correo });

    if ( existeEmail) {
        throw new Error(`El correo ${correo} ya existe en la BD`)
        // return res.status(400).json({
        //     msg: 'Este correo ya existe'
        // })
    }
}

const existeUsuarioPorId = async (id = '') => {

    const existeUsuario = await Usuario.findById(id);

    if ( !existeUsuario ) {
        throw new Error(`El id ${id} no existe en la BD`)
    }
}

export { 
        esRoleValido, 
        emailExiste,
        existeUsuarioPorId 
       };