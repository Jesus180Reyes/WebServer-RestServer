
const { response } = require('express');
const { subirArchivo } = require('../helpers/subir-archivo');
const { Usuario, Producto } = require('../models');
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);
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
const actualizarImagenCloudinary = async (req, res = response) => {
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
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');
        await cloudinary.uploader.destroy(public_id);
    }
    const { tempFilePath } = req.files.archivo;
    // Subir imagen a cloudinary con tamano y formato
    // const { secure_url } = await cloudinary.uploader.upload(tempFilePath, { height: 300, width: 300, crop: 'fill' });
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);


    modelo.img = secure_url;
    modelo.updateAt = new Date();
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

module.exports = { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary };