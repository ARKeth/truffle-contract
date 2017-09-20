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

type MiddlewareHook = <T>(obs: ObservableTransactionResult<T>) => ObservableTransactionResult<T>;

export interface Middleware {
  postTransaction: MiddlewareHook;
}

export type TruffleContract<T> = T & {
  hookMiddleware(middleware: Middleware): void;
  allEvents: any;
  address: string;
  setProvider(provider: any): void;
  deployed(): Promise<TruffleContract<T>>;
};

// declare module 'rxjs/Observable' {
//   // tslint:disable-next-line:interface-name no-shadowed-variable
//   interface Observable<T> {
//     once<T, R>(
//       this: TransationResultEvent<T>,
//       type: 'tx',
//       fn: (x: T) => R
//     ): TransationConfirmationEvent<T> | Observable<R>;
//     on<T, R>(
//       this: TransationConfirmationEvent<T>,
//       type: 'confirmation',
//       fn: (x: T) => R
//     ): Observable<R>;
//   }
// }

export default function<T>(options: any): TruffleContract<T>;
