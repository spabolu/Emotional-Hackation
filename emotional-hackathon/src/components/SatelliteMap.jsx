"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, ImageOverlay, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function SatelliteMap({ location }) {
  const [currentDate, setCurrentDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAvailableDates();
  }, [location]);

  const fetchAvailableDates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/satellite-dates?lat=${location.lat}&lng=${location.lng}`
      );
      if (!response.ok) throw new Error("Failed to fetch dates");
      const dates = await response.json();
      const parsedDates = dates.map((d) => new Date(d));
      setAvailableDates(parsedDates);
      if (parsedDates.length > 0) {
        setCurrentDate(parsedDates[0]);
        updateImagery(parsedDates[0]);
      } else {
        setError("No imagery available for this location");
      }
    } catch (error) {
      console.error("Error fetching dates:", error);
      setError("Failed to fetch available dates");
    } finally {
      setLoading(false);
    }
  };

  const updateImagery = async (date) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/satellite-image?lat=${location.lat}&lng=${
          location.lng
        }&date=${date.toISOString()}`
      );
      if (!response.ok) throw new Error("Failed to fetch imagery");
      const data = await response.json();
      setImageUrl(data.imageUrl);
    } catch (error) {
      console.error("Error fetching imagery:", error);
      setError("Failed to fetch satellite imagery");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (direction) => {
    const currentIndex = availableDates.findIndex(
      (date) => date.getTime() === currentDate.getTime()
    );
    const newIndex =
      direction === "next"
        ? Math.min(currentIndex + 1, availableDates.length - 1)
        : Math.max(currentIndex - 1, 0);
    setCurrentDate(availableDates[newIndex]);
    updateImagery(availableDates[newIndex]);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>

      <div className="satellite-imagery-map">
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={13}
          style={{ height: "400px", width: "100%" }}
        >
          {imageUrl ? (
            <ImageOverlay
              bounds={[
                [location.lat - 0.1, location.lng - 0.1],
                [location.lat + 0.1, location.lng + 0.1],
              ]}
              url={imageUrl}
            />
          ) : (
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          )}
          <Marker position={[location.lat, location.lng]} />
        </MapContainer>
        <div className="controls mt-4">
          <button
            onClick={() => handleDateChange("prev")}
            disabled={
              !currentDate ||
              currentDate.getTime() === availableDates[0]?.getTime()
            }
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Previous Date
          </button>
          <span className="text-lg font-semibold">
            {currentDate ? currentDate.toDateString() : "No date selected"}
          </span>
          <button
            onClick={() => handleDateChange("next")}
            disabled={
              !currentDate ||
              currentDate.getTime() ===
                availableDates[availableDates.length - 1]?.getTime()
            }
            className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
          >
            Next Date
          </button>
        </div>
      </div>
    </>
  );
}
