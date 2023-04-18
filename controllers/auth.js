import { generarJWT } from '../helpers/generar-jwt.js';
import { googleVerify } from '../helpers/google-verify.js';
import { Usuario } from '../models/usuario.js';
import bcryptjs from 'bcryptjs';

const login = async (req, res) => {

    const { correo, password } = req.body;

    try {

        //Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });

        if ( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            })
        }

        //Si el usuario está activo

        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario inactivo - estado: false'
            })
        }

        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }
        //Generar el JWT

        const token = await generarJWT( usuario.id );


        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }



}

const googleSignIn = async( req, res ) => {

    const { id_token } = req.body;

    try {

        const {correo, nombre,img} = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                rol: 'USER_ROLE',
                google: true
            }

            usuario = new Usuario( data );
            await usuario.save();
        }

        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }

        // console.log(googleUser);

        //Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })
    } catch (error) {

        res.status(400).json({
            ok: false,
            msg: 'El Token no se pudo verificar'
        })
    }

}

export { login, googleSignIn }