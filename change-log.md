## Changelog

### Version 1.0.0

**updated at 3/19/2024**

#

**Prisma:**

- **Added:** MySQL Prisma schema
- **Added:** Prisma Seed for users and countries

**Authentication:**

- **Implemented:** Authentication module with:
  - Login functionality
  - Two-factor authentication (TFA) validation via email
  - Logout functionality
- **Enhanced:** Authentication features with:
  - Handling of different authentication types (JWT, secure cookies, none)
  - Client IP address interception
  - Google reCAPTCHA validation

**Internationalization (i18n):**

- **Integrated:** Language handling with i18n library
- **Added:** Client-side language interceptor to retrieve language preference from requests

**Authorization:**

- **Implemented:** Role-based authorization system
