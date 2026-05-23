"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { STATUS_COLORS } from "@signalicity/shared";
import type { Signalement } from "@signalicity/shared";

const CROISSY_CENTER: L.LatLngExpression = [48.8783, 2.1372];

function getMarkerIcon(status: string, color?: string) {
  const c = color ?? STATUS_COLORS[status] ?? "#6B7280";
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="width:24px;height:24px;border-radius:50%;background:${c};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.2);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
  });
}

interface MapViewProps {
  signalements: Signalement[];
  height?: string;
  showHeatmap?: boolean;
  onMarkerClick?: (id: string) => void;
  center?: [number, number];
  zoom?: number;
  singleMarker?: { lat: number; lng: number };
}

export default function MapView({
  signalements,
  height = "500px",
  onMarkerClick,
  center,
  zoom = 15,
  singleMarker,
}: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current).setView(
      center ?? CROISSY_CENTER,
      zoom
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) map.removeLayer(layer);
    });

    if (singleMarker) {
      L.marker([singleMarker.lat, singleMarker.lng], {
        icon: getMarkerIcon("received", "#2563EB"),
      }).addTo(map);
      map.setView([singleMarker.lat, singleMarker.lng], 17);
      return;
    }

    // Add signalement markers
    signalements.forEach((s) => {
      const marker = L.marker([s.latitude, s.longitude], {
        icon: getMarkerIcon(s.status),
      }).addTo(map);

      marker.bindPopup(
        `<div style="font-family:Inter,system-ui,sans-serif;">
          <strong style="font-size:14px;">${s.title}</strong><br/>
          <span style="color:#6B7280;font-size:12px;">${s.address ?? ""}</span>
        </div>`,
        { closeButton: false, className: "clean-popup" }
      );

      if (onMarkerClick) {
        marker.on("click", () => onMarkerClick(s.id));
      }
    });
  }, [signalements, singleMarker]);

  return (
    <div
      ref={containerRef}
      style={{ height, width: "100%", borderRadius: "16px", overflow: "hidden" }}
    />
  );
}
