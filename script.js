/* ------------------------------------------------------------
   EVENTO 1:  Menú hamburguesa (versión mobile)
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
   EVENTO 3: Aparece un "Ver más" al pasar el cursor  
   sobre las tarjetas  de servicio (Capilar, Uñas, Maquillaje, Depilación.)
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
   EVENTO 4: Contador de caracteres en el mensaje
   del formulario de Contacto.
------------------------------------------------------------ */
try {
    const mensajeTextarea = document.getElementById("mensaje");
    const contadorMensaje = document.getElementById("contador-mensaje");
    const LIMITE_CARACTERES = 300;

    if (mensajeTextarea && contadorMensaje) {
        // Ponemos el texto inicial ni bien carga la página,
        // así arranca mostrando "0 / 300" en vez de un texto fijo distinto.
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