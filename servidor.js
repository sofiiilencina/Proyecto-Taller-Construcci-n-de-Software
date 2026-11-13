const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

app.use(cors());
app.use(express.json());

const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "putiq",
    database: "mydb"
});

const PORT = 3000;

// ==========================================
// 1. CLIENTE
// ==========================================

// Registrar cliente
app.post("/cliente", (req, res) => {
    const { apellido_cliente, nombre_cliente, email, contraseña } = req.body;
    
    if (!apellido_cliente || !nombre_cliente || !email || !contraseña) {
        return res.status(400).json({ error: "Todos los campos del cliente son obligatorios" });
    }

    const consulta = `INSERT INTO cliente (apellido_cliente, nombre_cliente, email, contraseña, soporte_idsoporte, turno_idturno) VALUES (?, ?, ?, ?, 1, 1)`;
    
    conexion.query(consulta, [apellido_cliente, nombre_cliente, email, contraseña], (error, resultado) => {
        if (error) {
            console.error("Error en MySQL:", error); // Muestra el error real en tu terminal
            return res.status(500).json({ 
                error: "Error al registrar el cliente", 
                detalle: error.sqlMessage // Envía el mensaje exacto de MySQL para ayudarte a corregirlo
            });
        }
        
        res.status(201).json({
            mensaje: "Cliente registrado correctamente",
            id_nuevo_cliente: resultado.insertId
        });
    });
});

// Actualizar cliente
app.put("/cliente/:id", (req, res) => {
    const { id } = req.params;
    const { apellido_cliente, nombre_cliente, email, contraseña } = req.body;
    const consulta = `UPDATE cliente SET apellido_cliente = ?, nombre_cliente = ?, email = ?, contraseña = ? WHERE idcliente = ?`;
    conexion.query(consulta, [apellido_cliente, nombre_cliente, email, contraseña, id], (error, resultado) => {
        if (error) {
            return res.status(500).json({ error: "Error al actualizar el cliente" });
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }
        res.status(200).json({ mensaje: "Cliente actualizado correctamente" });
    });
});

// Iniciar sesión (Login extra para validar)
app.post("/login", (req, res) => {
    const { email, contraseña } = req.body;
    const consulta = `SELECT * FROM cliente WHERE email = ? AND contraseña = ?`;
    
    conexion.query(consulta, [email, contraseña], (error, resultados) => {
        if (error) return res.status(500).json({ error: "Error en el servidor" });
        if (resultados.length === 0) return res.status(401).json({ error: "Credenciales incorrectas" });

        const usuario = resultados[0];

        res.status(200).json({
            mensaje: "Inicio de sesión exitoso",
            rol: usuario.rol, // 'admin' o 'usuario'
            cliente: usuario
        });
    });
});


// ==========================================
// 2. STAFF
// ==========================================

// Consultar disponibilidad horaria de un miembro del staff por DNI
app.get("/staff/:dnistaff/disponibilidad", (req, res) => {
    const { dnistaff } = req.params;
    const consulta = `SELECT disponibilidad_horaria FROM staff WHERE dnistaff = ?`;
    conexion.query(consulta, [dnistaff], (error, resultados) => {
        if (error) return res.status(500).json({ error: "Error al consultar disponibilidad" });
        if (resultados.length === 0) return res.status(404).json({ error: "Staff no encontrado" });
        res.status(200).json(resultados[0]);
    });
});

// Actualizar disponibilidad horaria del staff
app.put("/staff/:dnistaff/disponibilidad", (req, res) => {
    const { dnistaff } = req.params;
    const { disponibilidad_horaria } = req.body;
    const consulta = `UPDATE staff SET disponibilidad_horaria = ? WHERE dnistaff = ?`;
    conexion.query(consulta, [disponibilidad_horaria, dnistaff], (error, resultado) => {
        if (error) return res.status(500).json({ error: "Error al actualizar disponibilidad" });
        if (resultado.affectedRows === 0) return res.status(404).json({ error: "Staff no encontrado" });
        res.status(200).json({ mensaje: "Disponibilidad actualizada correctamente" });
    });
});

// Actualizar turno asignado al staff
app.put("/staff/:dnistaff/turno", (req, res) => {
    const { dnistaff } = req.params;
    const { turno_idturno } = req.body;
    const consulta = `UPDATE staff SET turno_idturno = ? WHERE dnistaff = ?`;
    conexion.query(consulta, [turno_idturno, dnistaff], (error, resultado) => {
        if (error) return res.status(500).json({ error: "Error al actualizar el turno del staff" });
        if (resultado.affectedRows === 0) return res.status(404).json({ error: "Staff no encontrado" });
        res.status(200).json({ mensaje: "Turno del staff actualizado correctamente" });
    });
});

// Obtener todo el staff (útil para selects)
app.get("/staff", (req, res) => {
    conexion.query(`SELECT * FROM staff`, (error, resultados) => {
        if (error) return res.status(500).json({ error: "Error al obtener el staff" });
        res.status(200).json(resultados);
    });
});

// CREAR STAFF (Create)
app.post("/staff", (req, res) => {
    const { dnistaff, nombre, apellido_staff, disponibilidad_horaria, especialidad} = req.body;
    if (!dnistaff || !nombre || !apellido_staff || !disponibilidad_horaria || !especialidad ) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }
    const consulta = `INSERT INTO staff (dnistaff, nombre, apellido_staff, disponibilidad_horaria, especialidad, turno_idturno) VALUES (?, ?, ?, ?, ?, 1)`;
    conexion.query(consulta, [dnistaff, nombre, apellido_staff, disponibilidad_horaria, especialidad], (error, resultado) => {
        if (error) {
            return res.status(500).json({ error: "Error al registrar el staff (verificá que el DNI no exista y que el ID de turno sea válido)" });
        }
        res.status(201).json({ mensaje: "Profesional agregado correctamente" });
    });
});

// ACTUALIZAR STAFF COMPLETO (Update)
app.put("/staff/:dnistaff", (req, res) => {
    const { dnistaff } = req.params;
    const { nombre, apellido_staff, disponibilidad_horaria, especialidad, turno_idturno } = req.body;
    const consulta = `UPDATE staff SET nombre = ?, apellido_staff = ?, disponibilidad_horaria = ?, especialidad = ?, turno_idturno = ? WHERE dnistaff = ?`;
    conexion.query(consulta, [nombre, apellido_staff, disponibilidad_horaria, especialidad, turno_idturno, dnistaff], (error, resultado) => {
        if (error) return res.status(500).json({ error: "Error al actualizar el staff" });
        if (resultado.affectedRows === 0) return res.status(404).json({ error: "Profesional no encontrado" });
        res.status(200).json({ mensaje: "Datos del profesional actualizados" });
    });
});

// ELIMINAR STAFF (Delete)
app.delete("/staff/:dnistaff", (req, res) => {
    const { dnistaff } = req.params;
    const consulta = `DELETE FROM staff WHERE dnistaff = ?`;
    conexion.query(consulta, [dnistaff], (error, resultado) => {
        if (error) return res.status(500).json({ error: "Error al eliminar el profesional" });
        if (resultado.affectedRows === 0) return res.status(404).json({ error: "Profesional no encontrado" });
        res.status(200).json({ mensaje: "Profesional eliminado correctamente" });
    });
});


// ==========================================
// 3. TURNO
// ==========================================

// Insertar Turno
app.post("/turno", (req, res) => {
    const { fecha, hora, tipo_servicios } = req.body;
    if (!fecha || !hora || !tipo_servicios) {
        return res.status(400).json({ error: "Fecha, hora y tipo de servicio son obligatorios" });
    }
    const consulta = `INSERT INTO turno (fecha, hora, tipo_servicios) VALUES (?, ?, ?)`;
    conexion.query(consulta, [fecha, hora, tipo_servicios], (error, resultado) => {
        if (error) return res.status(500).json({ error: "Error al registrar el turno" });
        res.status(201).json({ mensaje: "Turno registrado correctamente", idturno: resultado.insertId });
    });
});

// Actualizar Turno
app.put("/turno/:idturno", (req, res) => {
    const { idturno } = req.params;
    const { fecha, hora } = req.body;
    const consulta = `UPDATE turno SET fecha = ?, hora = ? WHERE idturno = ?`;
    conexion.query(consulta, [fecha, hora, idturno], (error, resultado) => {
        if (error) return res.status(500).json({ error: "Error al actualizar el turno" });
        if (resultado.affectedRows === 0) return res.status(404).json({ error: "Turno no encontrado" });
        res.status(200).json({ mensaje: "Turno actualizado correctamente" });
    });
});

// Eliminar Turno
app.delete("/turno/:idturno", (req, res) => {
    const { idturno } = req.params;
    const consulta = `DELETE FROM turno WHERE idturno = ?`;
    conexion.query(consulta, [idturno], (error, resultado) => {
        if (error) return res.status(500).json({ error: "Error al eliminar el turno" });
        if (resultado.affectedRows === 0) return res.status(404).json({ error: "Turno no encontrado" });
        res.status(200).json({ mensaje: "Turno eliminado correctamente" });
    });
});


// ==========================================
// 4. SOPORTE (Contacto)
// ==========================================

// Insertar mensaje de soporte
app.post("/soporte", (req, res) => {
    const { nombre, email, asunto, mensaje } = req.body;
    if (!nombre || !email || !mensaje) {
        return res.status(400).json({ error: "Nombre, email y mensaje son obligatorios" });
    }
    const consulta = `INSERT INTO soporte (nombre, email, asunto, mensaje) VALUES (?, ?, ?, ?)`;
    conexion.query(consulta, [nombre, email, asunto || "General", mensaje], (error, resultado) => {
        if (error) return res.status(500).json({ error: "Error al guardar el mensaje de soporte" });
        res.status(201).json({ mensaje: "Mensaje de soporte enviado correctamente", idsoporte: resultado.insertId });
    });
});

// Actualizar soporte
app.put("/soporte/:idsoporte", (req, res) => {
    const { idsoporte } = req.params;
    const { asunto, mensaje } = req.body;
    const consulta = `UPDATE soporte SET asunto = ?, mensaje = ? WHERE idsoporte = ?`;
    conexion.query(consulta, [asunto, mensaje, idsoporte], (error, resultado) => {
        if (error) return res.status(500).json({ error: "Error al actualizar soporte" });
        if (resultado.affectedRows === 0) return res.status(404).json({ error: "Registro de soporte no encontrado" });
        res.status(200).json({ mensaje: "Soporte actualizado correctamente" });
    });
});


// ==========================================
// 5. PRODUCTOS (CRUD Completo)
// ==========================================

// Leer todos los productos (Read)
app.get("/productos", (req, res) => {
    conexion.query("SELECT * FROM producto", (error, resultados) => {
        if (error) return res.status(500).json({ error: "Error al obtener los productos" });
        res.status(200).json(resultados);
    });
});

// Crear producto (Create)
app.post("/productos", (req, res) => {
    const { precio, stock, nombre } = req.body;
    if (precio === undefined || nombre === undefined || stock === undefined) {
        return res.status(400).json({ error: "Precio, nombre y stock son obligatorios" });
    }
    const consulta = `INSERT INTO producto (precio, nombre, stock) VALUES (?, ?, ?)`;
    conexion.query(consulta, [precio, nombre, stock], (error, resultado) => {
        if (error) return res.status(500).json({ error: "Error al crear el producto" });
        res.status(201).json({ mensaje: "Producto creado correctamente", codigo: resultado.insertId });
    });
});

// Actualizar producto (Update)
app.put("/producto/:codigo", (req, res) => {
    const { codigo } = req.params;
    const { nombre, precio, stock } = req.body;
    const consulta = `UPDATE producto SET nombre = ?, precio = ?, stock = ? WHERE codigo = ?`;
    conexion.query(consulta, [nombre, precio, stock, codigo], (error, resultado) => {
        if (error) return res.status(500).json({ error: "Error al actualizar el producto" });
        if (resultado.affectedRows === 0) return res.status(404).json({ error: "Producto no encontrado" });
        res.status(200).json({ mensaje: "Producto actualizado correctamente" });
    });
});

// Eliminar producto (Delete)
app.delete("/producto/:codigo", (req, res) => {
    const { codigo } = req.params;
    const consulta = `DELETE FROM producto WHERE codigo = ?`;
    conexion.query(consulta, [codigo], (error, resultado) => {
        if (error) return res.status(500).json({ error: "Error al eliminar el producto" });
        if (resultado.affectedRows === 0) return res.status(404).json({ error: "Producto no encontrado" });
        res.status(200).json({ mensaje: "Producto eliminado correctamente" });
    });
});


app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});