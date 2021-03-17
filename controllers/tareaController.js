const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const {validationResult} = require('express-validator');

exports.crearTarea = async (req,res) => {
    //valido errores
    const errores =  validationResult(req);

    if (!errores.isEmpty()){
      return  res.status(400).json({errores: errores.array()});
    }

    try {

        // extraer el proyecto y comprobar si existe
         const {proyecto} = req.body;

        const proyectoExiste = await Proyecto.findById(proyecto);

        if (!proyectoExiste){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

         // verificar el creador del proyecto.. se anadio una capa mas de segurdiad
         if(proyectoExiste.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'});
        }



        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json(tarea); 

    } catch (error) {
        console.log(error);
        return res.status(500).send('Hubo un error');
    }
}

exports.obtenerTareas = async (req,res) =>{

    try {

         // extraer el proyecto y comprobar si existe
         const {proyecto} = req.query;
        // console.log(req.query);

        const proyectoExiste = await Proyecto.findById(proyecto).sort({creado: -1})  ;

        if (!proyectoExiste){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

         // verificar el creador del proyecto.. se anadio una capa mas de segurdiad
         if(proyectoExiste.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'});
        }

        const tareas = await Tarea.find({proyecto}); // como se llama el campo igual que la variable. sole se pone proyecto
        res.json({tareas});
        
    } catch (error) {
        console.log(error);
        return res.status(500).send('Hubo un error en el servidor')
    }
}



exports.actualizarTarea = async (req,res) => {
    try {

       // extraer el proyecto y comprobar si existe
       const {proyecto, nombre, estado} = req.body;

        // si la tarea existe
        const tareaExiste = await Tarea.findById(req.params.id);

        if(!tareaExiste){
            return res.status(404).json({msg: 'Tarea no encontrada'});
        }

        const proyectoExiste = await Proyecto.findById(proyecto);

        // verificar el creador del proyecto.. se anadio una capa mas de segurdiad
        if(proyectoExiste.creador.toString() !== req.usuario.id){
           return res.status(401).json({msg: 'No Autorizado'});
       }

       // crear un objeto con la nueva informacion
       const nuevaTarea={};
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;
      
      // guardar la tarea
       const tarea = await Tarea.findOneAndUpdate({_id: req.params.id},
                                                  nuevaTarea,
                                                  {new: true} );
        res.json({tarea});                                     

    } catch (error) {
        console.log(error);
        return res.status(500).send('Hubo un error en el servidor');
    }
}

exports.eliminarTarea = async (req,res) => {
    try {
        const {proyecto} = req.query;

        // si la tarea existe
        const tareaExiste = await Tarea.findById(req.params.id);

        if(!tareaExiste){
            return res.status(404).json({msg: 'Tarea no encontrada'});
        }

        const proyectoExiste = await Proyecto.findById(proyecto);

        // verificar el creador del proyecto.. se anadio una capa mas de segurdiad
        if(proyectoExiste.creador.toString() !== req.usuario.id){
           return res.status(401).json({msg: 'No Autorizado'});
       }
       
      
       // eliminar el proyecto

       await Tarea.findByIdAndRemove({_id: req.params.id});

   

       res.json({msg: 'Proyecto Eliminado'});

    } catch (error) {
        console.log(error);
        return res.status(500).send('Hubo un error en el servidor');
    }
}