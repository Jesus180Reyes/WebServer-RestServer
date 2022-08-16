const { response } = require("express");
const { ObjectId } = require('mongoose').Types;
const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');
const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async (termino = '', res = response) => {

    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        });
    }
    const regex = new RegExp(termino, 'i');
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });
    const usuariosCount = await Usuario.count({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });
    res.json({
        total_usuarios: usuariosCount,
        results: usuarios
    });

}

const buscarCategoria = async (termino = '', res = response) => {
    const esMongoId = ObjectId.isValid(termino);
    if (esMongoId) {
        const categoria = await Categoria.findById(termino).populate('usuario', 'nombre');
        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }
    const regex = new RegExp(termino, 'i');
    const categorias = await Categoria.find({
        $or: [{ nombre: regex }],
        $and: [{ estado: true }]
    })
        .populate('usuario', 'nombre');
    const categoriasCount = await Categoria.count({
        $or: [{ nombre: regex }],
        $and: [{ estado: true }]
    });

    res.json({
        total_categorias: categoriasCount,
        results: categorias

    })

}
const buscarProductos = async (res = response, termino = '') => {

    const esMongoId = ObjectId.isValid(termino);
    if (esMongoId) {
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');
        return res.json({
            results: (producto) ? [producto] : []
        });
    }
    const regex = new RegExp(termino, 'i');
    const productos = await Producto.find({
        $or: [{ nombre: regex }],
        $and: [{ estado: true }]
    })
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre');
    const productosCount = await Producto.count({
        $or: [{ nombre: regex }],
        $and: [{ estado: true }]
    });


    res.json({
        total_productos: productosCount,
        results: productos
    });
}
const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
        });
    }
    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);

            break;
        case 'categorias':
            buscarCategoria(termino, res);
            break;
        case 'productos':
            buscarProductos(res, termino);
            break;
        case 'roles':
            break;

        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta busqueda'
            });

    }

}

module.exports = {
    buscar
}