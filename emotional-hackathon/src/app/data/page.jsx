"use client";

import { useState } from "react";
import { SendHorizontal } from "lucide-react";

import ArticlePage from "@/components/ArticlePage";

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [coordinates, setCoordinates] = useState({
    lat: 61.09758, // default values
    lng: -147.05437,
  });

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchTerm
        )}&format=json&addressdetails=1&limit=1&polygon_svg=1`
      );
      const data = await response.json();

      if (data.length > 0) {
        const lat = data[0].lat;
        const lon = data[0].lon;

        console.log(`Latitude: ${lat}, Longitude: ${lon}`);

        setCoordinates({ lat, lng: lon });
      } else {
        console.log("No results found.");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  return (
    <div className="grid items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <ArticlePage />

      <div className="w-full max-w-2xl mt-9">
        <div className="my-6">
          <h3 className="text-3xl text-center font-semibold">
            Satellite-based Predictive Timelapse
          </h3>
          <p className="text-center max-w-xl mx-auto">
            View the timelapse of any mining site using Google Earth Engine to
            track activities of landscape, understanding future sustainbility
            practices.
          </p>
        </div>
        <div className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <button
            className="hover:opacity-70 opacity-80"
            onClick={handleSearch}
          >
            <SendHorizontal />
          </button>
        </div>
      </div>
      <div className="p-4">
        <iframe
          width="800"
          height="600"
          src={`https://earthengine.google.com/iframes/timelapse_player_embed.html#v=${coordinates.lat},${coordinates.lng},12.433,latLng&t=3.45&ps=50&bt=19840101&et=20221231`}
          allowFullScreen
        />
      </div>
    </div>
  );
}
