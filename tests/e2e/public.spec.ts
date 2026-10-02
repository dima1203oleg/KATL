import { expect, test } from '@playwright/test';

test('localized home pages render useful server HTML', async ({ page }) => {
  for (const [path, lang, heading] of [
    ['/uk-UA', 'uk-UA', 'Енергія під контролем. Сильніша Україна.'],
    ['/en', 'en', 'Energy storage systems for real project needs'],
    ['/zh-CN', 'zh-CN', '面向实际项目需求的储能系统'],
  ]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
  }
});

test('root language selection follows country, then explicit preference', async ({ browser }) => {
  const ukContext = await browser.newContext({ extraHTTPHeaders: { 'cf-ipcountry': 'UA', 'accept-language': 'en-US,en;q=0.9' } });
  const ukPage = await ukContext.newPage();
  await ukPage.goto('/');
  await expect(ukPage).toHaveURL(/\/uk-UA$/);
  await ukContext.close();

  const chinaContext = await browser.newContext({ extraHTTPHeaders: { 'cf-ipcountry': 'CN', 'accept-language': 'en-US,en;q=0.9' } });
  const chinaPage = await chinaContext.newPage();
  await chinaPage.goto('/');
  await expect(chinaPage).toHaveURL(/\/zh-CN$/);
  await chinaContext.close();

  const preferenceContext = await browser.newContext({ extraHTTPHeaders: { 'cf-ipcountry': 'UA' } });
  await preferenceContext.addCookies([{ name: 'KATL_LOCALE', value: 'en', domain: '127.0.0.1', path: '/' }]);
  const preferencePage = await preferenceContext.newPage();
  await preferencePage.goto('/');
  await expect(preferencePage).toHaveURL(/\/en$/);
  await preferenceContext.close();
});

test('catalog and RFQ routes expose usable empty states and labelled inputs', async ({ page }) => {
  const catalog = await page.goto('/uk-UA/products');
  expect(catalog?.status()).toBe(200);
  await expect(page.getByRole('heading', { name: 'Системи накопичення енергії CATL' })).toBeVisible();

  const rfq = await page.goto('/uk-UA/rfq');
  expect(rfq?.status()).toBe(200);
  await expect(page.getByRole('heading', { name: 'Розкажіть про ваш об’єкт' })).toBeVisible();
  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByLabel(/компан/i)).toBeVisible();
});

test('RFQ form submits through the web API and confirms the persisted request', async ({ page }) => {
  await page.goto('/uk-UA/rfq?utm_source=playwright');
  await page.getByLabel(/компан/i).fill('Playwright QA Company');
  await page.getByRole('textbox', { name: /контактна особа/i }).fill('Automated QA');
  await page.getByLabel(/email/i).fill('playwright-qa@example.test');
  await page.getByLabel(/телефон/i).fill('+380000000001');
  await page.getByLabel(/обробку контактних даних/).check();
  await page.getByRole('button', { name: /Надіслати запит/ }).click();
  await expect(page.getByRole('heading', { name: 'Запит зареєстровано' })).toBeVisible();
  await expect(page.getByText(/RFQ-[0-9a-f-]{36}/i)).toBeVisible();
});

test('BESS calculation is saved and carried into RFQ without changing its inputs', async ({ page }) => {
  await page.goto('/uk-UA/engineering/bess-calculator');
  await page.getByLabel('Потужність навантаження, MW').fill('0.5');
  await page.getByLabel('Тривалість, години').fill('2');
  await page.getByLabel('Резерв енергії, %').fill('0');
  await page.getByLabel('PV потужність, MW (контекст)').fill('0');
  await page.getByRole('button', { name: /Розрахувати/ }).click();
  await expect(page.getByText('bess-energy-sizing-v2')).toBeVisible();
  const transfer = page.getByRole('link', { name: /Передати параметри в RFQ/ });
  await expect(transfer).toHaveAttribute('href', /calculationId=[0-9a-f-]{36}/i);
  await transfer.click();
  await expect(page.getByLabel('Потрібна потужність, kW')).toHaveValue('500');
  await expect(page.getByLabel('Потрібна енергія, kWh')).toHaveValue('1000');
  await page.getByLabel(/компанія/i).fill('Calculator Journey QA');
  await page.getByRole('textbox', { name: /контактна особа/i }).fill('Engineering QA');
  await page.getByLabel(/email/i).fill('calculator-journey@example.test');
  await page.getByLabel(/телефон/i).fill('+380000000004');
  await page.getByLabel(/обробку контактних даних/).check();
  await page.getByRole('button', { name: /Надіслати запит/ }).click();
  await expect(page.getByRole('heading', { name: 'Запит зареєстровано' })).toBeVisible();
});

test('mobile layout fits viewport and provides the primary RFQ action', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/uk-UA');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: /Отримати пропозицію/ }).first()).toBeVisible();
  const widths = await page.evaluate(() => {
    const viewport = document.documentElement.clientWidth;
    return {
      viewport,
      content: document.documentElement.scrollWidth,
      overflow: [...document.querySelectorAll('body *')]
        .map((element) => ({ element: element.tagName.toLowerCase(), className: typeof element.className === 'string' ? element.className : '', left: Math.round(element.getBoundingClientRect().left), right: Math.round(element.getBoundingClientRect().right), scrollWidth: element.scrollWidth, clientWidth: element.clientWidth }))
        .filter((element) => element.right > viewport + 1 || element.left < -1 || element.scrollWidth > element.clientWidth + 1)
        .slice(0, 12),
    };
  });
  expect(widths.content, JSON.stringify(widths.overflow)).toBeLessThanOrEqual(widths.viewport);
});

test('homepage has no horizontal overflow across phone, tablet, laptop and desktop widths', async ({ page }) => {
  await page.goto('/uk-UA');
  for (const [width, height] of [[320, 720], [375, 812], [390, 844], [430, 932], [768, 1024], [1024, 768], [1366, 768], [1920, 1080]] as const) {
    await page.setViewportSize({ width, height });
    const actual = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
    expect(actual.content, `${width}x${height}`).toBeLessThanOrEqual(actual.viewport);
  }
});

test('unknown pages return HTTP 404', async ({ page }) => {
  const response = await page.goto('/uk-UA/not-a-real-route');
  expect(response?.status()).toBe(404);
});

test('admin login opens the protected RFQ queue and records a status change', async ({ page }) => {
  const email = process.env.KATL_USER_EMAIL;
  const password = process.env.KATL_USER_PASSWORD;
  test.skip(!email || !password, 'Set ephemeral KATL_USER_EMAIL and KATL_USER_PASSWORD in the isolated test database.');

  await page.goto('/uk-UA/admin');
  const companyName = `KATL browser QA ${Date.now()} ${Math.random().toString(16).slice(2, 8)}`;
  const created = await page.request.post(new URL('/api/v1/rfq', page.url()).toString(), { data: {
    companyName,
    contactPerson: 'Automated Admin Acceptance',
    phone: '+380000000001',
    email: 'admin-acceptance@example.test',
    selectedSeries: 'CATL ESS test inquiry',
    useCase: 'Admin lifecycle acceptance',
    locale: 'uk-UA',
    utmSource: 'playwright-admin',
  } });
  expect(created.status()).toBe(201);
  await page.getByLabel('Email').fill(email!);
  await page.getByLabel('Пароль').fill(password!);
  await page.getByRole('button', { name: 'Увійти' }).click();
  await expect(page.getByRole('heading', { name: 'Огляд' })).toBeVisible();
  await page.getByRole('button', { name: 'Запити RFQ' }).click();
  const row = page.locator('tr').filter({ hasText: companyName });
  await expect(row).toBeVisible();
  const status = row.getByRole('combobox');
  await status.selectOption('QUALIFICATION');
  await expect(status).toHaveValue('QUALIFICATION');
  await expect(page.getByRole('status')).toContainText(/Статус запиту .* оновлено/);
  await page.getByRole('button', { name: 'PIM', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'PIM' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Нова картка продукту' })).toBeVisible();
  await expect(page.getByLabel('Категорія')).toBeVisible();
  await expect(page.getByText('Чернетка · не відображається публічно')).toBeVisible();

  const productId = `playwright-test-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
  await page.getByLabel('ID / slug').fill(productId);
  await page.getByLabel('Назва', { exact: true }).fill('Test only CATL ESS draft');
  await page.getByLabel('Сімейство').fill('TEST ONLY');
  await page.getByLabel('Категорія').selectOption('Utility-scale ESS');
  await page.getByLabel('Тип продукту').fill('TEST_ONLY');
  await page.getByLabel('Офіційне джерело CATL').fill(`https://www.catl.com/en/testing/${productId}`);
  await page.getByRole('button', { name: 'Створити чернетку' }).click();
  const draftRow = page.locator('tr').filter({ hasText: productId });
  await expect(draftRow).toBeVisible();
  await expect(draftRow.getByText('DRAFT', { exact: true })).toBeVisible();
  await expect(draftRow.getByRole('button', { name: /На перевірку/ })).toBeDisabled();
  await draftRow.getByRole('button', { name: /Історія ревізій/ }).click();
  await expect(page.locator('.pim-revision-history')).toContainText('CREATED');
  await draftRow.getByRole('button', { name: /Редагувати/ }).click();
  await expect(page.getByRole('heading', { name: 'Джерело для кожної характеристики' })).toBeVisible();
  await expect(page.getByText('Для цієї URL ще немає знімка.')).toBeVisible();
  await page.getByRole('button', { name: 'Скасувати' }).click();

  await page.getByRole('button', { name: 'CATL Sync' }).click();
  await expect(page.getByRole('heading', { name: 'Офіційні джерела CATL' })).toBeVisible();
  const source = page.locator('.sync-source').filter({ hasText: productId });
  await expect(source).toBeVisible();
  await expect(source.getByText('Ще не перевірено')).toBeVisible();

  await page.getByRole('button', { name: 'PIM', exact: true }).click();
  page.once('dialog', (dialog) => dialog.accept());
  await draftRow.getByRole('button', { name: 'Архів' }).click();
  await expect(draftRow.getByText('ARCHIVED')).toBeVisible();
  await page.getByRole('button', { name: 'CATL Sync' }).click();
  await expect(page.locator('.sync-source').filter({ hasText: productId }).locator('.sync-source-dot')).toHaveClass('sync-source-dot');

  await page.getByRole('button', { name: 'Вийти' }).click();
  await expect(page.getByRole('heading', { name: 'Вхід до адмінпанелі' })).toBeVisible();
});
