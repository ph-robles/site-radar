export async function geocodeEndereco(endereco: string) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        endereco
    )}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data || data.length === 0) {
        throw new Error("Endereço não encontrado");
    }

    return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        display_name: data[0].display_name,
    };
}