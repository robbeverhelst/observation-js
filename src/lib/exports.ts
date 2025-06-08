import type { ObservationClient } from '../core/client';
import type {
  Export,
  ExportStartResponse,
  Paginated,
  StartExportOptions,
} from '../types';

export class Exports {
  private client: ObservationClient;

  constructor(client: ObservationClient) {
    this.client = client;
  }

  /**
   * Fetches the current exports for the authenticated user.
   * @returns A paginated list of exports.
   */
  public async list(): Promise<Paginated<Export>> {
    return this.client.request<Paginated<Export>>('exports/');
  }

  /**
   * Fetches the details of a single export.
   * @param exportId The ID of the export.
   * @returns The export object.
   */
  public async get(exportId: number): Promise<Export> {
    return this.client.request<Export>(`exports/${exportId}/`);
  }

  /**
   * Starts a new export job.
   * @param options The export options, specifying the type and filters.
   * @returns A response object with the new export's ID and status URL.
   */
  public async start(options: StartExportOptions): Promise<ExportStartResponse> {
    const bodyParams: Record<string, string> = {};
    for (const key in options) {
      const value = options[key as keyof typeof options];
      if (value !== undefined) {
        bodyParams[key] = String(value);
      }
    }
    const body = new URLSearchParams(bodyParams).toString();

    return this.client.request<ExportStartResponse>('exports/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });
  }
} 