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