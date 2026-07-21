# Blog Like API

一个简单的博客点赞 API，使用 MongoDB 存储数据。

## 功能

- `GET /api/like?slug=xxx` - 获取指定文章点赞数
- `POST /api/like?slug=xxx` - 为指定文章点赞

## 部署

### 环境变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `MONGODB_URI` | MongoDB 连接字符串 | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `MONGODB_DB` | 数据库名称（可选） | `blog` |

### 本地运行

```bash
# 安装依赖
npm install

# 设置环境变量
export MONGODB_URI="your-mongodb-uri"

# 运行
npm start
```

### 部署到各平台

#### Vercel
```bash
npm i -g vercel
vercel deploy
```
在 Vercel 项目设置中添加 `MONGODB_URI` 环境变量。

#### Railway
- 连接 GitHub 仓库
- 添加 `MONGODB_URI` 环境变量
- 部署

#### 阿里云函数计算
- 使用函数计算控制台上传代码
- 配置环境变量
- 设置触发器为 HTTP 触发

#### 其他平台
只要支持 Node.js 运行时的平台都可以部署。

## 使用方法

### 获取点赞数

```bash
curl "http://localhost:3000/api/like?slug=my-post"
```

响应：
```json
{
  "count": 42,
  "slug": "my-post"
}
```

### 点赞

```bash
curl -X POST "http://localhost:3000/api/like?slug=my-post"
```

响应：
```json
{
  "count": 43,
  "slug": "my-post"
}
```

## 数据结构

MongoDB 中的 `likes` 集合：

```json
{
  "slug": "my-post",
  "count": 42,
  "ips": ["1.2.3.4", "5.6.7.8"]
}
```

- `slug`: 文章标识符
- `count`: 点赞数
- `ips`: 已点赞的 IP 列表（用于防刷）

## License

MIT
