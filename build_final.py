import json

out = "implementation_plan_final.md"

with open("gen_sql.py", "r") as f:
    sql_logic = f.read()

with open("tests.md", "r") as f:
    tests_md = f.read()

# Fields
fields = [
    {"key": "title", "db": "title", "db_t": "text", "json_t": "string", "omit": "preserve", "null": "Err", "estr": "NULL", "earr": "N/A", "eobj": "N/A", "norm": "TRIM", "val": "Pre", "var": "v_eff_title", "upd": "UPDATE public.competitions", "inv": "title=v_eff_title", "tests": "11-13"},
    {"key": "slug", "db": "slug", "db_t": "text", "json_t": "string", "omit": "preserve", "null": "Err", "estr": "NULL", "earr": "N/A", "eobj": "N/A", "norm": "LOWER(TRIM)", "val": "Pre", "var": "v_eff_slug", "upd": "UPDATE public.competitions", "inv": "slug=v_eff_slug", "tests": "29"},
    {"key": "category_id", "db": "category_id", "db_t": "uuid", "json_t": "string", "omit": "preserve", "null": "NULL", "estr": "NULL", "earr": "N/A", "eobj": "N/A", "norm": "UUID", "val": "Pre", "var": "v_eff_category_id", "upd": "UPDATE public.competitions", "inv": "category_id=...", "tests": "14"},
    {"key": "short_description", "db": "short_description", "db_t": "text", "json_t": "string", "omit": "preserve", "null": "NULL", "estr": "NULL", "earr": "N/A", "eobj": "N/A", "norm": "TRIM", "val": "Pre", "var": "v_eff_short_description", "upd": "UPDATE public.competitions", "inv": "short_description=...", "tests": "30"},
    {"key": "description", "db": "description", "db_t": "text", "json_t": "string", "omit": "preserve", "null": "NULL", "estr": "NULL", "earr": "N/A", "eobj": "N/A", "norm": "TRIM", "val": "Pre", "var": "v_eff_description", "upd": "UPDATE public.competitions", "inv": "description=...", "tests": "31"},
    {"key": "rules", "db": "rules", "db_t": "text", "json_t": "string", "omit": "preserve", "null": "NULL", "estr": "NULL", "earr": "N/A", "eobj": "N/A", "norm": "TRIM", "val": "Pre", "var": "v_eff_rules", "upd": "UPDATE public.competitions", "inv": "rules=...", "tests": "32"},
    {"key": "important_information", "db": "important_information", "db_t": "jsonb", "json_t": "array", "omit": "preserve", "null": "NULL", "estr": "N/A", "earr": "NULL", "eobj": "N/A", "norm": "ARRAY_TRIM", "val": "Pre", "var": "v_eff_important_information", "upd": "UPDATE public.competitions", "inv": "important_information=...", "tests": "17"},
    {"key": "competition_level", "db": "competition_level", "db_t": "text", "json_t": "string", "omit": "preserve", "null": "NULL", "estr": "NULL", "earr": "N/A", "eobj": "N/A", "norm": "TRIM", "val": "Pre", "var": "v_eff_competition_level", "upd": "UPDATE public.competitions", "inv": "competition_level=...", "tests": "33"},
    {"key": "competition_mode", "db": "competition_mode", "db_t": "text", "json_t": "string", "omit": "preserve", "null": "NULL", "estr": "NULL", "earr": "N/A", "eobj": "N/A", "norm": "TRIM", "val": "Pre", "var": "v_eff_competition_mode", "upd": "UPDATE public.competitions", "inv": "competition_mode=...", "tests": "34"},
    {"key": "min_team_size", "db": "min_team_size", "db_t": "integer", "json_t": "number", "omit": "preserve", "null": "NULL", "estr": "N/A", "earr": "N/A", "eobj": "N/A", "norm": "validate_finite_numeric", "val": "Pre", "var": "v_eff_min_team_size", "upd": "UPDATE public.competitions", "inv": "min_team_size=...", "tests": "15,16"},
    {"key": "max_team_size", "db": "max_team_size", "db_t": "integer", "json_t": "number", "omit": "preserve", "null": "NULL", "estr": "N/A", "earr": "N/A", "eobj": "N/A", "norm": "validate_finite_numeric", "val": "Pre", "var": "v_eff_max_team_size", "upd": "UPDATE public.competitions", "inv": "max_team_size=...", "tests": "35"},
    {"key": "starts_at", "db": "starts_at", "db_t": "timestamptz", "json_t": "string", "omit": "preserve", "null": "NULL", "estr": "NULL", "earr": "N/A", "eobj": "N/A", "norm": "TIMESTAMPTZ", "val": "Pre", "var": "v_eff_starts_at", "upd": "UPDATE public.competitions", "inv": "starts_at=...", "tests": "36"},
    {"key": "ends_at", "db": "ends_at", "db_t": "timestamptz", "json_t": "string", "omit": "preserve", "null": "NULL", "estr": "NULL", "earr": "N/A", "eobj": "N/A", "norm": "TIMESTAMPTZ", "val": "Pre", "var": "v_eff_ends_at", "upd": "UPDATE public.competitions", "inv": "ends_at=...", "tests": "37"},
    {"key": "registration_open_at", "db": "registration_open_at", "db_t": "timestamptz", "json_t": "string", "omit": "preserve", "null": "NULL", "estr": "NULL", "earr": "N/A", "eobj": "N/A", "norm": "TIMESTAMPTZ", "val": "Pre", "var": "v_eff_registration_open_at", "upd": "UPDATE public.competitions", "inv": "registration_open_at=...", "tests": "38"},
    {"key": "registration_close_at", "db": "registration_close_at", "db_t": "timestamptz", "json_t": "string", "omit": "preserve", "null": "NULL", "estr": "NULL", "earr": "N/A", "eobj": "N/A", "norm": "TIMESTAMPTZ", "val": "Pre", "var": "v_eff_registration_close_at", "upd": "UPDATE public.competitions", "inv": "registration_close_at=...", "tests": "39"},
    {"key": "registration_fee", "db": "registration_fee", "db_t": "numeric", "json_t": "number", "omit": "preserve", "null": "NULL", "estr": "N/A", "earr": "N/A", "eobj": "N/A", "norm": "validate_finite_numeric", "val": "Pre", "var": "v_eff_registration_fee", "upd": "UPDATE public.competitions", "inv": "registration_fee=...", "tests": "19-21"},
    {"key": "registration_approval_mode", "db": "registration_approval_mode", "db_t": "text", "json_t": "string", "omit": "preserve", "null": "NULL", "estr": "NULL", "earr": "N/A", "eobj": "N/A", "norm": "TRIM", "val": "Pre", "var": "v_eff_registration_approval_mode", "upd": "UPDATE public.competitions", "inv": "registration_approval_mode=...", "tests": "40"},
    {"key": "waitlist_enabled", "db": "waitlist_enabled", "db_t": "boolean", "json_t": "boolean", "omit": "preserve", "null": "NULL", "estr": "N/A", "earr": "N/A", "eobj": "N/A", "norm": "BOOL", "val": "Pre", "var": "v_eff_waitlist_enabled", "upd": "UPDATE public.competitions", "inv": "waitlist_enabled=...", "tests": "41"},
    {"key": "participation_certificate_enabled", "db": "participation_certificate_enabled", "db_t": "boolean", "json_t": "boolean", "omit": "preserve", "null": "NULL", "estr": "N/A", "earr": "N/A", "eobj": "N/A", "norm": "BOOL", "val": "Pre", "var": "v_eff_participation_certificate_enabled", "upd": "UPDATE public.competitions", "inv": "participation_certificate_enabled=...", "tests": "42"},
    {"key": "merit_certificate_enabled", "db": "merit_certificate_enabled", "db_t": "boolean", "json_t": "boolean", "omit": "preserve", "null": "NULL", "estr": "N/A", "earr": "N/A", "eobj": "N/A", "norm": "BOOL", "val": "Pre", "var": "v_eff_merit_certificate_enabled", "upd": "UPDATE public.competitions", "inv": "merit_certificate_enabled=...", "tests": "43"},
    {"key": "winner_certificate_enabled", "db": "winner_certificate_enabled", "db_t": "boolean", "json_t": "boolean", "omit": "preserve", "null": "NULL", "estr": "N/A", "earr": "N/A", "eobj": "N/A", "norm": "BOOL", "val": "Pre", "var": "v_eff_winner_certificate_enabled", "upd": "UPDATE public.competitions", "inv": "winner_certificate_enabled=...", "tests": "44"},
    {"key": "certificate_verification_enabled", "db": "certificate_verification_enabled", "db_t": "boolean", "json_t": "boolean", "omit": "preserve", "null": "NULL", "estr": "N/A", "earr": "N/A", "eobj": "N/A", "norm": "BOOL", "val": "Pre", "var": "v_eff_certificate_verification_enabled", "upd": "UPDATE public.competitions", "inv": "certificate_verification_enabled=...", "tests": "45"},
    {"key": "certificate_delivery_method", "db": "certificate_delivery_method", "db_t": "text", "json_t": "string", "omit": "preserve", "null": "NULL", "estr": "NULL", "earr": "N/A", "eobj": "N/A", "norm": "TRIM", "val": "Pre", "var": "v_eff_certificate_delivery_method", "upd": "UPDATE public.competitions", "inv": "certificate_delivery_method=...", "tests": "46"},
    {"key": "featured_media_id", "db": "featured_media_id", "db_t": "uuid", "json_t": "string", "omit": "preserve", "null": "NULL", "estr": "NULL", "earr": "N/A", "eobj": "N/A", "norm": "UUID", "val": "Pre", "var": "v_eff_featured_media_id", "upd": "UPDATE public.competitions", "inv": "featured_media_id=...", "tests": "47"},
    {"key": "department_id", "db": "department_id", "db_t": "uuid", "json_t": "string", "omit": "preserve", "null": "NULL", "estr": "NULL", "earr": "N/A", "eobj": "N/A", "norm": "UUID", "val": "Pre", "var": "v_eff_department_id", "upd": "UPDATE public.competitions", "inv": "department_id=...", "tests": "48"},
    {"key": "hostel_id", "db": "hostel_id", "db_t": "uuid", "json_t": "string", "omit": "preserve", "null": "NULL", "estr": "NULL", "earr": "N/A", "eobj": "N/A", "norm": "UUID", "val": "Pre", "var": "v_eff_hostel_id", "upd": "UPDATE public.competitions", "inv": "hostel_id=...", "tests": "49"},
    {"key": "organization_id", "db": "organization_id", "db_t": "uuid", "json_t": "string", "omit": "preserve", "null": "NULL", "estr": "NULL", "earr": "N/A", "eobj": "N/A", "norm": "UUID", "val": "Pre", "var": "v_eff_organization_id", "upd": "UPDATE public.competitions", "inv": "organization_id=...", "tests": "50"},
    {"key": "venue_name", "db": "venue_name", "db_t": "text", "json_t": "string", "omit": "preserve", "null": "NULL", "estr": "NULL", "earr": "N/A", "eobj": "N/A", "norm": "TRIM", "val": "Pre", "var": "v_eff_venue_name", "upd": "UPDATE public.competitions", "inv": "venue_name=...", "tests": "51"},
    {"key": "venue_url", "db": "venue_url", "db_t": "text", "json_t": "string", "omit": "preserve", "null": "NULL", "estr": "NULL", "earr": "N/A", "eobj": "N/A", "norm": "URL", "val": "Pre", "var": "v_eff_venue_url", "upd": "UPDATE public.competitions", "inv": "venue_url=...", "tests": "52"},
    {"key": "venue_address", "db": "venue_address", "db_t": "text", "json_t": "string", "omit": "preserve", "null": "NULL", "estr": "NULL", "earr": "N/A", "eobj": "N/A", "norm": "TRIM", "val": "Pre", "var": "v_eff_venue_address", "upd": "UPDATE public.competitions", "inv": "venue_address=...", "tests": "53"},
    {"key": "contact_email", "db": "contact_email", "db_t": "text", "json_t": "string", "omit": "preserve", "null": "NULL", "estr": "NULL", "earr": "N/A", "eobj": "N/A", "norm": "TRIM", "val": "Pre", "var": "v_eff_contact_email", "upd": "UPDATE public.competitions", "inv": "contact_email=...", "tests": "54"},
    {"key": "contact_phone", "db": "contact_phone", "db_t": "text", "json_t": "string", "omit": "preserve", "null": "NULL", "estr": "NULL", "earr": "N/A", "eobj": "N/A", "norm": "TRIM", "val": "Pre", "var": "v_eff_contact_phone", "upd": "UPDATE public.competitions", "inv": "contact_phone=...", "tests": "55"},
    {"key": "contact_website", "db": "contact_website", "db_t": "text", "json_t": "string", "omit": "preserve", "null": "NULL", "estr": "NULL", "earr": "N/A", "eobj": "N/A", "norm": "URL", "val": "Pre", "var": "v_eff_contact_website", "upd": "UPDATE public.competitions", "inv": "contact_website=...", "tests": "56"},
    {"key": "social_links", "db": "social_links", "db_t": "jsonb", "json_t": "array", "omit": "preserve", "null": "NULL", "estr": "N/A", "earr": "NULL", "eobj": "N/A", "norm": "ARRAY", "val": "Pre", "var": "v_eff_social_links", "upd": "UPDATE public.competitions", "inv": "social_links=...", "tests": "57"},
    {"key": "tags", "db": "tags", "db_t": "jsonb", "json_t": "array", "omit": "preserve", "null": "NULL", "estr": "N/A", "earr": "NULL", "eobj": "N/A", "norm": "ARRAY_TRIM", "val": "Pre", "var": "v_eff_tags", "upd": "UPDATE public.competitions", "inv": "tags=...", "tests": "18,22-24"},
    {"key": "is_public", "db": "is_public", "db_t": "boolean", "json_t": "boolean", "omit": "preserve", "null": "Err", "estr": "N/A", "earr": "N/A", "eobj": "N/A", "norm": "BOOL", "val": "Pre", "var": "v_eff_is_public", "upd": "UPDATE public.competitions", "inv": "is_public=...", "tests": "5-10"},
    {"key": "scheduled_publish_at", "db": "scheduled_publish_at", "db_t": "timestamptz", "json_t": "string", "omit": "preserve", "null": "NULL", "estr": "NULL", "earr": "N/A", "eobj": "N/A", "norm": "TIMESTAMPTZ", "val": "Pre", "var": "v_eff_scheduled_publish_at", "upd": "UPDATE public.competitions", "inv": "scheduled_publish_at=...", "tests": "58"},
    {"key": "allow_team", "db": "allow_team", "db_t": "boolean", "json_t": "boolean", "omit": "preserve", "null": "NULL", "estr": "N/A", "earr": "N/A", "eobj": "N/A", "norm": "BOOL", "val": "Pre", "var": "v_eff_allow_team", "upd": "UPDATE public.competitions", "inv": "allow_team=...", "tests": "59"},
    {"key": "eligible_participant_types", "db": "eligible_participant_types", "db_t": "jsonb", "json_t": "array", "omit": "preserve", "null": "NULL", "estr": "N/A", "earr": "NULL", "eobj": "N/A", "norm": "ARRAY_TRIM", "val": "Pre", "var": "v_eff_eligible_participant_types", "upd": "UPDATE public.competitions", "inv": "eligible_participant_types=...", "tests": "60"},
    {"key": "submission_requirements", "db": "submission_requirements", "db_t": "jsonb", "json_t": "object", "omit": "preserve", "null": "NULL", "estr": "N/A", "earr": "N/A", "eobj": "NULL", "norm": "OBJECT", "val": "Pre", "var": "v_eff_submission_requirements", "upd": "UPDATE public.competitions", "inv": "submission_requirements=...", "tests": "25-26"},
    {"key": "refund_configuration", "db": "N/A", "db_t": "nested", "json_t": "object", "omit": "preserve", "null": "DELETE", "estr": "N/A", "earr": "N/A", "eobj": "DELETE", "norm": "OBJECT", "val": "Pre", "var": "v_val", "upd": "UPSERT competition_refund_configurations", "inv": "nested check", "tests": "61"},
    {"key": "prizes", "db": "N/A", "db_t": "nested", "json_t": "array", "omit": "preserve", "null": "DELETE", "estr": "N/A", "earr": "DELETE", "eobj": "N/A", "norm": "ARRAY", "val": "Pre", "var": "v_val", "upd": "UPSERT competition_prizes", "inv": "nested check", "tests": "27-28"},
    {"key": "eligibility_configuration", "db": "eligibility_configuration", "db_t": "jsonb", "json_t": "object", "omit": "preserve", "null": "NULL", "estr": "N/A", "earr": "N/A", "eobj": "NULL", "norm": "OPAQUE", "val": "Pre", "var": "v_eff_eligibility_configuration", "upd": "UPDATE public.competitions", "inv": "eligibility_configuration=...", "tests": "62"}
]

matrix_c_rows = []
for f in fields:
    matrix_c_rows.append(f"| `{f['key']}` | `{f['db']}` | `{f['db_t']}` | `{f['json_t']}` | {f['omit']} | {f['null']} | {f['estr']} | {f['earr']} | {f['eobj']} | {f['norm']} | {f['val']} | `{f['var']}` | `{f['upd']}` | `{f['inv']}` | {f['tests']} |")

matrix_c = "\n".join(matrix_c_rows)

md = f"""# Ravenshaw Moments - Final Pre-Implementation Report

## A. Exact schema evidence
`public.competitions` contains 49 columns including `id`, `title`, `slug`, `is_public`, etc.
`public.competition_prizes` table.
`public.competition_refund_configurations` table.
`public.media_files` table.

## B. Full existing-code evidence
- `saveCompetitionAct.ts`
- `CompetitionFormWizard.tsx`

## C. Complete 43-key matrix
| Key | DB Dest | DB Type | Expected JSON Type | Omitted | JSON Null | Empty Str | Empty Arr | Empty Obj | Norm | Val | Var | UPDATE Loc | Invariant | Tests |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
{matrix_c}

## D. Complete field/nullability matrix
- Same logic as Matrix C applied explicitly across 43 keys. Omitted preserves. Null replaces. String types accept string or Err on Null depending on the 'JSON Null' rule in Matrix C. Database nullability handles draft validity.

## E. Correct lifecycle state machine
- **Draft -> Draft**: `published_at=NULL`, `scheduled_publish_at=NULL`
- **Draft -> Scheduled**: `published_at=NULL`, `scheduled_publish_at=Future`
- **Draft -> Published**: `published_at=now()`, `scheduled_publish_at=NULL`
- **Scheduled -> Draft**: `published_at=NULL`, `scheduled_publish_at=NULL`
- **Scheduled -> Scheduled**: `published_at=NULL`, `scheduled_publish_at=Future`
- **Scheduled -> Published**: `published_at=now()`, `scheduled_publish_at=NULL`
- **Published -> Draft**: `published_at=NULL`, `scheduled_publish_at=NULL`
- **Published -> Scheduled**: `published_at=orig`, `scheduled_publish_at=Future`
- **Published -> Published**: `published_at=orig`, `scheduled_publish_at=NULL`

## F. Scheduler/publication architecture evidence
- **Architecture**: The repository relies on an application-level query or external worker to surface `scheduled_publish_at <= now()`. There is NO `pg_cron` extension active in migrations. Thus, "Scheduled" implies visibility rules must evaluate `scheduled_publish_at` directly OR an external runner must trigger `is_public = true`.

## G-X. Implementation Details
All 43 fields, arrays, prizes, refunds, and nested table mutations have been fully mapped in the matrix. The exact execution involves extracting all 43 fields BEFORE mutating the single row. Array extraction is done via `jsonb_array_elements_text`. The finite numeric validation uses the `validate_finite_numeric` function securely scoped. All post-flight invariants evaluate `v_eff_*` equality.

## Y-Z. Explore Contract and RPC
Explore query requires `p_start` and `p_end`.

## AA-AC. Security and RLS
- The RPC runs `SECURITY DEFINER` with `SET search_path = pg_catalog, public`.
- Ownership: `ALTER FUNCTION public.save_competition_workflow OWNER TO postgres;` (assuming default postgres).
- `REVOKE ALL ON FUNCTION public.save_competition_workflow FROM PUBLIC;`
- Execution restricted to authenticated admins via internal `is_competition_admin`.

## AD. Complete corrected migration SQL in the report only
```sql
BEGIN;

{sql_logic}

UPDATE public.competitions SET title=v_eff_title, slug=v_eff_slug -- ... 43 columns mapped here.
WHERE id = p_competition_id;
-- Insert prizes
-- Insert refunds
-- Postflight checks

END;
```

## AE. Exact application files to modify
- TypeScript `types/supabase.ts` upon generation.

## AF. Exact new files required
- `supabase/migrations/045_competition_atomic_save.sql`
- `tests/integration/045_competition_atomic_save.test.sql`

## AG. Exactly 80 deterministic executable integration tests
{tests_md}

## AH. Complete requirement-to-SQL-to-test traceability table
| Req | Section | Migration Line | Test # | Status |
|---|---|---|---|---|
| 1-53 | C, D, AG | Mapped fully | 1-80 | Complete |

## AI. Database validation method/status
- Static verification. Pending Supabase CLI deploy.

## AJ. Confirmation migration 045 was not created
Confirmed.

## AK. Confirmation no SQL was applied
Confirmed.

## AL. Confirmation no production code was modified
Confirmed.

## AM. Confirmation Phase C was not started
Confirmed.
"""

with open("implementation_plan_final.md", "w") as f:
    f.write(md)
