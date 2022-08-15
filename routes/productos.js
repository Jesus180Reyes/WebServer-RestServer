const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { validarJWT, esAdminRole } = require('../middlewares');
const { existeProductoPorId } = require('../helpers/db-validators');
const router = Router();

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('precio', 'El precio es obligatorio').not().isEmpty(),
    check('descripcion', 'La descripción es obligatoria').not().isEmpty(),
    check('categoria', 'La categoria es obligatoria').isMongoId(),
    check('categoria', 'La categoria es obligatoria').not().isEmpty(),
    validarCampos,
], crearProducto);
router.get('/', [


], obtenerProductos);
router.get('/:id', [
    check('id', 'El id es obligatorio').not().isEmpty(),
    check('id', 'El id es obligatorio').isMongoId(),
    validarCampos,
], obtenerProducto);
router.put('/:id', [
    validarJWT,
    check('id', 'El id es obligatorio').not().isEmpty(),
    check('id', 'El id es obligatorio').isMongoId(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('precio', 'El precio es obligatorio').not().isEmpty(),
    check('descripcion', "La descripcion es obligatoria"),
    validarCampos,
], actualizarProducto);


router.delete('/:id', [
    validarJWT,
    check('id', 'El id es obligatorio').not().isEmpty(),
    check('id', 'El id es obligatorio').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
], borrarProducto);



module.exports = router;