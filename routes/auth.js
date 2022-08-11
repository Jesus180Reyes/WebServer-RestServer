const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();


router.post('/login', [
    check('correo', 'El Correo Es obligatorio').isEmail(),
    check('password', 'La Contrasena es Obligatoria').not().isEmpty(),
    validarCampos

], login);
router.post('/google', [
    check('id_token', 'Id token es necesario').not().isEmpty(),
    validarCampos

], googleSignIn);



module.exports = router;