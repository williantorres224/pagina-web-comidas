const CLAVE_PEDIDO = "pedidoOlorSabor";

const resumenPedidoPago = document.getElementById("resumen-pedido-pago");
const precioTotalPago = document.getElementById("precio-total-pago");
const montoYape = document.getElementById("monto-yape");
const montoEfectivo = document.getElementById("monto-efectivo");
const opcionesPago = document.getElementById("opciones-pago");
const btnConfirmarPago = document.getElementById("btn-confirmar-pago");
const mensajePago = document.getElementById("mensaje-pago");

const paneles = {
    tarjeta: document.getElementById("form-tarjeta"),
    yape: document.getElementById("panel-yape"),
    efectivo: document.getElementById("panel-efectivo")
};

const inputNumeroTarjeta = document.getElementById("numero-tarjeta");
const inputNombreTarjeta = document.getElementById("nombre-tarjeta");
const inputVencimiento = document.getElementById("vencimiento-tarjeta");
const inputCvv = document.getElementById("cvv-tarjeta");

let metodoSeleccionado = "tarjeta";

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

function calcularTotal(pedido) {
    return pedido.reduce((suma, item) => {
        const subtotal = item.subtotal ?? (item.precio * item.cantidad);
        return suma + subtotal;
    }, 0);
}

function mostrarResumen() {
    const pedido = obtenerPedido();

    if (pedido.length === 0) {
        resumenPedidoPago.innerHTML = `<p>No hay platos seleccionados.</p>`;
        precioTotalPago.textContent = "S/ 0.00";
        if (montoYape) montoYape.textContent = "S/ 0.00";
        if (montoEfectivo) montoEfectivo.textContent = "S/ 0.00";
        if (btnConfirmarPago) btnConfirmarPago.disabled = true;
        return;
    }

    const total = calcularTotal(pedido);

    const lista = pedido.map((item) => {
        const subtotal = item.subtotal ?? (item.precio * item.cantidad);
        return `
            <p>
                ${item.cantidad} × ${item.nombre}
                <span style="float:right">S/ ${subtotal.toFixed(2)}</span>
            </p>
        `;
    });

    resumenPedidoPago.innerHTML = lista.join("");
    precioTotalPago.textContent = `S/ ${total.toFixed(2)}`;
    if (montoYape) montoYape.textContent = `S/ ${total.toFixed(2)}`;
    if (montoEfectivo) montoEfectivo.textContent = `S/ ${total.toFixed(2)}`;
    if (btnConfirmarPago) btnConfirmarPago.disabled = false;
}

function seleccionarMetodo(metodo) {
    metodoSeleccionado = metodo;

    document.querySelectorAll(".opcion").forEach((boton) => {
        boton.classList.toggle("activa", boton.dataset.metodo === metodo);
    });

    Object.entries(paneles).forEach(([nombre, panel]) => {
        if (!panel) return;
        panel.classList.toggle("activo", nombre === metodo);
    });

    mensajePago.innerHTML = "";
}

if (opcionesPago) {
    opcionesPago.querySelectorAll(".opcion").forEach((boton) => {
        boton.addEventListener("click", () => seleccionarMetodo(boton.dataset.metodo));
    });
}

// --- Formateo y restricciones de los campos de tarjeta ---

if (inputNumeroTarjeta) {
    inputNumeroTarjeta.addEventListener("input", () => {
        const digitos = inputNumeroTarjeta.value.replace(/\D/g, "").slice(0, 16);
        inputNumeroTarjeta.value = digitos.replace(/(.{4})/g, "$1 ").trim();
    });
}

if (inputVencimiento) {
    inputVencimiento.addEventListener("input", () => {
        let valor = inputVencimiento.value.replace(/\D/g, "").slice(0, 4);
        if (valor.length > 2) {
            valor = `${valor.slice(0, 2)}/${valor.slice(2)}`;
        }
        inputVencimiento.value = valor;
    });
}

if (inputCvv) {
    inputCvv.addEventListener("input", () => {
        inputCvv.value = inputCvv.value.replace(/\D/g, "").slice(0, 3);
    });
}

if (inputNombreTarjeta) {
    inputNombreTarjeta.addEventListener("input", () => {
        inputNombreTarjeta.value = inputNombreTarjeta.value.replace(/[^\p{L}\s]/gu, "");
    });
}

function mostrarError(texto) {
    mensajePago.innerHTML = `<div class="mensaje-error">${texto}</div>`;
}

function validarPago() {
    if (metodoSeleccionado === "tarjeta") {
        const numero = inputNumeroTarjeta?.value.replace(/\s/g, "") || "";
        const nombre = inputNombreTarjeta?.value.trim() || "";
        const vencimiento = inputVencimiento?.value || "";
        const cvv = inputCvv?.value || "";

        if (numero.length !== 16) {
            mostrarError("El número de tarjeta debe tener 16 dígitos.");
            return false;
        }

        if (!nombre) {
            mostrarError("Ingresa el nombre en la tarjeta.");
            return false;
        }

        const match = vencimiento.match(/^(\d{2})\/(\d{2})$/);
        if (!match || Number(match[1]) < 1 || Number(match[1]) > 12) {
            mostrarError("La fecha de vencimiento no es válida (MM/AA).");
            return false;
        }

        if (cvv.length !== 3) {
            mostrarError("El CVV debe tener 3 dígitos.");
            return false;
        }
    }
    return true;
}

const NOMBRES_METODO = {
    tarjeta: "Tarjeta",
    yape: "Yape/Plin",
    efectivo: "Efectivo"
};

if (btnConfirmarPago) {
    btnConfirmarPago.addEventListener("click", async () => {
        const pedido = obtenerPedido();

        if (pedido.length === 0) {
            mostrarError("No hay platos en tu pedido para pagar.");
            return;
        }

        if (!validarPago()) {
            return;
        }

        const idPedido = localStorage.getItem("pedidoIdOlorSabor");

        if (!idPedido) {
            mostrarError("No se encontró tu pedido. Vuelve a completar tus datos en la pantalla anterior.");
            return;
        }

        const total = calcularTotal(pedido);

        btnConfirmarPago.disabled = true;
        mensajePago.innerHTML = `<p>Procesando pago...</p>`;

        try {
            const datos = new URLSearchParams({
                idPedido,
                metodo: NOMBRES_METODO[metodoSeleccionado] || metodoSeleccionado,
                monto: total.toFixed(2)
            });

            const respuesta = await fetch("pago", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
                },
                body: datos.toString()
            });

            const mensaje = await respuesta.text();

            console.log("Respuesta del servlet de pago:", respuesta.status, mensaje);

            if (respuesta.ok) {

                mensajePago.innerHTML = `
                    <div class="mensaje-exito">
                        <h3>✅ ¡Pago confirmado!</h3>
                        <p>Tu pedido está siendo preparado. Gracias por tu compra.</p>
                    </div>
                `;

                localStorage.removeItem(CLAVE_PEDIDO);
                localStorage.removeItem("pedidoIdOlorSabor");

                setTimeout(() => {
                    window.location.href = "index.html";
                }, 3000);

            } else {
                mostrarError(mensaje || "No se pudo registrar el pago.");
                btnConfirmarPago.disabled = false;
            }
        } catch (error) {
            console.error(error);
            mostrarError("No se pudo conectar con el servidor.");
            btnConfirmarPago.disabled = false;
        }
    });
}

mostrarResumen();
seleccionarMetodo("tarjeta");