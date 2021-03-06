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
//app.use(cors(  { credentials: true, origin: 'https://desolate-plains-36017.herokuapp.com/' } ));
//app.use(cors({origin: 'https://desolate-plains-36017.herokuapp.com'}));
//app.use(cors());
app.use(cors({ credentials: true, origin: true }));
app.options("*", cors())

//habilitar express.json
app.use( express.json ({ extended: true}));
 
// crear puerto de la app
const port = process.env.PORT  || 4000; 

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
app.listen(port,'0.0.0.0',() =>{
    console.log(`Nota: el servidor esta funcionando en el puerto ${port}` )
});