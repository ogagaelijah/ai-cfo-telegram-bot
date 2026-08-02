# AI CFO

## Overview

AI CFO is an AI-powered financial management platform designed for small and medium-sized businesses.

The platform is being built with a modular architecture so that the same backend can power:

- Telegram Bot
- WhatsApp Bot
- Web Dashboard
- Mobile App
- REST API

---

## Architecture

Presentation Layer

- Telegram (Telegraf)

Conversation Layer

- Flows

Business Layer

- Services

Data Layer

- Repositories

Persistence Layer

- SQLite Database

---

## Folder Structure

```
config/
constants/
database/
flows/
handlers/
keyboards/
repositories/
reports/
scheduler/
services/
states/
utils/
validators/
docs/
tests/
```

---

## Principles

- Separation of Concerns
- Repository Pattern
- Service Layer Pattern
- Modular Design
- Scalability
- Maintainability
- Testability

---

## Current Modules

- Sales
- Expenses
- Income
- Customers
- Reports

---

## Planned Modules

- Inventory
- Debtors
- AI Financial Advisor
- Charts & Analytics
- Scheduler
- Notifications
- REST API
- Web Dashboard
- Mobile App