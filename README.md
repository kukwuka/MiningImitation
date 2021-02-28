# Тестовое задание 

#### Эндпоинты
/register 

/info

/faucet

/submit

#### Изменения
Я чуть-чуть поменял условие , а именно время для майнинга поставил
10 секунд, для удобной отладки, время указвается в .env файле аргументом **DELAY**.
API клиента передается как строка от клиента , а не берется из request, так же для 

## Описание ручек API 
Пароль для /faucet  sha256(Открытый ключ + Nonce).

Пароль для /info /submit   Открытый ключ .

#### /register
отправляем json:
```json
{
    "ip":"127.0.0.1",
    "key":"b10de81c82c2ca1d7bc2cd79206eb01b4baf544d6869f47b8c51c100b8cc6c91"
}
```
Передаем ip и открытый ключ

#### /info
отправляем json:
```json
{
    "ip":"127.0.0.1",
    "key":"b10de81c82c2ca1d7bc2cd79206eb01b4baf544d6869f47b8c51c100b8cc6c91"
}
```

получаем json:
```json
{
  "pocket": {
    "$numberDecimal": "1"
  },
  "RandomKey": "4d6d8165b208401cd98c51e42681770db6edcd3cdd0d9233552a07da6642a1ff",
  "Nonce": 1
}
```
Randomkey задание , pocket.$numberDecimal кошелек,Nonce количество запросов на /faucet 

#### /faucet
отправляем json:
```json
{
"ip":"127.0.0.1",
"key":"00d1dea7fe2b1659ba93f28838fdd940a600715835c6bf66996efbf6fc349062"
}
```
если получили :
```json
{
  "message": "ok"
}
```
То пароль подходит.
#### /submit
```json
{
    "ip":"127.0.0.1",
    "key":"b10de81c82c2ca1d7bc2cd79206eb01b4baf544d6869f47b8c51c100b8cc6c91",
    "salt": "ouihfqwvyfqb987gyuob2yuofqewljlvqop"
}
```
Если получили
```json
{'message':'salt get'}
```
salt подходит.