// import {response } from 'express';
import { Usuario } from "../models/usuario.js";
import bcryptjs from 'bcryptjs';

const usuariosGet = async (req, res) => {

    // const {q,nombre= 'No Name',apellido,page=1,limit} = req.query;

    const { limite = 5, desde = 0 } = req.query;

    const query = { estado: true };

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        usuarios
    })
}

const usuariosPut = async (req, res) => {

    const { id } = req.params;
    const { _id, password, google, ...resto } = req.body;

    //Validar contra base de datos
    if ( password ) {
         //Encriptar password
        const salt = bcryptjs.genSaltSync(10);
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json(usuario)
}

const usuariosPost = async (req, res) => {



    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario( {nombre, correo, password, rol } );

    //Verificar si el correo existe
    

    //Encriptar password
    const salt = bcryptjs.genSaltSync(10);
    usuario.password = bcryptjs.hashSync( password, salt );

    //Guardar en la BD
    await usuario.save();

    res.json({
        usuario
    })
}

const usuariosPatch = (req, res) => {
    res.json({
        msg: 'patch API - controlador'
    })
}

const usuariosDelete = async (req, res) => {

    const { id } = req.params;

    // Físicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete ( id );

    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false });

    res.json({
        id,
        usuario
    })
}

export {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPatch,
    usuariosDelete
}