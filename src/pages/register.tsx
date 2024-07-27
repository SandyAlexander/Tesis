import { useState } from 'react';
import styles from './register.module.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage('User registered successfully!');
      setTimeout(() => {
        window.location.href = '/login'; // Redirige a la página de login después de 3 segundos
      }, 3000);
    } else {
      setMessage(data.message || 'An error occurred');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.overlay}></div> {/* Capa de fondo semi-transparente */}
      <div className={styles.form}>
        <h1 className={styles.title}>Register</h1>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          <label className={styles.label}>
            Email:
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className={styles.label}>
            Password:
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" className={styles.button}>Register</button>
        </form>
      </div>
    </div>
  );
}
