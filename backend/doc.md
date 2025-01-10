# Документация API

## Общие сведения

API предоставляет RESTful интерфейс для управления графиком простоя воздушных судов (далее ВС) и работами на них по заявкам заказчиков. Для аутентификации используется JWT (JSON Web Token), который необходимо передавать в заголовке `Authorization` в формате `Bearer <token>`.

## 1. Аутентификация

### 1.1. Регистрация пользователя

*   **URL:** `/api/auth/register`
*   **Метод:** `POST`
*   **Тело запроса:**
    ```json
    {
      "username": "testuser",
      "password": "testpassword123"
    }
    ```
    *   `username` (string, required): Имя пользователя.
    *   `password` (string, required): Пароль пользователя (минимум 6 символов).
*   **Успешный ответ (201):**
    ```json
    {
      "message": "User registered successfully",
      "user": {
          "id": 1,
          "username": "testuser"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
    *   `message` (string): Сообщение об успешной регистрации.
    *   `user` (object):
    *   `id` (integer): id пользователя.
    *   `username` (string): Имя пользователя.
    *   `token` (string): JWT для авторизации.
*   **Ошибка (400):**
    ```json
    {
      "errors": [
        { "msg": "Username is required" },
        { "msg": "Password is required" },
        { "msg": "Username must be at least 3 characters long" },
        { "msg": "Password must be at least 6 characters long" }
      ]
    }
    ```
    *   `errors` (array): Массив сообщений об ошибках.
    *   `msg` (string): Сообщение об ошибке.
*   **Ошибка (400):**
    ```json
    {
        "message": "Username already taken"
    }
    ```
        * `message` (string): Сообщение об ошибке.
*    **Ошибка (500):**
    ```json
    {
        "message": "Internal server error"
    }
    ```
    *   `message` (string):  Сообщение об ошибке сервера.

### 1.2. Вход пользователя

*   **URL:** `/api/auth/login`
*   **Метод:** `POST`
*   **Тело запроса:**
    ```json
    {
      "username": "testuser",
      "password": "testpassword123"
    }
    ```
    *   `username` (string, required): Имя пользователя.
    *   `password` (string, required): Пароль пользователя.
*   **Успешный ответ (200):**
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
          "id": 1,
          "username": "testuser"
      }
    }
    ```
    *   `token` (string): JWT для авторизации.
    *   `user` (object):
    *   `id` (integer): id пользователя.
    *   `username` (string): Имя пользователя.
*   **Ошибка (401):**
    ```json
     {
         "message": "Invalid username or password"
     }
    ```
      * `message` (string): Сообщение об ошибке.
*    **Ошибка (500):**
    ```json
    {
        "message": "Internal server error"
    }
    ```
    *   `message` (string): Сообщение об ошибке сервера.

## 2. Задачи

### 2.1. Получение списка всех воздушных судов

*   **URL:** `/api/aircrafts`
*   **Метод:** `GET`
*   **Авторизация:** Требуется Bearer токен.
*   **Параметры:** Отсутствуют.
*   **Возвращаемый ответ (200):**
    ```json
    [
        {
            "id": 1,
            "name": "CH-300 RA-55555",
            "start_date": "2024-01-01T00:00:00.000Z",
            "finish_date": "2024-01-10T00:00:00.000Z",
            "user_id": 1,
            "tasks": [
                 {
                    "id": 1,
                    "name": "Восстановление ЛКП",
                    "manpower": 5,
                    "completed": false,
                    "aircraft_id": 1
                 },
                {
                    "id": 2,
                    "name": "Ремонт фасадного ящика кухонного модуля",
                    "manpower": 8,
                    "completed": true,
                    "aircraft_id": 1
                }
             ]
         },
       {
            "id": 2,
            "name": "RRJ-95 RA89044",
            "start_date": "2024-02-15T00:00:00.000Z",
            "finish_date": "2024-02-28T00:00:00.000Z",
            "completed": true,
            "user_id": 1,
            "tasks": []
       }
    ]
    ```
    *   `id` (integer): Уникальный идентификатор воздушного судна (далее - ВС) в БД.
    *   `name` (string): Бортовой номер/тип ВС.
    *   `start_date` (string): Дата начала проведения обслуживания в формате ISO 8601.
    *   `finish_date` (string): Дата окончания проведения обслуживания в формате ISO 8601.
    *   `user_id` (integer): Идентификатор пользователя, который добавлял номера воздушных судов.
    *   `tasks` (array): Массив работ на ВС.
        *   `id` (integer): Уникальный идентификатор работы.
        *   `name` (string): Название/описание работы.
        *   `manpower` (integer): Трудоемкость работы.
        *    `completed` (boolean): Статус выполнения работы
        *   `aircraft_id` (integer): Идентификатор ВС, к которой относится работа.
*   **Ошибка (500):**
     ```json
    {
        "message": "Internal server error",
        "error": "Some error description"
    }
    ```
    *   `message` (string):  Сообщение об ошибке сервера.
    *   `error` (string): Детальное описание ошибки

### 2.2. Получение ВС по ID

*   **URL:** `/api/aircrafts/:id`
*   **Метод:** `GET`
*   **Авторизация:** Требуется Bearer токен.
*   **Параметры:**
    *   `id` (integer, required): Идентификатор задачи.
*  **Возвращаемый ответ (200):**
    ```json
      {
            "id": 1,
            "name": "CH-300 RA-55555",
            "start_date": "2024-01-01T00:00:00.000Z",
            "finish_date": "2024-01-10T00:00:00.000Z",
            "user_id": 1,
            "tasks": [
                 {
                    "id": 1,
                    "name": "Восстановление ЛКП",
                    "manpower": 5,
                    "completed": false,
                    "aircraft_id": 1
                 },
                {
                    "id": 2,
                    "name": "Ремонт фасадного ящика кухонного модуля",
                    "manpower": 8,
                    "completed": true,
                    "aircraft_id": 1
                }
             ]
         },
    ```
    * `id` (integer): Уникальный идентификатор воздушного судна (далее - ВС) в БД.
    * `name` (string): Бортовой номер/тип ВС.
    * `start_date` (string): Дата начала проведения обслуживания в формате ISO 8601.
    * `finish_date` (string): Дата окончания проведения обслуживания в формате ISO 8601.
    * `user_id` (integer): Идентификатор пользователя, который добавлял номера воздушных судов.
    * `tasks` (array): Массив работ на ВС.
        *   `id` (integer): Уникальный идентификатор работы.
        *   `name` (string): Название/описание работы.
        *   `manpower` (integer): Трудоемкость работы.
        *    `completed` (boolean): Статус выполнения работы
        *   `aircraft_id` (integer): Идентификатор ВС, к которой относится работа.
*   **Ошибка (404):**
    ```json
    {
      "message": "Aircraft not found"
    }
    ```
      * `message` (string): Сообщение об ошибке.
*  **Ошибка (500):**
     ```json
    {
        "message": "Internal server error",
        "error": "Some error description"
    }
    ```
       * `message` (string):  Сообщение об ошибке сервера.
       * `error` (string): Детальное описание ошибки

### 2.3. Добавление нового ВС 

*   **URL:** `/api/aircrafts`
*   **Метод:** `POST`
*   **Авторизация:** Требуется Bearer токен.
*   **Тело запроса:**
    ```json
    {
      "name": "GL6000 RA-73555",
      "start_date": "2024-03-01T00:00:00.000Z",
      "finish_date": "2024-03-15T00:00:00.000Z"
    }
    ```
    *   `name` (string, required): Бортовой номер/ тип ВС.
    *   `start_date` (string, required): Дата начала проведения обслуживания в формате ISO 8601.
    *   `finish_date` (string, required): Дата окончания проведения обслуживания в формате ISO 8601.
*   **Возвращаемый ответ (201):**
    ```json
    {
        "id": 3,
        "name": "GL6000 RA-73555",
        "start_date": "2024-03-01T00:00:00.000Z",
        "finish_date": "2024-03-15T00:00:00.000Z",
        "user_id": 1,
        "tasks": []
     }
    ```
    *   `id` (integer): Уникальный идентификатор воздушного судна (далее - ВС) в БД.
    *   `name` (string): Бортовой номер/тип ВС.
    *   `start_date` (string): Дата начала проведения обслуживания в формате ISO 8601.
    *   `finish_date` (string): Дата окончания проведения обслуживания в формате ISO 8601.
    *   `user_id` (integer): Идентификатор пользователя, который добавлял номера воздушных судов.
    *   `tasks` (array): Массив работ на ВС.
*   **Ошибка (400):**
    ```json
    {
      "errors": [
           { "msg": "Name is required" },
           { "msg": "Start date is required" },
           { "msg": "Finish date is required" }
       ]
    }
    ```
        *   `errors` (array): Массив сообщений об ошибках.
        *   `msg` (string): Сообщение об ошибке.
*  **Ошибка (500):**
     ```json
    {
        "message": "Internal server error",
        "error": "Some error description"
    }
    ```
    *    `message` (string):  Сообщение об ошибке сервера.
    *    `error` (string): Детальное описание ошибки

### 2.4. Обновление данных о ВС

*   **URL:** `/api/aircrafts/:id`
*   **Метод:** `PUT`
*   **Авторизация:** Требуется Bearer токен.
*   **Параметры:**
    *   `id` (integer, required): Идентификатор задачи.
*   **Тело запроса:**
    ```json
    {
      "name": "Updated A/C type or tailnumber",
      "start_date": "2024-03-01T00:00:00.000Z",
      "finish_date": "2024-03-15T00:00:00.000Z"
    }
    ```
    *   `id` (integer): Уникальный идентификатор воздушного судна (далее - ВС) в БД.
    *   `name` (string): Бортовой номер/тип ВС.
    *   `start_date` (string): Дата начала проведения обслуживания в формате ISO 8601.
    *   `finish_date` (string): Дата окончания проведения обслуживания в формате ISO 8601.
    
*   **Возвращаемый ответ (200):**
   ```json
      {
            "id": 1,
            "name": "Updated A/C type or tailnumber",
            "start_date": "2024-03-01T00:00:00.000Z",
            "finish_date": "2024-03-15T00:00:00.000Z"
            "user_id": 1,
            "tasks": []
        }
    ```
    *   `id` (integer): Уникальный идентификатор воздушного судна (далее - ВС) в БД.
    *   `name` (string): Бортовой номер/тип ВС.
    *   `start_date` (string): Дата начала проведения обслуживания в формате ISO 8601.
    *   `finish_date` (string): Дата окончания проведения обслуживания в формате ISO 8601.
    *   `user_id` (integer): Идентификатор пользователя, который добавлял номера воздушных судов.
    *   `tasks` (array): Массив работ на ВС.
*   **Ошибка (400):**
    ```json
   {
      "errors": [
           { "msg": "Name is required" },
           { "msg": "Start date is required" },
           { "msg": "Finish date is required" }
       ]
    }
    ```
         * `errors` (array): Массив сообщений об ошибках.
          * `msg` (string): Сообщение об ошибке.
*  **Ошибка (404):**
    ```json
    {
      "message": "Aircraft not found"
    }
    ```
      * `message` (string): Сообщение об ошибке.
*   **Ошибка (500):**
     ```json
    {
        "message": "Internal server error",
        "error": "Some error description"
    }
    ```
    *   `message` (string):  Сообщение об ошибке сервера.
    *   `error` (string): Детальное описание ошибки

### 2.5. Удаление данных о ВС

*   **URL:** `/api/aircrafts/:id`
*   **Метод:** `DELETE`
*   **Авторизация:** Требуется Bearer токен.
*   **Параметры:**
    *   `id` (integer, required): Идентификатор ВС.
*   **Возвращаемый ответ (204):** Без тела ответа.
*   **Ошибка (404):**
    ```json
    {
      "message": "Aircraft not found"
    }
    ```
    *   `message` (string): Сообщение об ошибке.
*   **Ошибка (500):**
     ```json
    {
        "message": "Internal server error",
        "error": "Some error description"
    }
    ```
    *   `message` (string):  Сообщение об ошибке сервера.
    *   `error` (string): Детальное описание ошибки

## 3. Работы на ВС

### 3.1. Добавление работ на ВС

*   **URL:** `/api/aircrafts/:aircraftId/tasks`
*   **Метод:** `POST`
*   **Авторизация:** Требуется Bearer токен.
*   **Параметры:**
    *   `aircraftId` (integer, required): Идентификатор ВС, к которому нужно добавить новый вид работ.
*   **Тело запроса:**
    ```json
    {
      "name": "Восстановление ЛКП киля",
      "manpower": 5,
      "completed": false
    }
    ```
    *   `name` (string, required): Название работы.
    *   `manpower` (integer, required): Трудоемкость работы.
    *   `completed` (boolean, required): Статус выполнения работы
*   **Возвращаемый ответ (201):**
    ```json
    {
        "id": 1,
        "name": "Восстановление ЛКП киля",
        "manpower": 5,
        "completed": false,
        "aircraft_id": 1
     }
    ```
    *   `id` (integer): Уникальный идентификатор работы.
    *   `name` (string, required): Название работы.
    *   `manpower` (integer, required): Трудоемкость работы.
    *   `completed` (boolean, required): Статус выполнения работы
    *   `aircraft_id` (integer): Идентификатор ВС, к которому нужно добавить новый вид работ.
*  **Ошибка (400):**
    ```json
    {
        "errors": [
           { "msg": "Name is required" },
           { "msg": "Manpower is required" },
           { "msg": "Completed is required"}
        ]
    }
    ```
    *   `errors` (array): Массив сообщений об ошибках.
    *   `msg` (string): Сообщение об ошибке.
*  **Ошибка (404):**
    ```json
    {
      "message": "Aircraft not found"
    }
    ```
    *   `message` (string): Сообщение об ошибке.
*   **Ошибка (500):**
     ```json
    {
        "message": "Internal server error",
        "error": "Some error description"
    }
    ```
    *   `message` (string):  Сообщение об ошибке сервера.
    *    `error` (string): Детальное описание ошибки

### 3.2. Получение списка работ конкретного ВС

*   **URL:** `/api/aircrafts/:aircraftId/tasks`
*   **Метод:** `GET`
*   **Авторизация:** Требуется Bearer токен.
*   **Параметры:**
    *   `aircraftId` (integer, required): Идентификатор ВС.
*   **Возвращаемый ответ (200):**
    ```json
    [
        {
            "id": 1,
            "name": "Восстановление ЛКП киля",
            "manpower": 5,
            "completed": false,
            "aircraft_id": 1
         },
         {
            "id": 2,
            "name": "Ремонт облицовки двери",
            "manpower": 8,
            "completed": true,
            "aircraft_id": 1
        }
    ]
    ```
    *   `id` (integer): Уникальный идентификатор работы.
    *   `name` (string, required): Название работы.
    *   `manpower` (integer, required): Трудоемкость работы.
    *   `completed` (boolean, required): Статус выполнения работы
    *   `aircraft_id` (integer): Идентификатор ВС, к которому нужно добавить новый вид работ.
*   **Ошибка (404):**
    ```json
    {
      "message": "Aircraft not found"
    }
    ```
      * `message` (string): Сообщение об ошибке.
*   **Ошибка (500):**
     ```json
    {
        "message": "Internal server error",
        "error": "Some error description"
    }
    ```
    *   `message` (string):  Сообщение об ошибке сервера.
    *   `error` (string): Детальное описание ошибки

### 3.3. Получение работы по ID

*   **URL:** `/api/tasks/:id`
*   **Метод:** `GET`
*   **Авторизация:** Требуется Bearer токен.
*   **Параметры:**
    *   `id` (integer, required): Идентификатор работы.
*  **Возвращаемый ответ (200):**
    ```json
     {
        "id": 1,
        "name": "Восстановление ЛКП киля",
        "manpower": 5,
        "completed": false,
        "aircraft_id": 1
     }
    ```
    *   `id` (integer): Уникальный идентификатор работы.
    *   `name` (string, required): Название работы.
    *   `manpower` (integer, required): Трудоемкость работы.
    *   `completed` (boolean, required): Статус выполнения работы
    *   `aircraft_id` (integer): Идентификатор ВС, к которому нужно добавить новый вид работ.
*   **Ошибка (404):**
    ```json
    {
        "message": "Task not found"
    }
    ```
    * `message` (string): Сообщение об ошибке.
*   **Ошибка (500):**
     ```json
    {
        "message": "Internal server error",
         "error": "Some error description"
    }
    ```
    *   `message` (string):  Сообщение об ошибке сервера.
    *   `error` (string): Детальное описание ошибки

### 3.4. Обновление работы

*   **URL:** `/api/tasks/:id`
*   **Метод:** `PUT`
*   **Авторизация:** Требуется Bearer токен.
*   **Параметры:**
    *   `id` (integer, required): Идентификатор подзадачи.
*   **Тело запроса:**
    ```json
    {
      "name": "Измененное наименование работы",
      "manpower": 7,
       "completed": true
    }
    ```
    *   `name` (string, required): Название работы.
    *   `manpower` (integer, required): Трудоемкость работы.
    *    `completed` (boolean, required): Статус выполнения работы
*   **Возвращаемый ответ (200):**
    ```json
     {
        "id": 1,
        "name": "Измененное наименование работы",
        "manpower": 7,
        "completed": true,
        "aircraft_id": 1
     }
    ```
    *   `id` (integer): Уникальный идентификатор работы.
    *   `name` (string, required): Название работы.
    *   `manpower` (integer, required): Трудоемкость работы.
    *   `completed` (boolean, required): Статус выполнения работы
    *   `aircraft_id` (integer): Идентификатор ВС, к которому нужно добавить новый вид работ.
*   **Ошибка (400):**
    ```json
    {
       "message": "Some error message"
    }
    ```
          * `message` (string): Сообщение об ошибке.
*   **Ошибка (404):**
    ```json
    {
        "message": "Task not found"
    }
    ```
    *   `message` (string): Сообщение об ошибке.
*   **Ошибка (500):**
     ```json
    {
        "message": "Internal server error",
        "error": "Some error description"
    }
    ```
    *   `message` (string):  Сообщение об ошибке сервера.
    *   `error` (string): Детальное описание ошибки

### 3.5. Удаление работы

*   **URL:** `/api/tasks/:id`
*   **Метод:** `DELETE`
*   **Авторизация:** Требуется Bearer токен.
*   **Параметры:**
    *   `id` (integer, required): Идентификатор подзадачи.
*   **Возвращаемый ответ (204):** Без тела ответа.
*   **Ошибка (404):**
    ```json
    {
        "message": "Task not found"
    }
    ```
    *   `message` (string): Сообщение об ошибке.
*   **Ошибка (500):**
     ```json
    {
        "message": "Internal server error",
        "error": "Some error description"
    }
    ```
    *   `message` (string):  Сообщение об ошибке сервера.
    *   `error` (string): Детальное описание ошибки

### 3.6. Массовое добавление работ на ВС

*   **URL:** `/api/aircrafts/:aircraftId/tasks/bulk`
*   **Метод:** `POST`
*   **Авторизация:** Требуется Bearer токен.
*   **Параметры:**
    *   `aircraftId` (integer, required): Идентификатор задачи, к которой нужно добавить подзадачи.
*   **Тело запроса:**
    ```json
      [
        {
            "name": "Изготовление заглушек для двигателя",
            "manpower": 5,
            "completed": false
        },
        {
            "name": "Ремонт подлокотника кресла бортпроводника",
            "manpower": 8,
            "completed": true
        }
     ]
    ```
    *   `name` (string, required): Название работы.
    *   `manpower` (integer, required): Трудоемкость работы.
    *   `completed` (boolean, required): Статус выполнения работы
*   **Возвращаемый ответ (201):**
    ```json
    {
      "message": "Tasks created successfully"
    }
    ```
    *   `message` (string):  Сообщение об успешном создании подзадач.
*   **Ошибка (400):**
    ```json
    {
        "message": "Invalid tasks data"
    }
    ```
    *   `message` (string): Сообщение об ошибке.
*  **Ошибка (404):**
    ```json
    {
      "message": "Aircraft not found"
    }
    ```
    *   `message` (string): Сообщение об ошибке.
*  **Ошибка (500):**
     ```json
    {
        "message": "Internal server error",
        "error": "Some error description"
    }
    ```
    *   `message` (string):  Сообщение об ошибке сервера.
    *   `error` (string): Детальное описание ошибки