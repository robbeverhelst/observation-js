export interface Country {
  code: string;
  name: string;
}

export interface CountryList {
  next: string | null;
  previous: string | null;
  results: Country[];
}
