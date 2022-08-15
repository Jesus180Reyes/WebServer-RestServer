const { response } = require("express");
const Producto = require("../models/producto");


const crearProducto = async (req, res = response) => {


    const { nombre, precio, descripcion, } = req.body;

    const productoDb = await Producto.findOne({ nombre });

    if (productoDb) {
        return res.status(400).json({
            ok: false,
            msg: `El Producto ${productoDb.nombre}, Ya existe`
        });
    }


    const data = {
        nombre,
        precio,
        descripcion,
        categoria: req.body.categoria,
        usuario: req.usuario._id
    },

        producto = new Producto(data);
    await producto.save();

    res.status(201).json({
        ok: true,
        msg: 'Producto Creado exitosamente',
        producto,
    });

}

const obtenerProductos = async (req, res = response) => {

    const { limite = 1, page = 0 } = req.query;
    const query = { estado: true };
    const total = await Producto.find(query).populate('usuario', 'nombre email');
    const paginado = await Producto.countDocuments(query)
        .skip(Number(page))
        .limit(Number(limite));


    res.json({
        ok: true,
        paginado,
        total,
    })
}

const obtenerProducto = async (req, res = response) => {
    const { id } = req.params;

    const producto = await Producto.findById(id).populate('usuario', 'nombre email');
    if (!producto) {
        return res.status(400).json({
            ok: false,
            msg: 'Producto no encontrado'
        });
    }

    res.json({
        ok: true,
        producto,
    });

}
const actualizarProducto = async (req, res = response) => {
    const { id } = req.params;
    req.id = req.usuario.id;
    const { nombre, precio, descripcion } = req.body;
    const producto = await Producto.findByIdAndUpdate(id, { nombre, precio, descripcion }, { new: true });

    if (!producto.estado) {
        return res.status(400).json({
            ok: false,
            msg: 'Producto No se puede actualizar, porque esta desahabilitado'
        });
    }
    if (!producto) {
        return res.status(400).json({
            ok: false,
            msg: 'Producto no encontrado'
        });
    }
    res.json({
        ok: true,
        producto,
    })
}


const borrarProducto = async (req, res = response) => {

    const { id } = req.params;
    const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true })
        .populate('usuario', 'nombre');

    res.json({
        ok: true,
        msg: 'Producto Desahabiblitado exitosamente',
        producto,
    });

}




module.exports = {
    crearProducto,
    obtenerProductos,
    actualizarProducto,
    obtenerProducto,
    borrarProducto
}