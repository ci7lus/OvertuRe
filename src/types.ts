export type TopTracks = {
  toptracks: {
    "@attr": {
      page: string
      perPage: string
      user: string
      total: string
      totalPages: string
    }
    track: {
      "@attr": { rank: string }
      duration: string
      playcount: string
      artist: {
        url: string
        name: string
        mbid: string
      }
      image: {
        size: "small" | "medium" | "large" | "extralarge"
        "#text": string
      }[]
      streamable: {
        fulltrack: string
        "#text": string
      }
      mbid: string
      name: string
      url: string
    }[]
  }
}

export type SpotifyToken = {
  access_token: string
  token_type: "bearer"
  expires_in: number
}

export type SpotifySearchResult = {
  tracks: {
    href: string
    items: {
      album: any
      artists: {
        external_urls: { spotify: string }
        href: string
        id: string
        name: string
        type: "artist"
        uri: string
      }[]
      disc_number: number
      duration_ms: number
      explicit: boolean
      external_urls: { spotify: string }
      id: string
      name: string
      type: "track"
      uri: string
    }[]
  }
}
