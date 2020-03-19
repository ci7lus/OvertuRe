# OvertuRe

Last.fm アカウントから直近 7 日間のトップトラックを取得し、Twitter プロフィールに設定するスクリプト。GAS で動く。

## デプロイ

```bash
$ git clone <this repo>
$ cd OvertuRe
$ cp sample.clasp.json .clasp.json
# .clasp.json を書き換える
$ clasp push
```

## プロパティ

| キー              | 意味                                                                                     |
| ----------------- | ---------------------------------------------------------------------------------------- |
| TWITTER_CK        | Twitter の CK                                                                            |
| TWITTER_CS        | Twitter の CS                                                                            |
| TWITTER_AT        | AT                                                                                       |
| TWITTER_ATS       | ATS                                                                                      |
| LASTFM_API_KEY    | Last.fm の API キー                                                                      |
| LASTFM_USER       | Last.fm でのユーザー                                                                     |
| LASTFM_PERIOD     | Last.fm の期間指定（任意、デフォルト 1month、overall/7day/1month/3month/6month/12month） |
| SPOTIFY_CLIENT_ID | Spotify の URL を設定したい場合は Spotify の　 ClientId (任意)                           |
| SPOTIFY_CLIENT_ID | (略) Spotify の ClientSecret (任意)                                                      |
| SPOTIFY_MARKET    | マーケット（任意、デフォルト JP）                                                        |

## License

[MIT License](/LICENSE)
