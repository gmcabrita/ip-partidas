import type { StationSearchResponse, TimetableResponse, TrainInformationResponse } from "@/types";

async function fetchApi<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function searchStations(query: string): Promise<StationSearchResponse> {
  if (!query.trim()) {
    return { response: [] };
  }

  const encodedQuery = encodeURIComponent(query);
  const url = `https://run.gmcabrita.com/ip.getStations/${encodedQuery}`;

  return fetchApi<StationSearchResponse>(url);
}

export async function getTimetable(
  nodeId: number,
  date: Date,
  serviceTypes: string[],
): Promise<TimetableResponse> {
  const dateStr = formatDate(date);
  const startTime = `${dateStr} 00:00`;
  const endTime = `${dateStr} 23:59`;
  const services = serviceTypes.join(", ");

  const encodedStart = encodeURIComponent(startTime);
  const encodedEnd = encodeURIComponent(endTime);
  const encodedServices = encodeURIComponent(services);

  const url = `https://run.gmcabrita.com/ip.getTimetables/${nodeId}/${encodedStart}/${encodedEnd}/${encodedServices}`;

  return fetchApi<TimetableResponse>(url);
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function getTrainInformation(
  trainId: number,
  date: Date,
): Promise<TrainInformationResponse> {
  const dateStr = formatDate(date);
  const url = `https://run.gmcabrita.com/ip.getTrainInformation/${trainId}/${dateStr}`;

  return fetchApi<TrainInformationResponse>(url);
}
