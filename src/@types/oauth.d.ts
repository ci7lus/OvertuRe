declare namespace GoogleAppsScript {
  interface OAuth {
    createService: (
      name: string
    ) => {
      setAccessTokenUrl: (
        s: string
      ) => {
        setRequestTokenUrl: (
          s: string
        ) => {
          setAuthorizationUrl: (
            s: string
          ) => {
            setConsumerKey: (
              s: string
            ) => {
              setConsumerSecret: (
                s: string
              ) => { setAccessToken: (at: string, ats: string) => OAuth }
            }
          }
        }
      }
    }
    fetch: (
      url: string,
      params?: { method: "get" | "post"; payload: any }
    ) => any
  }
}

declare var OAuth: GoogleAppsScript.OAuth
