import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import * as dotenv from 'dotenv';
dotenv.config();
import fs  from 'fs';
import { v2 as cloudinary } from 'cloudinary';

import { subirArchivo } from "../helpers/index.js";
import { Usuario, Producto } from '../models/index.js';

const callCloudinary = () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    return cloudinary;
}

const cargarArchivo = async (req, res) => {
  
    try {
        //  txt, md
        // const pathCompleto = await subirArchivo( req.files, ['txt','md'], 'textos' );
        const pathCompleto = await subirArchivo( req.files, undefined, 'imgs' );
    
        res.json({ nombre: pathCompleto });
        
    } catch (msg) {
        res.status(400).json({ msg });  
    }
    
}

const actualizarImagen = async (req, res) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch ( coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }    

        break;

        case 'productos':
            modelo = await Producto.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }    

        break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto'});
    }

    //Limpiar imagenes previas
    if ( modelo.img) {
        //Hay que borrar imagen del servidor
        const  pathImagen = path.join(__dirname,'../uploads', coleccion, modelo.img);

        if (fs.existsSync( pathImagen ) ) {
            fs.unlinkSync( pathImagen )
        }
        
    }

    const pathCompleto = await subirArchivo( req.files, undefined, coleccion );

    modelo.img = pathCompleto;

    await modelo.save();

    res.json( modelo );

}

const actualizarImagenCloudinary = async (req, res) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch ( coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }    

        break;

        case 'productos':
            modelo = await Producto.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }    

        break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto'});
    }

    //Limpiar imagenes previas
    if ( modelo.img) {
        
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[ nombreArr.length - 1 ];
        const [ public_id ] = nombre.split('.');

        callCloudinary().uploader.destroy( public_id );
    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await callCloudinary().uploader.upload( tempFilePath );
    
    modelo.img = secure_url;
    await modelo.save();

    res.json( modelo );

}

const mostrarImagen = async (req,res) => {
    
    const { id, coleccion } = req.params;

    let modelo;

    switch ( coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }    

        break;

        case 'productos':
            modelo = await Producto.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }    

        break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto'});
    }

    //Limpiar imagenes previas
    if ( modelo.img) {
        //Hay que borrar imagen del servidor
        const  pathImagen = path.join(__dirname,'../uploads', coleccion, modelo.img);

        if (fs.existsSync( pathImagen ) ) {
            return res.sendFile( pathImagen);
        }
        
    }

    const pathImagen = path.join(__dirname,'../assets/no-image.jpg');

    return res.sendFile(pathImagen);
    // res.json( { msg: 'Falta el placeholder '} );

}

export { cargarArchivo, 
        actualizarImagen, 
        mostrarImagen, 
        actualizarImagenCloudinary };