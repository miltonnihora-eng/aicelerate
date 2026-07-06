import { test, expect, APIRequestContext } from '@playwright/test';

/**
 * NPOLCMS-222 – Uitgelicht Api Get
 * NPOLCMS-223 – Uitgelicht Api Post
 * NPOLCMS-224 – Uitgelicht Api Delete
 * NPOLCMS-225 – Uitgelicht Api Update
 * NPOLCMS-226 – Uitgelicht publish/depublish endpoint
 * NPOLCMS-221 – Uitgelicht Api collection get
 * NPOLCMS-199 – Uitgelicht entiteit aanmaken
 */

const BASE = '/api/uitgelicht';

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

test.describe('Uitgelicht API – Get (NPOLCMS-222)', () => {
  let request: APIRequestContext;

  test.beforeEach(async ({ playwright }) => {
    request = await makeRequestContext(playwright);
  });

  test.afterEach(async () => {
    await request.dispose();
  });

  test('GET /api/uitgelicht – geeft lijst van uitgelichte items terug', async () => {
    const response = await request.get(BASE);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body) || Object.prototype.hasOwnProperty.call(body, 'data')).toBeTruthy();
  });

  test('GET /api/uitgelicht/:id – haalt een enkel uitgelicht item op', async () => {
    // Eerst aanmaken
    const create = await request.post(BASE, {
      data: {
        title: 'Uitgelicht GET test',
        podcastSerieId: '1',
      },
    });
    expect(create.status()).toBe(201);
    const { id } = await create.json();

    const response = await request.get(`${BASE}/${id}`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(id);
  });

  test('GET /api/uitgelicht/:id – geeft 404 voor onbekend item', async () => {
    const response = await request.get(`${BASE}/99999999`);
    expect(response.status()).toBe(404);
  });
});

test.describe('Uitgelicht API – Post (NPOLCMS-223)', () => {
  let request: APIRequestContext;

  test.beforeEach(async ({ playwright }) => {
    request = await makeRequestContext(playwright);
  });

  test.afterEach(async () => {
    await request.dispose();
  });

  test('POST /api/uitgelicht – maakt een uitgelicht item aan', async () => {
    const response = await request.post(BASE, {
      data: {
        title: 'Nieuw uitgelicht item',
        podcastSerieId: '1',
      },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body.title).toBe('Nieuw uitgelicht item');
  });

  test('POST /api/uitgelicht – geeft 422 bij ontbrekende verplichte velden', async () => {
    const response = await request.post(BASE, {
      data: {},
    });
    expect([400, 422]).toContain(response.status());
  });
});

test.describe('Uitgelicht API – Update (NPOLCMS-225)', () => {
  let request: APIRequestContext;

  test.beforeEach(async ({ playwright }) => {
    request = await makeRequestContext(playwright);
  });

  test.afterEach(async () => {
    await request.dispose();
  });

  test('PUT /api/uitgelicht/:id – werkt een uitgelicht item bij', async () => {
    const create = await request.post(BASE, {
      data: { title: 'Origineel', podcastSerieId: '1' },
    });
    expect(create.status()).toBe(201);
    const { id } = await create.json();

    const response = await request.put(`${BASE}/${id}`, {
      data: { title: 'Bijgewerkt uitgelicht item' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.title).toBe('Bijgewerkt uitgelicht item');
  });

  test('PUT /api/uitgelicht/:id – geeft 404 voor onbekend item', async () => {
    const response = await request.put(`${BASE}/99999999`, {
      data: { title: 'Bestaat niet' },
    });
    expect(response.status()).toBe(404);
  });
});

test.describe('Uitgelicht API – Delete (NPOLCMS-224)', () => {
  let request: APIRequestContext;

  test.beforeEach(async ({ playwright }) => {
    request = await makeRequestContext(playwright);
  });

  test.afterEach(async () => {
    await request.dispose();
  });

  test('DELETE /api/uitgelicht/:id – verwijdert een uitgelicht item', async () => {
    const create = await request.post(BASE, {
      data: { title: 'Te verwijderen uitgelicht', podcastSerieId: '1' },
    });
    expect(create.status()).toBe(201);
    const { id } = await create.json();

    const deleteResponse = await request.delete(`${BASE}/${id}`);
    expect([200, 204]).toContain(deleteResponse.status());

    const getResponse = await request.get(`${BASE}/${id}`);
    expect(getResponse.status()).toBe(404);
  });

  test('DELETE /api/uitgelicht/:id – geeft 404 voor onbekend item', async () => {
    const response = await request.delete(`${BASE}/99999999`);
    expect(response.status()).toBe(404);
  });
});

test.describe('Uitgelicht publish/depublish (NPOLCMS-226)', () => {
  let request: APIRequestContext;

  test.beforeEach(async ({ playwright }) => {
    request = await makeRequestContext(playwright);
  });

  test.afterEach(async () => {
    await request.dispose();
  });

  test('POST /api/uitgelicht/:id/publish – publiceert een uitgelicht item', async () => {
    const create = await request.post(BASE, {
      data: { title: 'Publiceer uitgelicht', podcastSerieId: '1' },
    });
    expect(create.status()).toBe(201);
    const { id } = await create.json();

    const response = await request.post(`${BASE}/${id}/publish`);
    expect([200, 204]).toContain(response.status());
  });

  test('POST /api/uitgelicht/:id/unpublish – depubliceert een uitgelicht item', async () => {
    const create = await request.post(BASE, {
      data: { title: 'Depubliceer uitgelicht', podcastSerieId: '1' },
    });
    expect(create.status()).toBe(201);
    const { id } = await create.json();

    await request.post(`${BASE}/${id}/publish`);

    const response = await request.post(`${BASE}/${id}/unpublish`);
    expect([200, 204]).toContain(response.status());
  });

  test('Gepubliceerd item heeft status "published" in response', async () => {
    const create = await request.post(BASE, {
      data: { title: 'Status check uitgelicht', podcastSerieId: '1' },
    });
    expect(create.status()).toBe(201);
    const { id } = await create.json();

    await request.post(`${BASE}/${id}/publish`);

    const get = await request.get(`${BASE}/${id}`);
    expect(get.status()).toBe(200);
    const body = await get.json();
    expect(body.status).toBe('published');
  });
});

test.describe('Uitgelicht API – Collection get (NPOLCMS-221)', () => {
  let request: APIRequestContext;

  test.beforeEach(async ({ playwright }) => {
    request = await makeRequestContext(playwright);
  });

  test.afterEach(async () => {
    await request.dispose();
  });

  test('GET /api/uitgelicht/collection – haalt uitgelichte items per collectie op', async () => {
    const response = await request.get(`${BASE}/collection`);
    expect([200, 404]).toContain(response.status());
    if (response.status() === 200) {
      const body = await response.json();
      expect(Array.isArray(body) || Object.prototype.hasOwnProperty.call(body, 'data')).toBeTruthy();
    }
  });

  test('GET /api/collections/:id/uitgelicht – haalt uitgelicht item voor specifieke collectie op', async () => {
    const response = await request.get('/api/collections/1/uitgelicht');
    expect([200, 404]).toContain(response.status());
  });
});
