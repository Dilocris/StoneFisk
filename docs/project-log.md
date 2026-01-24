# Project Log - Home Renovation Dashboard

This file tracks the evolution, major decisions, and interventions in the project.
All agents MUST read this to understand context before starting work.

## 2026-01-15: Structure Refactor (Smart Structure)
- **Action**: Flattened workspace structure.
- **Details**: 
  - Moved Next.js project from `renovate-dashboard/` subfolder to **Root Directory**.
  - Created `docs/` folder for documentation (`task.md`, `project-log.md`).
  - Source code is now in `src/`.
- **Reason**: Simplification. User wanted a "smart structure" without redundant subfolders.

## 2026-01-15: Next.js Pivot (Master Control)
- **Action**: Replaced Vanilla JS prototype with **Next.js 14**.
- **Details**:
  - Implemented `ProjectContext` for global state (localStorage persistence).
  - Built `BudgetWidget` (Recharts) and `TimelineWidget`.
  - Added "Add Expense" Modal with functional form.
  - Setup Tailwind CSS with Dark Mode support.
- **Reason**: User provided new PRD requesting a premium, scalable "Master Control" dashboard.

## 2026-01-15: Initial Prototype (Vanilla JS) [ARCHIVED]
- **Action**: Created modular HTML/JS/CSS structure.
- **Outcome**: Functionally correct but failed browser verification (CORS issues with ES Modules via `file://`).
- **Status**: Replaced by Next.js version.

## 2026-01-15: Persistence Migration (Server-Side)
- **Action**: Migrated data layer from `localStorage` to **File System**.
- **Details**:
  - Replaced client-side storage with `data/db.json` and API Routes (`/api/project`).
  - Implemented `/api/upload` endpoint for saving images to `public/uploads`.
  - Updated `ProjectContext` to use `fetch` for data operations.
- **Reason**: Enable unlimited storage and file support (photos/docs).

## 2026-01-15: Dashboard Redesign & Management Features
- **Action**: Full UX Redesign and CRUD implementation.
- **Details**:
  - **Layered Architecture**: Reorganized `page.tsx` into logical layers: Navigation, Gantt Hero, Logistics Pulse, and Administration.
  - **Gantt Workspace**: Implemented `GanttWorkspace.tsx` as a strategic 3-month timeline placeholder.
  - **CRUD Operations**: Added `updateExpense`, `deleteExpense`, `updateTask`, and `deleteTask` to `ProjectContext`.
  - **Management Layer**: Created `ManagementLayer.tsx` with tabbed tables for direct data manipulation.
  - **Build Fix**: Resolved a critical parsing error in `page.tsx`.
    - *Cause*: Duplicate JSX code and mismatched closing tags (`</section>`, `</main>`) left behind during code replacement.
    - *Fix*: Complete cleanup of `page.tsx` and proper reconstruction of the JSX tree.
- **Reason**: User requested better organization for future planning and the ability to edit/delete entries easily.

## 2026-01-15: Functional Alignment & Audit Fixes
- **Action**: Connected mock components to real logic and added missing management features.
- **Details**: 
  - **Real Gantt**: Refactored `GanttWorkspace` to use task dates instead of random offsets.
  - **Project Settings**: Created `ProjectSettingsForm` to allow naming the project and setting/changing the budget.
  - **Asset Management**: Implemented `AddAssetForm` and connected delete functionality.
  - **UI Polish**: Removed button hiding (opacity-0), and added "Início" date to the task management table.
- **Reason**: Ensure the dashboard accurately reflects project reality beyond visual placeholders.

## 2026-01-15: Underlying Logic & Performance Refinement
- **Action**: Strengthened data model and optimized persistence.
- **Details**:
  - **Type Expansion**: Added `Room` and `attachments` to `Expense` and `Task` interfaces.
  - **Debounced Saving**: Implemented 800ms debounce in `ProjectContext` to prevent excessive file-system writes.
  - **Media Integration**: Enabled file uploads in `AddExpenseForm` via `/api/upload`.
  - **Spatial Context**: Added "Room" selection to both Expense and Task forms.
- **Reason**: Lay foundation for room-based filtering and photo documentation while improving backend stability.
## 2026-01-15: Deep Gantt & UX Refinement
- **Action**: Comprehensive overhaul of Gantt logic and dashboard layout stability.
- **Details**:
  - **Advanced Gantt**: Implemented daily column grid with weekend (Sat/Sun) highlighting.
  - **Tooltip & Hover Fix**: Relocated tooltip triggers to individual bars and fixed overlapping position origins.
  - **Layout Anchoring**: Set fixed heights with internal scrolling for `AssetsTracker` and `ProgressLog` to prevent vertical page stretching.
  - **UX Improvements**: Implemented "Enter to Submit" logic and repositioned buttons in `ProgressLog`.
  - **UI Standard**: Renamed "Cronograma" tab to "Tarefas" and cleaned up redundant header actions.
- **Reason**: Address usability debt from early prototypes and ensure long-term stability as data grows.
## 2026-01-15: Advanced Functional & Visual Polish
- **Action**: Deep automation and visual redesign of key dashboard components.
- **Details**:
  - **Gantt Precision**: Added day numbers, fixed hover-trigger tooltips, and implemented a thicker, more accessible scrollbar.
  - **Asset/Expense Automation**: Linked `addExpense` to `addAsset` so materials appear automatically for tracking.
  - **Logistics UI**: Converted asset "Chegou!" buttons into checkboxes and simplified the entry form.
  - **Budget Redesign**: Overhauled `BudgetWidget` with a 2-column layout to fill the rectangular area.
  - **Inline Management**: Implemented searchable status dropdowns directly in the Expenses/Tasks tables.
- **Reason**: Transition the dashboard from a tracking tool to an automated management suite with professional UI balance.

## 2026-01-15: Bidirectional Sync & Responsive Layout
- **Action**: Hard-linking expense records to asset tracking and optimizing UI verticality.
- **Details**:
  - **Strong Sync**: Modified `ProjectContext` to use shared UUIDs for Expenses and their auto-generated Assets.
  - **Cascade Logic**: Implemented automatic name updates and deletions across both collections.
  - **Dynamic UI**: Replaced fixed 600px heights with `min-h`/`max-h` logic in `AssetsTracker` and `ProgressLog`.
- **Reason**: Final polish to ensure data integrity and a compact, professional aesthetic when handling varying amounts of data.

## 2026-01-15: Financial Engine Overhaul & Installments
- **Action**: Completely redesigned the financial logic to support installments, due dates, and payment methods.
- **Details**:
  - **Installment Automation**: `addExpense` now splits costs and creates sequential records for multi-payment purchases.
  - **Data Model**: Added `dueDate`, `paymentMethod`, `orderId`, and `installmentInfo` to the `Expense` type.
  - **UX Redesign**: Revamped `AddExpenseForm` with advanced financial controls and visual feedback for installments.
  - **UI Reporting**: Added a "Vencimento" column and installment badges (e.g., P1/10) to the management table.
- **Reason**: Align the dashboard with real-world construction financial management, allowing for better cash flow projection and precise payment tracking.

## 2026-01-15: UI Polishing & Suppliers Feature
- **Action**: Fixed critical UI glitches and implemented a comprehensive Supplier Management system.
- **Details**:
    - **UI Layout**: Optimized `BudgetWidget` for wide screens and fixed chart clipping.
    - **Navigation**: Implemented smooth scrolling for the "Ver Detalhes" button in Health Cards.
    - **Gantt UX**: Resolved tooltip overlapping issue by managing `z-index` on hover.
    - **Suppliers**: Added a dedicated "Fornecedores" tab with full CRUD (Add/Edit/Delete) and rating system.
- **Reason**: Improve dashboard usability on high-resolution displays and fulfill the user's need for a dedicated contact list for construction partners.

## 2026-01-15: Supplier Feature Expansion & Logical Categories
- **Action**: Fully expanded the Supplier management system with detailed contact fields and project-specific categories.
- **Details**:
    - **Data Model**: Added `phone1`, `phone2`, `email`, and `website` to the `Supplier` interface.
    - **Categories**: Overhauled the global `CATEGORIES` list to include logical construction phases (Marmoraria, Marcenaria, Gesso, Climatização, etc.).
    - **Form UX**: Updated `AddSupplierForm` with the new fields and set the default DDD to `(27)`.
    - **UI Display**: Enhanced the suppliers table in `ManagementLayer` to show multi-line contact info with icons for better readability.
- **Reason**: Provide a professional-grade contact management system for renovation projects, tailored to the specific needs of construction site coordination.

## 2026-01-15: Supplier Traceability & Auto-Linking
- **Action**: Linked the Supplier system to the financial (Expenses) and logistical (Assets) layers.
- **Details**:
    - **Data Integrity**: Modified `Expense` and `Asset` models to include `supplierId`.
    - **Auto-Propagation**: Updated `addExpense` to automatically link the corresponding delivery tracker item (`Asset`) to the selected supplier.
    - **UI Transparency**: Added supplier identity badges (👤) to the Expenses table and Assets Tracker cards.
    - **Form UX**: Integrated supplier selection dropdowns in both `AddExpenseForm` and `AddAssetForm`.
- **Reason**: Enable full traceability of purchases, allowing the user to know exactly which supplier to contact for each item expected at the construction site.

## 2026-01-15: Architect's Schedule Integration
- **Action**: Injected the official architect's schedule into the project tasks and Gantt chart.
- **Details**:
    - **Extraction**: Processed schedule image and extracted 9 key project phases (Briefing, Levantamento, EP, AT, EX-ARQ, EX-MCN).
    - **Status Logic**: Automatically categorized past phases as "Completed" and current phases as "In Progress" based on the current date (Jan 15th, 2026).
    - **Database Update**: Directly updated `db.json` to ensure the new milestones are permanent and synchronized across the dashboard.
- **Reason**: Align the project management tool with the professional timeline provided by the architectural team.

## 2026-01-15: Financial Status Chart Refactor
- **Action**: Redesigned the `BudgetWidget` chart to resolve visual clipping issues.
- **Details**:
    - **UI Pivot**: Replaced the radial `PieChart` with a custom vertical "Budget Column" (thermometer style).
    - **Optimization**: The new vertical layout naturally fits within the card's dimensions across all viewport sizes, eliminating SVG overflow.
    - **Premium Detail**: Added dynamic segment heights, shadow effects, and a floating percentage label for a high-end feel.
- **Reason**: Fix visual bug and improve data legibility in the main financial dashboard widget.

## 2026-01-15: Refinamentos de UX e Interatividade (Fase 14)
- **Action**: Aprimoramento da conectividade e fluidez visual do dashboard.
- **Details**:
    - **Gantt**: Adicionado destaque para o dia atual ("Hoje") e clique interativo nas tarefas para edição rápida.
    - **Finanças**: Refatoração do `BudgetWidget` para segmentos sólidos e reposicionamento do badge de porcentagem (evitando overlap).
    - **Logística**: Implementação de edição inteligente no `AssetsTracker` (direcionamento automático para Gasto ou Item).
    - **UI**: Limpeza de botões redundantes e correção de lints de sincronia.
- **Reason**: Melhorar a usabilidade e o profissionalismo da interface com base no feedback visual.

## 2026-01-16: Cronograma Avançado e Padronização (Fase 15)
- **Action**: Implementação de navegação temporal robusta e categorização precisa.
- **Details**:
    - **Gantt**: Adicionado suporte a datas passadas, setas de navegação (salto de 7 dias), botão de "Pular para Data" e marcadores de feriados brasileiros (2026). Remoção da barra de rolagem lateral em favor da navegação por estado.
    - **Finanças**: Ajustada a posição da porcentagem no `BudgetWidget` para eliminar o corte visual (clipping) no canto da tela.
    - **Cômodos**: Padronização da lista de áreas/cômodos para a ordem alfabética solicitada (*Área de Serviço, Escritório 2, Quarto 1, Quarto 2, Tudo, Varanda Casal*).
- **Reason**: Atender à necessidade de visualização histórica do cronograma e garantir precisão na categorização de gastos e tarefas.

## 2026-01-16: Refinamento de Precisão e Logística (Fase 16)
- **Action**: Aperfeiçoamento da fidelidade do cronograma e integração de fornecedores em tarefas.
- **Details**:
    - **Gantt**: Ajustado o cálculo de início das barras para precisão milimétrica (dia real). Implementado destaque pulsante ("Atrasado") para tarefas que passaram do prazo sem conclusão.
    - **Visual**: Substituição do azul pelo cinza azulado (`slate-500`) na categoria Pendente. Setas de navegação ampliadas e mais destacadas.
    - **Logística**: Restauração da lista completa de cômodos (14 entradas ordenadas).
    - **Conectividade**: Adicionado campo `supplierId` às tarefas, permitindo vincular responsáveis (ex: pedreiro, eletricista) diretamente no cronograma.
- **Reason**: Garantir que o dashboard reflita fielmente o andamento real e as responsabilidades da obra.

## 2026-01-16: Reversão da Fase 17 (Rollback)
- **Action**: Reversão completa das alterações de cores e tema arquitetônico.
- **Details**: 
    - Removidas as classes `brand-*` e definições no `globals.css`.
    - Restaurada a paleta de cores original (Azul, Verde, Âmbar, Rosa) em todos os componentes.
- **Reason**: Relato de que as cores "quebraram" a interface em alguns dispositivos/navegadores. Estabilidade visual restaurada.

## 2026-01-16: Refinamentos de UX e Rastreio de Atrasos (Fase 18)
- **Action**: Aperfeiçoamento da entrada de dados e novos KPIs de cronograma.
- **Details**: 
    - **Phone Mask**: Implementada máscara dinâmica `(##) #####-####` no cadastro de fornecedores, removendo o DDD fixo e adicionando limites de caracteres.
    - **Budget UI**: Centralizado o balão de porcentagem no "termômetro" financeiro para evitar cortes nas bordas em telas menores.
    - **Gantt Delay Tracking**: Adicionado o KPI "Carga de Atraso" no cabeçalho do cronograma, que soma o total de dias de atraso de todas as tarefas pendentes/bloqueadas.
- **Reason**: Melhorar a precisão da entrada de dados e fornecer uma visão clara de quanto tempo a obra está acumulando de atraso total.

## 2026-01-16: Tema Monokai Dimmed (Fase 19)
- **Action**: Implementação de tema escuro premium inspirado no VS Code.
- **Details**: 
    - **Palette overhaul**: Substituição de todas as cores por hexes Monokai Dimmed (#1e1e1e / #c5c8c6).
    - **Mapped Colors**: 
        - Pendente: #49483e (Muted Gray)
        - Em Curso: #fce566 (Monokai Yellow)
        - Pronto/Pago: #98e342 (Monokai Green)
        - Bloqueado/Atraso: #f92672 (Monokai Red)
        - Ações: #67d8ef (Monokai Cyan)
    - **Global consistency**: Atualizados Gantt, Orçamento, Tabelas e Formulários para total coesão.
- **Reason**: Preferência estética do usuário por um visual de IDE de alta performance e baixo cansaço visual.

## 2026-01-24: Environment Setup & Fix
- **Action**: Installed Node.js 24 and restored dev environment.
- **Details**: 
    - Detected missing `npm` and installed Node.js via `winget`.
    - Cleared corrupted `.next` cache to resolve Turbopack crash.
    - Successfully started development server on port 3000.
- **Reason**: Enable access to the dashboard.
