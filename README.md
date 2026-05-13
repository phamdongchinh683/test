# Facebook Login React Test

App ID đang dùng:

```env
VITE_FACEBOOK_APP_ID=802102469446209
```

## Chạy local

```bash
npm install
npm run dev
```

Mở:

```txt
http://localhost:5173
```

Hoặc nếu test bằng domain thật/ngrok thì dùng URL Vite hiển thị.

## Cấu hình Facebook Developer

Trong Facebook Developer Console:

1. App Settings > Basic
   - App Domains: nhập domain không có `https://`, không có path.
   - Ví dụ: `localhost` thường không cần thêm khi dev, domain thật thì thêm `tiennguyen107.io.vn`.

2. Facebook Login > Settings
   - Valid OAuth Redirect URIs: với JS SDK thường không bắt buộc như OAuth redirect flow, nhưng nếu Facebook yêu cầu thì thêm origin/page đang test.
   - Ví dụ: `http://localhost:5173/`
   - Domain thật: `https://www.tiennguyen107.io.vn/`

3. Website Platform
   - Site URL: URL gốc app.
   - Ví dụ: `http://localhost:5173/`

## Lưu ý lỗi domain

Nếu gặp lỗi:

```txt
The domain of this URL isn't included in the app's domains
```

Kiểm tra URL bạn đang mở trên trình duyệt. Domain đó phải khớp với App Domains/Site URL trong Facebook Developer.

Ví dụ nếu mở:

```txt
https://www.tiennguyen107.io.vn/
```

Thì App Domains nên có:

```txt
tiennguyen107.io.vn
```

Không nhập:

```txt
https://www.tiennguyen107.io.vn/
```
# test
