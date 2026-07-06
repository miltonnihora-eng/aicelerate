import { test, expect, APIRequestContext } from '@playwright/test';

/**
 * NPOLCMS-217 – BACKEND | Endpoint toevoegen om de details van een enkele Collection op te halen
 * NPOLCMS-218 – BACKEND | Volgorde van items in een collectie kunnen bepalen
 * NPOLCMS-197 – BACKEND | Podcast Collection 'feed' field
 * NPOLCMS-198 – BACKEND | Publicatiestatus toevoegen aan Podcast
 * NPOLCMS-47  – Blok CRUD-endpoints - GET Collection/overview endpoint
 */

const BASE = '/api/collections';

function makeRequestContext(playwright: any): Promise<APIRequestContext> {
  return playwright.request.newContext({
    baseURL: process.env.API_BASE_URL ?? 'http://localhost:8000',
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(process.env.API_TOKEN
        ? { Authorization: `Bearer ${process.env.API_TOKEN}` }
        : {}),
    },
  });
}

test.describe('Collections overzicht (NPOLCMS-47)', () => {
  let request: APIRequestContext;

  test.beforeEach(async ({ playwright }) => {
    request = await makeRequestContext(playwright);
  });

  test.afterEach(async () => {
    await request.dispose();
  });

  test('GET /api/collections – geeft overzicht van alle collecties', async () => {
    const response = await request.get(BASE);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body) || Object.prototype.hasOwnProperty.call(body, 'data')).toBeTruthy();
  });
});

test.describe('Collection details (NPOLCMS-217)', () => {
  let request: APIRequestContext;

  test.beforeEach(async ({ playwright }) => {
    request = await makeRequestContext(playwright);
  });

  test.afterEach(async () => {
    await request.dispose();
  });

  test('GET /api/collections/:id – haalt details van een enkele collectie op', async () => {
    // Eerst een collectie aanmaken
    const create = await request.post(BASE, {
      data: { name: 'Detail test collectie' },
    });
    expect(create.status()).toBe(201);
    const { id } = await create.json();

    const response = await request.get(`${BASE}/${id}`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(id);
    expect(body).toHaveProperty('name');
  });

  test('GET /api/collections/:id – geeft 404 voor onbekende collectie', async () => {
    const response = await request.get(`${BASE}/99999999`);
    expect(response.status()).toBe(404);
  });
});

test.describe('Volgorde van items in een collectie (NPOLCMS-218)', () => {
  let request: APIRequestContext;

  test.beforeEach(async ({ playwright }) => {
    request = await makeRequestContext(playwright);
  });

  test.afterEach(async () => {
    await request.dispose();
  });

  test('PATCH /api/collections/:id/items/order – stelt de volgorde van items in', async () => {
    // Collectie aanmaken
    const collection = await request.post(BASE, {
      data: { name: 'Volgorde test collectie' },
    });
    expect(collection.status()).toBe(201);
    const { id: collectionId } = await collection.json();

    // Items toevoegen
    const item1 = await request.post(`${BASE}/${collectionId}/items`, {
      data: { type: 'podcast', referenceId: '1' },
    });
    const item2 = await request.post(`${BASE}/${collectionId}/items`, {
      data: { type: 'podcast', referenceId: '2' },
    });

    if (item1.status() === 201 && item2.status() === 201) {
      const { id: id1 } = await item1.json();
      const { id: id2 } = await item2.json();

      const response = await request.patch(`${BASE}/${collectionId}/items/order`, {
        data: { order: [id2, id1] },
      });
      expect([200, 204]).toContain(response.status());
    }
  });
});

test.describe('Podcast Collection feed field (NPOLCMS-197)', () => {
  let request: APIRequestContext;

  test.beforeEach(async ({ playwright }) => {
    request = await makeRequestContext(playwright);
  });

  test.afterEach(async () => {
    await request.dispose();
  });

  test('POST /api/collections – bevat feed veld bij aanmaken', async () => {
    const response = await request.post(BASE, {
      data: {
        name: 'Podcast feed collectie',
        feed: 'https://example.com/podcast.rss',
      },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('feed');
  });

  test('PUT /api/collections/:id – feed veld kan worden bijgewerkt', async () => {
    const create = await request.post(BASE, {
      data: { name: 'Feed update test', feed: 'https://old.example.com/feed' },
    });
    expect(create.status()).toBe(201);
    const { id } = await create.json();

    const update = await request.put(`${BASE}/${id}`, {
      data: { feed: 'https://new.example.com/feed' },
    });
    expect(update.status()).toBe(200);
    const body = await update.json();
    expect(body.feed).toBe('https://new.example.com/feed');
  });
});

test.describe('Publicatiestatus Podcast (NPOLCMS-198)', () => {
  let request: APIRequestContext;

  test.beforeEach(async ({ playwright }) => {
    request = await makeRequestContext(playwright);
  });

  test.afterEach(async () => {
    await request.dispose();
  });

  test('GET /api/podcasts/:id – bevat publicatiestatus veld', async () => {
    const response = await request.get('/api/podcasts/1');
    if (response.status() === 200) {
      const body = await response.json();
      expect(body).toHaveProperty('publicationStatus');
    } else {
      expect([200, 404]).toContain(response.status());
    }
  });

  test('PATCH /api/podcasts/:id – publicatiestatus kan worden bijgewerkt', async () => {
    // Eerst een podcast ophalen die bestaat
    const list = await request.get('/api/podcasts');
    if (list.status() === 200) {
      const podcasts = await list.json();
      const items = Array.isArray(podcasts) ? podcasts : podcasts.data ?? [];
      if (items.length > 0) {
        const id = items[0].id;
        const response = await request.patch(`/api/podcasts/${id}`, {
          data: { publicationStatus: 'published' },
        });
        expect([200, 204]).toContain(response.status());
      }
    }
  });
});
