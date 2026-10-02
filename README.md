# 記帳苦手 · Lazy Ledger

給不愛記帳的人：**輸入金額 →（想寫再寫品項）→ 點一下類別，就記好了。**

- 8 個類別：食、衣、住、行（交通）、育樂、醫療、投資、其他
- 依手機時區自動判斷幣別：荷蘭 → €、英國 → £、台灣 → NT$（點幣別可臨時切換）
- 每筆都存原始金額和當下匯率，月總計用歐元顯示（設定裡可改）
- 可以寫「買了什麼」（不寫也行）；每一筆都能點開編輯金額、幣別、品項、類別、時間
- 帳本裡的「區間・報帳」：自選日期和類別看花費；每週自動挑「1 歐元換到最多台幣」的那天匯率，算出台幣報帳金額，可匯出 CSV
- 連續記帳天數、記錯可以馬上「復原」
- 沒網路也能用；資料只存在手機裡

## 檔案說明

| 檔案 | 用途 |
|---|---|
| `index.html` | 整個 App（畫面、樣式、程式都在這） |
| `art.js` | 法式手繪插畫（8 個類別 + 金幣），想改圖案就改這裡 |
| `fonts/` | 英文和數字用的 Cormorant Garamond 字型（SIL 開放字型授權） |
| `manifest.json` | 讓 iPhone 把它當成 App：名稱、圖示 |
| `sw.js` | 離線快取 |
| `icons/` | App 圖示 |

## 在電腦上試用

在 PyCharm 打開這個資料夾，到下方的 Terminal 輸入：

```bash
python3 -m http.server 8000
```

再用瀏覽器打開 http://localhost:8000 。電腦鍵盤可以直接輸入數字。

## 放到網路上，裝到 iPhone（免費，做一次就好）

iPhone 只能從 https 網址把網頁「加入主畫面」，所以要先放到網路上。最簡單的是 GitHub Pages：

1. 到 https://github.com 註冊帳號（免費）
2. 右上角 **+ → New repository**，名稱填 `lazy-ledger`，選 **Public**，按 **Create repository**
3. 在新頁面點 **uploading an existing file**，把這個資料夾裡的所有檔案（含 `icons` 資料夾）拖進去，按 **Commit changes**
4. 到 repository 的 **Settings → Pages**，Source 選 **Deploy from a branch**，Branch 選 `main`、資料夾 `/ (root)`，按 **Save**
5. 等 1～2 分鐘，網址會是 `https://你的帳號.github.io/lazy-ledger/`
6. 用 **iPhone 的 Safari** 打開這個網址 → 點下方 **分享** → **加入主畫面**

之後就從主畫面的「記帳苦手」圖示打開。

> 放在網路上的只有 App 本身，**妳的記帳資料不會上傳**，只存在手機裡。

## 之後要改版時

1. 改好檔案
2. 把 `sw.js` 開頭的 `VERSION`（目前是 `'v7'`）改成 `'v8'`（每次都加 1），手機才會抓到新版
3. 重新上傳到 GitHub（同樣用拖檔案的方式，會直接覆蓋；`art.js`、`fonts` 資料夾也要上傳）
4. 手機上把 App 完全關掉再打開，可能要開兩次才會換成新版

## 備份

打開 App → 點右上角的「今天／本月」→ 拉到最下面：

- **匯出**：CSV 檔，可以用 Excel 或 Numbers 打開
- **備份**／**從備份還原**：完整資料（JSON 檔），換手機或刪掉 App 前一定要先備份

> ⚠️ 如果把主畫面上的 App 刪掉，裡面的資料也會一起刪掉。

## 進階：網址參數（之後給捷徑用）

| 網址 | 效果 |
|---|---|
| `index.html?a=12.5&c=food` | 直接記一筆 €12.5 的「食」 |
| `index.html?a=£3.20&c=transport` | 自動辨識英鎊 |
| `index.html?a=150` | 只帶入金額，等妳點類別 |
| `index.html?a=4.8&c=food&n=拿鐵` | 連品項一起記 |

類別代碼：`food` 食、`clothes` 衣、`home` 住、`transport` 行、`fun` 育樂、`health` 醫療、`invest` 投資、`other` 其他

> 限制：iPhone 的「捷徑」打開網址時會用 Safari，而 Safari 和主畫面上的 App 是**分開存資料**的。所以目前捷徑記的帳不會出現在主畫面的 App 裡。這要等第二階段做成原生 App 才能真正解決。

## 匯率來源

[open.er-api.com](https://www.exchangerate-api.com/docs/free)（免費、不用註冊），連不上時改用 [fawazahmed0/currency-api](https://github.com/fawazahmed0/exchange-api)。每 6 小時最多更新一次，沒網路時用上次的匯率。

報帳用的每日歷史匯率來自 [fawazahmed0/currency-api](https://github.com/fawazahmed0/exchange-api) 的每日資料，抓過的日子會存在手機裡，不會重複下載。
