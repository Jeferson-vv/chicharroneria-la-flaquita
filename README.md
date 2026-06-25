# Chicharronería La Flaquita 🔥

Página web de Chicharronería La Flaquita — Av. Diagonal, Majes 04112, Pedregal, Arequipa.

---

## 📁 Estructura del proyecto

```
flaquita-final/
├── index.html              ← Estructura de la página
├── css/
│   └── estilos.css         ← Todos los estilos (colores, layout, animaciones)
├── js/
│   └── menu.js             ← Toda la lógica: carta, pedidos, WhatsApp, animación hero
├── data/
│   └── platos.json         ← ⭐ AQUÍ cambias precios, platos y datos del negocio
└── img/
    ├── logo.png            ← Logo circular
    ├── chicharron-con-zarza.jpg
    └── chicharron-sin-zarza.jpg
```

---

## ✏️ Cómo hacer cambios comunes

### Cambiar un precio o agregar un plato
Abre `data/platos.json`. Cada plato tiene esta forma:
```json
{
  "id": 1,
  "nombre": "Chicharrón Pequeño",
  "descripcion": "Porción individual con camote y cancha",
  "precio": 15,
  "emoji": "🥩",
  "foto": null,
  "opciones": []
}
```
- Cambia `"precio"` para actualizar el valor.
- Para usar una foto real en vez del emoji, sube la imagen a `img/` y pon `"foto": "img/tu-imagen.jpg"`.
- Para agregar un plato nuevo, copia un bloque `{ }` completo dentro de `"platos"` o `"bebidas"`, cambia el `"id"` (que no se repita) y los demás datos.

### Agregar fotos a los platos que aún tienen emoji
1. Sube la foto a la carpeta `img/`
2. En `platos.json`, cambia `"foto": null` por `"foto": "img/nombre-de-tu-foto.jpg"`
3. Pendientes de foto: Chicharrón Pequeño, Chicharrón Mediano, Chicha Morada, Gaseosa

### Cambiar el color principal de la página
Abre `css/estilos.css`, busca la sección `:root` al principio y cambia las variables, por ejemplo:
```css
--secundario: #C4520F;  /* color de botones y acentos */
```

### Actualizar horario, dirección o WhatsApp
Abre `data/platos.json` y edita la sección `"negocio"` al inicio del archivo.

### Cambiar el mapa de Google Maps
1. Ve a Google Maps → busca tu negocio → Compartir → Incorporar un mapa
2. Copia el link que está dentro de `src="..."` 
3. En `index.html`, busca el `<iframe>` dentro de la sección `id="info"` y reemplaza el `src`

---

## 🚀 Cómo subir a GitHub Pages

1. Crea un repositorio llamado `tuusuario.github.io`
2. Sube **todo el contenido** de esta carpeta (no la carpeta en sí) a la raíz del repositorio
3. Ve a Settings → Pages → Branch: main → Save
4. En 1-2 minutos tu página estará en `https://tuusuario.github.io`

**Importante:** el archivo principal debe llamarse exactamente `index.html` y debe quedar en la raíz del repositorio (no dentro de una subcarpeta).

---

## 🧪 Cómo probarlo en tu computadora (VS Code)

Como el sitio carga datos con `fetch()`, **no funciona** abriendo el `index.html` directo con doble clic (el navegador bloquea esa carga por seguridad).

Para probarlo correctamente:
1. Abre la carpeta `flaquita-final` en VS Code
2. Instala la extensión **Live Server**
3. Clic derecho en `index.html` → **Open with Live Server**
4. Se abre en tu navegador con todo funcionando — carta, pedidos, mapa, animaciones

---

## 🛵 Funciones ya incluidas

- Carta con tarjetas de platos y bebidas, con fotos reales o emoji
- Formulario de pedido con selección de platos por chips, cantidades ajustables y resumen automático
- Elección de tipo de pedido: Recoger / Reservar mesa / Delivery (con campo de dirección)
- Envío automático del pedido armado por WhatsApp
- Botones flotantes de WhatsApp y Delivery siempre visibles
- Mapa de Google Maps embebido con botón para abrir en la app
- Diseño responsive (se adapta a celular y computadora)
- Animación de tarjetas rotativas en la portada (hero)

## 📋 Pendiente para más adelante

- Fotos reales de: Chicharrón Pequeño, Chicharrón Mediano, Chicha Morada, Gaseosa
- Bot automático de WhatsApp (requiere WhatsApp Business API o servicios como Twilio/Manychat — es una configuración aparte)
