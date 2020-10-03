interface Debounced<R> {
  (...args): R

  bypass(...args): R
}

type Resource = { [key: string]: string | number | Date | boolean | Resource }

export interface ResourcesService {
  get(language: string): Promise<Resource>
  set(language: string, resource: Resource): Promise<any>
}

export interface ResourcesServiceObservable<T> extends ResourcesService<T> {
  status: {
    get: ObservableState<AsyncStatus>
    set: ObservableState<AsyncStatus>
  }
}

export interface LanguageService<T> {
  get(): Promise<T>
  set(language: string): Promise<any|T>
}

export interface LanguageServiceObservable<T> extends LanguageService<T> {
  status: {
    get: ObservableState<AsyncStatus>
    set: ObservableState<AsyncStatus>
  }
}

export interface Init<T> {
  (): Promise<T>
}

export interface I18nConfig {
  defaultLanguage: string
  debounceLanguageService?: number
  debounceResourcesService?: number
  languageService: LanguageService
  resourcesService: ResourcesService
}

export type ResolverTransformerInput = { path: string; template: string; status: AsyncStatus }

export interface ResolverTransformer {
  (arg: ResolverTransformerInput): string
}

interface Resolver {
  (path: string, transformer: ResolverTransformer): string
}

export interface I18nState {
  init: Promise<any>
  languageService: LanguageService
  language: ObservableState<string>
  resourcesService: ResourcesService
  resources: ObservableState<Resource>
  status: ObservableState<AsyncStatus>
  t: ObservableState<Resolver>
}

export interface Subscriber<T> {
  next(value: T): void
}

export interface Subscription {
  unsubscribe(): void
}

export interface Subject extends Subscriber<T> {
  private subscribers: Subscriber<T>[]
  subscribe(subscriber: Subscriber<T>): Subscription
}

export interface TransformerState<T> {
  (state: T): T
}

export interface ObservableState<T> {
  get: () => T,
  set: (transformer: TransformerState<T>) => void
  subscribe: (subscriber: Subscriber<T>) => Subscription
}

export interface FactoryObservableState<T> {
  create(initialValue: T): ObservableState<T>
}

export interface AsyncDebounceHooks {
  debounce: number
  onStart: Function
  onError: Function
  onSuccess: Function
}

enum AsyncStatus {
  Initial = 'Initial',
  Loading = 'Loading',
  Success = 'Success',
  Error = 'Error',
}

export interface ResolverConfig {
  defaultLanguage: string
  language: ObservableState<string>
  resources: ObservableState<Resource>
  status: ObservableState<AsyncStatus>
}
