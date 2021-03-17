const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
// express-validatos
// la validacion va en el router y el resultado va en el controlador

exports.crearUsuario = async (req,res) => {

    

    //revisar si hay errores
    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    // extraer email y password
    const {email, password} = req.body;
 
    
    try{
        // validad que el usuario registrado sea unico
        let usuario = await Usuario.findOne({ email });

        if (usuario){
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        // creae el nuevo usuario
        usuario = new Usuario(req.body);

        //hash a la clave
        const salt = await bcryptjs.genSalt(10);

        usuario.password = await bcryptjs.hash(password, salt);

        // guardar el nuevo usuario
        await usuario.save();

        // crear y firmar el JWT si todo es correcto
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        // firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            /// tiempo que caduca el usuairo
            // en react no hay sesiones
            expiresIn: 3600  // esta en segundos .. es una hora

        }, (error, token) => {
            if (error) throw error;

             // mensaje de confirmacin
            res.json({ token }); 
        });
  
    } catch(error) {
        console.log(error);
        res.status(400).send('hubo un error');
    }

 }