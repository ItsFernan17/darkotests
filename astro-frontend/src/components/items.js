export const ListaMenu = [
  {
    name: "Inicio",
    href: "/",
  },
  {
    name: "Sobre nosotros",
    subMenu: [
      { name: "Misión y Visión", href: "/mision-vision",},
      { name: "Información", href: "/informacion" },
      { name: "Nuestro Equipo", href: "/equipo" },
    ],
  },
  {
    name: "Preguntas Frecuentes",
    href: "/preguntas-respuestas",
  },
  {
    name: "Contactanos",
    href: "/contacto",
  },
];

export const ListaMenuSistema = [
  {
    name: "Inicio",
    href: "/portal/menu-sistema",
    roles: ["admin", "evaluador", "auxiliar"],
  },
  {
    name: "Asignaciones",
    roles: ["admin", "evaluador"],
    submenu: [
      {
        text: "Nueva Asignación",
        href: "/portal/asignaciones/registrar-asignacion",
      },
      {
        text: "Gestionar Asignaciones",
        href: "/portal/asignaciones/gestionar-asignacion",
      },
    ],
  },
  {
    name: "Exámenes",
    roles: ["admin", "evaluador"],
    submenu: [
      { text: "Nuevo Examen", href: "/portal/examen/registrar-examen" },
      { text: "Gestionar Exámenes", href: "/portal/examen/gestionar-examenes" },
      { text: "Nueva Serie", href: "/portal/series/registrar-serie" },
      { text: "Gestionar Series", href: "/portal/series/gestionar-series" },
    ],
  },
  {
    name: "Preguntas",
    roles: ["admin", "evaluador"],
    submenu: [
      {
        text: "Nueva Pregunta",
        href: "/portal/preguntas/registrar-pregunta",
      },
      {
        text: "Gestionar Preguntas",
        href: "/portal/preguntas/gestionar-pregunta",
      },
    ],
  },
  {
    name: "Tipos de Examen",
    roles: ["admin", "evaluador"],
    submenu: [
      {
        text: "Nuevo Tipo",
        href: "/portal/tipoExamen/registrar-tipo-examen",
      },
      {
        text: "Gestionar Tipos",
        href: "/portal/tipoExamen/gestionar-tipo-examen",
      },
    ],
  },
  {
    name: "Empleos",
    roles: ["admin", "evaluador"],
    submenu: [
      { text: "Nuevo Empleo", href: "/portal/empleos/registrar-empleo" },
      { text: "Gestionar Empleos", href: "/portal/empleos/gestionar-empleos" },
    ],
  },
  {
    name: "Usuarios",
    roles: ["admin", "auxiliar"],
    submenu: [
      { text: "Nuevo Usuario", href: "/portal/usuarios/registrar-usuario" },
      {
        text: "Gestionar Usuarios",
        href: "/portal/usuarios/gestionar-usuarios",
      },
    ],
  },
];
