import { generalContent } from '../store';

import axios from 'axios';

interface GeocodeResults {
  results: GeocodeResult[];
  status: string;
}

interface GeocodeResult {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  address_components: {
    long_name: string;
    short_name: string;
    types: string[];
  }[];
}

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<GeocodeResult | undefined> {
  const { data } = await axios.get<GeocodeResults>(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=${generalContent.value.locale}&key=AIzaSyBSZoL-j_xJ2DzEzzd1Tu2a1jt9KcSaozM&result_type=street_address|postal_code`,
    { withCredentials: false }
  );

  return data.results[0];
}
