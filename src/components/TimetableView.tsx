import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Departure, ColumnVisibility } from "@/types";
import { CheckCircle2, Clock, ArrowRight, AlertTriangle, XCircle } from "lucide-react";

interface TimetableViewProps {
  departures: Departure[];
  isLoading?: boolean;
  columnVisibility: ColumnVisibility;
  onTrainClick?: (trainId: number) => void;
}

function getServiceBadgeVariant(service: string): "default" | "secondary" | "outline" {
  switch (service) {
    case "ALFA":
      return "default";
    case "IC":
      return "default";
    case "URB|SUBUR":
      return "secondary";
    default:
      return "outline";
  }
}

function formatServiceType(service: string): string {
  const serviceMap: Record<string, string> = {
    "URB|SUBUR": "Urbano",
    ALFA: "Alfa",
    IC: "IC",
    IR: "IR",
    REGIONAL: "Regional",
    INTERNACIONAL: "Internacional",
    ESPECIAL: "Especial",
  };
  return serviceMap[service] || service;
}

function parseDelay(observacoes: string): number | null {
  if (!observacoes) return null;

  // Match patterns like "Circula com atraso de 13 min." or "atraso de 5 min"
  const match = observacoes.match(/atraso\s+de\s+(\d+)\s*min/i);
  if (match) {
    return parseInt(match[1], 10);
  }
  return null;
}

function isCancelled(observacoes: string): boolean {
  if (!observacoes) return false;
  return observacoes.toUpperCase().includes("SUPRIMIDO");
}

function getStatusInfo(departure: Departure): {
  variant: "outline" | "secondary" | "destructive";
  className: string;
  icon: typeof Clock;
  text: string;
  isCancelled: boolean;
} {
  // Check for cancelled trains first
  if (isCancelled(departure.Observacoes)) {
    return {
      variant: "destructive",
      className: "text-red-700 bg-red-100",
      icon: XCircle,
      text: "Suprimido",
      isCancelled: true,
    };
  }

  if (departure.ComboioPassou) {
    return {
      variant: "outline",
      className: "text-muted-foreground",
      icon: CheckCircle2,
      text: "Passou",
      isCancelled: false,
    };
  }

  const delay = parseDelay(departure.Observacoes);

  if (delay !== null && delay > 0) {
    return {
      variant: "secondary",
      className: "text-amber-700 bg-amber-100",
      icon: AlertTriangle,
      text: `+${delay} min`,
      isCancelled: false,
    };
  }

  return {
    variant: "secondary",
    className: "text-green-700 bg-green-100",
    icon: Clock,
    text: "A tempo",
    isCancelled: false,
  };
}

export function TimetableView({ departures, isLoading, columnVisibility, onTrainClick }: TimetableViewProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">A carregar horários...</span>
        </div>
      </div>
    );
  }

  if (departures.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Clock className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-lg font-medium text-muted-foreground">
            Nenhuma partida encontrada
          </p>
          <p className="text-sm text-muted-foreground">
            Selecione uma estação e tipo de serviço para ver os horários.
          </p>
        </div>
      </div>
    );
  }

  const showArrow = columnVisibility.origem && columnVisibility.destino;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columnVisibility.hora && <TableHead className="w-[100px]">Hora</TableHead>}
            {columnVisibility.estado && <TableHead className="w-[100px]">Estado</TableHead>}
            {columnVisibility.comboio && <TableHead className="w-[100px]">Comboio</TableHead>}
            {columnVisibility.servico && <TableHead className="w-[120px]">Serviço</TableHead>}
            {columnVisibility.origem && <TableHead>Origem</TableHead>}
            {showArrow && <TableHead className="w-[40px]"></TableHead>}
            {columnVisibility.destino && <TableHead>Destino</TableHead>}
            {columnVisibility.operador && <TableHead className="w-[120px]">Operador</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {departures.map((departure, index) => {
            const status = getStatusInfo(departure);
            const StatusIcon = status.icon;
            const hasObservations = departure.Observacoes && departure.Observacoes.trim() !== "";
            const showExtraObservations =
              hasObservations && !parseDelay(departure.Observacoes) && !status.isCancelled;

            return (
              <TableRow
                key={`${departure.NComboio1}-${departure.DataHoraPartidaChegada}-${index}`}
                className={`${departure.ComboioPassou ? "opacity-50" : ""} ${status.isCancelled ? "opacity-60 line-through decoration-red-500" : ""} ${onTrainClick ? "cursor-pointer hover:bg-muted/50" : ""}`}
                onClick={onTrainClick ? () => onTrainClick(departure.NComboio1) : undefined}
              >
                {columnVisibility.hora && (
                  <TableCell className="font-mono text-lg font-semibold">
                    {departure.DataHoraPartidaChegada}
                  </TableCell>
                )}
                {columnVisibility.estado && (
                  <TableCell className="no-underline" style={{ textDecoration: "none" }}>
                    <div className="flex flex-col gap-1">
                      <Badge variant={status.variant} className={status.className}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {status.text}
                      </Badge>
                      {showExtraObservations && (
                        <span
                          className="text-xs text-muted-foreground max-w-[150px] truncate"
                          title={departure.Observacoes}
                        >
                          {departure.Observacoes}
                        </span>
                      )}
                    </div>
                  </TableCell>
                )}
                {columnVisibility.comboio && (
                  <TableCell className="font-mono">
                    {departure.NComboio1}
                  </TableCell>
                )}
                {columnVisibility.servico && (
                  <TableCell>
                    <Badge variant={getServiceBadgeVariant(departure.TipoServico)}>
                      {formatServiceType(departure.TipoServico)}
                    </Badge>
                  </TableCell>
                )}
                {columnVisibility.origem && (
                  <TableCell className="font-medium">{departure.NomeEstacaoOrigem}</TableCell>
                )}
                {showArrow && (
                  <TableCell>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </TableCell>
                )}
                {columnVisibility.destino && (
                  <TableCell className="font-medium">{departure.NomeEstacaoDestino}</TableCell>
                )}
                {columnVisibility.operador && (
                  <TableCell className="text-sm text-muted-foreground">
                    {departure.Operador}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
