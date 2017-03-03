# Start Node Express Application

### Features
1. API
2. HTTPS
3. I18n
4. JWT
5. Mongoose
6. Templates
7. Tests
8. Validation
9. Chat on socket.io

### Usage
1. Edit config.js
2. `openssl genrsa 1024 > ssl/private.key`
3. `openssl req -new -key ssl/private.key -out ssl/cert.csr`
4. `openssl x509 -req -in ssl/cert.csr -signkey ssl/private.key -out ssl/certificate.pem`
2. `npm i`
3. `npm run dev`
