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
| Test Environment Support | ✅ Implemented & Tested | Client constructor accepts an optional `baseUrl`. |

---

### API Resources

#### Observations

| Endpoint | Method | Status | Notes |
|---|---|---|---|
| `/api/v1/observations/{id}/` | `GET` | ✅ Implemented & Tested | `client.observations.get(id)` |
| `/api/v1/observations/create-single/` | `POST` | 🟡 Implemented (Untested) | `client.observations.create(payload, options)` |
| `/api/v1/observations/{id}/update/` | `POST` | 🟡 Implemented (Untested) | `client.observations.update(id, payload, options)` |
| `/api/v1/observations/{id}/delete/` | `POST` | 🟡 Implemented (Untested) | `client.observations.delete(id)` |

#### Media

| Endpoint | Method | Status | Notes |
|---|---|---|---|
| `/api/v1/media-upload/` | `POST` | 🟡 Implemented (Untested) | `client.media.upload(file)` |

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

#### Badges

| Endpoint | Method | Status | Notes |
|---|---|---|---|
| `/api/v1/badges/` | `GET` | ✅ Implemented & Tested | `client.badges.list()` - Public and authenticated behavior. |
| `/api/v1/badges/<badge_id>/` | `GET` | ✅ Implemented & Tested | `client.badges.get(id)` - Public and authenticated behavior. |
| `/api/v1/badges/observation/<obs_id>/` | `GET` | 🟡 Implemented (Untested) | `client.badges.getForObservation(id)` - Requires authentication. |
| `/api/v1/badges/user-badge/seen/` | `POST` | 🟡 Implemented (Untested) | `client.badges.markAllAsSeen()` - Requires authentication. |
| `/api/v1/badges/user-badge/<id>/seen/` | `GET`/`POST` | 🟡 Implemented (Untested) | `client.badges.getLastSeen(id)`, `markAsSeen(id)` - Requires authentication. |
| `/api/v1/badges/user-season-badge/<id>/seen/` | `GET`/`POST` | 🟡 Implemented (Untested) | `client.badges.getSeasonLastSeen(id)`, `markSeasonAsSeen(id)` - Requires authentication. |

#### Groups

| Endpoint | Method | Status | Notes |
|---|---|---|---|
| `/api/v1/user/groups/` | `GET` | 🟡 Implemented (Untested) | `client.groups.list()` - Requires authentication. |
| `/api/v1/groups/<id>/` | `GET` | 🟡 Implemented (Untested) | `client.groups.get(id)` - Requires authentication. |
| `/api/v1/groups/<id>/summary/<code>/` | `GET` | ✅ Implemented & Tested | `client.groups.getSummary(id, code)` |
| `/api/v1/groups/create/` | `POST` | 🟡 Implemented (Untested) | `client.groups.create(name, photo)` - Requires authentication. |
| `/api/v1/groups/<id>/` | `PATCH` | 🟡 Implemented (Untested) | `client.groups.update(id, data)` - Requires authentication. |
| `/api/v1/groups/<id>/` | `DELETE` | 🟡 Implemented (Untested) | `client.groups.delete(id)` - Requires authentication. |
| `/api/v1/groups/<id>/renew-invite-code/` | `POST` | 🟡 Implemented (Untested) | `client.groups.renewInviteCode(id)` - Requires authentication. |
| `/api/v1/groups/<id>/join/<code>/` | `POST` | 🟡 Implemented (Untested) | `client.groups.join(id, code)` - Requires authentication. |
| `/api/v1/groups/<id>/leave/` | `POST` | 🟡 Implemented (Untested) | `client.groups.leave(id)` - Requires authentication. |
| `/api/v1/groups/<id>/members/<id>/` | `DELETE` | 🟡 Implemented (Untested) | `client.groups.removeMember(groupId, memberId)` - Requires authentication. |
| `/api/v1/groups/challenge-templates/` | `GET` | 🟡 Implemented (Untested) | `client.groups.listChallengeTemplates()` - Requires authentication. |
| `/api/v1/groups/<id>/challenges/` | `GET` | 🟡 Implemented (Untested) | `client.groups.listChallenges(id)` - Requires authentication. |
| `/api/v1/groups/<id>/challenges/` | `POST` | 🟡 Implemented (Untested) | `client.groups.createChallenge(id, data)` - Requires authentication. |
| `/api/v1/groups/<id>/challenges/<id>/` | `PUT`/`PATCH` | 🟡 Implemented (Untested) | `client.groups.updateChallenge(groupId, challengeId, data)` - Requires authentication. |
| `/api/v1/groups/<id>/challenges/<id>/` | `DELETE` | 🟡 Implemented (Untested) | `client.groups.deleteChallenge(groupId, challengeId)` - Requires authentication. |
| `/api/v1/groups/<id>/observations/` | `GET` | 🟡 Implemented (Untested) | `client.groups.getObservations(id)` - Requires authentication. |

#### Exports

| Endpoint | Method | Status | Notes |
|---|---|---|---|
| `/api/v1/exports/` | `GET` | 🟡 Implemented (Untested) | `client.exports.list()` - Requires authentication. |
| `/api/v1/exports/<id>/` | `GET` | 🟡 Implemented (Untested) | `client.exports.get(id)` - Requires authentication. |
| `/api/v1/exports/` | `POST` | 🟡 Implemented (Untested) | `client.exports.start(options)` - Requires authentication. |

#### Languages

| Endpoint | Method | Status | Notes |
|---|---|---|---|
| `/api/v1/languages/` | `GET` | ✅ Implemented & Tested | `client.languages.list()` |

#### Lookups

| Endpoint | Method | Status | Notes |
|---|---|---|---|
| `/api/v1/lookups/` | `GET` | ✅ Implemented & Tested | `client.lookups.get()` |

#### NIA Proxy

| Endpoint | Method | Status | Notes |
|---|---|---|---|
| `/api/identify-proxy/v1/` | `POST` | 🟡 Implemented (Untested) | `client.nia.identify(options)` - Can be used without auth (limited) or with auth. |

#### Sessions (V2)

| Endpoint | Method | Status | Notes |
|---|---|---|---|
| `/api/v2/user/sessions/` | `GET` | 🟡 Implemented (Untested) | `client.sessions.list()` - Requires authentication. |
| `/api/v2/sessions/` | `POST` | 🟡 Implemented (Untested) | `client.sessions.create(payload)` - Requires authentication. |
| `