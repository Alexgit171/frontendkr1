# Единый отчёт по запросам (вместо скриншотов Postman)

> В этой среде невозможно приложить реальные GUI-скриншоты Postman, поэтому подготовлен один текстовый отчёт с описанием запросов, тел запросов и ожидаемых JSON-ответов.

## 1. Локальный API из практического задания 2

### GET `{{baseUrl}}/products`
Ожидаемый результат:
```json
[
  { "id": 1, "name": "Ноутбук AirBook 14", "price": 64990 },
  { "id": 2, "name": "Беспроводная мышь Click Mini", "price": 2490 },
  { "id": 3, "name": "Механическая клавиатура KeyPro", "price": 7190 }
]
```

### POST `{{baseUrl}}/products`
Тело:
```json
{
  "name": "Игровая гарнитура SoundStorm",
  "price": 5590
}
```

Ожидаемый ответ:
```json
{
  "id": 4,
  "name": "Игровая гарнитура SoundStorm",
  "price": 5590
}
```

### PATCH `{{baseUrl}}/products/1`
Тело:
```json
{
  "price": 69990
}
```

Ожидаемый ответ:
```json
{
  "id": 1,
  "name": "Ноутбук AirBook 14",
  "price": 69990
}
```

### DELETE `{{baseUrl}}/products/3`
Ожидаемый ответ: статус `204 No Content`.

---

## 2. Внешние API (не менее 5 запросов)

### Open-Meteo — текущая погода (Москва)
Запрос:
`GET https://api.open-meteo.com/v1/forecast?latitude=55.7522&longitude=37.6156&current=temperature_2m,wind_speed_10m`

Ключевые поля ответа:
```json
{
  "latitude": 55.75,
  "longitude": 37.625,
  "current": {
    "temperature_2m": 18.4,
    "wind_speed_10m": 11.7
  }
}
```

### Open-Meteo — прогноз на 3 дня (Санкт-Петербург)
Запрос:
`GET https://api.open-meteo.com/v1/forecast?latitude=59.9386&longitude=30.3141&daily=temperature_2m_max,temperature_2m_min&forecast_days=3&timezone=Europe/Moscow`

Ключевые поля ответа:
```json
{
  "daily": {
    "time": ["2026-01-01", "2026-01-02", "2026-01-03"],
    "temperature_2m_max": [-3.2, -1.8, -2.4],
    "temperature_2m_min": [-8.7, -6.9, -7.5]
  }
}
```

### Frankfurter — актуальные курсы для USD
Запрос:
`GET https://api.frankfurter.app/latest?from=USD&to=EUR,RUB`

Ключевые поля ответа:
```json
{
  "base": "USD",
  "rates": {
    "EUR": 0.92,
    "RUB": 97.4
  }
}
```

### Frankfurter — конвертация 100 USD в RUB
Запрос:
`GET https://api.frankfurter.app/latest?amount=100&from=USD&to=RUB`

Ключевые поля ответа:
```json
{
  "amount": 100,
  "base": "USD",
  "rates": {
    "RUB": 9740.0
  }
}
```

### REST Countries — информация о Японии
Запрос:
`GET https://restcountries.com/v3.1/name/japan`

Ключевые поля ответа:
```json
[
  {
    "name": { "common": "Japan" },
    "capital": ["Tokyo"],
    "region": "Asia",
    "population": 125836021
  }
]
```
