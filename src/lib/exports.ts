import type { ObservationClient } from '../core/client';
import type {
  Export,
  ExportStartResponse,
  Paginated,
  StartExportOptions,
} from '../types';

export class Exports {
  #client: ObservationClient;

  /**
   * @internal
   */
  constructor(client: ObservationClient) {
    this.#client = client;
  }

  /**
   * Fetches a list of the authenticated user's observation exports.
   *
   * @returns A promise that resolves to a paginated list of the user's exports.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async list(): Promise<Paginated<Export>> {
    return this.#client.request<Paginated<Export>>('exports/');
  }

  /**
   * Fetches the details of a single export by its ID.
   * The export must belong to the authenticated user.
   *
   * @param exportId - The unique identifier for the export.
   * @returns A promise that resolves to the export object.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async get(exportId: number): Promise<Export> {
    return this.#client.request<Export>(`exports/${exportId}`);
  }

  /**
   * Starts a new observation export job.
   * This sends a request to the server to begin generating an export file.
   * The status of the job can be tracked via the `get` method.
   *
   * @param options - The export options, specifying the type, format, and filters.
   * @returns A promise that resolves to an object containing the new export's ID and status URL.
   * @throws {AuthenticationError} If the request is not authenticated.
   * @throws {ApiError} If the request fails.
   */
  public async start(
    options: StartExportOptions,
  ): Promise<ExportStartResponse> {
    const bodyParams: Record<string, string> = {};
    for (const key in options) {
      const value = options[key as keyof typeof options];
      if (value !== undefined) {
        bodyParams[key] = String(value);
      }
    }
    const body = new URLSearchParams(bodyParams).toString();

    return this.#client.request<ExportStartResponse>('exports/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });
  }
}
