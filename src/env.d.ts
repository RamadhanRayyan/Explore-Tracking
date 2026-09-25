/// <reference types="vite/client" />
import type {} from 'pinia';

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    persist?: any;
  }
}
