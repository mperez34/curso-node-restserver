// import {response } from 'express';

const usuariosGet = (req, res) => {

    const {q,nombre= 'No Name',apellido,page=1,limit} = req.query;

    res.json({
        msg: 'get API - controlador',
        q,
        nombre,
        apellido,
        page,
        limit
    })
}

const usuariosPut = (req, res) => {

    const id = req.params.id;

    res.json({
        msg: 'put API - controlador',
        id
    })
}

const usuariosPost = (req, res) => {

    const {nombre,apellido,edad} = req.body;

    res.json({
        msg: 'post API - controlador',
        nombre,
        apellido,
        edad
    })
}

const usuariosPatch = (req, res) => {
    res.json({
        msg: 'patch API - controlador'
    })
}

const usuariosDelete = (req, res) => {
    res.json({
        msg: 'delete API - controlador'
    })
}

export {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPatch,
    usuariosDelete
}