# BrowserStack Playwright Setup

Dit is de setup voor E2E tests via BrowserStack met Playwright.

## Vereisten

- Node.js 16+
- BrowserStack account met geldige credentials
- Playwright installed

## Installatie

```bash
npm install
```

## Environment Setup

Maak een `.env` bestand met je BrowserStack credentials:

```
BROWSERSTACK_USERNAME=your_username
BROWSERSTACK_ACCESS_KEY=your_access_key
```

Of stel environment variables in:

```bash
# Op macOS/Linux
export BROWSERSTACK_USERNAME=your_username
export BROWSERSTACK_ACCESS_KEY=your_access_key

# Op Windows PowerShell
$env:BROWSERSTACK_USERNAME="your_username"
$env:BROWSERSTACK_ACCESS_KEY="your_access_key"
```

## Tests Uitvoeren

### Lokaal (dev mode)
```bash
npm test
```

### Met UI (visueel debuggen)
```bash
npm run test:ui
```

### Debug mode
```bash
npm run test:debug
```

### Op BrowserStack (specifieke browser)
```bash
npx playwright test --project=bs-chrome-windows
npx playwright test --project=bs-firefox-windows
npx playwright test --project=bs-android-mobile
npx playwright test --project=bs-ios-mobile
```

### Alle BrowserStack tests
```bash
npx playwright test --grep @browserstack
```

## Beschikbare Test Projecten

### Desktop Browsers
- `chromium` - Lokale Chrome tests
- `firefox` - Lokale Firefox tests
- `webkit` - Lokale Safari tests
- `bs-chrome-windows` - BrowserStack Chrome op Windows
- `bs-firefox-windows` - BrowserStack Firefox op Windows
- `bs-safari-macos` - BrowserStack Safari op macOS

### Mobile Browsers
- `mobile-chrome` - Lokale Android emulator
- `mobile-safari` - Lokale iOS simulator
- `bs-android-mobile` - BrowserStack Android (Samsung Galaxy S23)
- `bs-ios-mobile` - BrowserStack iOS (iPhone 15)

## Configuratie Aanpassen

Edit `playwright.config.ts` om:
- Andere browsers toe te voegen
- Test timeout aan te passen
- Retry-strategie te wijzigen
- Reporter-instellingen aan te passen

Voorbeeld voor Chrome op Windows met specifieke versie:

```typescript
{
  name: 'bs-chrome-v120-windows',
  use: {
    connectOptions: {
      wsEndpoint: `wss://${BROWSERSTACK_USERNAME}:${BROWSERSTACK_ACCESS_KEY}@cdp.browserstack.com/playwright?caps=${encodeURIComponent(
        JSON.stringify({
          'browserstack.username': BROWSERSTACK_USERNAME,
          'browserstack.accessKey': BROWSERSTACK_ACCESS_KEY,
          'browser': 'Chrome',
          'browser_version': '120',
          'os': 'Windows',
          'os_version': '11',
          'name': 'Chrome v120 Test',
        })
      )}`,
    },
  },
}
```

## Test Reports

Na het uitvoeren van tests:
- HTML rapport: `test-results/index.html`
- JSON resultaten: `test-results/results.json`
- JUnit XML: `test-results/junit.xml`

Open het HTML rapport:
```bash
npx playwright show-report
```

## CI/CD Integratie

Voor GitHub Actions, GitLab CI, of andere CI platforms:

```yaml
# GitHub Actions voorbeeld
- name: Run E2E Tests
  env:
    BROWSERSTACK_USERNAME: ${{ secrets.BROWSERSTACK_USERNAME }}
    BROWSERSTACK_ACCESS_KEY: ${{ secrets.BROWSERSTACK_ACCESS_KEY }}
  run: npm run test:browserstack
```

## Troubleshooting

### Tests kunnen niet verbinden met BrowserStack
- Controleer BROWSERSTACK_USERNAME en BROWSERSTACK_ACCESS_KEY
- Zorg dat je BrowserStack account actief is
- Check je internet verbinding

### Timeout errors
- Verhoog timeout in `playwright.config.ts`
- Controleer of je website accessible is
- Probeer lokaal test eerst

### Slow tests
- Reduce workers in config
- Check BrowserStack network status
- Optimize je page load time

## Meer Info

- [Playwright Documentation](https://playwright.dev)
- [BrowserStack Playwright Guide](https://www.browserstack.com/docs/automate/playwright)
- [BrowserStack Device List](https://www.browserstack.com/list-of-browsers-and-os)
