// components/Examenes/useFaceMonitoring.js
import { useRef } from "react";

export function useFaceMonitoring(onAlert) {
  const videoRef = useRef(null);
  const intervalRef = useRef(null);

  const startMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      console.log("🎥 Cámara activada. Iniciando monitoreo simulado...");

      intervalRef.current = setInterval(() => {
        console.log("📷 Simulación de captura enviada a IA...");
        // Simula una alerta aleatoria
        if (Math.random() < 0.2) {
          onAlert("Rostro no detectado (simulado)");
        }
      }, 5000);
    } catch (error) {
      console.error("Error accediendo a la cámara:", error);
    }
  };

  const stopMonitoring = () => {
    clearInterval(intervalRef.current);
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    console.log("🛑 Monitoreo simulado detenido.");
  };

  const captureOnce = () => {
    console.log("📸 Captura final simulada enviada a IA.");
    onAlert("Última verificación facial simulada.");
  };

  return { videoRef, startMonitoring, stopMonitoring, captureOnce };
}
