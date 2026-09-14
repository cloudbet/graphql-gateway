import { AugmentedRequest, RESTDataSource } from '@apollo/datasource-rest';

export interface AccountCurrenciesResponse {
  currencies: string[];
}

export interface AccountBalanceResponse {
  amount: string;
}

export interface AccountInfoResponse {
  email: string;
  nickname: string;
  uuid: string;
}

export interface IAccountAPIDataSource {
  getAvailableCurrencies: () => Promise<AccountCurrenciesResponse>;
  getAccountBalance: (currency: string) => Promise<AccountBalanceResponse>;
  getAccountInfo: () => Promise<AccountInfoResponse>;
}

export class AccountAPI
  extends RESTDataSource
  implements IAccountAPIDataSource
{
  private headersToProxy: Map<string, string>;

  constructor(options: {
    baseURL: string;
    headersToProxy: Map<string, string>;
  }) {
    super();

    this.baseURL = options.baseURL;
    this.headersToProxy = options.headersToProxy;
  }

  override willSendRequest(_path: string, request: AugmentedRequest) {
    // we don't need pass everything for feed, just proxy the x-api-key. via cloudflare
    const apiKey = 'x-api-key';
    const value = this.headersToProxy?.get(apiKey);
    if (value) {
      request.headers[apiKey] = value;
    }
  }

  async getAvailableCurrencies(): Promise<AccountCurrenciesResponse> {
    return this.get('/v2-pub/v1/account/currencies');
  }

  async getAccountBalance(currency: string): Promise<AccountBalanceResponse> {
    return this.get(
      `/v2-pub/v1/account/currencies/${encodeURIComponent(currency)}/balance`,
    );
  }

  async getAccountInfo(): Promise<AccountInfoResponse> {
    return this.get('/v2-pub/v1/account/info');
  }
}
