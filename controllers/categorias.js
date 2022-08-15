const { response } = require("express");
const { Categoria } = require('../models');

const obtenerCategorias = async (req, res = response) => {
    const { limite = 1, page = 0 } = req.query;
    const query = { estado: true };
    const total = await Categoria.find(query).populate('usuario', 'nombre email');
    const paginado = await Categoria.countDocuments(query)
        .skip(Number(page))
        .limit(Number(limite));

    if (total.length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay Categorias'
        });
    }

    // const [total, paginado] = await Promise([
    //     await Categoria.countDocuments(query),
    //     await Categoria.find(query)
    //         .skip(Number(page))
    //         .limit(Number(limite))

    // ]);

    res.json({
        ok: true,
        paginado,
        total,

    });
}
const obtenerCategoria = async (req, res = response) => {
    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');
    res.json({
        ok: true,
        categoria
    });
}

const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriDb = await Categoria.findOne({ nombre });

    if (categoriDb) {
        return res.status(400).json({
            ok: false,
            msg: `La Categoria ${categoriDb.nombre}, Ya existe`
        });
    }
    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }
    const categoria = new Categoria(data);
    await categoria.save();


    res.status(201).json({
        ok: true,
        categoria
    });

}
const actualizarCategoria = async (req, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...resto } = req.body;
    resto.nombre = resto.nombre.toUpperCase();
    const categoria = await Categoria.findByIdAndUpdate(id, resto, { new: true }).populate('usuario', 'nombre');
    if (!categoria) {
        return res.status(400).json({
            ok: false,
            msg: 'No existe en la base de datos la categoria'
        });
    }

    res.json({
        ok: true,
        msg: "Categoria actualizada correctamente",
        categoria,
    });
}
const borrarCategoria = async (req, res = response) => {

    const { id } = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true })
        .populate('usuario', 'nombre correo');


    res.json({
        ok: true,
        msg: "Categoria borrada correctamente",
        categoriaBorrada,
    });
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria,
    obtenerCategoria
}