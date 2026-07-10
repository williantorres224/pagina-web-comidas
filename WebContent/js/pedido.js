const CLAVE_PEDIDO = "pedidoOlorSabor";

function obtenerPedido() {
    return JSON.parse(localStorage.getItem(CLAVE_PEDIDO)) || [];
}

function guardarPedido(pedido) {
    localStorage.setItem(CLAVE_PEDIDO, JSON.stringify(pedido));
}

function obtenerRegion() {
    const partes = window.location.pathname.toLowerCase().split("/");
    if (partes.includes("costa")) {
        return "Costa";
    }
    if (partes.includes("sierra")) {
        return "Sierra";
    }
    if (partes.includes("selva")) {
        return "Selva";
    }
    return "";
}

function obtenerCategoria() {
    const pagina = window.location.pathname.toLowerCase();
    if (pagina.includes("caldos")) {
        return "Caldo";
    }
    if (pagina.includes("segundos")) {
        return "Segundo";
    }
    return "";
}

function obtenerPrecio(textoPrecio) {
    return Number(textoPrecio.replace("S/", "").trim());
}

document.querySelectorAll(".card button").forEach((boton) => {
    boton.addEventListener("click", () => {
        const card = boton.closest(".card");
        const cantidadInput = card.querySelector(".cantidad");

        const nombre = card.querySelector("h2").textContent.trim();

        // Antes: card.querySelector("p") tomaba la descripción (.descripcion)
        // en vez del precio, que está en <div class="precio">.
        const precio = obtenerPrecio(card.querySelector(".precio").textContent);

        const cantidad = Number(cantidadInput.value);
        const categoria = obtenerCategoria();
        const region = obtenerRegion();
        const subtotal = precio * cantidad;

        if (cantidad <= 0) {
            alert("Ingrese una cantidad valida");
            return;
        }

        const pedido = obtenerPedido();
        const existente = pedido.find((item) =>
            item.nombre === nombre &&
            item.categoria === categoria &&
            item.region === region
        );

        if (existente) {
            // Se recalcula con el precio fresco de esta tarjeta (no con el
            // precio guardado antes), para autocorregir cualquier dato
            // corrupto que haya quedado de una versión anterior del carrito.
            existente.cantidad += cantidad;
            existente.precio = precio;
            existente.subtotal = existente.cantidad * precio;
        } else {
            pedido.push({
                nombre,
                categoria,
                region,
                precio,
                cantidad,
                subtotal
            });
        }

        guardarPedido(pedido);

        boton.textContent = "Agregado";
        setTimeout(() => {
            boton.textContent = "Agregar Pedido";
        }, 1200);
    });
});