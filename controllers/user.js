const { response, request } = require('express');
const usuariosGet = (req = request, res = response) => {
    const { q, nombre = 'No-Name', limit = 10, page = 1 } = req.query;
    res.json({
        ok: true,
        msg: 'get Api - Controlador de usuarios',
        q,
        nombre,
        limit,
        page
    });

}
const usuariosPost = (req, res = response) => {
    const { nombre, edad } = req.body;
    res.json({
        ok: true,
        msg: 'post Api - Controlador de usuarios',
        nombre,
        edad
    });

}
const usuariosDelete = (req, res) => {
    res.json({
        ok: true,
        msg: 'delete Api'
    });

}
const usuariosPut = (req, res) => {
    const { id } = req.params;
    res.json({
        ok: true,
        msg: 'put Api',
        id
    });

}
const usuariosPatch = (req, res) => {
    res.json({
        ok: true,
        msg: 'PATCH Api - CONTROLADOR DE USUARIOS'
    });

}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosDelete,
    usuariosPut,
    usuariosPatch
};