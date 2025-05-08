import { useState, useEffect } from 'react';

const CalendarioSistema = () => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [feriados, setFeriados] = useState([]);

  useEffect(() => {
    fetch(`https://date.nager.at/api/v3/PublicHolidays/${currentYear}/GT`)
      .then(res => res.json())
      .then(data => {
        // Feriados personalizados
        const feriadosExtra = [
          {
            date: `${currentYear}-02-14`,
            localName: 'San Valentín',
            name: "Valentine's Day",
          },
          {
            date: `${currentYear}-02-20`,
            localName: 'Día de Tecún Umán',
            name: "Tecun Uman Day",
          },
          {
            date: `${currentYear}-05-10`,
            localName: 'Día de la Madre',
            name: "Mother's Day",
          },
          {
            date: `${currentYear}-06-27`,
            localName: 'Día del Padre',
            name: "Father's Day",
          },
          {
            date: `${currentYear}-08-17`,
            localName: 'Día de la Bandera',
            name: "Flag Day",
          },
        ];
  
        // Evitar duplicados si algún feriado ya estuviera en la API
        const fechasExistentes = new Set(data.map(f => f.date));
        const feriadosCombinados = [
          ...data,
          ...feriadosExtra.filter(f => !fechasExistentes.has(f.date)),
        ];
  
        setFeriados(feriadosCombinados);
      })
      .catch(err => console.error('Error al obtener los días festivos:', err));
  }, [currentYear]);
  

  const traducirNombreFeriado = (nombreIngles) => {
    const traducciones = {
      "New Year's Day": "Año Nuevo",
      "Maundy Thursday": "Jueves Santo",
      "Good Friday": "Viernes Santo",
      "Holy Saturday": "Sábado Santo",
      "Labour Day": "Día del Trabajo",
      "Assumption Day": "Día de la Asunción",
      "Independence Day": "Día de la Independencia",
      "All Saints' Day": "Día de Todos los Santos",
      "Christmas Eve": "Nochebuena",
      "Christmas Day": "Navidad",
      "New Year's Eve": "Nochevieja",
      "Revolution Day": "Día de la Revolución",
      "Army Day": "Día del Ejército",
      "International Workers' Day": "Día del Trabajador",
      "Mother's Day": "Día de la Madre",
      "Easter Sunday": "Domingo de Resurrección",
    };
    return traducciones[nombreIngles] || nombreIngles;
  };

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const startDay = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const lastDayOfPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const weekdays = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];

  const monthName = firstDayOfMonth.toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  });

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const isToday = (dateObj) => dateObj.toDateString() === today.toDateString();
  const isHoliday = (dateStr) => feriados.find(f => f.date === dateStr);

  return (
    <div className="bg-white rounded-2xl shadow p-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrevMonth} className="text-[#4F6BED] hover:underline">
          &lt; Mes anterior
        </button>
        <h3 className="text-lg font-semibold capitalize text-[#2E2E32]">{monthName}</h3>
        <button onClick={handleNextMonth} className="text-[#4F6BED] hover:underline">
          Mes siguiente &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-gray-600 font-medium mb-2 text-sm">
        {weekdays.map(day => <div key={day}>{day}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`prev-${i}`} className="rounded-lg h-16 bg-gray-50 text-gray-400 flex items-start justify-start p-2 text-xs">
            {lastDayOfPrevMonth - startDay + i + 1}
          </div>
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date = i + 1;
          const dateObj = new Date(currentYear, currentMonth, date);
          const dateStr = dateObj.toISOString().split('T')[0];
          const holiday = isHoliday(dateStr);

          return (
            <div
              key={dateStr}
              className={`rounded-lg h-16 p-1 flex flex-col items-start justify-start text-left border
                ${holiday ? 'bg-[#FFF1F1] border-[#FF6B6B] text-[#FF6B6B]' : ''}
                ${isToday(dateObj) && !holiday ? 'bg-[#EAF0FF] text-[#4F6BED] border-[#4F6BED]' : ''}
                ${!holiday && !isToday(dateObj) ? 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50' : ''}`}
            >
              <div className="text-base font-semibold">{date}</div>
              {holiday && (
                <div className="text-[10px] mt-1 leading-tight">
                  {traducirNombreFeriado(holiday.localName)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Panel azul destacado del día actual */}
      <div className="mt-8 bg-[#4F6BED] text-white p-6 rounded-xl text-center">
        <div className="text-5xl font-bold mb-1">{today.getDate()}</div>
        <div className="text-lg capitalize mb-1">
          {today.toLocaleDateString('es-ES', { weekday: 'long' })}
        </div>
        <p className="text-sm">
          {
            isHoliday(today.toISOString().split('T')[0])
              ? traducirNombreFeriado(isHoliday(today.toISOString().split('T')[0])?.localName)
              : '¡Hoy es un gran día para aprender algo nuevo!'
          }
        </p>
      </div>
    </div>
  );
};

export default CalendarioSistema;
