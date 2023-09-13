import { geocoding } from '../lib/maptiler';
import { generalContent } from '../store';

interface GeocodeResult {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  features: {
    text: string;
    types: string[];
  }[];
}

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<GeocodeResult | undefined> {
  const data = await geocoding.reverse([lng, lat], {
    language: generalContent.value.locale,
    types: ['address', 'postal_code', 'municipality', 'county'],
  });

  if (!data.features.length) {
    return undefined;
  }

  const mainFeature = data.features[0];

  const result: GeocodeResult = {
    formatted_address: mainFeature.place_name,
    geometry: {
      location: {
        lat: mainFeature.center[1],
        lng: mainFeature.center[0],
      },
    },
    features: data.features.map((feature) => ({
      text: feature.text,
      types: feature.place_type,
    })),
  };

  const addressFeature = data.features.find((f) =>
    f.place_type.includes('address')
  );

  // Add street address number if available as a separate feature for formatting
  if (addressFeature && addressFeature.address) {
    result.features.push({
      text: addressFeature.address,
      types: ['street_number'],
    });
  }

  return result;
}

export function formatGeocodeResult(
  result: GeocodeResult,
  pattern: string
): string {
  return pattern.replace(/{([\w|]+)}/g, (_m, keys) => {
    for (const key of keys.split('|')) {
      const text = result.features.find((a) => a.types.includes(key))?.text;
      if (text) {
        return text;
      }
    }
    return '???';
  });
}
