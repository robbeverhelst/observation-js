export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Point {
  type: 'Point';
  coordinates: [number, number];
}

export interface UserDetail {
  id: number;
  name: string;
  avatar: string | null;
}

export interface LocationDetail {
  id: number;
  name: string;
  country_code: string;
  permalink: string;
  determination_requirements?: string;
}

export interface Photo {
  id: number;
  file: string;
  url: string;
  attribution: string;
  // and more properties if available from API
}

export interface Sound {
  id: number;
  file: string;
  url: string;
  attribution: string;
  // and more properties if available from API
}

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