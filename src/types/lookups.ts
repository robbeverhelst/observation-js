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
