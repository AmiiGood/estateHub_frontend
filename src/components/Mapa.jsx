import React from 'react'

const Mapa = ({ direccion }) => {
  console.log("Dirección:", direccion);

  if (!direccion) return null;

  return (
    <iframe
      width="100%"
      height="400"
      style={{ border: 0 }}
      loading="lazy"
      allowFullScreen
      src={`https://www.google.com/maps?q=${encodeURIComponent(
        direccion
      )}&output=embed`}
    ></iframe>
  );
};
export default Mapa;