# NPO Luister CMS API Tests

Automatische E2E en API tests voor de NPO Luister CMS API's met volledige CRUD dekking.

## 📋 Test Files

### 1. `npo-cms-api.spec.ts` - Direct API Tests
Direct tests tegen de API endpoints zonder UI.

**Test suites:**
- **Collection** - CREATE, READ operaties
- **CollectionBlock** - CRUD operaties (Create, Read, Update, Delete)
- **MixedCollectionItem** - CRUD operaties
- **PodcastCollectionItem** - CRUD operaties  
- **PodcastEpisodeCollectionItem** - CRUD operaties
- **Error Handling** - 404, 400, validation errors
- **Performance** - Response times, concurrent requests

**Endpoints getested:**
```
POST   /api/collection                          # Create
GET    /api/collections                         # List
GET    /api/collection/{id}                     # Read

POST   /api/collection-block                    # Create
GET    /api/collection-block/{id}               # Read
PUT    /api/collection-block/{id}               # Update
DELETE /api/collection-block/{id}               # Delete

POST   /api/mixed_collection_items              # Create
GET    /api/mixed_collection_items/{id}         # Read
PUT    /api/mixed_collection_items/{id}         # Update
DELETE /api/mixed_collection_items/{id}         # Delete

POST   /api/podcast_collection_items            # Create
GET    /api/podcast_collection_items/{id}       # Read
PUT    /api/podcast_collection_items/{id}       # Update
DELETE /api/podcast_collection_items/{id}       # Delete

POST   /api/podcast_episode_collection_items    # Create
GET    /api/podcast_episode_collection_items/{id} # Read
PUT    /api/podcast_episode_collection_items/{id} # Update
DELETE /api/podcast_episode_collection_items/{id} # Delete
```

### 2. `npo-cms-swagger-ui.spec.ts` - UI/Documentation Tests
Tests voor Swagger UI documentatie pagina.

**Test suites:**
- **Swagger UI Documentation** - Page loading, resource discovery, endpoint details
- **Responsive Design** - Mobile, tablet, desktop viewports

**Getest:**
- ✅ Pagina laadtijd
- ✅ Alle resource secties zichtbaar
- ✅ Authorize button
- ✅ Endpoint expansie/collapse
- ✅ Request/response details
- ✅ Server selector
- ✅ Copy to clipboard
- ✅ API versie display
- ✅ OpenAPI 3.1 format
- ✅ Responsive design

### 3. `config.ts` - Test Configuration
Centralized configuration en helpers.

## 🚀 Snel Starten

### Installatie
```bash
npm install
```

### Environment Setup
```bash
# Maak .env bestand
cp .env.example .env

# Voor de API tests (als auth nodig is)
LUISTER_CMS_API_BASE_URL=https://tst.luister-cms.api.npox.nl/api
LUISTER_CMS_API_TOKEN=your_token_here
```

## 📊 Tests Uitvoeren

### Alle NPO CMS tests
```bash
npm run test:npo
```

### Alleen API tests
```bash
npm run test:npo-api
```

### Alleen Swagger UI tests
```bash
npm run test:npo-swagger
```

### Met debug mode
```bash
npm run test:npo:debug
```

### Met UI viewer
```bash
npm run test:ui -- --grep "npo"
```

### Specifieke test suite
```bash
# Alleen CollectionBlock CRUD tests
npx playwright test npo-cms-api.spec.ts --grep "CollectionBlock"

# Alleen error handling tests
npx playwright test npo-cms-api.spec.ts --grep "Error Handling"

# Alleen performance tests
npx playwright test npo-cms-api.spec.ts --grep "Performance"
```

### Op specifieke browser
```bash
npx playwright test npo-cms-api.spec.ts --project=chromium
npx playwright test npo-cms-swagger-ui.spec.ts --project=firefox
```

### Parallelle execution
```bash
# Default: parallelle execution
npm run test:npo

# Sequential execution
npx playwright test npo-cms --workers=1
```

## 📈 Test Reports

Na het uitvoeren:

```bash
# HTML report
npx playwright show-report

# JSON output
cat test-results/results.json

# JUnit XML (voor CI/CD)
cat test-results/junit.xml
```

## 🔄 CRUD Coverage Matrix

| Resource | CREATE | READ | UPDATE | DELETE | Status |
|----------|--------|------|--------|--------|--------|
| Collection | ✅ | ✅ | ⏳ | ⏳ | Partial |
| CollectionBlock | ✅ | ✅ | ✅ | ✅ | Full |
| MixedCollectionItem | ✅ | ✅ | ✅ | ✅ | Full |
| PodcastCollectionItem | ✅ | ✅ | ✅ | ✅ | Full |
| PodcastEpisodeCollectionItem | ✅ | ✅ | ✅ | ✅ | Full |
| Block | ⏳ | ⏳ | ⏳ | ⏳ | Planned |
| BlockOnPage | ⏳ | ✅ | ⏳ | ✅ | Partial |

✅ = Implemented
⏳ = Planned
❌ = Not applicable

## 🧪 Test Data

Test data wordt automatisch gegenereerd met timestamps:
```typescript
{
  title: "Test Collection 1719667234567",
  description: "Automated test collection created at 2024-06-29T10:07:14.567Z"
}
```

Dit zorgt ervoor dat elk test run unieke data heeft en geen conflicts zijn.

## 🔐 Authentication

Voor endpoints die authentication vereisen:

```typescript
const response = await request.post(`${API_BASE_URL}/collection`, {
  data: {...},
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/ld+json',
  },
});
```

Set token in `.env`:
```
LUISTER_CMS_API_TOKEN=your_bearer_token
```

## 📡 API Endpoints Referentie

### Base URL
```
https://tst.luister-cms.api.npox.nl/api
```

### Content-Type Headers
```
Content-Type: application/ld+json
Accept: application/ld+json
```

### Response Format
API returns JSON-LD format (linked data):
```json
{
  "@context": "...",
  "@id": "/api/collection/123",
  "@type": "Collection",
  "id": "123",
  "title": "My Collection"
}
```

## 🐛 Troubleshooting

### Tests failen met 401 Unauthorized
- Check API token in `.env`
- Controleer token expiration
- Verify authentication headers

### Tests failen met 400 Bad Request
- Controleer test data in `npo-cms-api.spec.ts`
- Verify required fields zijn ingevuld
- Check API validation rules

### Tests timeout
- Verhoog timeout in `playwright.config.ts`
- Check API server status
- Verify network connectivity

### Port conflicts
- Controleer of andere services poort 3000+ niet gebruiken
- Change port in `.env` if needed

## 📝 Test Maintenance

### Endpoints toevoegen
1. Add endpoint in `npo-cms-api.spec.ts`
2. Add test data in `tests/config.ts`
3. Create test suite met CRUD operaties
4. Run tests: `npm run test:npo-api`

### Test data updaten
Edit `tests/config.ts` in de `MOCK_DATA` object.

### Response format wijzigingen
Update assertions in test files als API response format verandert.

## 🔗 Documentatie Links

- [API Documentation](https://tst.luister-cms.api.npox.nl/documentation)
- [Playwright Docs](https://playwright.dev)
- [OpenAPI 3.1 Spec](https://spec.openapis.org/oas/v3.1.0)
- [JSON-LD Format](https://json-ld.org/)

## 📊 CI/CD Integration

### GitHub Actions
```yaml
- name: Run NPO CMS Tests
  run: npm run test:npo
  env:
    LUISTER_CMS_API_TOKEN: ${{ secrets.LUISTER_CMS_API_TOKEN }}
```

### GitLab CI
```yaml
npo-api-tests:
  script:
    - npm install
    - npm run test:npo-api
  variables:
    LUISTER_CMS_API_TOKEN: $LUISTER_CMS_API_TOKEN
```

## 💡 Best Practices

1. **Use timestamps** - Zorg dat test data uniek is
2. **Test in isolation** - Geen dependencies tussen tests
3. **Clean up** - DELETE operaties testen voor cleanup
4. **Retry logic** - API kan traag zijn, use retry
5. **Mocking** - Voor unit tests, echte API voor E2E
6. **Error cases** - Test errors gelijk als happy paths

## 📞 Support

Voor vragen of issues:
1. Check test logs: `test-results/index.html`
2. Run in debug mode: `npm run test:npo:debug`
3. Check API documentation: https://tst.luister-cms.api.npox.nl/documentation
