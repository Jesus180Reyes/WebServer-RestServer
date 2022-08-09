const { Router } = require('express');
const { check } = require('express-validator');
require('colors');
const {
    usuariosGet,
    usuariosPost,
    usuariosDelete,
    usuariosPut,
    usuariosPatch, } = require('../controllers/user');
const { esRolValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole, tieneRol } = require('../middlewares/validar-roles');

const { validarCampos, validarJWT, esAdminRole, tieneRol } = require('../middlewares/');

const router = Router();


router.get('/', usuariosGet);

router.put('/:id', [
    check('id', "No es un ID valido").isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRolValido),
    validarCampos,
], usuariosPut);

router.post('/', [
    check('nombre', 'EL Nombre es Obligatorio').not().isEmpty(),
    check('correo', 'El Correo no es valido').isEmail(),
    check('correo').custom(emailExiste),
    check('password', 'Password es obligatorio y debe ser mayor a 6 Caracteres').isLength({ min: 6 }),
    // check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']), 
    check('rol').custom(esRolValido),
    validarCampos
], usuariosPost);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    tieneRol('ADMIN_ROLE', 'USER_ROLE'),
    check('id', "No es un ID valido").isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos

], usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;