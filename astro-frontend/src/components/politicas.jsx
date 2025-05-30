import { useState } from "react";

export default function NotificarCambios() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) return;

    setMensaje(""); // Limpia mensaje previo

    setTimeout(() => {
      console.log("Correo registrado:", email);
      setMensaje("¡Correo suscrito correctamente!");
      setEmail(""); // Limpia el input
    }, 500);
  };

  return (
    <section className="bg-[#5668e7] py-24 px-6 text-white text-center font-sans">
      <div className="max-w-xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold mb-6">
          Notifícame sobre cambios en los Términos y Políticas
        </h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className="block mb-2 text-left text-sm font-medium">
            Dirección de correo electrónico institucional
          </label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tucorreo@darkotests.com"
            className="w-full p-3 rounded-md text-black bg-white/20 border border-white/40 mb-6"
          />

          <button
            type="submit"
            className="bg-white text-[#5668e7] font-semibold px-6 py-3 rounded-full hover:bg-[#e6e6e6] transition"
          >
            Suscribirme
          </button>
        </form>

        {mensaje && (
          <p className="mt-4 text-green-200 text-sm animate-fade-in">
            {mensaje}
          </p>
        )}

        <p className="mt-6 text-sm text-white/90">
          Al suscribirte, aceptas nuestros{" "}
          <a href="/terminos-condiciones" className="underline hover:text-white">
            términos de uso
          </a>{" "}
          y{" "}
          <a href="/politica-privacidad" className="underline hover:text-white">
            políticas de privacidad
          </a>.
        </p>
      </div>
    </section>
  );
}
