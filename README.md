# 📚 Api ToDo4YoU

## 🚀 Tecnologias Utilizadas
- NestJs
- TypeScript
- Prisma
- Postgres
- Docker
- JWT
- Passport
- Zod
- Multer

---

## ⚙️ Instalação na Máquina Local

### 🛠️ Programas Necessários
- NodeJs
- Docker Compose
- Prisma
- OpenSSL
- Postgres

---

### 📥 Passo a Passo

1. **Clone o repositório:**
```bash
 git clone https://github.com/LucasFMarques2/apiTodo4You.git
```

2. **Acesse a pasta do projeto:**
```bash
cd apiTodo4You
```

3. **Instale as dependências**
```bash
npm install
```

4. **Renomeie o arquivo de ambiente:**
```bash
mv .exemple.env .env
```

5. **Gere a chave privada para autenticação:**
```bash
openssl genpkey -algorithm RSA -out private_key.pem
```

6. **Gere a chave pública:**
```bash
openssl rsa -pubout -in private_key.pem -out public_key.pem
```

7. **Converta a chave privada para base64:**
```bash
[Convert]::ToBase64String([IO.File]::ReadAllBytes('private_key.pem')) | Out-File 'private_key_base64.txt'
```
- Copie o conteúdo do arquivo gerado e cole na variável `JWT_PRIVATE_KEY` dentro do `.env` como uma string (`""`).

8. **Converta a chave pública para base64:**
```bash
[Convert]::ToBase64String([IO.File]::ReadAllBytes('public_key.pem')) | Out-File 'public_key_base64.txt'
```
- Copie o conteúdo do arquivo gerado e cole na variável `JWT_PUBLIC_KEY` dentro do `.env` como uma string (`""`).

9. **Configure o banco de dados:**
- No arquivo `.env`, altere o `DATABASE_URL` com o usuário, senha e nome do banco de dados definidos no `docker-compose.yml`.

10. **Suba os containers com Docker:**
```bash
docker compose up -d
```

11. **Execute as migrations do Prisma:**
```bash
npx prisma migrate dev
```
- Dê um nome à migration quando solicitado.

12. **Execute os testes end-to-end:**
```bash
npm run test:e2e
```

---

Fronted: https://github.com/LucasFMarques2/todo4You-frontend

🎉 Pronto! Sua API ToDo4YoU está configurada e pronta para uso!

