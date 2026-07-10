const formularioCliente = document.getElementById("form-cliente");
const btnConfirmarCliente = document.getElementById("btn-confirmar-cliente");
const mensajeCliente = document.getElementById("mensaje-cliente");
const resumenPedido = document.getElementById("resumen-pedido");
const precioTotal = document.getElementById("precio-total");
const CLAVE_PEDIDO = "pedidoOlorSabor";

function obtenerPedido() {
    try {
        const datos = JSON.parse(localStorage.getItem(CLAVE_PEDIDO));
        return Array.isArray(datos) ? datos : [];
    } catch (error) {
        console.error("Pedido corrupto en localStorage, se reinicia:", error);
        localStorage.removeItem(CLAVE_PEDIDO);
        return [];
    }
}

function mostrarResumenPedido() {

    const pedido = obtenerPedido();

    if (!resumenPedido) {
        return;
    }

    if (pedido.length === 0) {

        resumenPedido.innerHTML = `
            <p>No hay platos seleccionados.</p>
        `;

        if (precioTotal) {
            precioTotal.textContent = "S/ 0.00";
        }

        return;
    }

    const total = pedido.reduce((suma, item) => {

        const subtotal = Number.isFinite(item.subtotal) ? item.subtotal : (item.precio * item.cantidad);

        return suma + subtotal;

    }, 0);

    const lista = pedido.map((item) => {

        const subtotal = Number.isFinite(item.subtotal) ? item.subtotal : (item.precio * item.cantidad);

        return `
            <p>
                ${item.cantidad} × ${item.nombre}
                <span style="float:right">
                    S/ ${subtotal.toFixed(2)}
                </span>
            </p>
        `;

    });

    resumenPedido.innerHTML = lista.join("");

    if (precioTotal) {
        precioTotal.textContent = `S/ ${total.toFixed(2)}`;
    }

}

mostrarResumenPedido();

async function confirmarPedido() {

    console.log("Botón Confirmar Pedido presionado");

    if (!formularioCliente) {
        console.error("No se encontró #form-cliente en el DOM.");
        return;
    }

    // Muestra los mensajes de validación nativos (campos requeridos, email, etc.)
    // sin disparar un submit real.
    if (!formularioCliente.reportValidity()) {
        return;
    }

    const pedido = obtenerPedido();

    if (pedido.length === 0) {
        mensajeCliente.textContent = "Agrega al menos un plato antes de continuar.";
        return;
    }

    mensajeCliente.textContent = "Enviando datos...";

    try {
        const datos = new URLSearchParams(new FormData(formularioCliente));

        pedido.forEach((item) => {
            datos.append("platoNombre", item.nombre);
            datos.append("platoCategoria", item.categoria);
            datos.append("platoRegion", item.region);
            datos.append("platoCantidad", item.cantidad);
            datos.append("platoPrecio", item.precio);
        });

        const respuesta = await fetch(formularioCliente.action, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
            },
            body: datos.toString()
        });

        const mensaje = await respuesta.text();
        const idPedido = respuesta.headers.get("X-Id-Pedido");

        console.log("Respuesta del servlet:", respuesta.status, mensaje, "idPedido:", idPedido);

        if (respuesta.ok) {

            if (idPedido) {
                localStorage.setItem("pedidoIdOlorSabor", idPedido);
            }

            mensajeCliente.textContent = `${mensaje} Redirigiendo a pagos...`;
            setTimeout(() => {
                window.location.href = "pagos.html";
            }, 1200);
        } else {
            mensajeCliente.textContent = mensaje || "Ocurrió un error al registrar el pedido.";
        }
    } catch (error) {
        mensajeCliente.textContent = "No se pudo conectar con el servidor";
        console.error(error);
    }
}

if (btnConfirmarCliente) {
    btnConfirmarCliente.addEventListener("click", confirmarPedido);
} else {
    console.error("No se encontró el botón #btn-confirmar-cliente en el DOM.");
}