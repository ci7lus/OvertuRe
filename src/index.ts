import { TopTracks, SpotifySearchResult, SpotifyToken } from "./types"

const properties = PropertiesService.getScriptProperties()

const CK = properties.getProperty("TWITTER_CK")
const CS = properties.getProperty("TWITTER_CS")
const AT = properties.getProperty("TWITTER_AT")
const ATS = properties.getProperty("TWITTER_ATS")
const PERIOD = properties.getProperty("LASTFM_PERIOD")
const API_KEY = properties.getProperty("LASTFM_API_KEY")
const USER = properties.getProperty("LASTFM_USER")
const SPOTIFY_CLIENT_ID = properties.getProperty("SPOTIFY_CLIENT_ID")
const SPOTIFY_CLIENT_SECRET = properties.getProperty("SPOTIFY_CLIENT_SECRET")
const SPOTIFY_MARKET = properties.getProperty("SPOTIFY_MARKET")

function setProfile() {
  if (!CS || !CK || !AT || !ATS) {
    throw Error("ENV REQUIRED: TWITTER_*")
  }
  if (!API_KEY || !USER) {
    throw Error("ENV REQUIRED: LASTFM_*")
  }

  const req = UrlFetchApp.fetch(
    `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${USER}&api_key=${API_KEY}&format=json&period=${PERIOD ||
      "1month"}`
  )

  const body: TopTracks = JSON.parse(req.getContentText())

  if (0 < body.toptracks.track.length) {
    const track = body.toptracks.track[0]
    let artist = track.artist.name
    let name = track.name
    let url = track.url
    if (SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_SECRET) {
      const tokenRequest = UrlFetchApp.fetch(
        "https://accounts.spotify.com/api/token",
        {
          method: "post",
          payload: {
            grant_type: "client_credentials",
          },
          headers: {
            Authorization: `Basic ${Utilities.base64Encode(
              `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
            )}`,
          },
          muteHttpExceptions: true,
        }
      )
      const token: SpotifyToken = JSON.parse(tokenRequest.getContentText())
      if (tokenRequest.getResponseCode() === 200) {
        const req = UrlFetchApp.fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(
            `${name} ${artist}`
          )}&type=track&limit=1&market=${SPOTIFY_MARKET || "JP"}`,
          {
            headers: {
              Authorization: `Bearer ${token.access_token}`,
            },
            muteHttpExceptions: true,
          }
        )
        if (req.getResponseCode() === 200) {
          const spotifyBody: SpotifySearchResult = JSON.parse(
            req.getContentText()
          )
          if (0 < spotifyBody.tracks.items.length) {
            const spotifyTrack = spotifyBody.tracks.items[0]
            name = spotifyTrack.name
            if (spotifyTrack.external_urls.spotify) {
              url = spotifyTrack.external_urls.spotify
            }
            if (0 < spotifyTrack.artists.length) {
              artist = spotifyTrack.artists
                .map(artist => artist.name)
                .join(", ")
            }
          }
        }
      }
    }
    const text = `${artist}の${name} ${url} #NowPlaying`
    Logger.log(text)

    const twitter = OAuth.createService("Twitter")
      .setAccessTokenUrl("https://api.twitter.com/oauth/access_token")
      .setRequestTokenUrl("https://api.twitter.com/oauth/request_token")
      .setAuthorizationUrl("https://api.twitter.com/oauth/authorize")
      .setConsumerKey(CK)
      .setConsumerSecret(CS)
      .setAccessToken(AT, ATS)

    twitter.fetch("https://api.twitter.com/1.1/account/update_profile.json", {
      method: "post",
      payload: {
        description: text,
      },
    })
  }
}
