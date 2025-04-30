import React, { useEffect, useState } from 'react';

const EvaluadoMessage = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const storedUsuario = localStorage.getItem('usuario');
    if (storedUsuario) {
      setUsuario(storedUsuario);
    }
  }, []);

  return (
    <span id="welcome-message" className="text-[20px] font-bold text-primary">
      {usuario ? `¡Bienvenido de vuelta ${usuario}!` : '¡Bienvenido de vuelta usuario!'}
    </span>
  );
};

export default EvaluadoMessage;
