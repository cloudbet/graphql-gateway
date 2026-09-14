import { IAccountAPIDataSource } from './account';
import { IFeedAPIDataSource } from './feed';
import { ITradingAPIDataSource } from './trading';

export interface IDataSource {
  accountAPI: IAccountAPIDataSource;
  tradingAPI: ITradingAPIDataSource;
  feedAPI: IFeedAPIDataSource;
}
