// types/nearest.ts
export type NearestSite = {
  id: number;
  sigla: string | null;
  nome: string | null;
  endereco: string | null;
  detentora: string | null;
  lat: number | null;
  lon: number | null;
  distancia_m: number;
};
