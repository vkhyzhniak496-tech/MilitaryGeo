import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import MilitaryOSMLayer from "./MilitaryLayer";

function SetView({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);

  return null;
}

export default function App() {
  const center: [number, number] = [52.1850314, 21.0471538];          //spawnPoint
  const zoom = 15;

  return (
<MapContainer center={center} zoom={zoom} style={{ height: "100vh", width: "100vw" }}>
  <SetView center={center} zoom={zoom} />
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution='&copy; OpenStreetMap contributors'
  />
  <MilitaryOSMLayer />
</MapContainer>

  )};