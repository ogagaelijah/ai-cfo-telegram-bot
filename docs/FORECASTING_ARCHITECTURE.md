# Forecasting Architecture

## Status

🔒 ARCHITECTURE FROZEN

The forecasting layer has passed integration testing and is considered stable.

Current test status:

- Test files: 6 passed
- Tests: 64 passed
- Failures: 0

---

# 1. Purpose

The forecasting layer provides the AI CFO with forward-looking financial and operational intelligence.

It is responsible for calculating forecasts.

It is NOT responsible for formatting reports, generating PDFs, generating Excel files, or presenting information to users.

Those responsibilities belong to higher layers.

---

# 2. Forecasting Architecture

```text
Business Data
     │
     ├── Sales
     ├── Expenses
     ├── Inventory
     └── Demand History
            │
            ▼
    Forecasting Services
            │
    ┌───────┼────────┬───────────────┐
    │       │        │               │
    ▼       ▼        ▼               ▼
 Revenue   Cash   Inventory   Inventory Demand
 Forecast Forecast  Forecast      Forecast
    │       │        │               │
    └───────┼────────┴───────────────┘
            │
            ▼
      Profit Forecast
            │
            ▼
       Forecast Engine
            │
            ▼
     Unified Forecast
            │
            ▼
       Report Engine


3. Core Principles
4. Forecast Service Responsibilities
5. Forecast Engine Responsibilities
6. Data Flow
7. Dependency Rules
8. Testing Rules
9. Frozen Components
10. Change Policy
11. Report Engine Boundary

(EXAMPLE)
Each forecast service has one responsibility.

Forecast services calculate intelligence.

The Forecast Engine orchestrates intelligence.

The Report Engine presents intelligence.

No forecasting service generates reports.


DEPENDECY DIRECTION

Repositories / Data
        ↓
Trend Engines
        ↓
Forecast Services
        ↓
Forecast Engine
        ↓
Report Engine
        ↓
Telegram / API / Dashboard


# 3. Architecture Freeze Rules

The forecasting architecture is now frozen.

The following rules apply to all future development.

## Rule 1 — Forecast services remain independent

Each forecast service is responsible only for its own domain.

- revenueForecastService.js → Revenue
- cashForecastService.js → Cash
- inventoryForecastService.js → Inventory
- inventoryDemandForecastService.js → Inventory Demand
- profitForecastService.js → Profit
- riskForecastService.js → Risk

No forecast service should become responsible for another forecast domain.

---

## Rule 2 — forecastEngine.js is the orchestration layer

forecastEngine.js is the central coordinator.

It is responsible for:

- calling the individual forecast services
- passing required forecast results between services
- combining the results
- returning the unified forecast object

It must NOT contain the internal calculation logic of the individual forecast engines.

---

## Rule 3 — No child service may call forecastEngine.js

The dependency direction is:

Business Data
    ↓
Forecast Services
    ↓
forecastEngine.js
    ↓
Unified Forecast
    ↓
Report Engine

The direction must never be reversed.

A child forecast service must never import or call forecastEngine.js.

---

## Rule 4 — Forecast calculations happen once

A forecast must be calculated once and reused.

For example:

Revenue
    ↓
forecastEngine
    ↓
Profit

Profit must receive the existing revenue forecast rather than calculating revenue again.

The same principle applies to other cross-engine relationships.

---

## Rule 5 — Preserve individual forecast objects

The unified forecast must preserve the individual forecast results.

Example:

{
    revenue,
    cash,
    inventory,
    inventoryDemand,
    profit,
    risks
}

The integration layer must not unnecessarily rewrite or destroy information produced by the individual engines.

---

## Rule 6 — Report Engine must not calculate forecasts

The Report Engine consumes forecast results.

It does not replace the forecasting layer.

The Report Engine is responsible for:

- formatting
- interpretation
- summaries
- report sections
- presentation
- daily reports
- weekly reports
- monthly reports

Forecast calculations remain inside the forecasting layer.

---

## Rule 7 — No unnecessary changes to frozen engines

Once the forecasting architecture is frozen, existing forecast engines should not be modified merely to support reporting requirements.

If the Report Engine needs information that does not currently exist, the problem must first be evaluated architecturally.

Do not casually modify a stable forecasting engine.

---

## Rule 8 — Changes require tests

Any future modification to the forecasting layer must:

1. Add or update the relevant test.
2. Run the complete forecasting test suite.
3. Confirm zero failures.
4. Review the architecture impact.
5. Only then merge the change.

---

## Rule 9 — Integration tests are part of the architecture contract

The integration tests verify that:

- revenue, profit and inventory forecasts work together
- revenue is passed into profit correctly
- individual forecast objects are preserved
- zero revenue is handled safely
- zero inventory is handled safely
- conflicting signals are preserved
- forecast periods remain consistent

These tests are now part of the forecasting architecture contract.

---

## Rule 10 — Report Engine is the next architectural layer

The next layer above forecasting is the Report Engine.

The Report Engine will consume:

    Unified Forecast
          ↓
     Report Engine
          ↓
    Daily / Weekly / Monthly Reports
          ↓
    Telegram / Dashboard / PDF / Excel

The Report Engine must not bypass the unified forecast architecture.

---

# 4. Current Forecasting Test Contract

Current status:

- Test files: 6 passed
- Tests: 64 passed
- Failures: 0
- Forecast integration: PASS
- Forecast orchestration: PASS
- Revenue forecast: PASS
- Profit forecast: PASS
- Inventory demand forecast: PASS
- Revenue edge cases: PASS

The forecasting layer is considered stable.

🔒 FROZEN