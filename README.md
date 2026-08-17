# VoltDrive Admin Portal — Stage 14

Dark desktop administration prototype for the VoltDrive EV Charging Platform.

## Implemented modules

- Admin Dashboard
- Companies
- Users & Access
- Countries & Currencies
- Taxes
- Tariffs & Pricing
- Payments
- Partners & Settlements
- Roaming
- ERP & Integrations
- Firmware
- Security & Certificates
- AI & Automation
- Reports & Audit

## Stage 14 — Reports & Audit

The governance module adds advanced administrative reporting and a read-only audit trail:

- reusable report catalog with category, scope, owner, schedule, format and data domains;
- reporting coverage for charger reliability, sessions, energy, revenue/profitability, electricity cost, parking/reservations, maintenance, fleet/renewable energy, security and integrations;
- manual prototype report generation and retained report-run history;
- report-definition create/edit flows and CSV metadata snapshots;
- administrative audit trail with module, actor, source, severity and time-window filters;
- governed audit CSV export with mandatory reason when configured;
- audit distribution by module;
- retention, immutable-audit, PII, scheduled-delivery and export policies;
- new report/audit actions are themselves recorded in the administrative audit history.

The prototype models report configuration and governance locally. It does not query a real analytics warehouse, billing backend, charger telemetry service or compliance archive.

## Prototype storage

All administrative state is stored locally under `voltdrive_admin_v1`.

## Validation

Run:

```bash
npm run check
```

## Stage 16 — Energy & Load Optimization
Adds administrative energy policy configuration: site capacity and safety headroom, load-balancing strategy, vehicle priority signals, solar/site-battery optimization, demand response, peak protection, site overrides and a prototype-only allocation simulator. Operational charger control remains outside the Admin Portal.
