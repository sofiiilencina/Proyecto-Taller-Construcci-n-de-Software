const express = require( 'express' );
const cors = require( 'cors' )
const mysql = require( 'mysql2' )

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


// Agregar Producto
app.post("/productos", (req, res) => {
    const { precio, stock, nombre, idcliente } = req.body;
    if (precio === undefined || nombre === undefined || stock === undefined) {
        return res.status(400).json({ error: "El precio, el nombre y el stock del producto son obligatorios" });
    }
    const consulta = `INSERT INTO producto (precio, nombre, stock, idcliente) VALUES (?, ?, ?, ?)`;
    conexion.query(consulta, [precio, nombre, stock, idcliente], (error, resultado) => {
        if (error) {
            return res.status(500).json({ error: "Error al cargar" });
        }
        res.status(201).json({
            mensaje: "Producto creado correctamente"
        });
    });
});
   



//select (email,contraseña) from cliente =>Para iniciar sesion
//insert into cliente (cliente_nombre,cliente_apeliido,email,contraseña)

app.listen(PORT,()=>{
    console.log(`servidor escuchando en http://localhost:${PORT}`)
})
