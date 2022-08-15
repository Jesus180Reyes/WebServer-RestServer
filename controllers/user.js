const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const usuariosGet = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    // const { q, nombre = 'No-Name', limit = 10, page = 1 } = req.query;
    const query = { estado: true };

    // const usuarios = await Usuario.find(query)
    //     .skip(Number(desde))
    //     .limit(Number(limite));

    // const total = await Usuario.countDocuments(query);
    const [total, usuarios] = await Promise.all([
        await Usuario.countDocuments(query),
        await Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite)),

    ]);


    res.json({
        ok: true,
        total,
        usuarios,
    });

}
const usuariosPost = async (req, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    // Encryptar contraseña
    const salt = bcryptjs.genSaltSync();
    // Hash contraseña
    usuario.password = bcryptjs.hashSync(password, salt);
    // Guardar usuario en la base de datos
    await usuario.save();
    res.status(201).json({
        ok: true,
        msg: 'Usuario Creado Correctamente',
        usuario
    });


}
const usuariosDelete = async (req, res) => {
    const { id } = req.params;
    // const uid = req.uid;
    // Fisicamente eliminar el usuario Metodo 1:
    // const usuario = await Usuario.findByIdAndDelete(id);
    // Metodo 2:
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
    const usuarioAutenticado = req.usuario;
    res.json({
        ok: true,
        msg: 'Eliminado Correctamente',
        usuario,
        usuarioAutenticado
        // uid

    });

}
const usuariosPut = async (req, res = response) => {
    const { id } = req.params;
    const { password, google, correo, createdAt, estado, _id, rol, ...resto } = req.body;

    // TODO: validar que el id exista
    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }
    resto.updateAt = new Date();
    const usuarioU = await Usuario.findByIdAndUpdate(id, resto);
    res.json({
        ok: true,
        msg: 'Usuario Actualizado Correctamente',
        usuarioU,

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