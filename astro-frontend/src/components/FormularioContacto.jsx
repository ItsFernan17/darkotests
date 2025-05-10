import { useState } from "react";

export default function ContactoVentas() {
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setEnviado(true);
    }, 1000);
  };

  return (
    <section className="w-full py-20 px-6 bg-[#fef5d7] font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-start gap-10">
        {/* Texto descriptivo */}
        <div className="pt-4">
          <h2 className="text-5xl md:text-6xl font-semibold text-black mb-6 leading-tight">
            Potencia el trabajo<br />en equipo
          </h2>
          <p className="text-[#333] text-lg leading-relaxed mb-6">
            Aumenta la participación y la inclusión para inspirar nuevas ideas y
            perspectivas. Ponte en contacto con nuestro equipo especializado para
            obtener más información sobre cómo <strong>DarkoTests</strong> puede ayudar
            a tu organización.
          </p>
          <ul className="space-y-6 text-black text-base">
            <li className="flex items-center gap-4">
              <div className="w-11 h-11 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="text-[#f6c244] w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M9 20H4v-2a3 3 0 015.356-1.857M16 11a4 4 0 10-8 0 4 4 0 008 0z" />
                </svg>
              </div>
              <span><strong>Compromiso de integración:</strong> dar voz a todos</span>
            </li>
            <li className="flex items-center gap-4">
              <div className="w-11 h-11 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="text-[#f6c244] w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 17l6-6 4 4 8-8M14 7h7v7" />
                </svg>
              </div>
              <span><strong>Mejora continua:</strong> conoce las tendencias y aprende lo que funciona mejor</span>
            </li>
            <li className="flex items-center gap-4">
              <div className="w-11 h-11 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="text-[#f6c244] w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A9.953 9.953 0 0112 15c2.21 0 4.243.716 5.879 1.804M12 12a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.6 1.6 0 012.2 0l.6.6a1.6 1.6 0 010 2.2l-.6.6a1.6 1.6 0 01-2.2 0l-.6-.6a1.6 1.6 0 010-2.2l.6-.6z" />
                </svg>
              </div>
              <span><strong>Gestor personal:</strong> se asegura de que todo funcione a la perfección</span>
            </li>
          </ul>
        </div>

        {/* Formulario */}
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-[550px]">
          {enviado ? (
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-4">¡Gracias por contactarnos!</h3>
              <p className="text-[#4b4b4b] text-sm">Tu mensaje ha sido enviado correctamente. Nos pondremos en contacto contigo lo antes posible.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 font-sans text-[#1a1a1a] text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Nombre</label>
                  <input type="text" required className="w-full p-3 bg-[#f5f3f1] rounded-md focus:outline-none" />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Apellidos</label>
                  <input type="text" required className="w-full p-3 bg-[#f5f3f1] rounded-md focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block mb-1 font-medium">Por favor describe tu consulta:</label>
                <select required className="w-full p-3 bg-[#f5f3f1] rounded-md text-[#4b4b4b] focus:outline-none">
                  <option value="">- seleccionar -</option>
                  <option value="soporte">Soporte Técnico</option>
                  <option value="comercial">Interés Comercial</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Correo electrónico de trabajo</label>
                <input type="email" required placeholder="nombre@tuempresa.com" className="w-full p-3 bg-[#f5f3f1] rounded-md focus:outline-none" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Número de teléfono</label>
                <input type="tel" required placeholder="+0 (123) 456-7890" className="w-full p-3 bg-[#f5f3f1] rounded-md focus:outline-none" />
                <p className="text-xs text-[#4b4b4b] mt-1">Incluye el código de país/región</p>
              </div>
              <div>
                <label className="block mb-1 font-medium">¿Cómo podemos ayudarte?</label>
                <textarea required maxLength="500" className="w-full p-3 bg-[#f5f3f1] rounded-md h-28 resize-none focus:outline-none" />
                <div className="text-right text-xs text-[#4b4b4b]">500</div>
              </div>
              <button type="submit" className="w-full bg-[#1a1a1a] text-white py-3 rounded-full text-base font-semibold hover:bg-[#333] transition">
                Contacta ventas
              </button>
              <p className="text-xs text-center text-[#4b4b4b] mt-2">
                Al enviar este formulario, aceptas nuestros <a href="/terminos-condiciones" className="underline">términos de uso</a> y <a href="/politica-privacidad" className="underline">políticas</a>.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
