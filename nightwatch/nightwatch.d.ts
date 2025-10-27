declare module 'nightwatch' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface NightwatchCustomAssertions {
    // Add your custom assertions' types here
    // elementHasCount: (selector: string, count: number) => NightwatchBrowser
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface NightwatchCustomCommands {
    // Add your custom commands' types here
    // strictClick: (selector: string) => NightwatchBrowser
  }
}
