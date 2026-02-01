# StoneFisk Code Review

**Date:** February 1, 2026
**Reviewer:** Claude Code (Automated Analysis)
**Codebase:** StoneFisk Renovation Dashboard
**Tech Stack:** Next.js 16.1.2, React 19.2.3, TypeScript 5, Tailwind CSS 4
**Total Files Analyzed:** 22 source files (~3,515 lines of TypeScript)

---

## Executive Summary

StoneFisk is a local-first renovation management dashboard built with modern React patterns. While the codebase demonstrates solid TypeScript foundations and clean component separation, this review identified **47 issues** across security, performance, code quality, and architecture. The most critical gaps are the **complete absence of tests** and **security vulnerabilities** that would be problematic if deployed beyond local use.

---

## Priority 1: CRITICAL Issues

### 1.1 No Test Coverage (CRITICAL)

**Impact:** Zero confidence in code correctness; high regression risk
**Files Affected:** Entire codebase

| Metric | Status |
|--------|--------|
| Unit Tests | ❌ None |
| Integration Tests | ❌ None |
| E2E Tests | ❌ None |
| Test Framework | ❌ Not installed |

**Missing Test Coverage for Critical Paths:**
- `src/context/ProjectContext.tsx` - Core state management, CRUD operations
- `src/app/api/project/route.ts` - Data persistence layer
- `src/app/api/upload/route.ts` - File upload validation
- `src/lib/export.ts` - PDF generation logic
- `src/lib/date.ts` - Date formatting utilities
- All form components with complex validation

**Recommendation:** Install Vitest + React Testing Library, prioritize testing ProjectContext and API routes.

---

### 1.2 Missing Authentication/Authorization (CRITICAL - if deployed)

**Impact:** Complete data exposure if exposed to network
**Files:**
- `src/app/api/project/route.ts:50-58`
- `src/app/api/upload/route.ts:15-92`

```typescript
// No auth check - anyone can read/modify all project data
export async function GET() {
    await ensureDb();
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return NextResponse.json(JSON.parse(data));
}
```

**Vulnerabilities:**
- No session/token validation
- No CSRF protection
- No rate limiting
- All endpoints publicly accessible

**Recommendation:** For production deployment, add authentication middleware (NextAuth.js or similar).

---

### 1.3 Weak File Upload Validation (CRITICAL)

**Impact:** Potential for malicious file uploads
**File:** `src/app/api/upload/route.ts:7-13, 30-32, 41-45`

**Issues:**
1. **MIME type spoofing** - Only checks `file.type` header, not actual file content
2. **Weak randomness** - Uses `Math.random()` instead of `crypto.randomUUID()`
3. **No magic byte validation** - Files not verified by content signature

```typescript
// Trusts client-provided MIME type (can be spoofed)
if (!ALLOWED_TYPES.includes(file.type)) { ... }

// Predictable filename generation
const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
```

**Recommendation:** Validate file content with magic bytes, use `crypto.randomUUID()` for filenames.

---

## Priority 2: HIGH Severity Issues

### 2.1 Excessive `any` Types (HIGH)

**Impact:** Defeats TypeScript's type safety; runtime errors possible
**Count:** 12+ instances

| File | Line(s) | Issue |
|------|---------|-------|
| `src/app/page.tsx` | 31-34, 44-47 | `useState<any>(null)` for editing states |
| `src/app/api/project/route.ts` | 31 | `body: any` in validation function |
| `src/app/api/upload/route.ts` | 81 | `catch (error: any)` |
| `src/lib/export.ts` | 93, 116, 136, 142, 161, 179 | `(doc as any).lastAutoTable` |
| `src/components/dashboard/GanttWorkspace.tsx` | 316 | `(taskBars as any[])` |
| `src/components/dashboard/ManagementLayer.tsx` | 34, 220, 305, 365 | `item: any` in filter |

**Example Fix:**
```typescript
// Before
const [editingExpense, setEditingExpense] = useState<any>(null);

// After
const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
```

---

### 2.2 N+1 Query Pattern in Renders (HIGH)

**Impact:** O(n²) complexity; severe performance degradation with 100+ items
**Files:**
- `src/components/dashboard/ManagementLayer.tsx:241`
- `src/components/dashboard/AssetsTracker.tsx:54, 59`

```typescript
// Inside map loop - searches suppliers array for each expense
{data.suppliers.find(s => s.id === exp.supplierId)?.name}
```

**With 100 expenses × 50 suppliers = 5,000 array searches per render**

**Recommendation:** Create indexed lookup maps in context:
```typescript
const supplierMap = useMemo(() =>
    new Map(data.suppliers.map(s => [s.id, s])),
    [data.suppliers]
);
```

---

### 2.3 Global Event System Anti-Pattern (HIGH)

**Impact:** No type safety, hard to trace, namespace pollution
**Files:**
- `src/app/page.tsx:49-68` (8 event listeners)
- `src/components/dashboard/ManagementLayer.tsx:119`
- `src/components/dashboard/GanttWorkspace.tsx:328`

**19 window.addEventListener/dispatchEvent calls found**

```typescript
// No type safety for event names or payloads
window.dispatchEvent(new CustomEvent('edit-task', { detail: task }));
window.addEventListener('edit-task', (e: any) => setEditingTask(e.detail));
```

**Recommendation:** Replace with typed React Context or useReducer pattern for modal management.

---

### 2.4 Context Over-Subscription (HIGH)

**Impact:** All 20+ components re-render on any data change
**File:** `src/context/ProjectContext.tsx:21-46`

```typescript
// Every component gets full data object
const { data, ... } = useProject();
// Changes to ANY expense/task/supplier triggers re-render everywhere
```

**Recommendation:** Implement selector pattern with granular hooks:
```typescript
const useExpenses = () => useProject().data.expenses;
const useSuppliers = () => useProject().data.suppliers;
```

---

### 2.5 Duplicate `isValidProjectData` Function (HIGH)

**Impact:** Bug fixes must be applied in two places
**Files:**
- `src/context/ProjectContext.tsx:50-60`
- `src/app/api/project/route.ts:31-48`

**Recommendation:** Extract to `src/lib/validation.ts` and import in both locations.

---

### 2.6 Missing User Error Feedback (HIGH)

**Impact:** Users unaware when operations fail
**Files:**
- `src/context/ProjectContext.tsx:81-82, 110-111, 120-129`
- `src/components/forms/AddExpenseForm.tsx:78-91`

```typescript
} catch (e) {
    console.error("Failed to save data", e);
    // No UI notification - user thinks save succeeded
}
```

**Recommendation:** Add toast notifications or error state to context.

---

## Priority 3: MEDIUM Severity Issues

### 3.1 Large Monolithic Components (MEDIUM)

**Impact:** Hard to test, maintain, and optimize

| Component | Lines | Issues |
|-----------|-------|--------|
| `ManagementLayer.tsx` | 430 | Handles 3 tabs, filtering, search, bulk delete |
| `GanttWorkspace.tsx` | 363 | Timeline logic, grid generation, task rendering |
| `AddExpenseForm.tsx` | 310 | File upload, installment calc, form state |
| `AddTaskForm.tsx` | 293 | Could be split into field components |

**Recommendation:** Split ManagementLayer into ExpensesTable, TasksTable, SuppliersTable, TableHeader, BulkActions.

---

### 3.2 Missing Memoization (MEDIUM)

**Impact:** Expensive recalculations on every render
**Files:**
- `src/components/dashboard/BudgetWidget.tsx:8-28`
- `src/components/dashboard/HealthCheck.tsx:14-34`

```typescript
// Recalculates on every render with no useMemo
const paidAmount = data.expenses
    .filter(e => e.status === 'Paid')
    .reduce((sum, e) => sum + e.amount, 0);
```

**useMemo usage:** Only 2 occurrences (should be 5+)
**React.memo usage:** 0 occurrences (should be 3-4)

---

### 3.3 Repeated Input Styling (MEDIUM)

**Impact:** Inconsistent styling, maintenance burden
**Count:** 7+ instances of identical className patterns

```typescript
// This pattern repeated across all form components
className="p-3 bg-secondary rounded-xl border border-input focus:ring-2 focus:ring-primary"
```

**Recommendation:** Extract to `src/components/ui/Input.tsx` and `FormField.tsx`.

---

### 3.4 Missing Input Validation (MEDIUM)

**Impact:** Data integrity issues, potential DoS
**Files:** All form components

**Issues:**
- No `maxLength` on text inputs
- No range validation on numbers (negative amounts accepted)
- No email format validation on backend
- No file size check before parsing JSON imports

```typescript
// Accepts any finite number including negative
const parsedBudget = Number.parseFloat(budget);
if (!Number.isFinite(parsedBudget)) { return; }
// Should also check: if (parsedBudget < 0) { ... }
```

---

### 3.5 PDF Libraries Not Lazy-Loaded (MEDIUM)

**Impact:** ~350KB added to initial bundle for rarely-used feature
**File:** `package.json:14-15`

```json
"jspdf": "^4.0.0",        // ~250KB
"jspdf-autotable": "^5.0.7"  // ~100KB
```

**Recommendation:** Use dynamic import:
```typescript
const generatePDF = async () => {
    const { jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    // ... generate PDF
};
```

---

### 3.6 Monolithic Modal State (MEDIUM)

**Impact:** 10 useState calls for related modal state
**File:** `src/app/page.tsx:23-34`

```typescript
const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
// ... 8 more modal states
```

**Recommendation:** Unify into single reducer:
```typescript
const [modal, dispatch] = useReducer(modalReducer, { type: null, data: null });
```

---

### 3.7 Missing JSDoc Documentation (MEDIUM)

**Impact:** Reduced maintainability, poor IDE experience
**Count:** 0 JSDoc comments across 22 source files

**Files needing documentation:**
- `src/context/ProjectContext.tsx` - 20+ exported functions
- `src/lib/export.ts` - Complex PDF generation
- `src/lib/types.ts` - All interfaces
- All API routes

---

## Priority 4: LOW Severity Issues

### 4.1 Inconsistent Error Handling (LOW)

**Issue:** Mixed patterns for catch clauses

```typescript
} catch (error) { ... }  // Some files
} catch (e) { ... }       // Other files
} catch (err) { ... }     // Still others
```

---

### 4.2 Weak Randomness in Filename Generation (LOW)

**File:** `src/app/api/upload/route.ts:41`

```typescript
// Math.random() is not cryptographically secure
const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
```

**Recommendation:** Use `crypto.randomUUID()`.

---

### 4.3 Repeated Date Formatting (LOW)

**Count:** 13+ occurrences of locale formatting

```typescript
.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
```

**Recommendation:** Centralize in `src/lib/date.ts` (utility exists but not used everywhere).

---

### 4.4 Missing Environment Variable Documentation (LOW)

**Impact:** Setup friction for new developers
**Missing:** `.env.example` file

---

### 4.5 Poor Variable Naming (LOW)

**Examples:**
- `m` should be `month` (GanttWorkspace.tsx:252)
- `d` should be `dayLine` (GanttWorkspace.tsx:265)
- `sup` should be `supplier` (ManagementLayer.tsx:365)

---

## Recommendations Summary

### Immediate Actions (This Sprint)

| Priority | Issue | Effort | Impact |
|----------|-------|--------|--------|
| 1 | Add Vitest + basic tests for ProjectContext | 4h | Critical |
| 2 | Replace `any` types with proper interfaces | 2h | High |
| 3 | Create supplier/expense lookup maps | 1h | High |
| 4 | Add input validation (maxLength, ranges) | 2h | Medium |
| 5 | Extract duplicate `isValidProjectData` | 30m | High |

### Short-Term (Next 2 Sprints)

| Priority | Issue | Effort | Impact |
|----------|-------|--------|--------|
| 6 | Split ManagementLayer into sub-components | 4h | Medium |
| 7 | Replace window events with Context pattern | 3h | High |
| 8 | Add useMemo to BudgetWidget/HealthCheck | 1h | Medium |
| 9 | Lazy-load PDF libraries | 1h | Medium |
| 10 | Add JSDoc to exported functions | 3h | Medium |

### Before Production Deployment

| Priority | Issue | Effort | Impact |
|----------|-------|--------|--------|
| 11 | Implement authentication | 8h | Critical |
| 12 | Add CSRF protection | 2h | High |
| 13 | Implement proper file validation | 4h | High |
| 14 | Add rate limiting | 2h | Medium |
| 15 | Add error boundaries + toast notifications | 3h | High |

---

## Metrics Overview

| Category | Status | Score |
|----------|--------|-------|
| **Type Safety** | ⚠️ Needs Work | 6/10 |
| **Test Coverage** | ❌ Critical | 0/10 |
| **Security** | ⚠️ Local-only OK | 4/10 |
| **Performance** | ⚠️ Needs Optimization | 5/10 |
| **Documentation** | ⚠️ Partial | 5/10 |
| **Architecture** | ⚠️ Some Anti-patterns | 6/10 |
| **Code Quality** | ✅ Generally Good | 7/10 |

**Overall Score: 5.5/10** - Functional but needs significant improvements before scaling or production deployment.

---

## Appendix: Files Requiring Immediate Attention

1. `src/context/ProjectContext.tsx` - Core state, needs tests + selector pattern
2. `src/app/api/upload/route.ts` - Security hardening required
3. `src/components/dashboard/ManagementLayer.tsx` - Split into sub-components
4. `src/app/page.tsx` - Replace any types, unify modal state
5. `src/components/dashboard/BudgetWidget.tsx` - Add memoization

---

*This review was generated by automated static analysis. Manual review recommended for business logic validation.*
