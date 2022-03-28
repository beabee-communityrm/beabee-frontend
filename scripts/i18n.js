/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const MarkdownIt = require('markdown-it');

const simpleMd = new MarkdownIt('zero').enable(['emphasis']);

const optHandlers = {
  md: (data) => simpleMd.render(data),
};

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '.credentials.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

(async () => {
  const resp = await sheets.spreadsheets.values.get({
    spreadsheetId: '1l35DW5OMi-xM8HXek5Q1jOxsXScINqqpEvPWDlpBPX8',
    range: 'Sheet1',
  });

  const headers = resp.data.values[0];
  const rows = resp.data.values
    .slice(1)
    .map((row) =>
      Object.fromEntries(headers.map((header, i) => [header, row[i]]))
    )
    .filter((row) => row.key)
    // Sort by key for predictable output
    .sort((a, b) => (a.key < b.key ? -1 : 1));

  const locales = headers.filter((h) => h !== 'key');
  const localeData = Object.fromEntries(locales.map((locale) => [locale, {}]));

  // Construct nested objects from a.b.c key paths
  for (const row of rows) {
    const keyParts = row.key.split('.');
    const [lastKeyPart, ...keyOpts] = keyParts.pop().split(':');

    for (const locale of locales) {
      let localeDataPart = localeData[locale];
      for (const part of keyParts) {
        if (!localeDataPart[part]) {
          localeDataPart[part] = {};
        }
        localeDataPart = localeDataPart[part];
      }
      localeDataPart[lastKeyPart] = keyOpts.reduce(
        (data, opt) => optHandlers[opt](data),
        row[locale] || ''
      );
    }
  }

  for (const locale of locales) {
    console.log('Updating ' + locale);
    fs.writeFileSync(
      path.join(__dirname, '../locales', locale + '.json'),
      JSON.stringify(localeData[locale], null, 2) + '\n'
    );
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
