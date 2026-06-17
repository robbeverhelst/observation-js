export interface Export {
  id: number;
  is_ready: boolean;
  expires: string;
  description: string;
  filesize: number | null;
  message: string;
  download_url: string | null;
}

export interface ExportStartResponse {
  id: number;
  message: string;
  state_url: string;
}

export type ExportFormat = 'csv' | 'xlsx' | 'SQLite';

interface ExportOptionsBase {
  export_format?: ExportFormat;
  notify_by_email?: boolean;
}

interface ExportFilters {
  date_after?: string;
  date_before?: string;
  species_group?: number;
  validation_status?: string;
}

export type StartExportOptions = (
  | {
      type: 'USER_OBSERVATIONS';
    }
  | {
      type: 'ORGANISATION_OBSERVATIONS';
      organisation_id: number;
    }
  | {
      type: 'PROJECT_DUMP';
      project_id: number;
    }
  | {
      type: 'SPECIES_SHOWCASE';
      showcase_id: number;
    }
) &
  ExportFilters &
  ExportOptionsBase;
