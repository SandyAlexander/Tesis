const bcrypt = require('bcryptjs');

// Encriptar una contraseña
bcrypt.hash('admin', 10, (err, hash) => {
  if (err) throw err;
  console.log('Hashed password:', hash);

  // Comparar una contraseña
  const hashedPassword = hash; // Usa el hash que obtuviste arriba
  bcrypt.compare('admin', hashedPassword, (err, result) => {
    if (err) throw err;
    console.log('Password matches:', result); // Debería ser true
  });
});
