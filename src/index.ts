import { TopTracks, SpotifySearchResult } from "./types"

const properties = PropertiesService.getScriptProperties()

const CK = properties.getProperty("TWITTER_CK")
const CS = properties.getProperty("TWITTER_CS")
const AT = properties.getProperty("TWITTER_AT")
const ATS = properties.getProperty("TWITTER_ATS")
const LASTFM_API_KEY = properties.getProperty("LASTFM_API_KEY")
const LASTFM_USER = properties.getProperty("LASTFM_USER")
const SPOTIFY_API_KEY = properties.getProperty("SPOTIFY_API_KEY")

function setProfile() {
  if (!CS || !CK || !AT || !ATS) {
    throw Error("ENV REQUIRED: TWITTER_*")
  }
  if (!LASTFM_API_KEY || !LASTFM_USER) {
    throw Error("ENV REQUIRED: LASTFM_*")
  }

  const req = UrlFetchApp.fetch(
    `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${LASTFM_USER}&api_key=${LASTFM_API_KEY}&format=json&period=7day`
  )
  if (req.getResponseCode() !== 200) {
    throw new Error("last.fm API may be down.")
  }

  const body: TopTracks = JSON.parse(req.getContentText())

  if (0 < body.toptracks.track.length) {
    const track = body.toptracks.track[0]
    let artist = track.artist.name
    let name = track.name
    let url = track.url
    if (SPOTIFY_API_KEY) {
      const spotifyReq = UrlFetchApp.fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          `${name} ${artist}`
        )}&type=track&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${SPOTIFY_API_KEY}`,
          },
          muteHttpExceptions: true,
        }
      )
      if (spotifyReq.getResponseCode() === 200) {
        const spotifyBody: SpotifySearchResult = JSON.parse(
          spotifyReq.getContentText()
        )
        if (0 < spotifyBody.tracks.items.length) {
          const spotifyTrack = spotifyBody.tracks.items[0]
          name = spotifyTrack.name
          if (spotifyTrack.external_urls.spotify) {
            url = spotifyTrack.external_urls.spotify
          }
          if (0 < spotifyTrack.artists.length) {
            artist = spotifyTrack.artists[0].name
          }
        }
      } else {
        Logger.log(`Spotify: ${spotifyReq.getContentText()}`)
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
