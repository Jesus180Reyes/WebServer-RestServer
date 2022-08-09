const { response } = require("express");
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar_jwt");


const login = async (req, res = response) => {

    const { correo, password } = req.body;
    try {
        // Verificar el email existe
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario / Contraseña incorrectos - correo'
            });
        }
        // Si el usuario no está activo
        if (!usuario.estado) {
            return res.status(400).json({
                ok: false,
                msg: 'Has Sido Baneado de la plataforma - estado: false'
            });
        }
        // Verificar el password
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario / Contraseña incorrectos - password'
            });

        }
        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            msg: "Login correcto",
            usuario,
            token,

        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hubo un error, Hable con el administrador",
        });
    }
}


module.exports = {
    login,
}