# GitLens-Detective-
# GitLens Analysis Project

A sample project designed to demonstrate GitLens capabilities in VS Code for analyzing Git history, code authorship, and commit tracking.

## Project Overview

This repository contains various JavaScript files with different functions that have been modified by different contributors over time. It's perfect for practicing GitLens analysis techniques.

## Getting Started

1. **Clone this repository**:
   ```bash
   git clone https://github.com/your-username/gitlens-analysis-project.git
   cd gitlens-analysis-project
   ```

2. **Open in VS Code**:
   ```bash
   code .
   ```

3. **Install GitLens extension** (if not already installed):
   - Open Extensions panel (`Ctrl+Shift+X`)
   - Search for "GitLens"
   - Install "GitLens — Git supercharged"

4. **Follow the analysis guide**:
   - Open `gitlens_insights.md` for detailed instructions
   - Practice analyzing the sample functions in the `src/` directory

## Sample Functions to Analyze

### Calculator Module (`src/calculator.js`)
- `add(a, b)` - Basic addition function
- `calculateTax(amount, rate)` - Tax calculation with multiple contributors
- `calculateDiscount(price, percentage)` - Discount calculation function

### User Manager (`src/userManager.js`)
- `createUser(userData)` - User creation function
- `validateUser(user)` - User validation logic
- `updateUserProfile(userId, updates)` - Profile update function

### Data Processor (`src/dataProcessor.js`)
- `processData(rawData)` - Data processing pipeline
- `filterData(data, criteria)` - Data filtering function
- `sortData(data, sortBy)` - Data sorting implementation

## GitLens Analysis Tasks

Try using GitLens to answer these questions:

1. **Who wrote the `calculateTax` function?**
2. **When was the `validateUser` function last modified?**
3. **What commit originally added the `processData` function?**
4. **Which contributor has made the most changes to `helpers.js`?**
5. **What was the commit message when `calculateDiscount` was first added?**

## Features to Explore

- **Inline Blame**: See author and date information inline
- **Code Lens**: View recent changes above functions
- **File History**: Track changes over time
- **Line History**: See evolution of specific lines
- **Commit Search**: Find specific commits and changes
- **Compare Views**: See differences between versions

## Project Structure

```
src/
├── calculator.js      # Mathematical operations
├── userManager.js     # User management functions
├── dataProcessor.js   # Data processing utilities
└── utils/
    ├── helpers.js     # Helper functions
    └── validators.js  # Validation utilities
```

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run tests:
   ```bash
   npm test
   ```

3. Configure VS Code settings for optimal GitLens experience:
   - Settings are pre-configured in `.vscode/settings.json`
   - Recommended extensions listed in `.vscode/extensions.json`

## Contributing

This project is designed for learning GitLens. Feel free to:
- Add new functions
- Modify existing code
- Create meaningful commit messages
- Collaborate with others to create rich Git history

## Learning Resources

- `gitlens_insights.md` - Complete GitLens usage guide
- `docs/api.md` - API documentation
- GitLens official documentation: https://gitlens.amod.io/

