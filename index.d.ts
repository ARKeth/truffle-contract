import { Observable } from 'rxjs/Observable';

export interface TransationHashEvent {
  type: 'tx';
  value: string;
}
export interface TransactionConfirmation<T> {
  logs: T[];
  receipt: any;
  tx: string;
}
export interface TransationConfirmationEvent<T> {
  type: 'confirmation';
  value: TransactionConfirmation<T>;
}
export type TransationResultEvent<T> =
  | TransationHashEvent
  | TransationConfirmationEvent<T>;

export type ObservableTransactionResult<T> = Observable<
  TransationResultEvent<T>
>;

type MiddlewareHook = <T>(
  obs: ObservableTransactionResult<T>
) => ObservableTransactionResult<T>;

export interface Middleware {
  postTransaction: MiddlewareHook;
}

interface ContractDefaults {
  from?: string;
  gas?: string;
  gasPrice?: string;
  value?: string;
}

interface TransactionOptions {}

interface InputDefinition {
  indexed: boolean;
  name: string;
  type: string;
}

interface EventDefintion {
  anonymous: boolean;
  inputs: InputDefinition[];
  name: string;
  type: 'event';
}

interface NetworkDefinition {
  address: string;
  events: { [topic: string]: EventDefintion };
  links: {};
  updated_at: number;
}

export type ContractInstance<T> = T & {
  allEvents: any;
  address: string;
  abi: any[];
  contract: any;
  send(value: string): void;
  sendTransaction(options: {}): void;
  transactionHash: string | null;
  constructor: TruffleContract<T>;
};

export type TruffleContract<T> = {
  abi: any[];
  addProp(): void;
  at(address: string): Promise<ContractInstance<T>>;
  new (...args: any[]): void;
  setProvider(provider: any): void;
  hookMiddleware(middleware: Middleware): void;
  deployed(): Promise<ContractInstance<T>>;
  link(contract: TruffleContract<any>): void;
  link(name: string, address: string): void;
  networks: NetworkDefinition[];
  network: NetworkDefinition;
  setNetwork(networkId: string): void;
  hasNetwork(networkId: string): boolean;
  defaults(defaults: ContractDefaults): void;
  clone(networkId: string): TruffleContract<T>;
};

declare module 'rxjs/Observable' {
  // tslint:disable-next-line:interface-name no-shadowed-variable
  interface Observable<T> {
    once(this: Observable<any>, type: "tx", fn: Function): Observable<T>
    on(this: Observable<any>, type: "confirmation", fn: Function): Observable<T>
  }
}

export default function<T>(definition: any): TruffleContract<T>;
