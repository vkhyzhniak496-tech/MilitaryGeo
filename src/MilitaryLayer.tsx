// ---- IMPORTY ----
// Dokumentacja React hooków: https://react.dev/reference/react
import { useEffect, useState, useRef } from "react";

// Dokumentacja react-leaflet:
// https://react-leaflet.js.org/docs/start-introduction
import { GeoJSON, useMap } from "react-leaflet";

// Dokumentacja Axios: https://axios-http.com/docs/intro
import axios from "axios";

// Dokumentacja osmtogeojson: https://github.com/tyrasd/osmtogeojson
import osmtogeojson from "osmtogeojson";
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
  airfield: "Tempelhofer feld",
  training_area: "Zona treningowa",
  range:"Strzelnica (dziś się dowiedziałem)",
  primary: "Podstawowe",
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

  // ---- FUNKCJA POBIERANIA DANYCH ----
 const fetchData = async (type: MilitaryType) => {
  // Wyświetl loader
  setLoading(true);
  setData(null);
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
          Rodzaj sztuki wojennej
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

      {/* ---- WARSTWA GEOJSON ---- */}
      {data && (
        <GeoJSON
          key={militaryType}
          data={data}
          ref={layerRef}
          style={() => ({
            // TODO: Zmień kolory i sprawdź efekt
            color: "#ff0084ff",
            weight: 6,
            opacity: 1,
            fillColor: "#432b40ff",
            fillOpacity: 0.45,
          })}
        />
      )}
    </>
  );
}