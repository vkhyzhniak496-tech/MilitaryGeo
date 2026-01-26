// ---- IMPORTY ----
// Dokumentacja React hooków: https://react.dev/reference/react
import { useEffect, useRef, useState } from "react";

// Dokumentacja react-leaflet:
// https://react-leaflet.js.org/docs/start-introduction
import { GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";


// ---- TYPY ----
type MilitaryType =
  | "barracks"
  | "naval_base"
  | "airfield"
  | "training_area"
  | "range"
  | "primary"
  | "office"
  | "danger_area"
  | "shelter"
  | "bunker";



// TODO: Dodaj więcej typów wojskowych i sprawdź, czy pojawią się na mapie:
// airfield, training_area, range, primary, office, danger_area, shelter, bunker

// TODO: Poczytaj o GeoJSON: https://geojson.org/
// Typ danych GeoJSON
type GeoJSONData = GeoJSON.FeatureCollection;

// ---- LISTA TYPÓW ----
const MILITARY_TYPES: MilitaryType[] = [
  "barracks",
  "naval_base",
  "airfield",
   "training_area",
  "range",
   "primary",
   "office",
   "danger_area",
   "shelter",
   "bunker"
];

// ---- ETYKIETY ----
const MILITARY_LABELS: Record<MilitaryType, string> = {
  barracks: "Koszary",
  naval_base: "Baza morska",
  airfield: "Baza lotnicza",
  training_area: "Zona treningowa",
  range:"Strzelnica",
  primary: "Baza logistyczna",
  office: "Biuro",
  danger_area: "Strefa niebezpieczeństwa",
  shelter: "Schron",
  bunker: "Bunker "

};

// ---- KOMPONENT MilitaryOSMLayer ----
export default function MilitaryOSMLayer() {
  // TODO: Zmień domyślny typ na bazę morską i sprawdź efekt
  const [militaryType, setMilitaryType] =
    useState<MilitaryType>("naval_base");

  // TODO: Dodaj typowanie dla danych (GeoJSONData | null)
  const [data, setData] = useState<GeoJSONData | null>(null);

  // TODO: Dodaj obsługę błędów w UI (np. komunikat "Nie udało się pobrać danych")
  const [error, setError] = useState<string | null>(null);

  // Loader
  const [loading, setLoading] = useState<boolean>(false);

  // TODO: Sprawdź w dokumentacji Leaflet co można zrobić z ref:
  const layerRef = useRef<L.GeoJSON | null>(null);


  const map = useMap();

  const [lineColor, setLineColor] = useState("#ff0084ff");
const [lineWidth, setLineWidth] = useState(6);
const [lineOpacity, setLineOpacity] = useState(1);

  // ---- FUNKCJA POBIERANIA DANYCH ----
 const fetchData = async (type: MilitaryType) => {
  // Wyświetl loader
  setLoading(false);
  setData(null);
  setError(null);
  const url = `/data/${type}.json`
  try{
    const result = await fetch(url);
    
    if (!result.ok){
      console.error("File not found", url);
      return;
    }
    const geojson=await result.json();
    setData(geojson);
  }catch(error){
    console.error("Błąd", error);
  } finally{
    setLoading(false);
  }
};
  // ---- useEffect: pobieranie danych ----
  useEffect(() => {
    fetchData(militaryType);
  }, [militaryType]);

  // ---- useEffect: dopasowanie widoku mapy ----
  useEffect(() => {
    if (!data || !layerRef.current) return;

    const bounds = layerRef.current.getBounds();
    

    if (bounds.isValid()) {
      // TODO: Zmień animate: true na false i sprawdź różnicę
      map.fitBounds(bounds, { animate: true });
    }
  }, [data, map]);

  // ---- RENDER ----
  return (
    <>
     {error && (
  <div
    style={{
      position: "absolute",
      bottom: "20px",
      left: "20px",
      zIndex: 9999,
      background: "#fff",
      padding: "10px 14px",
      borderRadius: "6px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
      color: "#b71c1c",
      fontWeight: "bold",
    }}
  >
    {error}
  </div>
)}

      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          Wyszukiwanie: {MILITARY_LABELS[militaryType]}
        </div>
      )}

      {/* ---- PRZYCISKI ---- */}
      <div
        style={{
          position: "absolute",
          top: "1 0px",
          left: "50px",
          zIndex: 9999,
          background: "rgba(235, 172, 211, 0.9)",
          padding: "10px",
          borderRadius: "6px",
          boxShadow: "0 2px 6px rgba(255, 0, 183, 1)",
          width: "80vw",
          // TODO Spraw aby ten panel nie zachodził na przyciski do zmiany skali
        }}
      >
        <div style={{ fontWeight: "bold", marginBottom: "6px" }}>
          Obiekty:
        </div>

        {/* TODO: Dodaj tooltipy (podpowiedzi) do przycisków */}
        {MILITARY_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setMilitaryType(type)}
            style={{
              margin: "4px",
              padding: "6px 10px",
              borderRadius: "6px",
              border: "1px solid #555",
              background: type === militaryType ? "#008f37ff" : "#eee",
              color: type === militaryType ? "#000000ff" : "S#000",
              cursor: "pointer",
            }}
          >
            {MILITARY_LABELS[type] || type}
          </button>
        ))}
      </div>
{/* ---- LEGENDA (bottom-left) ---- */}
<div
  style={{
    position: "absolute",
    bottom: "20px",
    left: "20px",
    zIndex: 9999,
    background: "rgba(255, 255, 255, 0.9)",
    padding: "10px 14px",
    borderRadius: "6px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
    fontSize: "14px",
    fontWeight: "bold",
  }}
>
  <div style={{ marginBottom: "6px", fontSize: "16px" }}>
    Legenda
  </div>

  <div>
    Typ: {MILITARY_LABELS[militaryType]}
  </div>

  <div>
    Liczba obiektów: {data?.features?.length ?? 0}
  </div>
</div>

{/* ---- STYLE PANEL (bottom-right) ---- */}
<div
  style={{
    position: "absolute",
    bottom: "20px",
    right: "20px",
    zIndex: 9999,
    background: "rgba(255, 255, 255, 0.9)",
    padding: "12px 16px",
    borderRadius: "6px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
    width: "200px",
    fontSize: "14px",
  }}
>
  <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
    Styl warstwy
  </div>

  {/* Color */}
  <label style={{ display: "block", marginBottom: "6px" }}>
    Kolor:
    <input
      type="color"
      value={lineColor}
      onChange={(e) => setLineColor(e.target.value)}
      style={{ marginLeft: "8px" }}
    />
  </label>

  {/* Width */}
  <label style={{ display: "block", marginBottom: "6px" }}>
    Grubość:
    <input
      type="range"
      min={1}
      max={12}
      value={lineWidth}
      onChange={(e) => setLineWidth(Number(e.target.value))}
      style={{ width: "100%" }}
    />
  </label>

  {/* Opacity */}
  <label style={{ display: "block" }}>
    Przezroczystość:
    <input
      type="range"
      min={0.1}
      max={1}
      step={0.05}
      value={lineOpacity}
      onChange={(e) => setLineOpacity(Number(e.target.value))}
      style={{ width: "100%" }}
    />
  </label>
</div>

{/* ---- WARSTWA GEOJSON ---- */}
{data && (
  <GeoJSON
    key={militaryType}
    data={data}
    ref={layerRef}
    style={() => ({
      color: lineColor,
      weight: lineWidth,
      opacity: lineOpacity,
      fillColor: lineColor,
      fillOpacity: 0.45,
    })}
  />
)}
    </>
  );
}