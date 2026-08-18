# VoltDrive Admin Portal — Final Prototype Polish

Dark desktop administration prototype for the VoltDrive EV Charging Platform, built as the configuration/governance layer for the already separated Driver, Fleet Manager, Technician and Operator experiences.

## Implemented modules

- Admin Dashboard
- Companies
- Users & Access
- Countries & Currencies
- Tariffs & Pricing
- Taxes
- Payments — provider configuration, transactions/risk, subscriptions & charging packages
- Accounting — journal, ledger mappings, financial reconciliation and asset profitability
- Partners & Settlements
- Roaming
- ERP & Integrations
- Firmware
- Security & Certificates
- AI & Automation
- Energy & Load Optimization
- Reports & Audit
- Platform Settings

## Final technical polish

The final prototype pass adds cross-module safeguards without changing the established visual system:

- role-aware Admin Portal access and module permissions;
- company-scope filtering for company-bound administrative data;
- read-only enforcement for roles that may view but may not manage a module;
- centralized platform-time helpers for new actions and audit records;
- centralized administrative audit creation with current actor, module, severity and company scope;
- consistent distinction between aggregate platform users and the smaller prototype User Directory sample;
- scoped Dashboard, Countries/Taxes and Audit/Reporting views;
- regression checks for the original VoltDrive/Admin Portal brand, fully linked sidebar, removed planned placeholders, centered status pills and compact ERP checkboxes;
- runtime smoke tests for Platform Admin, Company Admin, scoped Auditor and Operator access boundaries;
- company-aware Accounting with Charging ↔ PSP ↔ Bank reconciliation and ERP-ready journal references;
- payment transaction/risk review plus subscriptions and prepaid charging packages;
- AI coverage for schedule optimization, support assistance and allowlisted safe recovery;
- report coverage for customer activity, busy/inactive periods, carbon and renewable energy.

The permission/scope layer is intentionally a client-side prototype. Production authorization must still be enforced by backend APIs and server-side policy checks.

## Prototype storage

All administrative state is stored locally under:

```text
voltdrive_admin_v1
```

Existing Stage 16 localStorage is migrated/extended by `admin-state.js`; manual storage clearing is not required for the new state fields.

## Validation

Syntax, local references, navigation and UI regression invariants:

```bash
npm run check
```

Runtime state/access smoke test:

```bash
npm run smoke
```

Run the complete regression suite:

```bash
npm run verify
```

Real-browser access regression (Chromium, when available):

```bash
npm run smoke:browser
```

The browser suite opens all 17 Admin Portal pages as Platform Admin, exercises create/edit drawers, validates Company Admin delegation and company scope, performs a permitted Finance refund, checks Auditor read-only behavior and verifies that an Operator cannot bypass `admin.portal.view` with a direct URL. If the local Chromium installation is managed by an enterprise policy that blocks localhost, the normal browser smoke reports a skip instead of failing the rest of the portable prototype checks. To require the browser layer in CI or a local development machine, use:

```bash
npm run smoke:browser:strict
```

## Prototype boundaries

The portal models configuration, workflows, approvals, policies and audit behavior locally. It does not connect to real chargers, OCPP/OCPI infrastructure, banks, ERP systems, certificate stores, analytics warehouses or production AI services. Secrets/private keys are intentionally not stored in the browser prototype.
