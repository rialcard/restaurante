# CLAUDE.md

Proyecto:
Aplicacion web de reservas y carta editable para un restaurante (Estan Burger)

Rol del agente:
Desarrollador web con 12 años de experiencia

Objetivo:
Crea una aplicación web para un restaurante donde se puedan hacer reservas y gestionar la carta (Todo se podrá administrar en un panel de administración)

Funcionalidades de la apliciación:
- Login y registro (supabase)
- Los clientes se pueden registrar para hacer reservas
- Los cliente tienen un rol "Cliente" con acceso solo a la parte publica.
- y los usuarios de la base de datos que tengan un rol "admin" (rol asignado manualmente), podran entrar al panel de administración.

- Panel de administración privado
  - Dentro del panel se podrá:
    - Listado de reservas
    - Modificar reserva
    - Cancelar reserva
    - Gestionar la carte de restaurante
     (CRUD de platos, CRUD de secciones de la carta, cada plato ira asignado a una de estas secciones, por ejemplo (entrantadas, hamburguesas, bebidas y postres))

- En la parte publica:
    - Para hacer reservas necesitamos estar logueados:
        - Seleccionar fecha de reserva
        - Seleccion de franja horaria
        - Comprobacion de disponibilidad
        - Crear reserva
        - Cancelar reserva
    - Sin necesidad de estar identificado:
        - ver la carta y ver las diferentes paginas de la web

- En general:
    - Protección de rutas
    - Validacion de solapamiento
    - Mensajes de confirmacion

Stack de tecnología:
- HTML5
- CSS3 (con tailwind)
- JavaScript
- React
- Base de datos y backend: Supabase

Preferencias generales:
- Todos los texto visibles en la web deben estar en español.

Preferencias de diseño:
- Basete en el documento HTML del diseño que tienes en la carpeta design del proyecto

Preferencias de estilos:
- Colores (los del diseño)
- Uso de HTML5 y CSS3 nativo.
- Uso de buenas practicas de maqutacion css y si es necesario usa flexbox y css grid layout.
-Que la webapp sea responsive.

Preferencias de codigo:
- No añadas dependencias externas.
- HTML debe ser semantico.
- Usa siempre let o const, y no uses nunca var.
- No uses alert, confirm o prompt, todo el feedback debe ser visual en el dom
- Toda alerta o ventana model que aparezca debe tener el mismo estilo que la web
- No uses innerHTML, todo el contenido debe ser insertado con appendchild o previamente creando un elemento con document.createElement
- Cuidado con olvidar prevenir el default en los eventos submit o click
- Prioriza el código legible y mantenible.
- Prioriza que el codigo sea sencillo de entender
- Si el agente duda, que revise las especificaciones del proyecto y si no que pregunte al usuario.

Estructura de archivos:
- carpeta (design)
- CLAUDE.md
- estructura de ficheros mas adecuada para proyectos de react (lo elige el agente de IA)
