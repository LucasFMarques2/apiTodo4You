de o comando npm i

renomear o arquivo .exemple.env para .env
venrificar se tem o openssl instalado
rodar o comando openssl genpkey -algorithm RSA -out private_key.pem
depois o comando openssl rsa -pubout -in private_key.pem -out public_key.pem
rodar o comando [Convert]::ToBase64String([IO.File]::ReadAllBytes('private_key.pem')) | Out-File 'private_key_base64.txt'
copiar o conteudo de private_key_base64.txt para JWT_PRIVATE_KEY
RODAR O COMANDO [Convert]::ToBase64String([IO.File]::ReadAllBytes('public_key.pem')) | Out-File 'public_key_base64.txt' E copiar o arquivo de public_key_base64.txt para JWT_PUBLIC_KEY

rodar docker compose up -d

no env altera o usuario, senha e banco de dados do DATABASE_URL pelo usuario, senha e banco de dados setados no arquivo docker-compose.yml

rodar o comando npx prisma migrate dev e de um nome a migration

rode os tests end to end npm run test:e2e
