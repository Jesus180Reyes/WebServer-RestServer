const { response, json } = require("express");
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar_jwt");
const { gooleVerify, googleVerify } = require("../helpers/google.verify");


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

const googleSignIn = async (req, res = response) => {
    const { id_token } = req.body;
    try {
        const { correo, nombre, img } = await googleVerify(id_token);
        let usuario = await Usuario.findOne({ correo });


        if (!usuario) {
            const data = {
                nombre,
                correo,
                rol: 'USER_ROLE',
                password: 'Autenticado con Google',
                img,
                google: true
            };
            usuario = new Usuario(data);
            await usuario.save();
        }
        if (!usuario.estado) {
            return res.status(401).json({
                ok: false,
                msg: 'Hable con el administrador, usuario bloqueado',
            });
        }
        const token = await generarJWT(usuario.id);
        res.json({
            ok: true,
            usuario,
            token
        });
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Token no valido',
        });

    }

}


module.exports = {
    login,
    googleSignIn
}