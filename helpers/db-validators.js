import { Categoria } from '../models/categoria.js';
import { Producto } from '../models/producto.js';
import { Role } from '../models/role.js';
import { Usuario } from "../models/usuario.js";

/*Validadores de usuarios*/
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

/*Validadores de categorias*/
const existeCategoriaPorId = async (id = '') => {

    const existeCategoria = await Categoria.findById(id);

    if ( !existeCategoria ) {
        throw new Error(`El id ${id} no existe en la BD`)
        
    }

}

const existeCategoriaPorNombre = async (nombre = '') => {

    const categoria = nombre.toUpperCase();
    const existeCategoria = await Categoria.findOne({ nombre: categoria });

    if ( !existeCategoria ) {
        throw new Error(`La categoria ${categoria} no existe en la BD`)
        
    }
}

/*Validadores de productos*/

const existeProductoPorId = async (id = '') => {

    const existeProducto = await Producto.findById(id);

    if (!existeProducto) {
        throw new Error(`El id ${id} no existe en la BD`)
    }
}

const existeProductoPorNombre = async ( nombre = '') => {

    const producto = nombre.toUpperCase();
    const existeProducto = await Producto.findOne({ nombre: producto });

    if ( existeProducto ) {
        throw new Error(`El producto ${producto} ya existe en la BD`)
    }
}

// Validar colecciones

const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes( coleccion );

    if ( !incluida ) {
        throw new Error(`La colección ${ coleccion } no es permitida, ${ colecciones }`);
    }

    return true;
}

export { 
        esRoleValido, 
        emailExiste,
        existeUsuarioPorId,
        existeCategoriaPorId,
        existeCategoriaPorNombre,
        existeProductoPorId,
        existeProductoPorNombre,
        coleccionesPermitidas
       };