const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

// Siempre que se haga cualquier operacion en especial con asyn
exports.crearProyecto = async ( req,res ) => {
   
     //valido errores
    //revisar si hay errores
    // const errores = validationResult(req);

    // if(!errores.isEmpty()){
    //     return res.status(400).json({errores: errores.array()});
    // }

   


    try {
        // crear nuevo proyecto

        const proyecto = new Proyecto(req.body);
        
       
        
        // guardar el creador via JWT
        proyecto.creador = req.usuario.id;

        await proyecto.save();
        res.json({proyecto});
    
    } catch (error)  {
        console.log(error);
        res.status(500).send(error);
        
    }
}

//obtiene todos los proyectos del usuario actual
exports.obtenerProyetos = async (req,res) =>{
    try {
        const  proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({creador: -1}) ;
        res.json({proyectos});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Actualiza uun proyecto

exports.actualizaProyecto = async(req,res) => {
    //valido errores
    const errores =  validationResult(req);
    if (!errores.isEmpty()){
      return  res.status(400).json({errores: errores.array()});
    }

    // extraer la informacion del proyecto
    const { nombre } = req.body;
    const nuevoProyecto = {};

    if(nombre) {
        nuevoProyecto.nombre = nombre
    }
    try {
        // revisar el id.. params lo toma del route
        // las conusltas siempre van con await
     //   console.log(req.params);
        let proyecto =  await Proyecto.findById(req.params.id);

        if (!proyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        // verificar el creador del proyecto.. se anadio una capa mas de segurdiad
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'});
        }
        
        //actualizar
        proyecto = await Proyecto.findByIdAndUpdate({ _id: req.params.id },
                                                    {$set : nuevoProyecto},
                                                    {new: true} );

       res.json({proyecto});       
        
        
    } catch (error) {
        console.log(error);
        return res.status(500).send('Error en el servidor')
    }

   
}

exports.eliminarProyecto = async (req,res) => {
     try {
         // revisar el id.. params lo toma del route
         // las conusltas siempre van con await
      //   console.log(req.params);
         let proyecto =  await Proyecto.findById(req.params.id);
 
         if (!proyecto){
             return res.status(404).json({msg: 'Proyecto no encontrado'})
         }
 
         // verificar el creador del proyecto.. se anadio una capa mas de segurdiad
         if(proyecto.creador.toString() !== req.usuario.id){
             return res.status(401).json({msg: 'No Autorizado'});
         }
         
        // eliminar el proyecto

        await Proyecto.findOneAndRemove({_id: req.params.id});

        res.json({msg: 'Proyecto Eliminado'});
         
         
     } catch (error) {
        
         return res.status(500).json({msg: 'Error en el servidor'});
     }
}