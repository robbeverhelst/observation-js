# `observation-js` Feature Checklist

This document tracks the implementation status of the `waarneming.nl` API endpoints in the `observation-js` library.

- ✅ **Implemented & Tested**: The feature is implemented and covered by passing unit tests.
- 🟡 **Implemented (Untested)**: The feature is implemented, but has not been tested against the live API (e.g., requires authentication).
- ❌ **Not Implemented**: The feature has not been implemented yet.

---

### Core Client

| Feature | Status | Notes |
|---|---|---|
| **Authentication** | | |
| OAuth2: Authorization Code Flow | 🟡 Implemented (Untested) | `getAuthorizationUrl()`, `getAccessToken()` |
| OAuth2: Password Grant Flow | 🟡 Implemented (Untested) | `getAccessTokenFromPassword()` |
| OAuth2: Refresh Token | 🟡 Implemented (Untested) | `refreshAccessToken()` |
| OAuth2: Revoke Token | 🟡 Implemented (Untested) | `revokeToken()` |
| **Utilities** | | |
| Public (Unauthenticated) Requests | ✅ Implemented & Tested | `publicRequest()` |
| Authenticated Requests | ✅ Implemented & Tested | `request()` |
| Test Environment Support | ❌ Not Implemented | Client should support targeting `waarneming-test.nl`. |

---

### API Resources

#### Observations

| Endpoint | Method | Status | Notes |
|---|---|---|---|
| `/api/v1/observations/{id}/` | `GET` | ✅ Implemented & Tested | `client.observations.get(id)` |
| `/api/v1/observations/create-single/` | `POST` | ❌ Not Implemented | |
| `/api/v1/observations/{id}/update/` | `POST` | ❌ Not Implemented | |
| `/api/v1/observations/{id}/delete/` | `POST` | ❌ Not Implemented | |

#### Species

| Endpoint | Method | Status | Notes |
|---|---|---|---|
| `/api/v1/species/{id}/observations/` | `GET` | ✅ Implemented & Tested | `client.species.getObservations(id)` |
| `/api/v1/species/` | `GET` | ✅ Implemented & Tested | `client.species.search(query)` |
| `/api/v1/species/{id}/` | `GET` | ✅ Implemented & Tested | `client.species.get(id)` |
| `/api/v1/species-occurrence/` | `GET` | ✅ Implemented & Tested | `client.species.getOccurrence(ids, point)` |
| `/api/v1/species-groups/` | `GET` | ✅ Implemented & Tested | `client.species.listGroups()` |
| `/api/v1/species-groups/{id}/attributes/` | `GET` | ✅ Implemented & Tested | `client.species.getGroupAttributes(id)` |

#### Regions

| Endpoint | Method | Status | Notes |
|---|---|---|---|
| `/api/v1/regions/` | `GET` | ✅ Implemented & Tested | `client.regions.list()` |
| `/api/v1/region-types/` | `GET` | ✅ Implemented & Tested | `client.regions.listTypes()` |

#### Locations

| Endpoint | Method | Status | Notes |
|---|---|---|---|
| `/api/v1/locations/` | `GET` | 🟡 Implemented (Untested) | `client.locations.search(params)` - Requires authentication. |
| `/api/v1/locations/{id}/` | `GET` | 🟡 Implemented (Untested) | `client.locations.get(id)` - Requires authentication. |
| `/api/v1/locations/{id}/species-seen/` | `GET` | 🟡 Implemented (Untested) | `client.locations.getSpeciesSeen(id, params)` - Requires authentication. |
| `/api/v1/locations/species-seen/` | `GET` | 🟡 Implemented (Untested) | `client.locations.getSpeciesSeenAroundPoint(params)` - Requires authentication. |
| `/api/v1/locations/geojson/` | `GET` | ✅ Implemented & Tested | `client.locations.getGeoJSON(params)` |

#### Region Species Lists

| Endpoint | Method | Status | Notes |
|---|---|---|---|
| `/api/v1/region-lists/` | `GET` | ✅ Implemented & Tested | `client.regionSpeciesLists.list()` |
| `/api/v1/region-lists/{list_id}/species/` | `GET` | ✅ Implemented & Tested | `client.regionSpeciesLists.getSpecies(listId)` |

#### User

| Endpoint | Method | Status | Notes |
|---|---|---|---|
| `/api/v1/user/terms/` | `GET` | ✅ Implemented & Tested | `client.users.getTerms()` |
| `/api/v1/user/register/` | `POST` | 🟡 Implemented (Untested) | `client.users.register(details)` |
| `/api/v1/user/password-reset/` | `POST` | 🟡 Implemented (Untested) | `client.users.resetPassword(email)` |
| `/api/v1/user/info/` | `GET` / `POST` | 🟡 Implemented (Untested) | `client.users.getInfo()`, `client.users.updateInfo(details)` - Requires authentication. |
| `/api/v1/user/resend-email-confirmation/` | `POST` | 🟡 Implemented (Untested) | `client.users.resendEmailConfirmation()` - Requires authentication. |
| `/api/v1/user/stats/observations/` | `GET` | 🟡 Implemented (Untested) | `client.users.getStats(params)` - Requires authentication. |
| `/api/v1/auth/magic-login-link/` | `POST` | 🟡 Implemented (Untested) | `client.users.getMagicLoginLink()` - Requires authentication. |
| `/api/v1/user/avatar/` | `GET`/`PUT`/`DELETE` | 🟡 Implemented (Untested) | `client.users.getAvatar()`, `updateAvatar()`, `deleteAvatar()` - Requires authentication. |

#### Countries

| Endpoint | Method | Status | Notes |
|---|---|---|---|
| `/api/v1/countries/` | `GET` | ✅ Implemented & Tested | `client.countries.list()` |

#### Other Resources

| Resource | Status | Notes |
|---|---|---|
| Badges | ❌ Not Implemented | |
| Challenges | ❌ Not Implemented | |
| Countries | ✅ Implemented & Tested | Moved to dedicated section. |
| Exports | ❌ Not Implemented | |
| Groups | ❌ Not Implemented | |
| Information blocks | ❌ Not Implemented | |
| Languages | ❌ Not Implemented | |
| Locations | ✅ Implemented & Tested | Moved to dedicated section. |
| Lookups / Constants | ❌ Not Implemented | |
| NIA proxy | ❌ Not Implemented | |
| Region species lists | ✅ Implemented & Tested | Moved to dedicated section. |
| Regions | ✅ Implemented & Tested | Moved to dedicated section. |
| Sessions | ❌ Not Implemented | |
| Transects | ❌ Not Implemented | |
| User | ✅ Implemented & Tested | Moved to dedicated section. | 