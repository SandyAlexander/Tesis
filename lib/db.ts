import mysql from 'mysql2/promise';

// Crea una piscina de conexiones con mysql2
const connection = mysql.createPool({
  host: 'localhost',     // Cambia a tu host si es necesario
  user: 'root',          // Nombre de usuario
  password: 'admin',     // Contraseña
  database: 'Appweb',    // Nombre de la base de datos
  port: 3307,            // Puerto si usas uno distinto al predeterminado
});

// Función para ejecutar consultas
export const query = async (sql: string, values?: any) => {
  const [results] = await connection.query(sql, values); // Usa 'connection' en lugar de 'pool'
  return results;
};

export default connection;
