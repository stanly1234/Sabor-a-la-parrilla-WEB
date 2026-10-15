let carrito = [];
let total = 0;

// ========== CONFIGURACIÓN EMAILJS ==========
// Reemplaza estos valores con tus credenciales de EmailJS
const EMAILJS_CONFIG = {
    serviceId: "service_3bjysdj",      // Tu Service ID
    templateId: "template_6dwtb6h",    // Tu Template ID
    publicKey: "UoWQm9eWLmXDWiv6C"          // Tu Public Key (User ID)
};
// ==========================================

function agregarCarrito(nombre, precio) {
    carrito.push({ nombre, precio });
    actualizarCarrito();
}

function actualizarCarrito() {
    const lista = document.getElementById("lista-carrito");
    lista.innerHTML = "";
    total = 0;

    carrito.forEach((producto, index) => {
        total += producto.precio;
        lista.innerHTML += `
            <div class="item-carrito">
                <div>
                    <strong>${producto.nombre}</strong>
                    <p>$${producto.precio.toFixed(2)}</p>
                </div>
                <button class="eliminar-btn" onclick="eliminarProducto(${index})">Eliminar</button>
            </div>
        `;
    });

    document.getElementById("total").innerText = total.toFixed(2);
}

function eliminarProducto(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
}

function generarFactura() {
    if (carrito.length === 0) {
        alert("Agrega al menos un producto al carrito antes de ver la factura.");
        return;
    }

    const contenido = document.getElementById("contenido-factura");
    const fecha = new Date();
    const numeroFactura = Math.floor(Math.random() * 100000);
    let html = `
        <center>
            <img src="img/logo.png" width="120" alt="Logo">
            <h2>SABOR A LA PARRILLA BBQ</h2>
            <p>Factura #${numeroFactura}</p>
            <p>${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}</p>
            <hr>
            <table width="100%">
                <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                </tr>
    `;

    carrito.forEach(producto => {
        html += `
                <tr>
                    <td>${producto.nombre}</td>
                    <td>$${producto.precio.toFixed(2)}</td>
                </tr>
        `;
    });

    const iva = total * 0.13;
    const subtotal = total - iva;

    html += `
            </table>
            <hr>
            <p>Subtotal: $${subtotal.toFixed(2)}</p>
            <p>IVA (13%): $${iva.toFixed(2)}</p>
            <h2>Total: $${total.toFixed(2)}</h2>
            <hr>
            <p>¡Gracias por su compra!</p>
        </center>
    `;

    contenido.innerHTML = html;
    document.getElementById("total-factura").innerText = total.toFixed(2);
    document.getElementById("factura").classList.add("activo");
}

function imprimirFactura() {
    generarFactura();
    setTimeout(() => {
        window.print();
    }, 300);
}

function cerrarFactura() {
    document.getElementById("factura").classList.remove("activo");
}

function abrirFormularioEnvio() {
    if (carrito.length === 0) {
        alert("Agrega al menos un producto al carrito antes de enviar la factura.");
        return;
    }
    document.getElementById("modal-envio").classList.add("activo");
}

function cerrarFormularioEnvio() {
    document.getElementById("modal-envio").classList.remove("activo");
}

function enviarFacturaEmail() {
    const nombre = document.getElementById("cliente-nombre").value.trim();
    const email = document.getElementById("cliente-email").value.trim();
    const mensaje = document.getElementById("cliente-mensaje").value.trim();

    // Validar campos
    if (!nombre) {
        alert("Por favor ingresa el nombre del cliente.");
        return;
    }
    if (!email) {
        alert("Por favor ingresa el email del cliente.");
        return;
    }
    if (!EMAILJS_CONFIG.serviceId || !EMAILJS_CONFIG.templateId || !EMAILJS_CONFIG.publicKey) {
        alert("Por favor configura tus credenciales de EmailJS en el archivo JavaScript.");
        return;
    }

    // Inicializar EmailJS con la Public Key
    if (typeof emailjs === "undefined") { alert("No se pudo cargar el servicio de correo. Revisa tu conexión."); return; }
    emailjs.init(EMAILJS_CONFIG.publicKey);

    // Generar contenido de la factura
    let fecha = new Date();
    let numeroFactura = Math.floor(Math.random() * 100000);
    let contenidoFactura = `Factura #${numeroFactura}\n${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}\n\n`;
    
    carrito.forEach(producto => {
        contenidoFactura += `${producto.nombre} - $${producto.precio.toFixed(2)}\n`;
    });

    const iva = total * 0.13;
    const subtotal = total - iva;

    contenidoFactura += `\nSubtotal: $${subtotal.toFixed(2)}\nIVA (13%): $${iva.toFixed(2)}\nTotal: $${total.toFixed(2)}`;

    // Parámetros del template
    const templateParams = {
        correo: email,
        nombre: nombre,
        mensaje: mensaje || "Sin mensaje adicional",
        contenido_factura: contenidoFactura,
        total: total.toFixed(2)
    };

    // Enviar email
    emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams)
        .then(() => {
            alert("¡Factura enviada exitosamente a " + email + "!");
            cerrarFormularioEnvio();
            // Limpiar formulario
            document.getElementById("cliente-nombre").value = "";
            document.getElementById("cliente-email").value = "";
            document.getElementById("cliente-mensaje").value = "";
        })
        .catch((error) => {
            alert("Error al enviar la factura: " + error.text);
            console.error("Error:", error);
        });
}
