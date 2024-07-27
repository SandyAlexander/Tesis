import { useRouter } from 'next/router';
import React from 'react';
import styles from './home.module.css'; // Importa el archivo de estilos

export default function Home() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className={styles.container}>
      <div className={styles.overlay}></div> {/* Capa de fondo semi-transparente */}
      <div className={styles.content}>
        <h1 className={styles.title}>Inicio</h1>
        <div className={styles.buttons}>
          <button className={styles.button} onClick={() => handleNavigation('/silabo')}>Silabo</button>
          <button className={styles.button} onClick={() => handleNavigation('/planificaciones')}>Planificaciones</button>
          <button className={styles.button} onClick={() => handleNavigation('/informes')}>Informes</button>
          <button className={styles.button} onClick={() => handleNavigation('/notas')}>Notas</button>
        </div>
      </div>
    </div>
  );
}
