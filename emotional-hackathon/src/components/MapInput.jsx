"use client";

import React, { useState } from "react";

const LocationInput = ({ onSubmit }) => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ latitude, longitude });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Latitude:
        <input
          type="number"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Longitude:
        <input
          type="number"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          required
        />
      </label>
      <br />
      <button type="submit">Show Imagery</button>
    </form>
  );
};

export default LocationInput;
