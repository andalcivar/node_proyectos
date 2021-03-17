// importamos express
const express = require('express');
const conectarDB = require('./config/db')
const cors = require('cors');



/*** DEPENDENCIAS INSTALLADAS
 * npm install jsonwebtoken -- json web token
 * npm i express-validator -- para validar cuando se guarde un formulario
 * npm install bcryptjs -- convierte en hash cualquier cadena de texto
 * npm i express mongoose dotenv -- (expres para las api) ( mongo como base de datos) ( dotenv para que funciones las varialbes.env)
 * npm install -D nodemon  (refresca el servidor cada que hacemos cambios)
 * npm i cors -- permite peticiones de otro dominio ( si no se lo instala dara error de CORS)
 */
// crear el servidor
const app = express();

// conectar a la bd
conectarDB();

// habilita cors
app.use(cors());

//habilitar express.json
app.use( express.json ({ extended: true}));
 
// crear puerto de la app
const PORT = process.env.PORT  || 4000;

// definir la pagina principal 
// verifica que el servidor esta corriendo correctamente
/*
app.get('/', (req,res) => {
    res.send('hola mundo')
});
*/
// importar rutas
app.use('/api/usuarios', require('./routes/usuarios') );
app.use('/api/auth', require('./routes/auth') );
app.use('/api/proyectos', require('./routes/proyectos') );
app.use('/api/tareas', require('./routes/tareas') );

// arrancar la app
app.listen(PORT,() =>{
    console.log(`el servidor esta funcionando en el puerto ${PORT}` )
});