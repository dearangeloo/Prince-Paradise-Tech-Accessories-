# Security Specification: Prince Paradise Tech Accessories

## 1. Data Invariants
- Products can only be created, modified, or soft-archived by verified administrative users.
- Public storefront users can only view products with `status == 'published'`. Draft and archived products are shielded from unauthenticated access.
- Categories can only be configured by administrators. Public storefront queries can only view active categories.
- Order requests submitted by customers through the storefront must strictly start in `status: 'pending'`, with no initial staff notes or confirmed timestamps.
- Customer PII (name, phone, delivery area) contained within order requests is accessible strictly to authenticated administrators.
- Monetary values are stored as non-negative integer kobo to eliminate floating point rounding attacks.
- Store settings can only be altered by authenticated administrators.

## 2. Dirty Dozen Payload Threat Tests
1. Ghost field privilege injection (attempting to write `isAdmin: true` into a profile).
2. Unverified email admin bypass (spoofing admin email with `email_verified: false`).
3. Price tampering on public order creation (attempting to set unit prices to 0 or negative).
4. Direct status escalation (customer setting order status to `confirmed` or `completed`).
5. Staff notes leak (unauthenticated user listing order requests to extract customer phone numbers).
6. Resource poisoning via oversized payloads (ID > 128 characters or string fields > limits).
7. Stock negative decrement injection.
8. Unauthorized category deactivation or mass-deletion.
9. Cross-tenant order modification.
10. System-only field alteration (`createdAt` backdating).
11. Unauthenticated image deletion.
12. Audit log tampering or truncation.

All attack vectors are blocked by Firestore rules, server-side validation, and ABAC role gating.
