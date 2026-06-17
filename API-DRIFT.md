# Upstream API drift notes

A review on **2026-06-17** compared this client against the waarneming.nl /
observation.org API documentation.

> **Status: needs authenticated verification.** The docs at
> `https://waarneming.nl/api/docs/` are now **login-gated** — every page (HTML
> and `.md`, including `?format=openapi`) returns `HTTP 403`
> ("Authentication is required to view this documentation", linking to
> `/accounts/login/`). The findings below were reconstructed from
> search-engine-indexed snippets, **not** authoritative full reads. Do not
> rewrite published types on them blindly.

### How to verify properly

Log in with an approved API account and pull the spec with the session cookie:

```bash
curl --cookie "sessionid=<your-session>" \
  'https://waarneming.nl/api/docs/?format=openapi' -o openapi.json
# or fetch the per-resource markdown pages, e.g.
curl --cookie "sessionid=<your-session>" \
  'https://waarneming.nl/api/docs/observations.md'
```

Then diff against `src/types/*.ts`. Note upstream's own rule (`about.md`):
**"clients must accept more fields than described; adding fields is not a new API
version."** So *missing* fields are expected drift — only **type mismatches,
renamed fields, and wrong response shapes** are actionable bugs.

## Suspected drift (verify before acting)

| # | Confidence | File | Suspected issue |
|---|-----------|------|-----------------|
| 1 | High | `src/types/nia-proxy.ts:5` | `taxon.id` typed `number`, but upstream returns a string like `"8807@WRN"`. Also `model_version`/`species[]` may actually be `model_implementation:{tag,version}` + per-prediction `morphs` + top-level `life_stages`. |
| 2 | High | `src/types/regions.ts` (`Region`) | Indexed shape is `{id, type:number, name, continent?, iso?}`; current `slug`/`centroid`/`parent` may not exist. |
| 3 | High | `src/types/users.ts` (`User`) | `GET /user/info/` indexed as `{id, name, email, is_mail_allowed, url, country}`; current `avatar`/`observation_count`/`species_count`/`validation_count` may belong to a different endpoint. |
| 4 | High | `src/types/regions.ts`, `src/lib/regionSpeciesLists.ts` | `region-lists/` index rows look like `{id, region, species_group, custom_name?}` (not `RegionSpeciesList`). `region-lists/{id}/species/` rows are flat with `native`/`rank`/`determination_requirements`, not `SpeciesData`. |
| 5 | Medium | `src/types/species.ts` | Add `authority`. List/search objects may return singular `photo` (URL string) alongside detail `photos[]`. |
| 6 | Medium | `src/types/observations.ts` (`Observation`) | v1 detail may return `species` as a bare int (not nested) plus flat fields `number`, `sex`, `accuracy`, `notes`, `is_certain`, `uuid`, `modified`, `species_group`, `permalink`. Current shape looks v2-modeled while the lib calls v1 paths. The `location` field is documented as deprecated in favour of `location_detail`. |
| 7 | Medium | new resource | `transects` is a documented resource (`POST/PUT /api/v1/transects/create-or-update/`) with **no** type or lib class here. |

### Confirmed *correct* (no change needed)
- `SpeciesData.status` / `rarity` as `string` (+ optional `rarity_text`/`url`) — matches docs ("numeric or string, missing without a location").
- `Export`, `Country`, `LocationDetail`, `Lookups` keys — consistent with indexed examples.

### Other open questions
- **v1/v2 split:** base URL is hardcoded `/api/v1`; only `sessions` uses absolute `/api/v2` paths. Confirm whether more resources are migrating to v2 and whether the base should be per-resource configurable.
- **Trailing slashes:** several calls omit the trailing slash (e.g. `badges/${id}`, `challenges/${id}`, `groups/${id}`, `observations/${id}`, `species/${id}`) while most include it; Django `APPEND_SLASH` can 301-redirect and drop POST bodies. Verify each.
- **OAuth `client_credentials` grant:** documented but not implemented (only `authorization_code` / `password` / `refresh_token`).

### Resources that could not be verified at all (docs login-gated)
badges, challenges, groups, sessions, languages, media, information.
