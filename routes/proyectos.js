const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middleware/auth');
const {check} = require('express-validator');


//crea proyectos
//api/proyectos
router.post('/',
    auth,
     [
      
         check('nombre','El nombre del proyecto es obligatorio').not().isEmpty()
     ],
    proyectoController.crearProyecto
);

// obtener todos los proyectos
router.get('/',
    auth,
    proyectoController.obtenerProyetos

)

// actualizar proyectos por ID, :id es el parametro

router.put('/:id',
    auth,
    [
        check('nombre','El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.actualizaProyecto
);

//eliminar proyecto
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
);


module.exports = router;    