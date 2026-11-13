/* ------------------------------------------------------------
   EVENTO 1: Menú hamburguesa (versión mobile)
------------------------------------------------------------ */
let botonMenu, listaLinks;

try {
    botonMenu = document.getElementById("menu-toggle");
    listaLinks = document.querySelector(".nav-links");

    if (botonMenu && listaLinks) {
        botonMenu.addEventListener("click", function () {
            listaLinks.classList.toggle("abierta");
            const estaAbierto = listaLinks.classList.contains("abierta");
            botonMenu.setAttribute("aria-expanded", estaAbierto);
        });
    }
} catch (error) {
    console.error("Error en el evento del menú hamburguesa:", error);
}


/* ------------------------------------------------------------
   EVENTO 2: Cerrar el menú con la tecla Escape
------------------------------------------------------------ */
try {
    document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape" && listaLinks && listaLinks.classList.contains("abierta")) {
            listaLinks.classList.remove("abierta");
            if (botonMenu) {
                botonMenu.setAttribute("aria-expanded", "false");
            }
        }
    });
} catch (error) {
    console.error("Error en el evento de Escape:", error);
}


/* ------------------------------------------------------------
   EVENTO 3: Aparece un "Ver más" al pasar el cursor sobre las tarjetas de servicio
------------------------------------------------------------ */
try {
    const tarjetasServicio = document.querySelectorAll(".servicio-item");

    tarjetasServicio.forEach(function (tarjeta) {
        const tip = document.createElement("span");
        tip.classList.add("tip-hover");
        tip.textContent = "Ver más";
        tarjeta.appendChild(tip);

        tarjeta.addEventListener("mouseover", function () {
            tip.classList.add("tip-visible");
        });

        tarjeta.addEventListener("mouseout", function () {
            tip.classList.remove("tip-visible");
        });
    });
} catch (error) {
    console.error("Error en el evento de tips de servicio:", error);
}


/* ------------------------------------------------------------
   EVENTO 4: Contador de caracteres en el mensaje del formulario de Contacto
------------------------------------------------------------ */
try {
    const mensajeTextarea = document.getElementById("mensaje");
    const contadorMensaje = document.getElementById("contador-mensaje");
    const LIMITE_CARACTERES = 300;

    if (mensajeTextarea && contadorMensaje) {
        contadorMensaje.textContent = "0 / " + LIMITE_CARACTERES + " caracteres";

        mensajeTextarea.addEventListener("input", function () {
            const cantidad = mensajeTextarea.value.length;
            contadorMensaje.textContent = cantidad + " / " + LIMITE_CARACTERES + " caracteres";

            if (cantidad > LIMITE_CARACTERES) {
                contadorMensaje.classList.add("contador-limite");
            } else {
                contadorMensaje.classList.remove("contador-limite");
            }
        });
    }
} catch (error) {
    console.error("Error en el contador de caracteres:", error);
}


/* ------------------------------------------------------------
   EVENTO 5: Confirmación al enviar el formulario
------------------------------------------------------------ */
let temporizadorMensaje;

try {
    const formularioContacto = document.querySelector("form");
    const mensajeEnvio = document.getElementById("mensaje-envio");

    if (formularioContacto && mensajeEnvio) {
        formularioContacto.addEventListener("submit", function (evento) {
            evento.preventDefault();

            clearTimeout(temporizadorMensaje);

            const nombre = document.getElementById("nombre").value.trim();
            const correo = document.getElementById("correo").value.trim();
            const mensajeTexto = document.getElementById("mensaje").value.trim();

            if (nombre === "" || correo === "" || mensajeTexto === "") {
                mensajeEnvio.textContent = "Por favor completá nombre, correo y mensaje antes de enviar.";
                mensajeEnvio.className = "mensaje-envio mensaje-error";
            } else {
                mensajeEnvio.textContent = "¡Gracias " + nombre + "! Recibimos tu consulta, te vamos a responder a la brevedad.";
                mensajeEnvio.className = "mensaje-envio mensaje-exito";

                formularioContacto.reset();

                const contadorMensaje = document.getElementById("contador-mensaje");
                if (contadorMensaje) {
                    contadorMensaje.textContent = "0 / 300 caracteres";
                    contadorMensaje.classList.remove("contador-limite");
                }
            }

            temporizadorMensaje = setTimeout(function () {
                mensajeEnvio.className = "mensaje-envio";
                mensajeEnvio.textContent = "";
            }, 4000);
        });
    }
} catch (error) {
    console.error("Error en el envío del formulario de contacto:", error);
}


/* ------------------------------------------------------------
   EVENTO 6: Botón cancelar del formulario de turnos
------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", function () {
    const btnCancelar = document.getElementById("btn-cancelar");

    if (btnCancelar) {
        btnCancelar.addEventListener("click", function () {
            window.history.back();
        });
    }
});


/* ------------------------------------------------------------
   EVENTO 7: Botón Volver de las páginas de productos
------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", function () {
    const btnVolver = document.getElementById("btn-volver");
    if (btnVolver) {
        btnVolver.addEventListener("click", function () {
            window.history.back();
        });
    }
});


/* ------------------------------------------------------------
   EVENTO 8: Lógica del Carrito, Drawer y Tarjetas de Productos
------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", function () {
    const enlaceCarrito = document.getElementById("enlace-carrito");
    const carritoDrawer = document.getElementById("carrito-drawer");
    const carritoOverlay = document.getElementById("carrito-overlay");
    const cerrarCarrito = document.getElementById("cerrar-carrito");
    const contadorCarrito = document.getElementById("contador-carrito");
    const contenedorItems = document.getElementById("carrito-items");
    const precioTotalSpan = document.getElementById("carrito-precio-total");

    // Cargar carrito desde localStorage (array de productos)
    let carrito = JSON.parse(localStorage.getItem("carritoProductos")) || [];

    function actualizarCarrito() {
        // Calcular cantidad total de productos para el contador
        const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        if (contadorCarrito) contadorCarrito.textContent = totalItems;

        // Renderizar items en el drawer
        if (contenedorItems) {
            contenedorItems.innerHTML = "";
            let precioTotal = 0;

            if (carrito.length === 0) {
                contenedorItems.innerHTML = '<p style="color: #ccc; text-align: center;">Tu carrito está vacío</p>';
            } else {
                carrito.forEach((item, index) => {
                    precioTotal += item.precio * item.cantidad;

                    const divItem = document.createElement("div");
                    divItem.classList.add("carrito-item");
                    divItem.innerHTML = `
                        <div class="carrito-item-img" style="background-image: url('${item.imagen}')"></div>
                        <div class="carrito-item-info">
                            <h4>${item.nombre}</h4>
                            <span>Cant: ${item.cantidad} | $${(item.precio * item.cantidad).toLocaleString()}</span>
                        </div>
                        <button class="btn-eliminar-item" data-index="${index}" title="Eliminar">🗑️</button>
                    `;
                    contenedorItems.appendChild(divItem);
                });
            }

            if (precioTotalSpan) {
                precioTotalSpan.textContent = `$${precioTotal.toLocaleString()}`;
            }
        }

        localStorage.setItem("carritoProductos", JSON.stringify(carrito));
    }

    actualizarCarrito();

    // Abrir y cerrar el Drawer del Carrito
    if (enlaceCarrito) {
        enlaceCarrito.addEventListener("click", function (e) {
            e.preventDefault();
            if (carritoDrawer && carritoOverlay) {
                carritoDrawer.classList.add("abierto");
                carritoOverlay.classList.add("activo");
            }
        });
    }

    function cerrarDrawer() {
        if (carritoDrawer && carritoOverlay) {
            carritoDrawer.classList.remove("abierto");
            carritoOverlay.classList.remove("activo");
        }
    }

    if (cerrarCarrito) cerrarCarrito.addEventListener("click", cerrarDrawer);
    if (carritoOverlay) carritoOverlay.addEventListener("click", cerrarDrawer);

    // Eliminar producto individual con el botón de basura
    if (contenedorItems) {
        contenedorItems.addEventListener("click", function (e) {
            if (e.target.classList.contains("btn-eliminar-item")) {
                const index = e.target.getAttribute("data-index");
                carrito.splice(index, 1);
                actualizarCarrito();
            }
        });
    }

    // Lógica de las tarjetas de productos (selector, sumar/restar y agregar)
    const tarjetas = document.querySelectorAll(".producto-card");

    tarjetas.forEach(tarjeta => {
        const btnComprar = tarjeta.querySelector(".btn-comprar");
        const selectorContainer = tarjeta.querySelector(".selector-cantidad-container");
        const btnRestar = tarjeta.querySelector(".btn-restar");
        const btnSumar = tarjeta.querySelector(".btn-sumar");
        const spanCantidad = tarjeta.querySelector(".cantidad-num");
        const btnAgregar = tarjeta.querySelector(".btn-agregar-carrito");

        const id = tarjeta.getAttribute("data-id");
        const nombre = tarjeta.getAttribute("data-nombre");
        const precio = parseFloat(tarjeta.getAttribute("data-precio"));
        const imagenBg = tarjeta.querySelector(".producto-imagen").style.backgroundImage;
        const imagen = imagenBg.slice(5, -2).replace(/['"]/g, "");

        let cantidadActual = 1;

        if (btnComprar && selectorContainer) {
            btnComprar.addEventListener("click", function () {
                btnComprar.style.display = "none";
                selectorContainer.style.display = "flex";
            });
        }

        if (btnRestar && spanCantidad) {
            btnRestar.addEventListener("click", function () {
                if (cantidadActual > 1) {
                    cantidadActual--;
                    spanCantidad.textContent = cantidadActual;
                }
            });
        }

        if (btnSumar && spanCantidad) {
            btnSumar.addEventListener("click", function () {
                cantidadActual++;
                spanCantidad.textContent = cantidadActual;
            });
        }

        if (btnAgregar) {
            btnAgregar.addEventListener("click", function () {
                const productoExistente = carrito.find(item => item.id === id);

                if (productoExistente) {
                    productoExistente.cantidad += cantidadActual;
                } else {
                    carrito.push({ id, nombre, precio, imagen, cantidad: cantidadActual });
                }

                actualizarCarrito();

                if (selectorContainer && btnComprar && spanCantidad) {
                    selectorContainer.style.display = "none";
                    btnComprar.style.display = "block";
                    cantidadActual = 1;
                    spanCantidad.textContent = "1";
                }

                if (carritoDrawer && carritoOverlay) {
                    carritoDrawer.classList.add("abierto");
                    carritoOverlay.classList.add("activo");
                }
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LÓGICA PARA INICIAR SESIÓN (login.html) ---
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('correo-login').value;
            const contraseña = document.getElementById('password-login').value;

            try {
                const res = await fetch('http://localhost:3000/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, contraseña })
                });
                const data = await res.json();
                if (res.ok) {
                    alert(data.mensaje);
                    // Guardamos el cliente en localStorage por si lo usas después
                    localStorage.setItem('clienteLogueado', JSON.stringify(data.cliente));
                    window.location.href = 'index.html';
                } else {
                    alert(data.error || 'Credenciales incorrectas');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('No se pudo conectar con el servidor');
            }
        });
    }

    // --- 2. LÓGICA PARA REGISTRO (registro.html) ---
    const formRegistro = document.getElementById('form-registro') || document.querySelector('.registro-form');
    if (formRegistro) {
        formRegistro.addEventListener('submit', async (e) => {
            e.preventDefault();
            // Asegúrate de que los IDs en tu registro.html coincidan con estos
            const nombre_cliente = document.getElementById('nombre-reg')?.value || document.getElementById('nombre')?.value;
            const apellido_cliente = document.getElementById('apellido-reg')?.value || document.getElementById('apellido')?.value;
            const email = document.getElementById('email-reg')?.value || document.getElementById('correo')?.value;
            const contraseña = document.getElementById('password-reg')?.value || document.getElementById('contraseña')?.value;

            try {
                const res = await fetch('http://localhost:3000/cliente', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ apellido_cliente, nombre_cliente, email, contraseña })
                });
                const data = await res.json();
                if (res.ok) {
                    alert(data.mensaje);
                    window.location.href = 'login.html';
                } else {
                    alert(data.error || 'Error al registrarse');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error de conexión con el servidor');
            }
        });
    }

    // --- 3. LÓGICA PARA CONTACTO / SOPORTE (Contacto.html) ---
    const formContacto = document.querySelector('.contacto-grid form');
    if (formContacto) {
        const mensajeEnvio = document.getElementById('mensaje-envio');

        formContacto.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('correo').value;
            const asunto = document.getElementById('asunto').value;
            const mensaje = document.getElementById('mensaje').value;

            try {
                const res = await fetch('http://localhost:3000/soporte', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre, email, asunto, mensaje })
                });
                const data = await res.json();
                if (res.ok) {
                    if (mensajeEnvio) {
                        mensajeEnvio.textContent = data.mensaje;
                        mensajeEnvio.style.color = 'green';
                    } else {
                        alert(data.mensaje);
                    }
                    formContacto.reset();
                } else {
                    if (mensajeEnvio) {
                        mensajeEnvio.textContent = data.error || 'Error al enviar';
                        mensajeEnvio.style.color = 'red';
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                if (mensajeEnvio) {
                    mensajeEnvio.textContent = 'Error de conexión con el servidor';
                    mensajeEnvio.style.color = 'red';
                }
            }
        });
    }

    // --- 4. LÓGICA PARA RESERVAR TURNOS Y CARGAR STAFF (Reservar.html) ---
    const selectProfesional = document.getElementById('select-profesional');
    if (selectProfesional) {
        // Cargar el staff desde la base de datos al selector
        async function cargarStaff() {
            try {
                const res = await fetch('http://localhost:3000/staff');
                const staffList = await res.json();
                selectProfesional.innerHTML = '<option value="">Selecciona un profesional</option>';
                staffList.forEach(st => {
                    const opt = document.createElement('option');
                    opt.value = st.dnistaff;
                    opt.textContent = `${st.nombre} ${st.apellido_staff} - (${st.especialidad})`;
                    selectProfesional.appendChild(opt);
                });
            } catch (error) {
                console.error('Error cargando staff:', error);
                selectProfesional.innerHTML = '<option value="">Error al cargar staff</option>';
            }
        }
        cargarStaff();

        // Enviar el formulario de reserva de turnos
        const formReserva = document.getElementById('form-reserva');
        if (formReserva) {
            formReserva.addEventListener('submit', async (e) => {
                e.preventDefault();
                // Puedes ajustar estos valores según los inputs que tengas en tu HTML de reservas
                const fecha = "2026-06-15"; 
                const hora = "11:00";       
                const tipo_servicios = "Atención General Boutique";

                try {
                    const res = await fetch('http://localhost:3000/turno', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ fecha, hora, tipo_servicios })
                    });
                    const data = await res.json();
                    if (res.ok) {
                        alert(data.mensaje);
                        formReserva.reset();
                    } else {
                        alert(data.error || 'Error al reservar el turno');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('No se pudo conectar con el servidor');
                }
            });
        }
    }

});

// --- 5. LÓGICA PARA EL CATÁLOGO Y CARRITO DE COMPRAS ---
document.addEventListener('DOMContentLoaded', () => {

    // A. Mostrar/Ocultar el selector de cantidad al hacer clic en "Comprar"
    const botonesComprar = document.querySelectorAll('.btn-comprar');
    botonesComprar.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const card = e.target.closest('.producto-card');
            const btnComprar = card.querySelector('.btn-comprar');
            const selectorCantidad = card.querySelector('.selector-cantidad-container');

            // Oculta el botón comprar y muestra los controles de cantidad
            btnComprar.style.display = 'none';
            selectorCantidad.style.display = 'flex';
        });
    });

    // B. Controladores de sumar y restar cantidad
    const tarjetasProductos = document.querySelectorAll('.producto-card');
    tarjetasProductos.forEach(card => {
        const btnRestar = card.querySelector('.btn-restar');
        const btnSumar = card.querySelector('.btn-sumar');
        const spanCantidad = card.querySelector('.cantidad-num');
        const btnAgregarCarrito = card.querySelector('.btn-agregar-carrito');

        if (btnSumar && btnRestar && spanCantidad) {
            let cantidad = 1;

            btnSumar.addEventListener('click', () => {
                cantidad++;
                spanCantidad.textContent = cantidad;
            });

            btnRestar.addEventListener('click', () => {
                if (cantidad > 1) {
                    cantidad--;
                    spanCantidad.textContent = cantidad;
                }
            });

            // C. Agregar producto al carrito y guardarlo
            if (btnAgregarCarrito) {
                btnAgregarCarrito.addEventListener('click', () => {
                    const id = card.getAttribute('data-id');
                    const nombre = card.getAttribute('data-nombre') || card.querySelector('h3').textContent;
                    const precioTexto = card.getAttribute('data-precio') || card.querySelector('.producto-precio').textContent;
                    // Limpiamos el precio para dejarlo como número (ej: "$15.000" a 15000)
                    const precio = parseFloat(precioTexto.replace('$', '').replace(/\./g, '').replace(',', '.'));

                    const itemCarrito = {
                        id: id,
                        nombre: nombre,
                        precio: precio,
                        cantidad: cantidad
                    };

                    // Recuperamos el carrito actual del localStorage o creamos uno nuevo
                    let carrito = JSON.parse(localStorage.getItem('carritoBoutique')) || [];
                    
                    // Verificamos si el producto ya estaba en el carrito para sumar la cantidad
                    const index = carrito.findIndex(item => item.id === id);
                    if (index !== -1) {
                        carrito[index].cantidad += cantidad;
                    } else {
                        carrito.push(itemCarrito);
                    }

                    // Guardamos de nuevo en el navegador
                    localStorage.setItem('carritoBoutique', JSON.stringify(carrito));

                    alert(`¡${nombre} x${cantidad} agregado al carrito!`);
                    
                    // Reseteamos la vista de la tarjeta
                    card.querySelector('.selector-cantidad-container').style.display = 'none';
                    card.querySelector('.btn-comprar').style.display = 'block';
                    cantidad = 1;
                    spanCantidad.textContent = '1';
                });
            }
        }
    });

});

// --- CRUD COMPLETO DE STAFF (gestion_staff.html) ---
const formStaffCrud = document.getElementById('form-staff-crud');
const tablaStaffBody = document.getElementById('tabla-staff-body');

if (formStaffCrud && tablaStaffBody) {
    const modoEdicionInput = document.getElementById('modo-edicion');
    const dniInput = document.getElementById('dnistaff');
    const nombreInput = document.getElementById('nombre-staff');
    const apellidoInput = document.getElementById('apellido-staff');
    const especialidadInput = document.getElementById('especialidad-staff');
    const disponibilidadInput = document.getElementById('disponibilidad-staff');
    const turnoIdInput = document.getElementById('turno-id');
    const tituloForm = document.getElementById('titulo-form-staff');
    const btnGuardar = document.getElementById('btn-guardar-staff');
    const btnCancelar = document.getElementById('btn-cancelar-edicion');
    const mensajeStaff = document.getElementById('mensaje-staff');

    // 1. LEER (Cargar tabla)
    async function cargarTablaStaff() {
        try {
            const res = await fetch('http://localhost:3000/staff');
            const lista = await res.json();
            tablaStaffBody.innerHTML = '';

            lista.forEach(prof => {
                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid #333';
                tr.innerHTML = `
                    <td style="padding: 12px;">${prof.dnistaff}</td>
                    <td style="padding: 12px;">${prof.nombre} ${prof.apellido_staff}</td>
                    <td style="padding: 12px;">${prof.especialidad}</td>
                    <td style="padding: 12px;">${prof.disponibilidad_horaria}</td>
                    <td style="padding: 12px;">${prof.turno_idturno}</td>
                    <td style="padding: 12px; text-align: center;">
                        <button type="button" class="btn-editar-staff" data-prof='${JSON.stringify(prof)}' style="background: rgb(246, 112, 181); color: #fff; border: none; padding: 6px 12px; border-radius: 10px; cursor: pointer; margin-right: 5px;">Editar</button>
                        <button type="button" class="btn-eliminar-staff" data-dni="${prof.dnistaff}" style="background: #d9534f; color: #fff; border: none; padding: 6px 12px; border-radius: 10px; cursor: pointer;">Eliminar</button>
                    </td>
                `;
                tablaStaffBody.appendChild(tr);
            });

            asignarEventosBotones();
        } catch (error) {
            console.error('Error al cargar la tabla:', error);
        }
    }

    // 2. CREAR / ACTUALIZAR (Submit del formulario)
    formStaffCrud.addEventListener('submit', async (e) => {
        e.preventDefault();
        const modo = modoEdicionInput.value;
        const datos = {
            dnistaff: dniInput.value,
            nombre: nombreInput.value,
            apellido_staff: apellidoInput.value,
            especialidad: especialidadInput.value,
            disponibilidad_horaria: disponibilidadInput.value,
            turno_idturno: turnoIdInput.value
        };

        try {
            let url = 'http://localhost:3000/staff';
            let method = 'POST';

            if (modo === 'editar') {
                url = `http://localhost:3000/staff/${datos.dnistaff}`;
                method = 'PUT';
            }

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            const respuesta = await res.json();
            if (res.ok) {
                mensajeStaff.textContent = respuesta.mensaje;
                mensajeStaff.style.color = '#4caf50';
                resetearFormulario();
                cargarTablaStaff();
            } else {
                mensajeStaff.textContent = respuesta.error || 'Ocurrió un error';
                mensajeStaff.style.color = '#f44336';
            }
        } catch (error) {
            mensajeStaff.textContent = 'Error de conexión con el servidor';
            mensajeStaff.style.color = '#f44336';
        }
    });

    // 3. ASIGNAR EVENTOS A EDITAR Y ELIMINAR
    function asignarEventosBotones() {
        // Botón Editar
        document.querySelectorAll('.btn-editar-staff').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const prof = JSON.parse(e.target.getAttribute('data-prof'));
                modoEdicionInput.value = 'editar';
                dniInput.value = prof.dnistaff;
                dniInput.disabled = true; // No se edita la clave primaria
                nombreInput.value = prof.nombre;
                apellidoInput.value = prof.apellido_staff;
                especialidadInput.value = prof.especialidad;
                disponibilidadInput.value = prof.disponibilidad_horaria;
                turnoIdInput.value = prof.turno_idturno;

                tituloForm.textContent = `Editando a ${prof.nombre} ${prof.apellido_staff}`;
                btnGuardar.textContent = 'Actualizar Datos';
                btnCancelar.style.display = 'inline-block';
            });
        });

        // Botón Eliminar
        document.querySelectorAll('.btn-eliminar-staff').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const dni = e.target.getAttribute('data-dni');
                if (confirm(`¿Seguro que querés eliminar al profesional con DNI ${dni}?`)) {
                    try {
                        const res = await fetch(`http://localhost:3000/staff/${dni}`, { method: 'DELETE' });
                        const data = await res.json();
                        if (res.ok) {
                            mensajeStaff.textContent = data.mensaje;
                            mensajeStaff.style.color = '#4caf50';
                            cargarTablaStaff();
                        } else {
                            alert(data.error);
                        }
                    } catch (error) {
                        alert('Error al intentar eliminar');
                    }
                }
            });
        });
    }

    function resetearFormulario() {
        formStaffCrud.reset();
        modoEdicionInput.value = 'crear';
        dniInput.disabled = false;
        tituloForm.textContent = 'Agregar Nuevo Profesional';
        btnGuardar.textContent = 'Guardar Profesional';
        btnCancelar.style.display = 'none';
    }

    btnCancelar.addEventListener('click', resetearFormulario);

    // Inicializar la tabla al abrir la página
    cargarTablaStaff();
}

document.addEventListener('DOMContentLoaded', () => {

    // ... acá ya tenés tus otras funciones (como el carrito, el contacto, etc.) ...

    // --- AQUí PEGÁS EL PASO 3 (LÓGICA PARA EL LOGIN CON ROLES) ---
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('correo-login').value;
            const contraseña = document.getElementById('password-login').value;

            try {
                const res = await fetch('http://localhost:3000/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, contraseña })
                });
                const data = await res.json();
                
                if (res.ok) {
                    alert(data.mensaje);
                    // Guardamos los datos del usuario en la memoria del navegador
                    localStorage.setItem('usuarioLogueado', JSON.stringify(data.cliente));

                    // Redirección inteligente según el rol que devuelve el servidor
                    if (data.rol === 'admin') {
                        window.location.href = 'index_admin.html'; // Si es admin, va al panel de administración
                    } else {
                        window.location.href = 'index.html'; // Si es cliente común, va al inicio
                    }
                } else {
                    alert(data.error || 'Credenciales incorrectas');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('No se pudo conectar con el servidor');
            }
        });
    }

});

// --- CRUD COMPLETO DE PRODUCTOS (gestion_productos.html) ---
const formProductoCrud = document.getElementById('form-producto-crud');
const tablaProductosBody = document.getElementById('tabla-productos-body');

if (formProductoCrud && tablaProductosBody) {
    const modoEdicionProd = document.getElementById('modo-edicion-prod');
    const codigoInput = document.getElementById('codigo-producto');
    const nombreProdInput = document.getElementById('nombre-prod');
    const precioProdInput = document.getElementById('precio-prod');
    const stockProdInput = document.getElementById('stock-prod');
    const tituloFormProd = document.getElementById('titulo-form-producto');
    const btnGuardarProd = document.getElementById('btn-guardar-prod');
    const btnCancelarProd = document.getElementById('btn-cancelar-prod');
    const mensajeProd = document.getElementById('mensaje-prod');

    // 1. LEER (Cargar tabla de productos)
    async function cargarTablaProductos() {
        try {
            const res = await fetch('http://localhost:3000/productos');
            const lista = await res.json();
            tablaProductosBody.innerHTML = '';

            lista.forEach(prod => {
                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid #333';
                tr.innerHTML = `
                    <td style="padding: 12px;">${prod.codigo}</td>
                    <td style="padding: 12px;">${prod.nombre}</td>
                    <td style="padding: 12px;">$${prod.precio}</td>
                    <td style="padding: 12px;">${prod.stock}</td>
                    <td style="padding: 12px; text-align: center;">
                        <button type="button" class="btn-editar-prod" data-prod='${JSON.stringify(prod)}' style="background: rgb(166, 92, 236); color: #fff; border: none; padding: 6px 12px; border-radius: 10px; cursor: pointer; margin-right: 5px;">Editar</button>
                        <button type="button" class="btn-eliminar-prod" data-codigo="${prod.codigo}" style="background: #d9534f; color: #fff; border: none; padding: 6px 12px; border-radius: 10px; cursor: pointer;">Eliminar</button>
                    </td>
                `;
                tablaProductosBody.appendChild(tr);
            });

            asignarEventosProductos();
        } catch (error) {
            console.error('Error al cargar productos:', error);
        }
    }

    // 2. CREAR / ACTUALIZAR
    formProductoCrud.addEventListener('submit', async (e) => {
        e.preventDefault();
        const modo = modoEdicionProd.value;
        const datos = {
            nombre: nombreProdInput.value,
            precio: parseFloat(precioProdInput.value),
            stock: parseInt(stockProdInput.value)
        };

        try {
            let url = 'http://localhost:3000/productos';
            let method = 'POST';

            if (modo === 'editar') {
                const codigo = codigoInput.value;
                url = `http://localhost:3000/producto/${codigo}`;
                method = 'PUT';
            }

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            const respuesta = await res.json();
            if (res.ok) {
                mensajeProd.textContent = respuesta.mensaje;
                mensajeProd.style.color = '#4caf50';
                resetearFormProd();
                cargarTablaProductos();
            } else {
                mensajeProd.textContent = respuesta.error || 'Ocurrió un error';
                mensajeProd.style.color = '#f44336';
            }
        } catch (error) {
            mensajeProd.textContent = 'Error de conexión con el servidor';
            mensajeProd.style.color = '#f44336';
        }
    });

    // 3. ASIGNAR EVENTOS A BOTONES DE EDICIÓN Y ELIMINACIÓN
    function asignarEventosProductos() {
        document.querySelectorAll('.btn-editar-prod').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const prod = JSON.parse(e.target.getAttribute('data-prod'));
                modoEdicionProd.value = 'editar';
                codigoInput.value = prod.codigo;
                nombreProdInput.value = prod.nombre;
                precioProdInput.value = prod.precio;
                stockProdInput.value = prod.stock;

                tituloFormProd.textContent = `Editando: ${prod.nombre}`;
                btnGuardarProd.textContent = 'Actualizar Producto';
                btnCancelarProd.style.display = 'inline-block';
            });
        });

        document.querySelectorAll('.btn-eliminar-prod').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const codigo = e.target.getAttribute('data-codigo');
                if (confirm(`¿Seguro que querés eliminar el producto con código ${codigo}?`)) {
                    try {
                        const res = await fetch(`http://localhost:3000/producto/${codigo}`, { method: 'DELETE' });
                        const data = await res.json();
                        if (res.ok) {
                            mensajeProd.textContent = data.mensaje;
                            mensajeProd.style.color = '#4caf50';
                            cargarTablaProductos();
                        } else {
                            alert(data.error);
                        }
                    } catch (error) {
                        alert('Error al intentar eliminar');
                    }
                }
            });
        });
    }

    function resetearFormProd() {
        formProductoCrud.reset();
        modoEdicionProd.value = 'crear';
        tituloFormProd.textContent = 'Agregar Nuevo Producto';
        btnGuardarProd.textContent = 'Guardar Producto';
        btnCancelarProd.style.display = 'none';
    }

    btnCancelarProd.addEventListener('click', resetearFormProd);

    // Cargar la tabla al iniciar
    cargarTablaProductos();
}

// --- INYECCIÓN AUTOMÁTICA DEL CARRITO (ESTÉTICA BOUTIQUE) ---
document.addEventListener('DOMContentLoaded', () => {

    // 1. Inyectar el HTML del cajón del carrito con estética unificada
    if (!document.getElementById('carrito-drawer')) {
        const carritoHTML = `
            <div id="carrito-drawer" style="position: fixed; right: -420px; top: 0; width: 380px; max-width: 90vw; height: 100%; background: #1a191a; border-left: 3px solid rgb(166, 92, 236); box-shadow: -8px 0 25px rgba(0, 0, 0, 0.8); z-index: 1000; transition: right 0.35s cubic-bezier(0.25, 0.8, 0.25, 1); display: flex; flex-direction: column; color: #fff; padding: 25px; box-sizing: border-box; font-family: 'Times New Roman', Times, serif;">
                
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid rgba(166, 92, 236, 0.4); padding-bottom: 15px; margin-bottom: 10px;">
                    <h3 style="margin: 0; color: rgb(246, 112, 181); font-size: 26px; font-style: italic; letter-spacing: 0.5px;">Tu Carrito</h3>
                    <button id="cerrar-carrito" style="background: rgba(137, 43, 226, 0.2); border: 1px solid rgb(166, 92, 236); color: #fff; width: 32px; height: 32px; border-radius: 50%; font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s;">&times;</button>
                </div>

                <div id="carrito-items" style="flex: 1; overflow-y: auto; padding-right: 5px; display: flex; flex-direction: column; gap: 14px;">
                    <!-- Productos dinámicos -->
                </div>

                <div style="border-top: 2px solid rgba(166, 92, 236, 0.4); padding-top: 20px; margin-top: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 22px; font-style: italic; margin-bottom: 18px;">
                        <span style="color: #e0e0e0;">Total:</span>
                        <span id="carrito-precio-total" style="color: rgb(246, 112, 181); font-weight: bold;">$0</span>
                    </div>
                    <button id="btn-ir-pagar" style="width: 100%; background: linear-gradient(135deg, rgb(137, 43, 226), rgb(246, 112, 181)); color: #fff; border: 2px solid rgb(200, 140, 255); padding: 14px; border-radius: 25px; font-family: 'Times New Roman', Times, serif; font-style: italic; font-size: 16px; font-weight: bold; letter-spacing: 1px; cursor: pointer; box-shadow: 0 4px 15px rgba(137, 43, 226, 0.4);">FINALIZAR COMPRA</button>
                </div>
            </div>
            <div id="carrito-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(3px); display: none; z-index: 999;"></div>
        `;
        document.body.insertAdjacentHTML('beforeend', carritoHTML);
    }

    const drawer = document.getElementById('carrito-drawer');
    const overlay = document.getElementById('carrito-overlay');
    const btnCerrar = document.getElementById('cerrar-carrito');
    const contenedorItems = document.getElementById('carrito-items');
    const spanPrecioTotal = document.getElementById('carrito-precio-total');
    const btnIrPagar = document.getElementById('btn-ir-pagar');

    function abrirCarrito() {
        drawer.style.right = '0';
        overlay.style.display = 'block';
        actualizarVistaCarrito();
    }

    function cerrarCarrito() {
        drawer.style.right = '-420px';
        overlay.style.display = 'none';
    }

    if (btnCerrar) btnCerrar.addEventListener('click', cerrarCarrito);
    if (overlay) overlay.addEventListener('click', cerrarCarrito);

    function actualizarVistaCarrito() {
        let carrito = JSON.parse(localStorage.getItem('carritoBoutique')) || [];
        contenedorItems.innerHTML = '';
        let total = 0;

        if (carrito.length === 0) {
            contenedorItems.innerHTML = '<p style="text-align: center; color: #888; margin-top: 50px; font-style: italic; font-size: 18px;">Tu carrito está vacío</p>';
            spanPrecioTotal.textContent = '$0';
            return;
        }

        carrito.forEach((item, index) => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;

            const divItem = document.createElement('div');
            divItem.style.cssText = 'background: #212021; padding: 14px; border-radius: 16px; border: 1.5px solid rgba(166, 92, 236, 0.6); box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; flex-direction: column; gap: 10px;';
            divItem.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
                    <h4 style="margin: 0; font-size: 16px; color: #fff; font-style: italic; line-height: 1.3;">${item.nombre}</h4>
                    <button class="btn-eliminar-item" data-index="${index}" style="background: none; border: none; color: rgb(246, 112, 181); cursor: pointer; font-size: 18px; padding: 0; line-height: 1;" title="Quitar producto">&times;</button>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 15px; color: rgb(185, 130, 245); font-weight: bold;">$${subtotal.toLocaleString('es-AR')}</span>
                    
                    <div style="display: flex; align-items: center; gap: 10px; background: #151415; padding: 4px 10px; border-radius: 20px; border: 1px solid rgb(137, 43, 226);">
                        <button class="btn-quitar-uno" data-index="${index}" style="background: none; color: #fff; border: none; font-size: 16px; cursor: pointer; padding: 0 4px;">-</button>
                        <span style="font-size: 14px; font-family: sans-serif; color: #fff;">${item.cantidad}</span>
                        <button class="btn-sumar-uno" data-index="${index}" style="background: none; color: #fff; border: none; font-size: 16px; cursor: pointer; padding: 0 4px;">+</button>
                    </div>
                </div>
            `;
            contenedorItems.appendChild(divItem);
        });

        spanPrecioTotal.textContent = `$${total.toLocaleString('es-AR')}`;

        document.querySelectorAll('.btn-sumar-uno').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.getAttribute('data-index');
                carrito[idx].cantidad++;
                localStorage.setItem('carritoBoutique', JSON.stringify(carrito));
                actualizarVistaCarrito();
            });
        });

        document.querySelectorAll('.btn-quitar-uno').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.getAttribute('data-index');
                if (carrito[idx].cantidad > 1) {
                    carrito[idx].cantidad--;
                } else {
                    carrito.splice(idx, 1);
                }
                localStorage.setItem('carritoBoutique', JSON.stringify(carrito));
                actualizarVistaCarrito();
            });
        });

        document.querySelectorAll('.btn-eliminar-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.getAttribute('data-index');
                carrito.splice(idx, 1);
                localStorage.setItem('carritoBoutique', JSON.stringify(carrito));
                actualizarVistaCarrito();
            });
        });
    }
    // 4. Interceptar cuando se agrega un producto para abrir el carrito automáticamente
    document.querySelectorAll('.btn-agregar-carrito').forEach(btn => {
        btn.addEventListener('click', () => {
            abrirCarrito();
        });
    });

    // 5. Redirigir a la página de pago al hacer clic en finalizar compra
    if (btnIrPagar) {
        btnIrPager = btnIrPagar.addEventListener('click', () => {
            let carrito = JSON.parse(localStorage.getItem('carritoBoutique')) || [];
            if (carrito.length === 0) {
                alert('Tu carrito está vacío');
                return;
            }
            
            // Si estamos en una subcarpeta de Venta, subimos dos niveles para llegar a la raíz
            const ruta = window.location.pathname;
            if (ruta.includes('/Venta_')) {
                window.location.href = '../../pago.html';
            } else {
                window.location.href = 'pago.html';
            }
        });
    }
});



// --- ABRIR CARRITO DESDE CUALQUIER ENLACE ---
document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.abrir-carrito-trigger');
    if (trigger) {
        e.preventDefault(); // Evita que la página salte o se recargue
        const drawer = document.getElementById('carrito-drawer');
        const overlay = document.getElementById('carrito-overlay');
        
        if (drawer && overlay) {
            drawer.style.right = '0';
            overlay.style.display = 'block';
            // Si ya tenés la función actualizarVistaCarrito definida en tu script, la llamás acá:
            if (typeof actualizarVistaCarrito === 'function') {
                actualizarVistaCarrito();
            }
        }
    }
});