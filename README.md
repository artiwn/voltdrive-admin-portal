# VoltDrive Admin Portal — Stage 15

Desktop administration prototype for the VoltDrive EV Charging Platform.

## Completed modules

- Admin Dashboard
- Companies
- Users & Access
- Countries & Currencies
- Tariffs & Pricing
- Taxes
- Payments
- Partners & Settlements
- Roaming
- ERP & Integrations
- Firmware
- Security & Certificates
- AI & Automation
- Reports & Audit
- Platform Settings

## Stage 15 — Platform Settings

Platform Settings provides global inherited defaults without duplicating controls that belong to dedicated modules.

Included configuration groups:

- General & Localization
- Charging & Reservation defaults
- Communications
- Numbering & Identifiers
- Data Retention
- Feature Availability
- Support, Legal & Maintenance
- Configuration Readiness
- Explicit inheritance order
- Configuration boundaries
- Administrative audit for settings changes
- CSV export

Global settings are persisted in the existing `voltdrive_admin_v1` localStorage state.

Administrative audit retention is synchronized between Platform Settings, Security & Certificates, and Reports & Audit.

## AI & Automation navigation fix

The AI & Automation module already existed from Stage 13. Stage 15 fixes older sidebars that still displayed AI & Automation as a planned module. It is now a real navigation link across every implemented Admin Portal page.

## UI rules preserved

- Dark VoltDrive desktop design system.
- Original `VoltDrive / Admin Portal` sidebar brand retained.
- Compact checkboxes remain 16×16 px inside settings forms.
- Compact icons, pills and badges use explicit flex centering.
- No global style rewrite was introduced for existing modules.

## Prototype note

This remains a front-end prototype. Values are stored in `localStorage`; no production backend, real credentials, private keys, payment secrets or external ERP/network connections are included.

## Check

```bash
npm run check
```
