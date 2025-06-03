# 使用官方 Node.js LTS 基底映像
FROM node:18

# 設定工作目錄
WORKDIR /app

# 複製 package 檔案並安裝依賴
COPY package*.json ./
RUN npm install

# 複製所有專案檔案
COPY . .

# 開放 port
EXPOSE 3000

# 啟動應用程式
CMD ["npm", "start"]