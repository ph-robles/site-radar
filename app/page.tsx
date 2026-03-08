'use client';

import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { searchSites, type Site } from '@/services/sites';

/**
 * Tipo EXATO que a RPC `nearest_sites` retorna.
 * Mantém nullability coerente com o banco e elimina os erros de TS.
 */
type NearestSite = {
  id: number;
  sigla: string | null;
  nome: string | null;
  endereco: string | null;
  detentora: string | null;
  lat: number | null;
  lon: number | null;
  distancia_m: number; // metros
};

export default function HomePage() {
  // Busca por texto (já existente)
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 400);
  const [results, setResults] = useState<Site[]>([]);
  const [loading, setLoading] = useState(false);

  // "Perto de mim"
  const [locLoading, setLocLoading] = useState(false);
  const [nearby, setNearby] = useState<NearestSite[]>([]);

  // --- Busca por texto ---
  useEffect(() => {
    let active = true;
    async function run() {
      if (!debounced.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      const { data, error } = await searchSites(debounced);
      if (active) {
        if (error) {
          console.error('Erro ao buscar sites:', error);
          setResults([]);
        } else {
          setResults(data);
        }
        setLoading(false);
      }
    }
    run();
    return () => {
      active = false;
    };
  }, [debounced]);

  // --- Perto de mim ---
  async function handleNearMe() {
    try {
      setLocLoading(true);
      setNearby([]);

      // 1) Pegar posição atual do navegador (Geolocation API)
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        });
      });

      const { latitude: lat, longitude: lon, accuracy } = position.coords;
      console.log('Minha posição:', lat, lon, '±', accuracy, 'm');

      // 2) Chamar a rota /api/nearest
      const resp = await fetch('/api/nearest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lon }),
      });

      if (!resp.ok) {
        const txt = await resp.text().catch(() => '');
        throw new Error(`Falha /api/nearest: ${resp.status} - ${txt?.slice(0, 200)}`);
      }

      const json = (await resp.json()) as { data: NearestSite[] };
      setNearby(Array.isArray(json.data) ? json.data : []);
    } catch (err: any) {
      alert('Não consegui obter sua localização ou buscar sites próximos. Verifique permissões e tente novamente.');
      console.error(err);
    } finally {
      setLocLoading(false);
    }
  }

  // --- Deeplinks de navegação ---
  function openGoogleMaps(lat: number, lon: number) {
    // https://developers.google.com/maps/documentation/urls/get-started
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
    window.open(url, '_blank');
  }

  function openWaze(lat: number, lon: number) {
    // https://developers.google.com/waze/deeplinks/
    const url = `https://waze.com/ul?ll=${lat}%2C${lon}&navigate=yes&zoom=17`;
    window.open(url, '_blank');
  }

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Buscar Sites</h1>

      {/* --- Busca por texto --- */}
      <div className="space-y-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Digite sigla ou nome..."
          className="w-full border rounded px-3 py-2"
        />
        {loading && <p className="text-sm text-gray-500">Buscando...</p>}

        <ul className="space-y-2">
          {results.map((s) => (
            <li key={s.id} className="border p-3 rounded">
              <div className="font-medium">{s.nome}</div>
              <div className="text-sm text-gray-600">{s.sigla}</div>
            </li>
          ))}
        </ul>

        {!loading && debounced && results.length === 0 && (
          <p className="text-sm text-gray-500">Nada encontrado.</p>
        )}
      </div>

      {/* --- Perto de mim (3) --- */}
      <div className="pt-4 border-t">
        <button
          onClick={handleNearMe}
          disabled={locLoading}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
        >
          {locLoading ? 'Localizando...' : 'Perto de mim (3)'}
        </button>

        {nearby.length > 0 && (
          <ul className="mt-4 space-y-2">
            {nearby.map((s) => (
              <li key={s.id} className="border p-3 rounded">
                <div className="font-medium">{s.nome ?? s.sigla ?? 'Site'}</div>
                <div className="text-sm text-gray-600">{s.endereco ?? 'Sem endereço'}</div>

                <div className="text-sm">
                  Distância: <strong>{Math.round(s.distancia_m)} m</strong>
                </div>

                <div className="flex gap-2 mt-2">
                  {s.lat != null && s.lon != null && (
                    <>
                      <button
                        onClick={() => openGoogleMaps(s.lat!, s.lon!)}
                        className="px-3 py-1 rounded bg-green-600 text-white"
                      >
                        Abrir no Google Maps
                      </button>

                      <button
                        onClick={() => openWaze(s.lat!, s.lon!)}
                        className="px-3 py-1 rounded bg-purple-600 text-white"
                      >
                        Abrir no Waze
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
``