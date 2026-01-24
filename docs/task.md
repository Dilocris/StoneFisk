# Roadmap: Home Renovation Dashboard ("Master Control")

## ✅ Phase 1: Foundation (Completed)
- [x] specific PRD Analysis & Setup <!-- id: 0 -->
- [x] Basic Next.js + Tailwind Architecture <!-- id: 1 -->
- [x] Global State Management (`ProjectContext`) <!-- id: 5 -->
- [x] Dashboard Layout & Core Widgets (Budget Donut, Simple Timeline) <!-- id: 3 -->
- [x] Expense Tracking (Modal & Logic) <!-- id: 4 -->

## 💾 Phase 1.5: Persistence Migration (High Priority)
- [x] **Create API Endpoints** (`GET/POST /api/project`) <!-- id: 5b -->
- [x] **Migrate Context to Fetch** (Replace localStorage) <!-- id: 5c -->
- [x] **Implement File Uploads** <!-- id: 5d -->
- [x] **PDF Report Export** <!-- id: 5e -->

## 📅 Phase 2: Schedule & Tasks (Current Priority)
- [x] **Implement "Add Task" Modal** <!-- id: 7 -->
- [ ] **Create Tasks Page** <!-- id: 8 -->
    - Full list view of all tasks.
    - Filtering by Status (Pending/Done).
- [ ] **3-Month Timeline Widget** <!-- id: 9 -->
    - Upgrade the simple list to a visual "Carrousel" (Gantt-style).
    - Visual bars showing start/end dates.

## 💰 Phase 3: Deep Budgeting
- [ ] **Category Breakdowns** <!-- id: 10 -->
    - Visual progress bars for each category (Demolition, Electrical, etc.).
    - "Budget vs Actual" comparison per category.
- [x] **Room-based Tracking** <!-- id: 11 -->
    - Filter expenses by Room. (DONE)

## 🛍️ Phase 4: Procurement (FF&E)
- [ ] **Purchases / Wishlist Page** <!-- id: 12 -->
    - System to track items to buy.
    - **Product Options**: Ability to add multiple links for one item (e.g. 3 faucet options).
    - **Selection Logic**: Marking one option as "Selected" adds it to the Projected Budget.

## 👥 Phase 5: Stakeholders
- [x] **Contacts Directory** <!-- id: 13 -->
    - Simple CRUD for Contractors, Suppliers, Architects.

## 🛡️ Phase 6: Code Audit & Hardening (Completed)
- [x] **Security Hardening** <!-- id: 14 -->
- [x] **Context Reliability** <!-- id: 15 -->

## 📦 Phase 7: Version Control & Safety
- [/] **Git Initialization** <!-- id: 16 -->
    - Initialize repository.
    - Set up proper `.gitignore`.
    - Initial baseline commit.
