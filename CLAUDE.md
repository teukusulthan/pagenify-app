# CLAUDE.md — Pagenify

## 1. Purpose
This file gives implementation rules for Claude Code working on **Pagenify**.

Use this file as the **execution guide**.
Use `CLAUDE_PAGENIFY_FULL_APP_REQUIREMENTS.md` as the **full product and technical source of truth**.

If this file and the requirements file appear to conflict, follow this priority order:

1. Latest direct user instruction
2. `CLAUDE_PAGENIFY_FULL_APP_REQUIREMENTS.md`
3. This `CLAUDE.md`
4. Existing codebase conventions, if they do not conflict with the above

---

## 2. Project Summary
Pagenify is an AI-powered web application that helps authenticated users create structured sales pages for products, services, or digital offers.

Core workflow:

1. User registers or logs in
2. User opens dashboard
3. User creates a page from a dedicated create page route
4. User fills structured fields and may optionally upload a product image
5. User generates a preview through **z.ai GLM**
6. The system validates the AI response, composes sanitized HTML using a fixed internal template, and shows preview
7. User saves the page
8. User can later edit, archive, or recover the page
9. Public ACTIVE pages are accessible through `/u/[username]/[slug]`

---

## 3. Mandatory Product Decisions
These decisions are final unless the user explicitly changes them.

1. **Create page uses a dedicated page route**, not a modal.
2. **Edit page uses a dedicated page route**, not a modal.
3. Use **page-based UX** for large content-heavy interactions.
4. Delete is **soft delete only**.
5. Soft-deleted pages must be recoverable.
6. Public archived pages must not be accessible.
7. Use **Next.js App Router**.
8. Use **TypeScript**.
9. Use **PostgreSQL**.
10. Use **Prisma ORM** for all database access.
11. Use **Zod** for validation on client and server.
12. Use **React Hook Form** for forms.
13. Use **Tailwind CSS** and **shadcn/ui**.
14. Use **Zustand** only for lightweight shared UI state.
15. Use **Sonner** for toast notifications.
16. Use **JWT in HttpOnly cookies** for auth.
17. Use **z.ai GLM** as the LLM provider/model family.
18. The LLM must return **structured content**, not uncontrolled full page markup.
19. The app must compose final HTML using a fixed internal template.
20. Generated HTML must be sanitized before save and before render if needed.
21. Slug is generated once on create and should remain stable after edit.
22. Optional product image upload is part of MVP.
23. Do not add extra features outside MVP.

---

## 4. Stack
Required stack:

- **Framework:** Next.js App Router
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma ORM
- **Validation:** Zod
- **Forms:** React Hook Form + `@hookform/resolvers/zod`
- **UI:** shadcn/ui
- **Styling:** Tailwind CSS
- **Toast:** Sonner
- **State:** Zustand
- **Auth:** JWT + HttpOnly cookies
- **Password Hashing:** bcryptjs
- **JWT Utility:** jose
- **Image Upload:** Cloudinary
- **Sanitization:** sanitize-html
- **Slug Utility:** slugify
- **Icons:** lucide-react
- **LLM:** z.ai GLM

Code quality tools:

- ESLint
- Prettier
- TypeScript strict mode
- Prisma Migrate
- Vitest
- Playwright

---

## 5. Primary Files to Respect
Claude Code must treat these files as important architectural boundaries:

- `CLAUDE.md`
- `CLAUDE_PAGENIFY_FULL_APP_REQUIREMENTS.md`
- `prisma/schema.prisma`
- `src/lib/validations/*`
- `src/lib/services/*`
- `src/app/api/*`

Do not scatter business logic randomly across route handlers or page components.

---

## 6. Architecture Rules

### 6.1 Separation of Concerns
Follow this split:

- **Pages / components:** UI only
- **Route handlers:** thin transport layer only
- **Services:** business logic
- **Validation schemas:** reusable Zod schemas
- **Prisma layer:** database access through Prisma only
- **Utilities:** stateless helper functions

### 6.2 Route Handlers
Route handlers must:

- parse request
- validate input
- call service functions
- return consistent response envelope

Route handlers must **not** contain large business logic blocks.

### 6.3 Service Layer
Services should own:

- auth logic
- page creation/update/archive/recover logic
- LLM prompt building and response validation
- HTML composition and sanitization
- image upload orchestration

### 6.4 Validation
All input must be validated twice where appropriate:

- client-side for UX
- server-side for trust

Never trust client input without server validation.

---

## 7. Data and Domain Rules

### 7.1 Page Status
Pages must use explicit status values.

Allowed values:

- `ACTIVE`
- `ARCHIVED`

Behavior:

- newly saved pages are `ACTIVE`
- archive changes `ACTIVE -> ARCHIVED`
- recover changes `ARCHIVED -> ACTIVE`
- public route only renders `ACTIVE`

### 7.2 Ownership
Every protected page operation must verify ownership.

Applies to:

- get page for edit
- update page
- archive page
- recover page
- regenerate page
- upload linked assets if ownership is relevant

### 7.3 Slugs
- Generate slug on create only
- Use title + short unique suffix
- Do not auto-change slug on edit

---

## 8. AI Generation Rules

### 8.1 LLM Provider
Use **z.ai GLM**.
The exact model string must come from environment variables.

### 8.2 Prompting Rule
The LLM must receive structured business input and return structured copy.

The LLM must **not** be allowed to decide the entire page architecture.

### 8.3 Required AI Output Shape
The AI output must be validated with Zod and contain at minimum:

- headline
- subheadline
- benefits
- features breakdown
- pricing text
- CTA text
- social proof placeholder copy

### 8.4 Final HTML
The application, not the LLM, must compose final HTML from a fixed internal template.

Minimum template sections:

1. Hero section
2. Product/service summary
3. Benefits section
4. Features breakdown
5. Pricing section
6. Social proof placeholder
7. Final CTA section

### 8.5 Sanitization
Always sanitize final HTML before saving.
Sanitize again before rendering if needed.
Block scripts and unsafe attributes.

---

## 9. UX Rules

### 9.1 Page-Based UX
Use dedicated routes for:

- create page
- edit page
- archived pages list

Do not re-introduce modal-based create/edit flows.

### 9.2 Feedback Rules
Every meaningful action must provide feedback.

Use:

- inline field errors for validation problems
- loading state for async actions
- success toast for successful actions
- error toast for failed actions

### 9.3 Toast Policy
Use Sonner for:

- registration success/failure
- login success/failure
- image upload success/failure
- preview generation success/failure
- save success/failure
- update success/failure
- archive success/failure
- recover success/failure

---

## 10. API Rules

### 10.1 Response Envelope
All APIs must use one consistent response format.

Success:

```json
{
  "success": true,
  "message": "Human-readable message",
  "data": {},
  "error": null
}
```

Error:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "details": null
  }
}
```

### 10.2 Error Codes
Prefer these error codes:

- `VALIDATION_ERROR`
- `UNAUTHORIZED`
- `FORBIDDEN`
- `NOT_FOUND`
- `CONFLICT`
- `UPLOAD_FAILED`
- `GENERATION_FAILED`
- `DATABASE_ERROR`
- `UNKNOWN_ERROR`

### 10.3 API Style
- keep route handlers thin
- map exceptions to clean API responses
- never expose raw Prisma or provider errors directly to UI

---

## 11. Prisma Rules

1. All DB access must go through Prisma.
2. No raw SQL unless absolutely necessary.
3. Use Prisma schema as canonical data model.
4. Use migrations for schema changes.
5. Keep relations explicit.
6. Keep field naming consistent with the requirements file.

Expected main models:

- `User`
- `Page`

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

---

## 12. Suggested Directory Structure
Claude Code should prefer this structure unless the repo already has an equivalent better structure:

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

---

## 13. Execution Strategy
When implementing from scratch, prefer this order:

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

Do not jump into UI polish before the flows work end-to-end.

---

## 14. Testing Expectations
Claude Code should write or prepare tests for:

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

Minimum tooling direction:

- Vitest for unit/service testing
- Playwright for end-to-end critical flows

---

## 15. Environment Variable Expectations
Expect at minimum these env variables:

- `DATABASE_URL`
- `JWT_SECRET`
- `ZAI_API_KEY`
- `ZAI_GLM_MODEL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_APP_URL`

Do not hardcode secrets.
Validate env values at startup if env validation utilities exist.

---

## 16. Definition of Done
A feature is done only if:

1. it matches the requirements file
2. it respects architecture boundaries
3. it includes validation
4. it includes correct ownership checks where needed
5. it returns consistent API responses
6. it provides proper loading / success / error feedback
7. it does not break existing flows
8. it is type-safe
9. it does not introduce unnecessary features

---

## 17. Anti-Patterns to Avoid
Claude Code must avoid these:

- putting heavy logic directly in components
- putting heavy logic directly in route handlers
- skipping Zod on server validation
- storing auth token in localStorage
- letting LLM output raw uncontrolled full page HTML architecture
- saving unsanitized AI HTML
- using hard delete instead of soft delete
- reintroducing modal-based create/edit pages
- changing slug on edit
- bypassing Prisma ORM
- inconsistent API responses
- adding extra non-MVP features without instruction

---

## 18. Final Instruction
Build the simplest clean version that fully satisfies the requirements.

Do not optimize for cleverness.
Optimize for:

- correctness
- clarity
- maintainability
- predictable behavior
- MVP completeness

When unsure, choose the solution that is:

- easier to reason about
- easier to validate
- safer for AI-generated output
- more aligned with the requirements document
