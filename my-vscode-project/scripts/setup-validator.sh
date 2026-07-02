#!/bin/bash
# Script om Playwright en BrowserStack setup te valideren

echo "🧪 Playwright BrowserStack Setup Validator"
echo "=========================================="
echo ""

# Check Node.js
echo "✓ Node.js version:"
node --version

# Check npm
echo "✓ npm version:"
npm --version

echo ""
echo "📦 Checking dependencies..."

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found"
    exit 1
fi

# Check Playwright installation
if npm list @playwright/test &>/dev/null; then
    echo "✓ @playwright/test installed"
else
    echo "⚠️  @playwright/test not found. Installing..."
    npm install
fi

# Check BrowserStack credentials
if [ -z "$BROWSERSTACK_USERNAME" ] || [ -z "$BROWSERSTACK_ACCESS_KEY" ]; then
    echo ""
    echo "⚠️  BrowserStack credentials not set!"
    echo ""
    echo "   Set environment variables:"
    echo "   export BROWSERSTACK_USERNAME=<your_username>"
    echo "   export BROWSERSTACK_ACCESS_KEY=<your_access_key>"
    echo ""
    echo "   Or create .env file:"
    echo "   cp .env.example .env"
    echo "   # Then edit .env with your credentials"
else
    echo "✓ BrowserStack credentials configured"
fi

echo ""
echo "✓ Configuration complete!"
echo ""
echo "To run tests:"
echo "  npm test                    # Run locally"
echo "  npm run test:ui             # Run with UI"
echo "  npm run test:browserstack   # Run on BrowserStack"
