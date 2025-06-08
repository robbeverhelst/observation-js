export interface SpeciesDetail {
  id: number;
  scientific_name: string;
  name: string;
  group: number;
  type: string;
}

export interface UserDetail {
  id: number;
  name: string;
  avatar: string | null;
}

export interface User extends UserDetail {
  email: string;
  permalink: string;
  country: string;
  url: string;
  is_mail_allowed: boolean;
  consider_email_confirmed: boolean;
}

export interface LocationDetail {
  id: number;
  name: string;
  country_code: string;
  permalink: string;
  determination_requirements?: string;
}

export interface Point {
  type: 'Point';
  coordinates: [number, number];
}

export interface Observation {
  id: number;
  uuid: string;
  species: number;
  species_detail: SpeciesDetail;
  date: string;
  time: string | null;
  number: number;
  sex: string;
  is_certain: boolean;
  is_escape: boolean;
  point: Point;
  accuracy: number | null;
  location: number;
  location_detail: LocationDetail;
  user: number;
  user_detail: UserDetail;
  notes: string | null;
  permalink: string;
  modified: string;
  validation_status: string;
  rarity: number;
  species_status: number;
  activity: number;
  life_stage: number;
  method: number | null;
  substrate: null; // Type unknown
  related_species: number;
  obscurity: number;
  counting_method: number | null;
  embargo_date: string;
  external_reference: string | null;
  links: any[]; // Type unknown
  details: any[]; // Type unknown
  observer_location: Point | null;
  transect_uuid: string | null;
  species_group: number;
  photos: any[]; // Define photo type later
  sounds: any[]; // Define sound type later
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ObservationClientOptions {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface PasswordGrantOptions {
  clientId: string;
  clientSecret?: string; // Only for confidential clients
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface Species {
  id: number;
  scientific_name: string;
  authority: string;
  name: string;
  group: number;
  group_name: string;
  status: string;
  rarity: string;
  type: string;
  photo: string | null;
  permalink: string;
  determination_requirements?: string;
  info_text?: string;
}

export interface SpeciesGroup {
  id: number;
  name: string;
}

export interface SpeciesGroupAttributeValue {
  id: number;
  text: string;
  is_active: boolean;
  is_default?: boolean;
  bmp?: boolean;
}

export interface SpeciesGroupAttributes extends SpeciesGroup {
  activity: SpeciesGroupAttributeValue[];
  method: SpeciesGroupAttributeValue[];
  life_stage: SpeciesGroupAttributeValue[];
  substrate?: SpeciesGroupAttributeValue[];
}

export interface SpeciesOccurrence {
  species_id: number;
  occurs: 'yes' | 'no' | 'unknown';
}

export interface Region {
  id: number;
  type: number;
  name: string;
  continent?: number;
  iso?: string;
}

export interface RegionType {
  id: number;
  name: string;
}

export interface Location {
  id: number;
  name: string;
  country_code: string;
  permalink: string;
  is_active?: boolean;
  geom?: GeoJSON.Geometry;
}

export interface SpeciesSeen {
  id: number;
  scientific_name: string;
  name: string;
  group: number;
  rarity: number;
  species_url: string;
  num_observations: number;
  last_seen?: string;
  last_observation?: number;
  last_observation_url?: string;
}

// Basic GeoJSON types based on the API response
export namespace GeoJSON {
  export type Geometry = Point | Polygon | MultiPolygon | LineString;

  export interface Point {
    type: 'Point';
    coordinates: [number, number];
  }

  export interface Polygon {
    type: 'Polygon';
    coordinates: Array<Array<[number, number]>>;
  }

  export interface MultiPolygon {
    type: 'MultiPolygon';
    coordinates: Array<Array<Array<[number, number]>>>;
  }

  export interface LineString {
    type: 'LineString';
    coordinates: Array<[number, number]>;
  }

  export interface Feature<G extends Geometry | null = Geometry> {
    type: 'Feature';
    geometry: G;
    properties: Record<string, any> | null;
  }

  export interface FeatureCollection<G extends Geometry | null = Geometry> {
    type: 'FeatureCollection';
    features: Array<Feature<G>>;
  }
}

export interface RegionSpeciesList {
  id: number;
  region: number;
  species_group: number;
  custom_name?: string;
}

export interface RegionSpecies {
  species: number;
  group: number;
  name: string;
  scientific_name: string;
  rarity: number;
  native: boolean;
  type: string;
  rank: number;
  sort_order_group: number;
  sort_order_rank: number;
  sort_order_taxonomy: number;
  determination_requirements?: string;
}

export interface TermContent {
  content: string;
  created: string;
  permalink: string;
  title?: string;
}

export interface Terms {
  tos: TermContent;
  privacy: TermContent;
  'faq-obsidentify': TermContent;
}

export interface UserStats {
  total: [number, number];
  [date: string]: [number, number];
}

export interface Country {
  code: string;
  name: string;
}

export interface CountryList {
  next: string | null;
  previous: string | null;
  results: Country[];
}

export interface BadgeLevel {
  id: number;
  target_species: number;
  target_observations: number;
  value: number;
  content: string;
}

export interface UserRegularBadge {
  id: number;
  num_species: number;
  num_observations: number;
  is_valid: boolean;
  last_seen: string;
  publication_time: string;
  level: BadgeLevel;
}

export interface UserSeasonBadge {
  id: number;
  rank: number;
  content: string;
  country_code: string;
  last_seen: string;
  publication_time: string;
  label: string;
}

export interface Badge {
  id: number;
  name: string;
  type: 'regular' | 'season';
  silhouette: string;
  background_color: string;
  species_groups: number[];
  user_regular_badge: UserRegularBadge | null;
  next_level: BadgeLevel | null;
  onboarding_levels: BadgeLevel[] | null;
  user_season_badges: UserSeasonBadge[] | null;
}

export interface GroupMember {
  id: number;
  name: string;
  avatar: string | null;
  role: 'admin' | 'member';
}

export interface Group {
  id: number;
  name: string;
  photo: string;
  created_at: string;
  invite_link: string;
  members: GroupMember[];
}

export type GroupSummary = Pick<Group, 'id' | 'name' | 'photo'>;

export interface ChallengeUser {
  is_subscribed: boolean;
  observation_count: number;
  species_count: number;
}

export interface Challenge {
  id: number;
  type: string;
  title: string;
  header: string;
  start_date_time: string;
  end_date_time: string;
  cover_image: string;
  cover_thumbnail: string | null;
  results: any[];
  observation_count: number;
  species_count: number;
  challenge_user: ChallengeUser;
  targets_description: string;
  targets: any[];
  group_id: number;
  template_id: number;
}

export interface ChallengeTemplate {
  id: number;
  title: string;
  species_groups: number[];
}

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

export type ExportFormat = 'csv' | 'tsv' | 'SQLite';

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
      type: 'ORGANIZATION_OBSERVATIONS';
      organization_id: number;
    }
  | {
      type: 'SPECIES_SHOWCASE';
      showcase_id: number;
    }
) &
  ExportFilters &
  ExportOptionsBase;

export type Icon = 'external-link' | 'wikipedia-w';

export interface Link {
  url: string;
  icon?: Icon;
  text: string;
}

interface ContentBlockBase {
  type: string;
  skippable?: boolean;
}

export interface ContentBlockHtml extends ContentBlockBase {
  type: 'html';
  body: string;
  collapsed?: boolean;
}

export interface GalleryImage {
  url: string;
  attribution: string;
  location: string;
}

export interface GalleryItem {
  title: string;
  subtitle: string;
  description: string;
  images: GalleryImage[];
  link?: Link;
}

export interface ContentBlockGallery extends ContentBlockBase {
  type: 'gallery';
  items: GalleryItem[];
}

export interface GallerySound {
  url: string;
  attribution: string;
  sonogram_url: string;
  location: string;
}

export interface SoundGalleryItem {
  title: string;
  subtitle: string;
  description: string;
  sounds: GallerySound[];
  link?: Link;
}

export interface ContentBlockSoundGallery extends ContentBlockBase {
  type: 'sound-gallery';
  items: SoundGalleryItem[];
}

export interface ContentBlockSpeciesHeader extends ContentBlockBase {
  type: 'species-header';
  scientific_name: string;
  authority: string;
  name: string;
}

export interface ContentBlockExternalLinks extends ContentBlockBase {
  type: 'external-links';
  links: Link[];
}

export interface ItemListItem {
  type: 'rarity' | 'status' | 'obscurity';
  label: string;
  sublabel?: string;
  value: number;
}

export interface ContentBlockItemList extends ContentBlockBase {
  type: 'item-list';
  title?: string;
  items: ItemListItem[];
}

export type ContentBlock =
  | ContentBlockHtml
  | ContentBlockGallery
  | ContentBlockSoundGallery
  | ContentBlockSpeciesHeader
  | ContentBlockExternalLinks
  | ContentBlockItemList;

export interface InformationBlock {
  title?: string;
  content: ContentBlock[];
  info?: string;
  link?: Link;
}

export interface Language {
  code: string;
  name_en: string;
  name_native: string;
}

export interface LookupValue<T extends string | number> {
  id: T;
  name: string;
  is_active: boolean;
}

export interface CountingMethodValue extends LookupValue<number> {
  is_default?: boolean;
}

export interface Lookups {
  validation_status: LookupValue<string>[];
  rarity: LookupValue<number>[];
  counting_method: CountingMethodValue[];
  obscurity: LookupValue<number>[];
  species_type: LookupValue<string>[];
  species_status: LookupValue<number>[];
}

export interface ModelCoverage {
  image: string;
  description: string;
}

export interface NiaSpecies {
  id: number;
  scientific_name: string;
  name: string;
  group: number;
  type: string;
  rarity?: number;
  status?: number;
}

export interface NiaLifeStage {
  species_id: number;
  id: number;
  text: string;
  is_active: boolean;
  is_default?: boolean;
}

export interface NiaMorph {
  probability: number;
  token: string;
}

export interface NiaPrediction {
  probability: number;
  taxon: {
    id: string;
    name: string;
  };
  morphs?: NiaMorph[];
}

export interface NiaResponse {
  predictions: NiaPrediction[];
  model_coverage: ModelCoverage;
  location?: string; // Deprecated
  location_detail?: LocationDetail;
  species?: NiaSpecies[];
  life_stages?: NiaLifeStage[];
}

export interface MediaUploadResponse {
  name: string;
  type: 'jpg' | 'mp3' | 'wav';
  exif?: {
    datetime?: string;
    date?: string;
    time?: string;
  };
}

export interface ObservationDetailPayload {
  number?: number;
  sex?: 'M' | 'F' | 'U';
  activity?: number;
  life_stage?: number;
}

export interface CreateObservationPayload {
  species: number;
  date: string; // yyyy-mm-dd
  point: string | Point;
  time?: string; // hh:mm
  number?: number;
  sex?: 'M' | 'F' | 'U';
  is_certain?: boolean;
  notes?: string;
  external_reference?: string;
  activity?: number;
  life_stage?: number;
  method?: number;
  substrate?: number;
  obscurity?: number;
  counting_method?: number;
  embargo_date?: string; // yyyy-mm-dd
  transect_uuid?: string;
  details?: ObservationDetailPayload[];
  upload_media?: string[];
  recognition_probability?: number;
}

export type UpdateObservationPayload = Omit<
  CreateObservationPayload,
  'species' | 'date' | 'point'
> & {
  species?: number;
  date?: string;
  point?: string | Point;
};

export interface CreateObservationOptions {
  upload_photos?: Blob[];
  upload_sounds?: Blob[];
}

export interface ObservationList {
  id?: number;
  species_group: number;
  all_species_counted: boolean | null;
  all_individuals_counted: boolean | null;
  notes: string;
}

export interface Session {
  id: number;
  uuid: string;
  type: 'point' | 'transect';
  observation_lists: ObservationList[];
  observation_count: number;
  location_detail: LocationDetail;
  start_datetime: string;
  end_datetime: string;
  geom: GeoJSON.Point | GeoJSON.LineString;
  notes: string;
  permalink: string;
}

export interface CreateSessionPayload {
  uuid: string;
  type: 'point' | 'transect';
  observation_lists: Omit<ObservationList, 'id'>[];
  start_datetime: string;
  end_datetime: string;
  geom: GeoJSON.Point | GeoJSON.LineString;
  notes: string;
}

export type UpdateSessionPayload = CreateSessionPayload; 