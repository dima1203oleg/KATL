# Localization Platform Architecture (KATL Platform)

## 1. Overview & Architectural Isolation
The **Localization Platform** is a standalone, provider-agnostic platform module responsible for managing multilingual content, terminology consistency, translation workflows, and locale-aware routing across the KATL ecosystem.

### Key Invariant
**The Localization Platform is completely decoupled from any AI provider.**
It utilizes the **AI Provider Gateway** solely as a replaceable translation assistance tool and never imports or invokes OpenAI, Gemini, Claude, or any third-party SDK directly.

---

## 2. Supported Locales
* `uk` (Default / Primary): Ukrainian (Українська)
* `en`: English (International Engineering)
* `zh-cn`: Simplified Chinese (CATL Original Technical Reference)

Extensible architecture allows adding `pl`, `de`, `ro`, `es`, `fr` through database configuration without modifying application logic.

---

## 3. Core Subsystems

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Localization Platform                           │
├───────────────────┬───────────────────┬────────────────────────────────┤
│  Locale Registry  │ Translation Memory│       Glossary Subsystem       │
│  - Active locales │ - Exact matches   │  - Approved BESS terms         │
│  - Fallback rules │ - Fuzzy matches   │  - Forbidden terms             │
│  - URL prefixing  │ - Re-use tracking │  - Cross-locale mappings       │
├───────────────────┴───────────────────┴────────────────────────────────┤
│                         Translation Workflow                           │
│  SOURCE ──> DRAFT ──> MACHINE_TRANSLATED ──> HUMAN_REVIEW ──> APPROVED  │
│                                                │                       │
│                                           (Outdated) <── On Source Diff│
└────────────────────────────────────────────────────────────────────────┘
```

### 3.1. BESS Terminology Glossary
Ensures strict consistency in electrical and energy storage nomenclature:
* **BESS** -> Системи накопичення енергії акумуляторного типу (СНЕА / BESS)
* **LCOS** -> Нормована вартість зберігання енергії (Levelized Cost of Storage)
* **Depth of Discharge (DoD)** -> Глибина розряду
* **Round Trip Efficiency (RTE)** -> ККД повного циклу (заряд/розряд)
* **PCS** -> Система перетворення енергії (Power Conversion System / Інвертор)
* **EMS** -> Система керування енергією (Energy Management System)
* **Grid Forming** -> Режим формування мережі (острівний режим)
* **Peak Shaving** -> Зрізання пікових навантажень

### 3.2. Translation Memory (TM)
* Stores hash of source strings with target translations.
* Prevents re-translating identical technical strings.
* Tracks usage frequency and verification timestamps.

### 3.3. Translation Lifecycle
1. `SOURCE`: Original text in Ukrainian or English.
2. `DRAFT` / `MACHINE_TRANSLATED`: Generated via AI Gateway task `translate`.
3. `HUMAN_REVIEW`: Assigned to technical translator / engineer.
4. `APPROVED`: Validated and published to production bundle.
5. `OUTDATED`: Triggered automatically when source string changes.
