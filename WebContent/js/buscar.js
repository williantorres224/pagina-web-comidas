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

function guardarPedido(pedido) {
    localStorage.setItem(CLAVE_PEDIDO, JSON.stringify(pedido));
}

function obtenerRegion() {
    const partes = window.location.pathname.toLowerCase().split("/");
    if (partes.includes("costa")) return "Costa";
    if (partes.includes("sierra")) return "Sierra";
    if (partes.includes("selva")) return "Selva";
    return "";
}

// Quita tildes y pasa a minúsculas para que "cordero" encuentre "Cordero" o "córdero".
function normalizar(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function extraerPlatosDeHtml(html, categoria) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const tarjetas = doc.querySelectorAll(".card");

    const platos = [];

    tarjetas.forEach((tarjeta) => {
        const h2 = tarjeta.querySelector("h2");
        const precioEl = tarjeta.querySelector(".precio");
        const imgEl = tarjeta.querySelector("img");

        const nombre = h2 ? h2.textContent.trim() : "";
        const precioTexto = precioEl ? precioEl.textContent.replace("S/", "").trim() : "0";
        const precio = Number(precioTexto);
        const imagen = imgEl ? imgEl.getAttribute("src") : "";

        // Ignora tarjetas sin nombre o sin precio válido (datos incompletos).
        if (nombre && !Number.isNaN(precio)) {
            platos.push({ nombre, precio, imagen, categoria });
        }
    });

    return platos;
}

async function obtenerTodosLosPlatos() {
    const [resCaldos, resSegundos] = await Promise.all([
        fetch("caldos.html"),
        fetch("segundos.html")
    ]);

    const [htmlCaldos, htmlSegundos] = await Promise.all([
        resCaldos.text(),
        resSegundos.text()
    ]);

    return [
        ...extraerPlatosDeHtml(htmlCaldos, "Caldo"),
        ...extraerPlatosDeHtml(htmlSegundos, "Segundo")
    ];
}

function crearTarjetaResultado(plato) {
    const div = document.createElement("div");
    div.className = "resultado-card";

    div.innerHTML = `
        <img src="${plato.imagen}" alt="${plato.nombre}">
        <div class="resultado-info">
            <h3>${plato.nombre}</h3>
            <p class="resultado-precio">S/ ${plato.precio.toFixed(2)}</p>
            <div class="resultado-controles">
                <input type="number" class="resultado-cantidad" min="0" max="20" value="1">
                <button type="button" class="resultado-agregar">🛒 Agregar</button>
            </div>
        </div>
    `;

    const boton = div.querySelector(".resultado-agregar");
    const inputCantidad = div.querySelector(".resultado-cantidad");

    boton.addEventListener("click", () => {
        const cantidad = Number(inputCantidad.value);

        if (cantidad <= 0) {
            alert("Ingrese una cantidad valida");
            return;
        }

        const region = obtenerRegion();
        const subtotal = plato.precio * cantidad;

        const pedido = obtenerPedido();
        const existente = pedido.find((item) =>
            item.nombre === plato.nombre &&
            item.categoria === plato.categoria &&
            item.region === region
        );

        if (existente) {
            existente.cantidad += cantidad;
            existente.subtotal = existente.cantidad * existente.precio;
        } else {
            pedido.push({
                nombre: plato.nombre,
                categoria: plato.categoria,
                region,
                precio: plato.precio,
                cantidad,
                subtotal
            });
        }

        guardarPedido(pedido);

        boton.textContent = "Agregado";
        setTimeout(() => {
            boton.textContent = "🛒 Agregar";
        }, 1200);
    });

    return div;
}

function inicializarBusqueda() {
    const contenedorBusqueda = document.querySelector(".busqueda");

    if (!contenedorBusqueda) {
        return;
    }

    const input = contenedorBusqueda.querySelector("input");
    const boton = contenedorBusqueda.querySelector("button");

    const resultados = document.createElement("div");
    resultados.id = "resultados-busqueda";
    contenedorBusqueda.insertAdjacentElement("afterend", resultados);

    let platosCache = null;

    async function ejecutarBusqueda() {
        const consulta = normalizar(input.value);

        if (!consulta) {
            resultados.innerHTML = "";
            return;
        }

        resultados.innerHTML = `<p class="buscando">Buscando...</p>`;

        try {
            if (!platosCache) {
                platosCache = await obtenerTodosLosPlatos();
            }

            const coincidencias = platosCache.filter((plato) =>
                normalizar(plato.nombre).includes(consulta)
            );

            resultados.innerHTML = "";

            if (coincidencias.length === 0) {
                resultados.innerHTML = `
                    <p class="sin-resultados">
                        No se encontraron platos con "${input.value}".
                    </p>
                `;
                return;
            }

            const grid = document.createElement("div");
            grid.className = "resultados-grid";

            coincidencias.forEach((plato) => {
                grid.appendChild(crearTarjetaResultado(plato));
            });

            resultados.appendChild(grid);

        } catch (error) {
            console.error(error);
            resultados.innerHTML = `
                <p class="sin-resultados">
                    Ocurrió un error al buscar. Intenta de nuevo.
                </p>
            `;
        }
    }

    boton.addEventListener("click", (event) => {
        event.preventDefault();
        ejecutarBusqueda();
    });

    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            ejecutarBusqueda();
        }
    });
}

inicializarBusqueda();