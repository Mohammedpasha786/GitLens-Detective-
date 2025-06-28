#!/bin/bash

# HTTPie CLI Repository Setup Script for GitLens Analysis
# This script clones the HTTPie CLI repository and prepares it for analysis

set -e  # Exit on any error

echo "🚀 Setting up HTTPie CLI for GitLens Analysis"
echo "=============================================="

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if python3 is installed
if ! command -v python3 &> /dev/null; then
    echo "⚠️  Python3 is not installed. Some analysis features may be limited."
fi

# Create project directory
PROJECT_DIR="httpie-gitlens-analysis"
if [ -d "$PROJECT_DIR" ]; then
    echo "📁 Project directory already exists: $PROJECT_DIR"
    read -p "Do you want to remove it and start fresh? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf "$PROJECT_DIR"
        echo "🗑️  Removed existing directory"
    else
        echo "Keeping existing directory. You may want to pull latest changes."
        cd "$PROJECT_DIR/httpie-cli" 2>/dev/null || {
            echo "❌ No httpie-cli directory found in $PROJECT_DIR"
            exit 1
        }
        git pull origin master
        echo "📥 Updated repository"
        exit 0
    fi
fi

mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

echo "📥 Cloning HTTPie CLI repository..."
echo "Repository: https://github.com/httpie/cli.git"

# Clone the repository with progress
git clone --progress https://github.com/httpie/cli.git httpie-cli

if [ $? -ne 0 ]; then
    echo "❌ Failed to clone repository"
    exit 1
fi

cd httpie-cli

echo ""
echo "📊 Repository Statistics:"
echo "========================"
echo "📍 Location: $(pwd)"
echo "📈 Total commits: $(git rev-list --count HEAD)"
echo "👥 Contributors: $(git shortlog -sn | wc -l)"
echo "🎯 First commit: $(git log --reverse --pretty=format:'%h %ad %s' --date=short | head -1)"
echo "🔄 Latest commit: $(git log -1 --pretty=format:'%h %ad %s' --date=short)"
echo "🌿 Current branch: $(git branch --show-current)"
echo "📦 Repository size: $(du -sh . | cut -f1)"

# Check Python availability and set up virtual environment
if command -v python3 &> /dev/null; then
    echo ""
    echo "🐍 Setting up Python environment..."
    
    # Create virtual environment
    python3 -m venv venv
    source venv/bin/activate
    
    echo "📦 Installing HTTPie in development mode..."
    pip install --upgrade pip
    pip install -e .
    
    echo "✅ Python environment ready"
    echo "To activate: source venv/bin/activate"
else
    echo "⚠️  Skipping Python setup (Python3 not found)"
fi

# Create analysis directories
echo ""
echo "📁 Creating analysis structure..."
cd ..  # Back to project root

mkdir -p .vscode findings scripts

# Create VS Code settings
cat > .vscode/settings.json << 'EOF'
{
    "gitlens.views.repositories.files.layout": "tree",
    "gitlens.views.fileHistory.enabled": true,
    "gitlens.views.lineHistory.enabled": true,
    "gitlens.currentLine.enabled": true,
    "gitlens.currentLine.pullRequests.enabled": true,
    "gitlens.hovers.currentLine.over": "line",
    "gitlens.blame.highlight.enabled": true,
    "gitlens.blame.heatmap.enabled": true,
    "gitlens.codeLens.enabled": true,
    "gitlens.codeLens.authors.enabled": true,
    "gitlens.codeLens.recentChange.enabled": true,
    "gitlens.statusBar.enabled": true,
    "gitlens.defaultDateFormat": "MM/DD/YYYY",
    "gitlens.defaultDateStyle": "relative",
    "python.defaultInterpreterPath": "./httpie-cli/venv/bin/python",
    "files.exclude": {
        "**/venv": true,
        "**/__pycache__": true,
        "**/*.pyc": true
    }
}
EOF

# Create extensions recommendations
cat > .vscode/extensions.json << 'EOF'
{
    "recommendations": [
        "eamodio.gitlens",
        "ms-python.python",
        "ms-python.pylint",
        "ms-vscode.vscode-json",
        "github.vscode-pull-request-github",
        "ms-python.black-formatter"
    ]
}
EOF

# Create README for the analysis project
cat > README.md << 'EOF'
# HTTPie CLI GitLens Analysis Project

This project demonstrates GitLens capabilities by analyzing the HTTPie CLI repository.

## Repository Information
- **URL**: https://github.com/httpie/cli
- **Language**: Python  
- **Description**: Modern, user-friendly command-line HTTP client
- **First Commit**: 2012
- **Active Development**: Yes

## Quick Start
1. Open this directory in VS Code: `code .`
2. Install recommended extensions (GitLens will be suggested)
3. Navigate to `httpie-cli/` directory to start analysis
4. Follow the guide in `gitlens_insights.md`

## Analysis Structure
- `httpie-cli/` - Cloned repository
- `findings/` - Your analysis results
- `gitlens_insights.md` - Complete GitLens guide
- `.vscode/` - VS Code configuration

## Key Files to Analyze
- `httpie/core.py` - Main application logic
- `httpie/cli/arguments.py` - Command-line parsing
- `httpie/output/formatters/` - Output formatting
- `httpie/plugins/` - Plugin system

## Analysis Goals
1. Identify key contributors and their specializations
2. Track evolution of major features (plugins, sessions, auth)
3. Understand code quality improvements over time
4. Learn GitLens features through real-world examples
EOF

# Create initial findings template
cat > findings/analysis_template.md << 'EOF'
# HTTPie CLI Analysis Session

**Date**: [Fill in date]
**Analyst**: [Your name]
**Focus**: [What you're analyzing]

## Function/Feature Analysis

### Target: [Function/File name]
- **Location**: [File path]
- **Lines**: [Line numbers]

### GitLens Findings
- **Original Author**: [Name from blame]
- **Creation Date**: [Date from first commit]
- **Last Modified**: [Date from recent commit]
- **Total Changes**: [From file history]

### Key Contributors
1. [Name] - [What they contributed]
2. [Name] - [What they contributed]

### Evolution Timeline
- [Date]: [Major change description]
- [Date]: [Major change description]

### Interesting Commits
- `[hash]`: [Commit message and significance]
- `[hash]`: [Commit message and significance]

## Code Quality Observations
- [Refactoring patterns]
- [Documentation improvements]
- [Test coverage changes]

## Questions for Further Investigation
1. [Question about the code/history]
2. [Question about contributors/decisions]

## GitLens Features Used
- [ ] Inline blame annotations
- [ ] Code Lens
- [ ] File History view
- [ ] Line History view
- [ ] Commit search
- [ ] Repository view
- [ ] Compare features
EOF

echo ""
echo "✅ Setup Complete!"
echo "=================="
echo ""
echo "📁 Project structure created in: $(pwd)"
echo "🔧 VS Code settings configured for optimal GitLens experience"
echo "📚 Analysis templates ready in findings/"
echo ""
echo "🚀 Next Steps:"
echo "1. Open VS Code: code ."
echo "2. Install GitLens extension (will be recommended)"
echo "3. Navigate to httpie-cli/ directory"
echo "4. Start analyzing with GitLens!"
echo ""
echo "💡 Pro Tips:"
echo "- Use Ctrl+Shift+P and type 'GitLens' to see all available commands"
echo "- Enable blame annotations with Ctrl+Shift+G B"
echo "- Right-click on any line to see GitLens context menu"
echo "- Check the Repository view in the sidebar for overview"
echo ""
echo "Happy analyzing! 🎉"
