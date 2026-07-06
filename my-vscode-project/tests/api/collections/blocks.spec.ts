import { test, expect, APIRequestContext } from '@playwright/test';

/**
 * NPOLCMS-51  – BACKEND | Blok CRUD-endpoints
 * NPOLCMS-50  – BACKEND | Pagina blokken endpoint
 * NPOLCMS-85  – BACKEND | Collectie en blok koppeling/ontkoppeling
 * NPOLCMS-192 – BACKEND | Endpoints om een blok te kunnen publiceren/depubliceren
 * NPOLCMS-231 – Placeholder-blok
 * NPOLCMS-232 – Collection-blok
 * NPOLCMS-233 – Info-blok
 * NPOLCMS-234 – Hero-blok
 */

const BASE = '/api/blocks';

test.describe('Blok CRUD-endpoints (NPOLCMS-51)', () => {
  let request: APIRequestContext;
  let createdBlockId: number;

  test.beforeEach(async ({ playwright }) => {
    request = await playwright.request.newContext({
      baseURL: process.env.API_BASE_URL ?? 'http://localhost:8000',
      extraHTTPHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(process.env.API_TOKEN
          ? { Authorization: `Bearer ${process.env.API_TOKEN}` }
          : {}),
      },
    });
  });

  test.afterEach(async () => {
    await request.dispose();
  });

  test('GET /api/blocks – geeft een lijst van blokken terug', async () => {
    const response = await request.get(BASE);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body) || typeof body === 'object').toBeTruthy();
  });

  test('POST /api/blocks – maakt een collection-blok aan (NPOLCMS-232)', async () => {
    const response = await request.post(BASE, {
      data: {
        type: 'collection',
        title: 'Test Collection Blok',
      },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body.type).toBe('collection');
    createdBlockId = body.id;
  });

  test('POST /api/blocks – maakt een placeholder-blok aan (NPOLCMS-231)', async () => {
    const response = await request.post(BASE, {
      data: {
        type: 'placeholder',
        title: 'Test Placeholder Blok',
      },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body.type).toBe('placeholder');
  });

  test('POST /api/blocks – maakt een info-blok aan (NPOLCMS-233)', async () => {
    const response = await request.post(BASE, {
      data: {
        type: 'info',
        title: 'Test Info Blok',
      },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body.type).toBe('info');
  });

  test('POST /api/blocks – maakt een hero-blok aan (NPOLCMS-234)', async () => {
    const response = await request.post(BASE, {
      data: {
        type: 'hero',
        title: 'Test Hero Blok',
      },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body.type).toBe('hero');
  });

  test('GET /api/blocks/:id – haalt een enkel blok op', async () => {
    // Eerst aanmaken
    const create = await request.post(BASE, {
      data: { type: 'collection', title: 'Blok voor GET test' },
    });
    expect(create.status()).toBe(201);
    const { id } = await create.json();

    const response = await request.get(`${BASE}/${id}`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(id);
  });

  test('PUT /api/blocks/:id – werkt een blok bij', async () => {
    const create = await request.post(BASE, {
      data: { type: 'info', title: 'Originele titel' },
    });
    expect(create.status()).toBe(201);
    const { id } = await create.json();

    const response = await request.put(`${BASE}/${id}`, {
      data: { title: 'Bijgewerkte titel' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.title).toBe('Bijgewerkte titel');
  });

  test('DELETE /api/blocks/:id – verwijdert een blok', async () => {
    const create = await request.post(BASE, {
      data: { type: 'placeholder', title: 'Te verwijderen blok' },
    });
    expect(create.status()).toBe(201);
    const { id } = await create.json();

    const deleteResponse = await request.delete(`${BASE}/${id}`);
    expect(deleteResponse.status()).toBe(204);

    const getResponse = await request.get(`${BASE}/${id}`);
    expect(getResponse.status()).toBe(404);
  });
});

test.describe('Pagina blokken endpoint (NPOLCMS-50)', () => {
  let request: APIRequestContext;

  test.beforeEach(async ({ playwright }) => {
    request = await playwright.request.newContext({
      baseURL: process.env.API_BASE_URL ?? 'http://localhost:8000',
      extraHTTPHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(process.env.API_TOKEN
          ? { Authorization: `Bearer ${process.env.API_TOKEN}` }
          : {}),
      },
    });
  });

  test.afterEach(async () => {
    await request.dispose();
  });

  test('GET /api/pages/:pageId/blocks – haalt blokken van een pagina op', async () => {
    const response = await request.get('/api/pages/1/blocks');
    expect([200, 404]).toContain(response.status());
  });
});

test.describe('Collectie en blok koppeling/ontkoppeling (NPOLCMS-85)', () => {
  let request: APIRequestContext;

  test.beforeEach(async ({ playwright }) => {
    request = await playwright.request.newContext({
      baseURL: process.env.API_BASE_URL ?? 'http://localhost:8000',
      extraHTTPHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(process.env.API_TOKEN
          ? { Authorization: `Bearer ${process.env.API_TOKEN}` }
          : {}),
      },
    });
  });

  test.afterEach(async () => {
    await request.dispose();
  });

  test('POST /api/blocks/:id/collection – koppelt een collectie aan een blok', async () => {
    // Blok aanmaken
    const block = await request.post(BASE, {
      data: { type: 'collection', title: 'Koppeltest blok' },
    });
    expect(block.status()).toBe(201);
    const { id: blockId } = await block.json();

    // Collectie aanmaken
    const collection = await request.post('/api/collections', {
      data: { name: 'Koppeltest collectie' },
    });
    expect(collection.status()).toBe(201);
    const { id: collectionId } = await collection.json();

    // Koppelen
    const link = await request.post(`${BASE}/${blockId}/collection`, {
      data: { collectionId },
    });
    expect([200, 201]).toContain(link.status());
  });

  test('DELETE /api/blocks/:id/collection – ontkoppelt een collectie van een blok', async () => {
    // Blok + collectie aanmaken en koppelen
    const block = await request.post(BASE, {
      data: { type: 'collection', title: 'Ontkoppeltest blok' },
    });
    expect(block.status()).toBe(201);
    const { id: blockId } = await block.json();

    const collection = await request.post('/api/collections', {
      data: { name: 'Ontkoppeltest collectie' },
    });
    expect(collection.status()).toBe(201);
    const { id: collectionId } = await collection.json();

    await request.post(`${BASE}/${blockId}/collection`, {
      data: { collectionId },
    });

    // Ontkoppelen
    const unlink = await request.delete(`${BASE}/${blockId}/collection`);
    expect([200, 204]).toContain(unlink.status());
  });
});

test.describe('Blok publiceren/depubliceren (NPOLCMS-192)', () => {
  let request: APIRequestContext;

  test.beforeEach(async ({ playwright }) => {
    request = await playwright.request.newContext({
      baseURL: process.env.API_BASE_URL ?? 'http://localhost:8000',
      extraHTTPHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(process.env.API_TOKEN
          ? { Authorization: `Bearer ${process.env.API_TOKEN}` }
          : {}),
      },
    });
  });

  test.afterEach(async () => {
    await request.dispose();
  });

  test('POST /api/blocks/:id/publish – publiceert een blok', async () => {
    const create = await request.post(BASE, {
      data: { type: 'hero', title: 'Publiceer blok' },
    });
    expect(create.status()).toBe(201);
    const { id } = await create.json();

    const response = await request.post(`${BASE}/${id}/publish`);
    expect([200, 204]).toContain(response.status());
  });

  test('POST /api/blocks/:id/unpublish – depubliceert een blok', async () => {
    const create = await request.post(BASE, {
      data: { type: 'hero', title: 'Depubliceer blok' },
    });
    expect(create.status()).toBe(201);
    const { id } = await create.json();

    await request.post(`${BASE}/${id}/publish`);

    const response = await request.post(`${BASE}/${id}/unpublish`);
    expect([200, 204]).toContain(response.status());
  });
});
