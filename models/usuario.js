const { Schema, Model, model } = require('mongoose');


const UsuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es Requeriido']

    },
    correo: {
        type: String,
        required: [true, 'El correo es Requerido'],
        unique: true


    },
    password: {
        type: String,
        required: true,

    },
    img: {
        type: String,
        required: false,


    },
    rol: {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updateAt: {
        type: Date,
        default: Date.now(),
    },
});

UsuarioSchema.methods.toJSON = function () {
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

module.exports = model('Usuario', UsuarioSchema);