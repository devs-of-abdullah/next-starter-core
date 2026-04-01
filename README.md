# Enterprise SaaS Starter Template(Next.js 15)

The ultimate production-ready starter for building SaaS applications with 7-layer security, Clean Architecture, and full i18n support.

---

## 7-Layer Security Model
1. **Transport Layer**: Enforces HTTPS and HSTS(Production).
2. **Persistence Layer**: HttpOnly, Secure, SameSite=Strict cookies for refresh tokens.
3. **Identity Layer**: JWT-based access tokens with high entropy.
4. **Behavior Layer**: Session rotation and fingerprinting (IP + User Agent) to prevent hijacking.
5. **Logic Layer**: Ownership-based policies (Users can only access their own data).
6. **Network Layer**: Built-in rate limiting powered by Upstash Redis or local memory.
7. **Infrastructure Layer**: Comprehensive Audit Logging of all security events.

---

## Internationalization (i18n)
Full RTL (Right-to-Left) support is built-in.
- **English (en)**: Left-to-Right
- **Turkish (tr)**: Left-to-Right
- **Arabic (ar)**: Right-to-Left (Custom Arabic Fonts - Noto Kufi)

Toggle languages using the floating `LanguageSwitcher` component.

---