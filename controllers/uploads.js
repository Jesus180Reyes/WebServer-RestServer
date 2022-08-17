
const { response } = require('express');
const { subirArchivo } = require('../helpers/subir-archivo');
const { Usuario, Producto } = require('../models');
const fs = require('fs');
const path = require('path');
const cargarArchivo = async (req, res = response) => {

    // Imagnes
    try {

        // const nombre = await subirArchivo(req.files, ['txt', 'md', 'pdf'], 'textos');
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
        res.json({
            nombre
        });
    } catch (error) {
        return res.status(400).json({
            msg: error
        });
    }

}
const actualizarImagen = async (req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: 'No existe el usuario con el' + id
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: 'No existe un producto con el' + id
                });
            }
            break;

        default:
            return res.status(500).json({
                msg: "se me olvido validar eso"
            });
    }
    // Limpiar Imagens previas
    if (modelo.img) {
        // Borrar imagen anterior
        const pathImagen = path.join(__dirname, "../uploads/", coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;
    await modelo.save();
    res.json(
        modelo
    );

}
const mostrarImagen = async (req, res = response) => {
    const { id, coleccion } = req.params;
    const noImage = path.join(__dirname, "../assets/", "no-image.jpg");


    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.sendFile(noImage);
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.sendFile(noImage);
            }
            break;

        default:
            return res.status(500).json({
                msg: "se me olvido validar eso"
            });
    }
    // Limpiar Imagens previas
    if (modelo.img) {
        // Borrar imagen anterior
        const pathImagen = path.join(__dirname, "../uploads/", coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }

    res.sendFile(noImage);


}

module.exports = { cargarArchivo, actualizarImagen, mostrarImagen };