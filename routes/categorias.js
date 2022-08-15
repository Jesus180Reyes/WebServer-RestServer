const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, esAdminRole } = require('../middlewares');
const { crearCategoria, obtenerCategorias, actualizarCategoria, obtenerCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');


const router = Router();
// obtener todas las categorias - pubico
router.get('/', obtenerCategorias);

// obtenr una categoria por id - publico
router.get('/:id', [
    check('id', "No es un id valido").isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], obtenerCategoria);


// crear una categoria - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);
// actualizar una categoria - privado - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    check('id', "El id Es Obligatorio").not().isEmpty(),
    check('id', "Id no valido").isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], actualizarCategoria);
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'ID no valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], borrarCategoria);



module.exports = router;