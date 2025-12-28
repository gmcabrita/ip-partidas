export interface Station {
  NodeID: number;
  Nome: string;
  Distancia: number;
}

export interface StationSearchResponse {
  response: Station[];
}

export interface Departure {
  ComboioPassou: boolean;
  DataHoraPartidaChegada: string;
  DataHoraPartidaChegada_ToOrderBy: string;
  DataHoraPartidaChegada_ToOrderByi: string;
  DataRealizacao: string;
  EstacaoDestino: number;
  EstacaoOrigem: number;
  NComboio1: number;
  NComboio2: number;
  NomeEstacaoDestino: string;
  NomeEstacaoOrigem: string;
  Observacoes: string;
  Operador: string;
  TipoServico: string;
}

export interface TimetableNode {
  NodeID: number;
  NodesComboioTabelsPartidasChegadas: Departure[];
}

export interface TimetableResponse {
  response: TimetableNode[];
}

export interface ServiceType {
  value: string;
  label: string;
  group: string;
}

export const SERVICE_TYPES: ServiceType[] = [
  { value: "INTERNACIONAL", label: "Internacional", group: "PASSAGEIROS" },
  { value: "ALFA", label: "Alfa Pendular", group: "PASSAGEIROS" },
  { value: "IC", label: "Intercidades", group: "PASSAGEIROS" },
  { value: "IR", label: "Inter-Regional", group: "PASSAGEIROS" },
  { value: "REGIONAL", label: "Regional", group: "PASSAGEIROS" },
  { value: "URB|SUBUR", label: "Urbano/Suburbano", group: "PASSAGEIROS" },
  { value: "ESPECIAL", label: "Especial", group: "PASSAGEIROS" },
];

export type ColumnId =
  | "hora"
  | "comboio"
  | "servico"
  | "origem"
  | "destino"
  | "operador"
  | "estado";

export interface ColumnDefinition {
  id: ColumnId;
  label: string;
}

export const COLUMNS: ColumnDefinition[] = [
  { id: "hora", label: "Hora" },
  { id: "estado", label: "Estado" },
  { id: "comboio", label: "Comboio" },
  { id: "servico", label: "Serviço" },
  { id: "origem", label: "Origem" },
  { id: "destino", label: "Destino" },
  { id: "operador", label: "Operador" },
];

export type ColumnVisibility = Record<ColumnId, boolean>;

export const DEFAULT_COLUMN_VISIBILITY: ColumnVisibility = {
  hora: true,
  comboio: false,
  servico: false,
  origem: true,
  destino: true,
  operador: true,
  estado: true,
};
