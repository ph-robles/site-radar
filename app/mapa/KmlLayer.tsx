import L from "leaflet";
import * as toGeoJSON from "@mapbox/togeojson";

export default async function KmlLayer(url: string, map: L.Map) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            console.error("KmlLayer: falha ao buscar o arquivo KML", response.status);
            return;
        }

        const kmlText = await response.text();

        const parser = new DOMParser();
        const kml = parser.parseFromString(kmlText, "text/xml");

        const geojson = toGeoJSON.kml(kml);

        // Verifica se o mapa ainda existe antes de adicionar a layer
        // (evita erro se o componente foi desmontado antes do fetch terminar)
        if (!map || !map.getContainer()) return;

        const layer = L.geoJSON(geojson, {
            style: {
                color: "#ff0000",
                weight: 2,
            },
        });

        layer.addTo(map);

    } catch (err) {
        console.error("KmlLayer: erro ao carregar KML", err);
    }
}