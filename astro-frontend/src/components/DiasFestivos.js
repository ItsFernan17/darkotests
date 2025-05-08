export const frasesMotivadoras = [
  "Hoy es un buen día para aprender algo nuevo. No subestimes el poder de una pequeña mejora diaria.",
  "Sigue avanzando, cada paso cuenta. El éxito no se logra de un salto, sino paso a paso.",
  "La constancia es la clave del éxito. Los grandes logros están hechos de esfuerzos diarios silenciosos.",
  "Aprovecha este día como una nueva oportunidad para crecer, aprender y acercarte a tus sueños.",
  "Haz de hoy un día extraordinario. Recuerda que tu actitud define el impacto que puedes tener.",
  "La actitud positiva transforma los días grises. Aun en la dificultad, hay espacio para avanzar.",
  "Recuerda por qué empezaste. Volver a tu propósito puede renovar tus fuerzas.",
  "Un pequeño esfuerzo diario lleva a grandes logros. No importa cuán lento vayas, siempre que no te detengas.",
  "Tú puedes con esto. Cree en ti mismo y en todo lo que eres capaz de lograr.",
  "No todos los días son buenos, pero siempre hay algo bueno en cada día. Encuentra ese detalle y aférrate a él."
];
  
  export function obtenerDescripcionFeriado(nombre) {
    const descripciones = {
      'Año Nuevo': 'Celebración del inicio del año calendario.',
      'Jueves Santo': 'Conmemoración de la última cena de Jesús con sus discípulos.',
      'Viernes Santo': 'Día solemne que recuerda la crucifixión de Jesucristo.',
      'Sábado Santo': 'Día de luto y reflexión antes del Domingo de Resurrección.',
      'Día del Trabajo': 'Homenaje a los derechos y logros de los trabajadores.',
      'Día del Ejército': 'Celebración del Ejército de Guatemala.',
      'Día de la Asunción': 'Celebración religiosa en honor a la Virgen María.',
      'Día de la Independencia': 'Conmemoración de la independencia de Centroamérica de España.',
      'Día de la Revolución': 'Recuerdo del levantamiento cívico-militar del 20 de octubre de 1944.',
      'Día de Todos los Santos': 'Celebración religiosa en honor a todos los santos.',
      'Nochebuena (desde mediodía)': 'Celebración previa a la Navidad, desde el mediodía.',
      'Navidad': 'Celebración del nacimiento de Jesucristo.',
      'Nochevieja (desde mediodía)': 'Último día del año, se celebra desde el mediodía.'
    };
  
    return descripciones[nombre] || 'Día festivo oficial en Guatemala.';
  }
  