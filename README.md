# 質數學習遊戲（Flask 版）

本專案為使用 Flask 架構的互動網頁遊戲，讓國小六年級學生練習分辨 1~100 的質數。

## 目錄結構

```
prime01/
├── app.py                # Flask 主程式
├── requirements.txt      # 依賴套件
├── README.md             # 專案說明
├── static/               # 靜態資源（CSS/JS）
│   ├── styles.css
│   └── script.js
└── templates/            # HTML模板
    └── index.html
```

## 執行方式

1. 安裝依賴：

```bash
pip install -r requirements.txt
```

2. 啟動伺服器：

```bash
python app.py
```

3. 在瀏覽器開啟 http://127.0.0.1:5000/

## 功能特色
- 1~100 數字表格，每行6格，17行
- 點選/滑動選取非質數，檢查答案與重設
- 響應式設計，支援平板/手機/PC
- 全部互動於單一頁面

---

如需部署至雲端，請參考 Render 或其他 Flask 靜態網站部署教學。 