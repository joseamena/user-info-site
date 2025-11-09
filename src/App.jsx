import React, { useEffect, useState } from 'react';
import './App.css';

function getBrandFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('brand') || '';
}

function applyBrandTheme(brand) {
  if (brand === 'super-duper') {
    document.body.style.background = 'url("/backgrounds/super-duper.png") center center / cover no-repeat';
  } else {
    document.body.style.background = '#3d3d3d';
  }
}

export default function App() {
  const [message, setMessage] = useState('');
  const brand = getBrandFromURL();

  useEffect(() => {
    applyBrandTheme(brand);
  }, [brand]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      email: form.email.value,
      phone: form.phone.value,
      birthDate: form.birthDate.value,
      gender: form.gender.value,
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

  const feedbackStatus = message
    ? message.startsWith('¡Gracias') ? 'success' : 'error'
    : 'idle';

  return (
    <div className="app">
      <div className="form-card">
        <header className="form-card__header">
          <div className="form-card__badge">
            <img
              src="/placeholders/catch-game-logo-placeholder.svg"
              alt="Logo temporal Catch Game"
              className="form-card__logo"
            />
            {/* TODO: Replace the placeholder logo above with the provided title artwork. */}
          </div>
          <h1>Llena tus datos</h1>
        </header>
        <form id="userForm" className="form-card__form" autoComplete="on" onSubmit={handleSubmit}>
          <div className="form-card__grid">
            <label className="form-field">
              <span className="form-field__label">Nombre</span>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Nombre"
                required
                autoComplete="given-name"
              />
            </label>

            <label className="form-field">
              <span className="form-field__label">Apellido</span>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Apellido"
                required
                autoComplete="family-name"
              />
            </label>

            <label className="form-field form-field--full">
              <span className="form-field__label">Correo</span>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="sunombre@dominio.com"
                required
                autoComplete="email"
              />
            </label>

            <label className="form-field">
              <span className="form-field__label">Celular</span>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="0999999999"
                required
                autoComplete="tel"
                pattern="[0-9\\-\\+\\s]{7,15}"
              />
            </label>

            <label className="form-field">
              <span className="form-field__label">Fecha de Nacimiento</span>
              <input
                type="text"
                id="birthDate"
                name="birthDate"
                placeholder="MM-DD-AAAA"
                inputMode="numeric"
                pattern="\\d{2}-\\d{2}-\\d{4}"
                title="Formato esperado: MM-DD-AAAA"
              />
            </label>
          </div>

          <fieldset className="form-field form-field--full form-field--fieldset">
            <legend className="form-field__label">Género</legend>
            <div className="form-card__radio-group">
              <label className="radio-option">
                <input type="radio" name="gender" value="masculino" required />
                <span>Masculino</span>
              </label>
              <label className="radio-option">
                <input type="radio" name="gender" value="femenino" />
                <span>Femenino</span>
              </label>
              <label className="radio-option">
                <input type="radio" name="gender" value="otro" />
                <span>Otro</span>
              </label>
            </div>
          </fieldset>

          <button type="submit" className="form-card__cta">
            Continuar
          </button>
        </form>
        <div
          id="message"
          className="form-card__message"
          aria-live="polite"
          data-status={feedbackStatus}
        >
          {message}
        </div>
      </div>
    </div>
  );
}
