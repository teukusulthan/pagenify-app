# CLAUDE.md — Pagenify
## 1) Role
Execution guide for Claude Code on **Pagenify**.
Full source of truth: `CLAUDE_PAGENIFY_FULL_APP_REQUIREMENTS.md`.
Priority: 1) latest user instruction, 2) requirements file, 3) this file, 4) existing codebase conventions that do not conflict.
## 2) Product summary
Pagenify is an AI-powered web app for authenticated users to create structured sales pages for products, services, or digital offers.
Core flow: register/login → dashboard → create page route → fill structured fields + optional image → generate preview through **z.ai GLM** → validate AI output → compose sanitized HTML from fixed template → save page → edit/archive/recover page → public **ACTIVE** pages available at `/u/[username]/[slug]`.
## 3) Non-negotiable product decisions
- Create page uses a **dedicated page route**, not a modal.
- Edit page uses a **dedicated page route**, not a modal.
- Use page-based UX for large content-heavy flows.
- Delete is **soft delete only**.
- Soft-deleted pages must be recoverable.
- Archived pages must not be publicly accessible.
- Slug is created once and stays stable after edit.
- Product image upload is optional but included in MVP.
- Do not add features outside MVP.
## 4) Required stack
- Next.js App Router
- TypeScript
- PostgreSQL
- Prisma ORM
- Zod
- React Hook Form + `@hookform/resolvers/zod`
- shadcn/ui
- Tailwind CSS
- Sonner
- Zustand for lightweight shared UI state only
- JWT in HttpOnly cookies
- bcryptjs
- jose
- Cloudinary
- sanitize-html
- slugify
- lucide-react
- z.ai GLM
- ESLint, Prettier, TypeScript strict mode, Prisma Migrate, Vitest, Playwright
## 5) Important files and boundaries
Architectural anchors:
- `CLAUDE.md`
- `CLAUDE_PAGENIFY_FULL_APP_REQUIREMENTS.md`
- `prisma/schema.prisma`
- `src/lib/validations/*`
- `src/lib/services/*`
- `src/app/api/*`
Do not scatter business logic across pages or route handlers.
## 6) Architecture rules
### Separation of concerns
- Pages/components: UI only
- Route handlers: request parsing, validation, service calls, response mapping
- Services: business logic
- Validation schemas: reusable Zod schemas
- Prisma layer: all database access through Prisma only
- Utilities: stateless helpers
### Route handlers must
- parse request
- validate input
- call service functions
- return the standard response envelope
They must not contain large business logic blocks.
### Services should own
- auth logic
- page create/update/archive/recover logic
- LLM prompt building and response validation
- HTML composition and sanitization
- image upload orchestration
### Validation rules
- Validate on client for UX
- Validate on server for trust
- Never trust client input without server validation
- Never trust AI output without validation
## 7) Data and domain rules
### Page status
Allowed values: `ACTIVE`, `ARCHIVED`
Behavior:
- new pages are `ACTIVE`
- archive changes `ACTIVE -> ARCHIVED`
- recover changes `ARCHIVED -> ACTIVE`
- public route renders only `ACTIVE`
### Ownership
Every protected page operation must verify ownership: get page for edit, update page, archive page, recover page, regenerate page, delete-like actions.
### Slugs
- Generate on create only
- Use title + short unique suffix
- Never auto-change on edit
## 8) AI generation rules
### LLM provider
Use **z.ai GLM**. Model string must come from environment variables.
### Prompting rule
The LLM receives structured business input and returns **structured copy**. It must not decide the page architecture.
### Required AI output shape
Validate AI output with Zod. Minimum fields:
- headline
- subheadline
- benefits
- featuresBreakdown
- pricingText
- ctaText
- socialProofTitle
- socialProofBody
### Final HTML composition
The application, not the LLM, composes final HTML from a fixed internal template with these sections:
1. Hero
2. Product/service summary
3. Benefits
4. Features breakdown
5. Pricing
6. Social proof placeholder
7. Final CTA
### Sanitization
- Sanitize final HTML before save
- Sanitize again before render if needed
- Block scripts and unsafe attributes
## 9) UX rules
### Page-based UX
Use dedicated routes for create page, edit page, and archived pages list.
Do not reintroduce modal-based create/edit flows.
### Feedback rules
Every meaningful action must provide feedback:
- inline field errors for validation problems
- loading state for async actions
- success toast for successful actions
- error toast for failed actions
### Toast policy
Use Sonner for registration, login, image upload, preview generation, save, update, archive, and recover success/failure states.
## 10) API rules
### Response envelope
All APIs must return this shape.

Success:
```json
{"success":true,"message":"Human-readable message","data":{},"error":null}
```
Error:
```json
{"success":false,"message":"Human-readable error message","data":null,"error":{"code":"ERROR_CODE","details":null}}
```
### Preferred error codes
- `VALIDATION_ERROR`
- `UNAUTHORIZED`
- `FORBIDDEN`
- `NOT_FOUND`
- `CONFLICT`
- `UPLOAD_FAILED`
- `GENERATION_FAILED`
- `DATABASE_ERROR`
- `UNKNOWN_ERROR`
### API style
- keep route handlers thin
- map exceptions to clean API responses
- never expose raw Prisma or provider errors directly to UI
## 11) Prisma rules
- All DB access must go through Prisma.
- No raw SQL unless absolutely necessary.
- Use Prisma schema as canonical data model.
- Use migrations for schema changes.
- Keep relations explicit.
- Keep field naming aligned with the requirements file.

Expected core models: `User`, `Page`
Expected important `Page` fields:
- `id`
- `userId`
- `status`
- `slug`
- `title`
- `description`
- `targetAudience`
- `priceDisplay`
- `keyFeatures`
- `uniqueSellingPoints`
- `productImageUrl`
- `generatedHtml`
- `createdAt`
- `updatedAt`
## 12) Preferred project structure
```text
src/
  app/
    page.tsx
    login/page.tsx
    register/page.tsx
    dashboard/page.tsx
    dashboard/pages/new/page.tsx
    dashboard/pages/[id]/edit/page.tsx
    dashboard/archived/page.tsx
    u/[username]/[slug]/page.tsx
    api/
      auth/
      uploads/
      pages/
  components/
    ui/
    auth/
    dashboard/
    page-builder/
    sales-page/
    shared/
  lib/
    prisma.ts
    auth/
    validations/
    services/
    utils/
    constants/
  store/
  types/
prisma/
  schema.prisma
  migrations/
```
## 13) Recommended implementation order
1. foundation setup
2. Prisma schema and migrations
3. auth flow
4. protected dashboard shell
5. active and archived pages list
6. create page route
7. edit page route
8. image upload flow
9. GLM generation flow
10. preview rendering
11. save/update/archive/recover APIs
12. public page route
13. error handling and toasts
14. test pass
Do not optimize UI polish before flows work end-to-end.
## 14) Testing expectations
Write or prepare tests for:
- auth flow
- active page creation
- optional image upload flow
- preview generation flow
- save page flow
- update page flow
- archive page flow
- recover page flow
- ownership enforcement
- public page behavior for ACTIVE vs ARCHIVED
Tooling: Vitest for unit/service tests, Playwright for end-to-end critical flows.
## 15) Expected environment variables
- `DATABASE_URL`
- `JWT_SECRET`
- `ZAI_API_KEY`
- `ZAI_GLM_MODEL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_APP_URL`
Do not hardcode secrets. Validate env values at startup if env validation utilities exist.
## 16) Definition of done
A feature is done only if it:
1. matches the requirements file
2. respects architecture boundaries
3. includes validation
4. includes correct ownership checks where needed
5. returns consistent API responses
6. provides proper loading, success, and error feedback
7. does not break existing flows
8. is type-safe
9. does not introduce unnecessary features
## 17) Anti-patterns to avoid
Never:
- put heavy logic directly in components
- put heavy logic directly in route handlers
- skip Zod on server validation
- store auth token in localStorage
- let LLM output uncontrolled full page HTML architecture
- save unsanitized AI HTML
- use hard delete instead of soft delete
- reintroduce modal-based create/edit pages
- change slug on edit
- bypass Prisma ORM
- return inconsistent API responses
- add non-MVP features without instruction
## 18) Git commit rules
Every commit must follow these rules:
- **One logical change per commit.** Do not batch unrelated changes.
- **Always push after committing.** If push fails, stop and report the blocker.
- **Commit message format:** `<type>: <short description>`
  - Types: `feat`, `fix`, `chore`, `refactor`, `docs`, `style`, `test`
  - Example: `feat: add login page`, `fix: handle 429 rate limit`, `chore: update deps`
- **After each small unit of work:**
  1. `git add -A`
  2. `git commit -m "<type>: <message>"`
  3. `git push`
- **Never commit `.env` files** (they are gitignored).
- **Never use `--no-verify`** or skip hooks.
- **Prefer creating new commits over amending**, unless explicitly asked.
- If the user says "commit" or finishes a feature, commit immediately without waiting.

## 19) Final execution rule
Build the simplest clean version that fully satisfies the requirements.
Optimize for correctness, clarity, maintainability, predictable behavior, and MVP completeness.
When unsure, choose the solution that is easier to reason about, easier to validate, safer for AI-generated output, and more aligned with the requirements document.