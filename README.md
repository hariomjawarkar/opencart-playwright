# OpenCart Playwright Automation Framework

A premium, robust End-to-End automation framework for OpenCart/TutorialsNinja demo site using Playwright and TypeScript.

## 🚀 Features
- **Page Object Model (POM)** architecture for maintainability.
- **Data-Driven Testing** using JSON providers.
- **Dynamic User Registration** for success scenarios (ensures valid credentials).
- **Cross-browser support** (Chromium, Firefox).
- **Automatic reporting** (HTML & Allure).
- **Video & Screenshots** captured for every test run.

## 🛠️ Tech Stack
- **Language:** TypeScript
- **Test Runner:** Playwright
- **Reporting:** Allure, HTML Report
- **Utilities:** Faker for random data generation

## 📂 Project Structure
- `pages/`: Page Object classes.
- `tests/`: Test specifications.
- `utils/`: Data providers and random data generators.
- `testdata/`: JSON files for data-driven tests.

## 🏃 Getting Started

### Prerequisites
- Node.js installed.
- Playwright installed.

### Installation
```bash
npm install
npx playwright install
```

### Running Tests
Run all tests:
```bash
npx playwright test
```

Run specific test:
```bash
npx playwright test tests/EndToEndTest.spec.ts
```

View HTML Report:
```bash
npx playwright show-report
```

## 🎥 Evidence
Check the `/assets` folder for execution videos and screenshots of the automation runs.

