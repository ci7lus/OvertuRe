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

| キー              | 意味                                                           |
| ----------------- | -------------------------------------------------------------- |
| TWITTER_CK        | Twitter の CK                                                  |
| TWITTER_CS        | Twitter の CS                                                  |
| TWITTER_AT        | AT                                                             |
| TWITTER_ATS       | ATS                                                            |
| LASTFM_API_KEY    | Last.fm の API キー                                            |
| LASTFM_USER       | Last.fm でのユーザー                                           |
| SPOTIFY_CLIENT_ID | Spotify の URL を設定したい場合は Spotify の　 ClientId (任意) |
| SPOTIFY_CLIENT_ID | (略) Spotify の ClientSecret (任意)                            |

## License

[MIT License](/LICENSE)
