export default class BeabeeAddress {
  static get name() {
    return 'beabee';
  }

  static get displayName() {
    return 'Beabee';
  }

  get queryProperty() {
    return 'q';
  }

  getDisplayValue(address: any) {
    return address ? `${address.street}, ${address.city}` : '';
  }

  getRequestUrl() {
    return 'https://api.beabee.fr/addresses';
  }
}
