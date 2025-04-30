import React, { useEffect, useState } from 'react';

const WelcomeMessage = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const storedUsuario = localStorage.getItem('usuario');
    if (storedUsuario) {
      setUsuario(storedUsuario);
    }
  }, []);

  return (
    <span id="welcome-message" className="text-[20px] font-bold text-primary">
      {usuario ? `¡Atención ${usuario}!` : '¡Atención usuario!'}
    </span>
  );
};

export default WelcomeMessage;
