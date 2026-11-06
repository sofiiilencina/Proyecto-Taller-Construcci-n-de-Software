const express = require(' express');
const cors = require( 'cors')
const mysql = require( 'mysql2')

const app = express()

app. use(cors())
app. use(express. json())

const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "putiq",
    database: "mydb"
})
   const PORT = 3000

//select (email,contraseña) from cliente =>Para iniciar sesion
//insert into cliente (cliente_nombre,cliente_apeliido,email,contraseña)

app.listen(PORT,()=>{
    console.log(`servidor escuchando en http://localhost:${PORT}`)
})
