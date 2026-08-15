"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export default function FounderWorldMap({ founders, activeIndex, onSelect }) {
  const elementRef = useRef(null);
  const mapRef = useRef(null);
  const onSelectRef = useRef(onSelect);

  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);

  useEffect(() => {
    let cancelled = false;
    let map;

    async function setupMap() {
      const leafletModule = await import("leaflet");
      if (cancelled || !elementRef.current) return;
      const L = leafletModule.default || leafletModule;

      map = L.map(elementRef.current, {
        center: [25, 0],
        zoom: 1.5,
        minZoom: 1,
        maxZoom: 12,
        zoomSnap: 0.5,
        worldCopyJump: true,
        attributionControl: true,
      });
      mapRef.current = map;

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        className: "nlock-map-tiles",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      founders.forEach((founder, index) => {
        const latitude = Number(founder.latitude);
        const longitude = Number(founder.longitude);
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;

        const icon = L.icon({
          iconUrl: founder.photoUrl || "/favicon.svg",
          iconSize: index === activeIndex ? [48, 48] : [40, 40],
          iconAnchor: index === activeIndex ? [24, 24] : [20, 20],
          className: `nlock-founder-marker ${index === activeIndex ? "is-active" : ""}`,
        });
        L.marker([latitude, longitude], { icon, title: founder.name })
          .addTo(map)
          .on("click", () => onSelectRef.current(index));
      });

      if (founders.length === 1) {
        map.setView([Number(founders[0].latitude), Number(founders[0].longitude)], 5);
      } else if (founders.length > 1) {
        const bounds = founders
          .map((founder) => [Number(founder.latitude), Number(founder.longitude)])
          .filter(([lat, lng]) => Number.isFinite(lat) && Number.isFinite(lng));
        if (bounds.length) map.fitBounds(bounds, { padding: [55, 55], maxZoom: 5 });
      }
    }

    setupMap();
    return () => {
      cancelled = true;
      if (map) map.remove();
      mapRef.current = null;
    };
  }, [founders, activeIndex]);

  return <div ref={elementRef} className="h-full min-h-[390px] w-full sm:min-h-[520px]" aria-label="Mapa geográfico dos Coaches Fundadores" />;
}
