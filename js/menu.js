/* =============================================
   CHICHARRONERÍA LA FLAQUITA — Lógica principal
   Carga datos desde data/platos.json
   ============================================= */

let DATOS = null;
let catActiva = 'chicharron';
const seleccion = {}; // { id: cantidad }
let tipoEntrega = 'recoger';

// --- Punto de entrada ---
document.addEventListener('DOMContentLoaded', async () => {
  await cargarDatos();
  renderizarInfoNegocio();
  renderMenu();
  renderChips();
  configurarFormulario();
  configurarNavScroll();
  configurarAnimacionHero();
});

// --- Carga el JSON con todos los datos del negocio ---
async function cargarDatos() {
  try {
    const respuesta = await fetch('data/platos.json');
    DATOS = await respuesta.json();
  } catch (error) {
    console.error('Error al cargar platos.json:', error);
  }
}

// --- Rellena el link de WhatsApp en todos los elementos con esa clase ---
function renderizarInfoNegocio() {
  if (!DATOS) return;
  const n = DATOS.negocio;
  document.querySelectorAll('.js-link-whatsapp').forEach(el => {
    el.href = `https://wa.me/${n.whatsapp}`;
  });
}

/* =============================================
   CARTA — Tarjetas de platos y bebidas
   ============================================= */

function crearTarjeta(item) {
  const opts = item.opciones && item.opciones.length
    ? `<div class="tarjeta-opts" style="margin-top:.5rem;">
        <label>Opciones disponibles</label>
        <select disabled>${item.opciones.map(o => `<option>${o}</option>`).join('')}</select>
       </div>` : '';

  const imagenHTML = item.foto
    ? `<img src="${item.foto}" alt="${item.nombre}" class="tarjeta-img-real" />`
    : `<div class="tarjeta-img">${item.emoji}</div>`;

  return `
    <article class="tarjeta">
      ${imagenHTML}
      <div class="tarjeta-body">
        <h3 class="tarjeta-nombre">${item.nombre}</h3>
        <p class="tarjeta-desc">${item.descripcion}</p>
        ${opts}
        <p class="tarjeta-precio">S/ ${item.precio}.00</p>
        <span class="tarjeta-disponible">Disponible ahora</span>
      </div>
    </article>`;
}

function renderMenu() {
  if (!DATOS) return;
  const items = catActiva === 'chicharron' ? DATOS.platos : DATOS.bebidas;
  document.getElementById('menu-grid').innerHTML = items.map(crearTarjeta).join('');
}

function cambiarTab(cat) {
  catActiva = cat;
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('activo', t.dataset.cat === cat));
  renderMenu();
}
window.cambiarTab = cambiarTab;

/* =============================================
   SELECCIÓN DE PLATOS POR CHIPS (formulario de pedido)
   ============================================= */

function renderChips() {
  if (!DATOS) return;
  const contPlatos = document.getElementById('chips-platos');
  const contBebidas = document.getElementById('chips-bebidas');

  contPlatos.innerHTML = DATOS.platos.map(crearChip).join('');
  contBebidas.innerHTML = DATOS.bebidas.map(crearChip).join('');
}

function crearChip(item) {
  return `
    <button type="button" class="chip" id="chip-${item.id}" onclick="toggleChip(${item.id})">
      ${item.emoji} ${item.nombre}
      <span class="chip-cantidad" id="chip-cant-${item.id}">1</span>
    </button>`;
}

function toggleChip(id) {
  if (seleccion[id]) {
    delete seleccion[id];
  } else {
    seleccion[id] = 1;
  }
  actualizarChipsYResumen();
}
window.toggleChip = toggleChip;

function cambiarCantidad(id, delta) {
  if (!seleccion[id]) return;
  const nuevaCant = seleccion[id] + delta;
  if (nuevaCant <= 0) {
    delete seleccion[id];
  } else {
    seleccion[id] = nuevaCant;
  }
  actualizarChipsYResumen();
}
window.cambiarCantidad = cambiarCantidad;

function quitarDelResumen(id) {
  delete seleccion[id];
  actualizarChipsYResumen();
}
window.quitarDelResumen = quitarDelResumen;

function actualizarChipsYResumen() {
  const todos = [...DATOS.platos, ...DATOS.bebidas];

  // Actualizar visual de los chips (activo/inactivo + cantidad)
  todos.forEach(item => {
    const chip = document.getElementById(`chip-${item.id}`);
    const cantSpan = document.getElementById(`chip-cant-${item.id}`);
    if (!chip) return;
    if (seleccion[item.id]) {
      chip.classList.add('activo');
      cantSpan.textContent = seleccion[item.id];
    } else {
      chip.classList.remove('activo');
    }
  });

  // Construir el resumen del pedido
  const resumenEl = document.getElementById('resumen-pedido');
  const idsSeleccionados = Object.keys(seleccion);

  if (idsSeleccionados.length === 0) {
    resumenEl.innerHTML = '<p class="resumen-vacio">Aún no has seleccionado nada de la carta</p>';
    return;
  }

  let total = 0;
  const itemsHTML = idsSeleccionados.map(id => {
    const item = todos.find(p => p.id === parseInt(id));
    const cant = seleccion[id];
    const subtotal = item.precio * cant;
    total += subtotal;
    return `
      <div class="resumen-item">
        <span class="resumen-item-nombre">${item.emoji} ${item.nombre}</span>
        <span style="display:flex;align-items:center;gap:14px;">
          <span class="cantidad-control">
            <button type="button" class="cantidad-btn" onclick="cambiarCantidad(${id},-1)" aria-label="Quitar uno">−</button>
            <span class="cantidad-num">${cant}</span>
            <button type="button" class="cantidad-btn" onclick="cambiarCantidad(${id},1)" aria-label="Agregar uno">+</button>
          </span>
          <span class="resumen-item-precio">S/ ${subtotal.toFixed(2)}</span>
          <button type="button" class="resumen-quitar" onclick="quitarDelResumen(${id})" aria-label="Quitar">✕</button>
        </span>
      </div>`;
  }).join('');

  resumenEl.innerHTML = itemsHTML + `
    <div class="resumen-total">
      <span>Total</span>
      <span>S/ ${total.toFixed(2)}</span>
    </div>`;
}

/* =============================================
   TIPO DE ENTREGA — Recoger / Reservar / Delivery
   ============================================= */

function elegirEntrega(tipo) {
  tipoEntrega = tipo;
  document.querySelectorAll('.entrega-opt').forEach(b => b.classList.toggle('activo', b.dataset.tipo === tipo));
  document.getElementById('grupo-direccion').style.display = tipo === 'delivery' ? 'flex' : 'none';
}
window.elegirEntrega = elegirEntrega;

/* =============================================
   ENVÍO DEL FORMULARIO DE PEDIDO POR WHATSAPP
   ============================================= */

function configurarFormulario() {
  const form = document.getElementById('form-pedido');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const nombre = document.getElementById('f-nombre').value;
    const hora = document.getElementById('f-hora').value;
    const direccion = document.getElementById('f-direccion')?.value || '';

    const todos = [...DATOS.platos, ...DATOS.bebidas];
    const idsSeleccionados = Object.keys(seleccion);

    if (idsSeleccionados.length === 0) {
      alert('Por favor selecciona al menos un plato de la carta 🥩');
      return;
    }

    let total = 0;
    const listaTexto = idsSeleccionados.map(id => {
      const item = todos.find(p => p.id === parseInt(id));
      const cant = seleccion[id];
      total += item.precio * cant;
      return `• ${cant}x ${item.nombre} — S/ ${(item.precio * cant).toFixed(2)}`;
    }).join('\n');

    const tipoTexto = {
      recoger: '🏃 Pasaré a recoger',
      reservar: '🍽️ Quiero reservar mesa',
      delivery: '🛵 Es para delivery' + (direccion ? `\nDirección: ${direccion}` : '')
    }[tipoEntrega];

    const msg = `¡Hola! Me llamo *${nombre}*.\n\nMi pedido:\n${listaTexto}\n\n*Total: S/ ${total.toFixed(2)}*\n\nHora: ${hora}\n${tipoTexto}\n\n¿Me confirma disponibilidad?`;

    window.open(`https://wa.me/${DATOS.negocio.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  });
}

/* =============================================
   NAVEGACIÓN — efecto al hacer scroll + menú móvil
   ============================================= */

function configurarNavScroll() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('compacta', window.scrollY > 80);
  });

  const btnMovil = document.getElementById('btn-movil');
  const navLinks = document.getElementById('nav-links');
  if (btnMovil && navLinks) {
    btnMovil.addEventListener('click', () => {
      navLinks.classList.toggle('abierto');
      btnMovil.setAttribute('aria-expanded', navLinks.classList.contains('abierto'));
    });
  }
}

/* =============================================
   ANIMACIÓN DEL HERO — tarjetas rotativas
   ============================================= */

function configurarAnimacionHero() {
  const cards = document.querySelectorAll('.plato-card');
  const dots = document.querySelectorAll('.plato-dot');
  if (!cards.length) return;

  let actual = 0;
  let timer;

  function mostrar(idx) {
    cards[actual].classList.remove('visible');
    cards[actual].classList.add('hiding');
    setTimeout(() => { cards[actual].classList.remove('hiding'); }, 500);
    dots[actual].classList.remove('activo');
    actual = idx;
    cards[actual].classList.add('visible');
    dots[actual].classList.add('activo');
  }

  function siguiente() {
    mostrar((actual + 1) % cards.length);
  }

  window.irPlato = function (idx) {
    clearInterval(timer);
    mostrar(idx);
    timer = setInterval(siguiente, 3000);
  };

  cards[0].classList.add('visible');
  timer = setInterval(siguiente, 3000);
}
