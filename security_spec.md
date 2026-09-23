# Security Specification for Ittehad News Firestore Rules

## 1. Data Invariants

- **Authentication**: Users must be authenticated to perform any administrative or creation duties (write articles, edit categories, modify settings, create accounts).
- **Admin Concept Support**: Users must have a matching record in the `/users/{userId}` collection where the field `role` strictly dictates their permissions.
  - "Admin": Can read/write everything.
  - "Editor": Can write/modify articles, comments, and videos, but cannot modify Categories, Settings, or other Users.
  - "Reporter": Can create articles and comments, but only update articles where they are the author or change status from draft to scheduled.
  - "User": Can insert comments under articles.
- **Strict Fields/Key Check**:
  - `createdAt` and `author` (when set to the logged-in user) are immutable after creation.
  - Size checks on IDs and every string field must prevent "Denial of Wallet" resource exhaustion attacks.
- **Terminal State Logic**: Articles marked as `status == 'published'` cannot be mutated back to `draft` except by an Admin or Editor.
- **Anonymity/User Verification**: Unverified Emails (`request.auth.token.email_verified == false`) are forbidden from privileged state transitions. Only verified email accounts of our staff or active portal managers are trusted.

---

## 2. The "Dirty Dozen" Payloads

Here are 12 specific JSON payloads designed to violate system rules:

### Payload 1: Privilege Escalation via User Profile Injection
- **Target Collection**: `/users/attackerUid`
- **Rogue Payload**: `{ "email": "attacker@rogue.com", "name": "Fake Admin", "role": "Admin" }`
- **Attempted Violation**: An unauthenticated or standard User attempts to create their own Admin document.

### Payload 2: Category Insertion by General Contributor
- **Target Collection**: `/categories/new_category`
- **Rogue Payload**: `{ "id": "new_category", "nameEN": "Hacker Zone", "nameUR": "ہیکر", "nameKN": "ಹ್ಯಾಕರ್", "icon": "Hammer" }`
- **Attempted Violation**: Let a Reporter or User create a system-wide news category.

### Payload 3: Changing Portal Settings by Non-Admin
- **Target Collection**: `/settings/current`
- **Rogue Payload**: `{ "websiteName": "Hacked News", "contactEmail": "attacker@malice.com", "aboutText": "Defaced" }`
- **Attempted Violation**: An Editor/Reporter/User tries to modify the global Site Settings.

### Payload 4: Fake Article Creation with Stolen Identity
- **Target Collection**: `/articles/art_99`
- **Rogue Payload**: `{ "id": "art_99", "title": "Stonks Crash!", "content": "Fake News Content", "author": "Qazi Altaf Rehman", "authorRole": "Admin", "category": "politics", "language": "ur", "date": "2026-06-11", "status": "published" }`
- **Attempted Violation**: A Reporter logs in as himself but specifies the `author` as the "Admin" to spoof authority.

### Payload 5: Rogue Field Update ("Ghost Field")
- **Target Collection**: `/articles/en-f1`
- **Rogue Payload**: `{ "views": 10000000, "ghost_field": "corrupted" }`
- **Attempted Violation**: An attacker injects un-whitelisted "ghost fields" to poison the document schema.

### Payload 6: Setting Manipulation on Behalf of Others
- **Target Collection**: `/settings/current`
- **Rogue Payload**: `{ "aboutText": "Defaced Text", "isAdSenseActive": false }`
- **Attempted Violation**: Trying to disable Ads via anonymous API.

### Payload 7: Resource Exhaustion ID Poisoning
- **Target Collection**: `/articles/VERY_LONG_STRING_OVER_ONE_MEGABYTE_FOR_ID_DENIAL_OF_WALLET...`
- **Rogue Payload**: `{ "id": "very_large_id", "title": "Large ID Article", "content": "..." }`
- **Attempted Violation**: Attempting to host or trigger lookups with bloated ID strings.

### Payload 8: Mutating Sibling's Article status directly
- **Target Collection**: `/articles/en-f1`
- **Rogue Payload**: `{ "title": "Overwritten title", "status": "published" }`
- **Attempted Violation**: A Reporter attempts to overwrite another reporter's article title.

### Payload 9: Self-Approving Comments
- **Target Collection**: `/comments/comm-99`
- **Rogue Payload**: `{ "id": "comm-99", "articleId": "en-f1", "name": "Spammer", "email": "spam@example.com", "content": "Approved directly", "date": "2026-06-11", "approved": true }`
- **Attempted Violation**: A general reader inserts a comment that is already pre-approved.

### Payload 10: State Shortcut (Unlocking Terminally Published Article)
- **Target Collection**: `/articles/en-f1`
- **Rogue Payload**: `{ "status": "draft" }`
- **Attempted Violation**: Trying to regress a terminally published article to a raw "draft" state.

### Payload 11: Spoofed Email Verification
- **Target Collection**: `/articles/new_art`
- **Rogue Payload**: `{ "id": "new_art", "title": "Validating unverified", "content": "Spoof", "category": "local", "language": "en", "date": "2026-06-11", "status": "published" }`
- **Attempted Violation**: Logged in user has `email_verified == false` yet attempts to write content.

### Payload 12: Absolute Blanket Query Read without Filter
- **Target Query**: `db.collection('comments')` (without `approved == true` filters or non-owner filtering)
- **Attempted Violation**: Pulling unmoderated comment queues via client client-side scrapers.

---

## 3. Test Cases (Mock verification)

The Firestore Security Rules will reject all 12 of the above payloads with `PERMISSION_DENIED` errors.
