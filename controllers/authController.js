const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');


exports.autenticarUsuario = async (req,res) => {
    //revisar si hay errores
    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    //extraer email y password

    const{ email, password} = req.body;

    try {
        //revisar que sea un usuario registrado
        let usuario = await Usuario.findOne({email});
        if(!usuario){
            return res.status(400).json({msg: 'El usuario no existe' });
        }

        // valida el password
        const passCorrecto = await bcryptjs.compare(password, usuario.password )
        if(!passCorrecto){
            return res.status(400).json({msg: 'Password Incorrecto'});
        }

        // crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id,
                edad: "20",
            }
        };

        // firmar el JWT es correcto
        jwt.sign(payload, process.env.SECRETA, {
            /// tiempo que caduca el usuairo
            // en react no hay sesiones
            expiresIn: 3600  // esta en segundos .. es una hora

        }, (error, token) => {
            if (error) throw error;

             // mensaje de confirmacin
            res.json({ token }); 
        });

    } catch (error) {
        console.log(error);
        res.status(500),json({msg: 'Hubo un error en el servidor'});
    }

}

exports.usuarioAutenticado = async (req,res) => {
    try {
        //.select('-password' para decir que el password no se lo requiere
        const usuario = await Usuario.findById(req.usuario.id).select('-password') ;
        res.json({usuario});
    } catch (error) {
        console.log(error);
        res.status(500),json({msg: 'Hubo un error en el servidor'});
    }
} 