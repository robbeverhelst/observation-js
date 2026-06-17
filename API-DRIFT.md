# API sync & v2.0 migration

On **2026-06-17** the client was diffed — field by field — against the
authenticated waarneming.nl API documentation (`https://waarneming.nl/api/docs/`,
pulled with a logged-in session) **and** verified against live API responses.
The type layer had drifted substantially from the real API. **v2.0 corrects it.**

Ground rule (from the API's `about.md`): *"clients must accept more fields than
described; adding fields is not a new API version."* So additive server fields are
not breaking. The changes below are corrections where the client's types or
requests **contradicted** the real API (wrong types, wrong field names, wrong
request params/methods) — these are breaking for consumers, hence the major bump.

## Breaking changes by resource

### Observations
- `species`, `user`, `location` are now **`number`** (IDs). The nested objects are
  separate optional fields: `species_detail`, `user_detail`, `location_detail`.
- `photos` / `sounds` are now **`string[]`** (URLs), not object arrays.
- Removed fields that the API never returned: `count`, `count_text`,
  `comments_count`, `likes_count`, `is_validated`, `model_prediction`,
  `obscured_by_user`. Renamed: `url`→`permalink`, `created_at`→`modified`,
  `count`→`number`.
- Query params corrected (the old names were silently ignored by the server):
  `modified_after`→`modified_since`, `observation_date_after`→`date_after`,
  `observation_date_before`→`date_before`.
- `getAroundPoint` now takes `{ coordinates: "lat,lng", days, radius?, end_date?, species_group?, min_rarity? }` (was `{ lat, lng, radius_km }`).
- `getDeleted` now returns `Paginated<{ original_id, deleted_at }>` and filters by `modified_since`.
- Create payload uses `species` / `number` (was `species_id` / `count`); `location_id` removed.
- `search()` now calls the real `GET /observations/` list endpoint (previously threw). Added bulk `create` (one-way sync).

### Species
- `photo: string` (was `photos: Photo[]`); `permalink` (was `url`); added `authority`, `group_name`, `info_text?`, `determination_requirements?`.
- `status` / `rarity` are optional strings (absent without a location context).
- `getOccurrence` returns `{ results: { species_id, occurs }[] }`; `getInformation` now typed `InformationBlock[]`; species-group attributes fully typed.

### Regions / region species lists
- `Region` is `{ id, type, name, continent?, iso? }` (removed `slug`/`centroid`/`parent`).
- `RegionSpeciesList` is `{ id, region, species_group, custom_name? }`.
- New `RegionSpecies` (flat row) returned by `regionSpeciesLists.getSpecies()`.

### Users
- `User` is `{ id, name, email, is_mail_allowed, url, country, consider_email_confirmed, avatar }` (count fields belong to `users.getStats()`).
- `Terms` keys are `tos` / `privacy` / `faq-obsidentify` (objects). `UserStats` typed as date→`[observations, species]` tuples.

### Locations
- `Location` uses `geom` (was `geometry`); removed `has_geometry`/`cover_photo`.
- `SpeciesSeen` fields renamed to match the API (`id`, `name`, `num_observations`, `last_seen`, …).
- `search` / `getSpeciesSeenAroundPoint` / `getGeoJSON` now send `coordinates="lat,lng"`.

### NIA
- `taxon.id` is a **string** (e.g. `"8807@WRN"`); `taxon` is `{ id, name }`.
- `model_coverage` is `{ image, description }`; removed `model_version`.
- `location_detail` is a full location object; `species[]` reshaped (`group` is a number); added `morphs`/`life_stages`.

### Sessions / Challenges / Groups / Exports / Countries
- **Sessions:** `Session` reshaped (removed `name`/`is_active`/`user`; added `observation_lists`, `start_datetime`/`end_datetime`, `geom`, …); added `sessions.get(uuid)`.
- **Challenges:** `getRanking` returns `{ ranking: ChallengeRank[] }`; `group` → `group_id`/`template_id`.
- **Groups:** `join` is `PUT groups/join/<code>/` and returns the group; `leave` is `DELETE`; `listChallengeTemplates(groupId)` is group-scoped.
- **Exports:** British spelling `ORGANISATION_OBSERVATIONS` / `organisation_id`; added `PROJECT_DUMP` and `xlsx`.
- **Countries:** `list()` returns `CountryList` (the API sends no `count`).

## New resources
- **`client.transects`** — legacy transect create/update (`POST`/`PUT /transects/create-or-update/`).
- **`client.bioblitzes`** — list, get, like/unlike, category statistics.

## Verification
Validated by the full integration suite (rewritten mocks) plus the live e2e suite
against the public API (`bun test tests/e2e/`).
