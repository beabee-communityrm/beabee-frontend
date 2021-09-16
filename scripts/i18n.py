import csv, json, sys
from collections import defaultdict

r = csv.DictReader(sys.stdin)

def deepdefaultdict():
    return defaultdict(deepdefaultdict)

locales = [locale for locale in r.fieldnames if locale != 'key']

locale_strings = {locale: deepdefaultdict() for locale in locales}

for string in r:
    key_parts = string['key'].split('.')
    for locale in locales:
        locale_strings_part = locale_strings[locale]
        for part in key_parts[:-1]:
            locale_strings_part = locale_strings_part[part]
        locale_strings_part[key_parts[-1]] = string[locale]

for locale in locales:
    with open('./locales/{0}.json'.format(locale), 'w', encoding='utf8') as f:
        json.dump(locale_strings[locale], f, sort_keys=True, indent=2, ensure_ascii=False)
        f.write('\n');

