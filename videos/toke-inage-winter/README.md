# 土気と稲毛海岸：冬の朝の気温はなぜ違う？（59秒の解説動画）

| ファイル | 中身 |
|---|---|
| `toke_inage_winter_morning.mp4` | 完成動画（1920×1080・16:9／30fps／59.0秒／字幕焼き込み／音声なし） |
| `narration_script.md` | ナレーション原稿（時間・画面の説明・読み方・使ったデータ・出典） |
| `subtitles.srt` | 字幕ファイル（動画の字幕と同じ内容・同じタイミング） |
| `src/animation.html` | アニメーション本体（Canvas。`drawFrame(t)` で t 秒のコマを描く） |
| `src/render.js` | 全コマを書き出して MP4 にするスクリプト |
| `src/stills.js` | 確認用に指定秒の静止画を書き出すスクリプト |

## 作り直し方

Playwright（Chromium）・ffmpeg・Noto Sans CJK JP フォントが必要です。

```bash
cd src
node render.js ../toke_inage_winter_morning.mp4            # 字幕あり
node render.js ../toke_inage_winter_morning_nosubs.mp4 --nosubs  # 字幕なし
node stills.js /path/to/outdir 4.5 12.5 50.5               # 静止画の確認
```

字幕の文言とタイミングは `src/animation.html` の `SUBS` にあります。変えた場合は `subtitles.srt` と `narration_script.md` も合わせて直してください。
