"use client";

import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { 
  Map as MapIcon, 
  Layers, 
  Train, 
  AlertTriangle, 
  MapPin, 
  Compass,
  Zap,
  Info
} from "lucide-react";
import { api } from "@/lib/api";

export default function RailwayMapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [corridor, setCorridor] = useState<any>(null);
  const [selectedStation, setSelectedStation] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getCorridor();
        setCorridor(data);
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize MapLibre GL map centered on Thal Ghat corridor (Kasara-Igatpuri)
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
          },
        },
        layers: [
          {
            id: "osm-layer",
            type: "raster",
            source: "osm",
            paint: {
              "raster-opacity": 0.35,
              "raster-brightness-min": 0.2,
              "raster-brightness-max": 0.8,
            },
          },
        ],
      },
      center: [73.40, 19.50],
      zoom: 9.5,
    });

    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    map.current.on("load", () => {
      if (!map.current) return;

      // Railway line geometry coordinates (Kalyan to Igatpuri)
      const lineCoordinates = [
        [73.1355, 19.2437], // KYN
        [73.2100, 19.3000], // THS
        [73.3000, 19.4300], // ASO
        [73.4800, 19.6400], // KSRA
        [73.5600, 19.6950], // IGP
      ];

      // Add Railway Track Layer
      map.current.addSource("railway-line", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: { name: "Central Railway Mainline" },
          geometry: {
            type: "LineString",
            coordinates: lineCoordinates,
          },
        },
      });

      map.current.addLayer({
        id: "railway-track-casing",
        type: "line",
        source: "railway-line",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#3b82f6",
          "line-width": 6,
          "line-opacity": 0.8,
        },
      });

      map.current.addLayer({
        id: "railway-track-ties",
        type: "line",
        source: "railway-line",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#f59e0b",
          "line-width": 2,
          "line-dasharray": [2, 2],
        },
      });

      // Add Station Markers
      const stations = [
        { code: "KYN", name: "Kalyan Junction", km: 53.0, coords: [73.1355, 19.2437] },
        { code: "THS", name: "Titwala", km: 64.0, coords: [73.2100, 19.3000] },
        { code: "ASO", name: "Asangaon", km: 85.0, coords: [73.3000, 19.4300] },
        { code: "KSRA", name: "Kasara", km: 121.0, coords: [73.4800, 19.6400] },
        { code: "IGP", name: "Igatpuri", km: 137.0, coords: [73.5600, 19.6950] },
      ];

      stations.forEach((st) => {
        const el = document.createElement("div");
        el.className = "station-marker";
        el.innerHTML = `
          <div style="background-color: #1e3a8a; border: 2px solid #60a5fa; color: white; padding: 3px 6px; border-radius: 6px; font-weight: bold; font-size: 11px; cursor: pointer; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.5);">
            🚉 ${st.code}
          </div>
        `;
        el.addEventListener("click", () => setSelectedStation(st));

        new maplibregl.Marker({ element: el })
          .setLngLat(st.coords as [number, number])
          .addTo(map.current!);
      });

      // Add Active Maintenance Block Zone (KM 125.4)
      const blockEl = document.createElement("div");
      blockEl.innerHTML = `
        <div style="background-color: #f59e0b; border: 2px solid #ffffff; color: #000; padding: 4px 8px; border-radius: 8px; font-weight: 900; font-size: 10px; animation: pulse 2s infinite; box-shadow: 0 0 15px #f59e0b;">
          ⚠️ BLOCK: BLK-001 (KM 125.4)
        </div>
      `;
      new maplibregl.Marker({ element: blockEl })
        .setLngLat([73.5010, 19.6620])
        .addTo(map.current!);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Geospatial Operations Visualizer
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            MapLibre GL JS Railway Network Map
          </h1>
          <p className="text-xs text-slate-400">
            Real-time PostGIS track geometry, station nodes, defect zones, and active blocks
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-300">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Active Maintenance Zone: KM 125.4</span>
          </div>
        </div>
      </div>

      {/* Map Card */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 h-[600px]">
        <div ref={mapContainer} className="w-full h-full" />

        {/* Station Inspector Overlay */}
        {selectedStation && (
          <div className="absolute top-4 left-4 p-4 rounded-xl bg-slate-900/90 border border-slate-700 backdrop-blur-md shadow-2xl w-80 text-xs space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-white text-sm">Station: {selectedStation.name}</span>
              <span className="font-mono text-blue-400 font-bold">{selectedStation.code}</span>
            </div>
            <div className="space-y-1 text-slate-300 text-[11px]">
              <p>Chainage Location: <strong>KM {selectedStation.km}</strong></p>
              <p>Corridor: <strong>Central Railway - Mumbai Division</strong></p>
              <p>Signalling: <strong>Automatic Block Signalling (ABS)</strong></p>
            </div>
            <button
              onClick={() => setSelectedStation(null)}
              className="w-full py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors"
            >
              Close
            </button>
          </div>
        )}

        {/* Floating Map Legend */}
        <div className="absolute bottom-4 right-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-xl text-xs space-y-1.5">
          <span className="font-bold text-white text-[11px] block">Network Legend:</span>
          <div className="flex items-center gap-2 text-slate-300 text-[11px]">
            <span className="w-3 h-1 bg-blue-500 rounded" />
            <span>Mainline Track (ABS)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300 text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-700 border border-blue-400" />
            <span>Operational Stations</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300 text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Coordinated Block Zone</span>
          </div>
        </div>
      </div>
    </div>
  );
}
