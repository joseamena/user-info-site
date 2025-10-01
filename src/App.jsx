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
    document.body.style.background = '#f7f7f7';
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
    <div className="container">
      <h2>Reclama tu premio!</h2>
      <form id="userForm" autoComplete="on" onSubmit={handleSubmit}>
        <label htmlFor="firstName">Nombre</label>
        <input type="text" id="firstName" name="firstName" required autoComplete="given-name" />

        <label htmlFor="lastName">Apellido</label>
        <input type="text" id="lastName" name="lastName" required autoComplete="family-name" />

        <label htmlFor="phone">Número de Teléfono</label>
        <input type="tel" id="phone" name="phone" required autoComplete="tel" pattern="[0-9\-\+\s]{7,15}" />

        <label htmlFor="email">Dirección de Correo Electrónico</label>
        <input type="email" id="email" name="email" required autoComplete="email" />

        <button type="submit">Enviar</button>
      </form>
      <div id="message" style={{ marginTop: '1em', color: message.startsWith('¡Gracias') ? 'green' : 'red' }}>{message}</div>
    </div>
  );
}
