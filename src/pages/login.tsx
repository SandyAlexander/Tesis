import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from './login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage('Inicio de sesión correctamente');
      setTimeout(() => {
        router.push('/home'); // Redirige a la página de inicio después de 2 segundos
      }, 2000);
    } else {
      setMessage(data.message || 'Ocurrió un error');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.overlay}></div> {/* Capa de fondo semi-transparente */}
      <div className={styles.form}>
        <h1 className={styles.title}>Login</h1>
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
          <button type="submit" className={styles.button}>Login</button>
        </form>
        <div className={styles.registerLink}>
          <a href="/register">Don't have an account? Register here</a>
        </div>
      </div>
    </div>
  );
}
