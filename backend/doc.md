# Документация API

## Общие сведения

API предоставляет RESTful интерфейс для управления задачами и подзадачами. Для аутентификации используется JWT (JSON Web Token), который необходимо передавать в заголовке `Authorization` в формате `Bearer <token>`.

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
            * `id` (integer): id пользователя.
            * `username` (string): Имя пользователя.
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
    * `errors` (array): Массив сообщений об ошибках.
      * `msg` (string): Сообщение об ошибке.
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
      * `id` (integer): id пользователя.
      * `username` (string): Имя пользователя.
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
        * `message` (string): Сообщение об ошибке сервера.

## 2. Задачи

### 2.1. Получение списка всех задач

*   **URL:** `/api/tasks`
*   **Метод:** `GET`
*   **Авторизация:** Требуется Bearer токен.
*   **Параметры:** Отсутствуют.
*   **Возвращаемый ответ (200):**
    ```json
    [
        {
            "id": 1,
            "name": "Task 1",
            "start_date": "2024-01-01T00:00:00.000Z",
            "finish_date": "2024-01-10T00:00:00.000Z",
             "completed": false,
            "user_id": 1,
            "subtasks": [
                 {
                    "id": 1,
                     "name": "Subtask 1",
                      "manpower": 5,
                      "completed": false,
                    "task_id": 1
                 },
                {
                    "id": 2,
                    "name": "Subtask 2",
                    "manpower": 8,
                   "completed": true,
                   "task_id": 1
                }
             ]
         },
       {
            "id": 2,
            "name": "Task 2",
            "start_date": "2024-02-15T00:00:00.000Z",
            "finish_date": "2024-02-28T00:00:00.000Z",
            "completed": true,
            "user_id": 1,
             "subtasks": []
       }
    ]
    ```
    * `id` (integer): Уникальный идентификатор задачи.
    * `name` (string): Название задачи.
    * `start_date` (string): Дата начала задачи в формате ISO 8601.
    * `finish_date` (string): Дата окончания задачи в формате ISO 8601.
    * `completed` (boolean): Статус выполнения задачи.
    * `user_id` (integer): Идентификатор пользователя, создавшего задачу.
    * `subtasks` (array): Массив подзадач.
        *   `id` (integer): Уникальный идентификатор подзадачи.
        *   `name` (string): Название подзадачи.
        *   `manpower` (integer): Трудоемкость подзадачи.
        *    `completed` (boolean): Статус выполнения подзадачи
        *   `task_id` (integer): Идентификатор задачи, к которой относится подзадача.
*   **Ошибка (500):**
     ```json
    {
        "message": "Internal server error",
        "error": "Some error description"
    }
    ```
        * `message` (string):  Сообщение об ошибке сервера.
        * `error` (string): Детальное описание ошибки

### 2.2. Получение задачи по ID

*   **URL:** `/api/tasks/:id`
*   **Метод:** `GET`
*   **Авторизация:** Требуется Bearer токен.
*   **Параметры:**
    *   `id` (integer, required): Идентификатор задачи.
*  **Возвращаемый ответ (200):**
    ```json
      {
            "id": 1,
            "name": "Task 1",
            "start_date": "2024-01-01T00:00:00.000Z",
            "finish_date": "2024-01-10T00:00:00.000Z",
            "completed": false,
            "user_id": 1,
             "subtasks": [
                 {
                    "id": 1,
                     "name": "Subtask 1",
                      "manpower": 5,
                      "completed": false,
                     "task_id": 1
                 },
                {
                    "id": 2,
                    "name": "Subtask 2",
                    "manpower": 8,
                   "completed": true,
                   "task_id": 1
                }
             ]
        }
    ```
    * `id` (integer): Уникальный идентификатор задачи.
    * `name` (string): Название задачи.
    * `start_date` (string): Дата начала задачи в формате ISO 8601.
    * `finish_date` (string): Дата окончания задачи в формате ISO 8601.
     * `completed` (boolean): Статус выполнения задачи.
    * `user_id` (integer): Идентификатор пользователя, создавшего задачу.
    * `subtasks` (array): Массив подзадач.
        *   `id` (integer): Уникальный идентификатор подзадачи.
        *   `name` (string): Название подзадачи.
        *   `manpower` (integer): Трудоемкость подзадачи.
        *    `completed` (boolean): Статус выполнения подзадачи
        *   `task_id` (integer): Идентификатор задачи, к которой относится подзадача.
*   **Ошибка (404):**
    ```json
    {
      "message": "Task not found"
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

### 2.3. Создание новой задачи

*   **URL:** `/api/tasks`
*   **Метод:** `POST`
*   **Авторизация:** Требуется Bearer токен.
*   **Тело запроса:**
    ```json
    {
      "name": "New Task",
      "start_date": "2024-03-01T00:00:00.000Z",
      "finish_date": "2024-03-15T00:00:00.000Z",
       "completed": false
    }
    ```
    *   `name` (string, required): Название задачи.
    *   `start_date` (string, required): Дата начала задачи в формате ISO 8601.
    *   `finish_date` (string, required): Дата окончания задачи в формате ISO 8601.
     *  `completed` (boolean, required): Статус выполнения задачи
*   **Возвращаемый ответ (201):**
    ```json
    {
        "id": 3,
        "name": "New Task",
        "start_date": "2024-03-01T00:00:00.000Z",
        "finish_date": "2024-03-15T00:00:00.000Z",
        "completed": false,
        "user_id": 1,
         "subtasks": []
     }
    ```
    * `id` (integer): Уникальный идентификатор задачи.
    * `name` (string): Название задачи.
    * `start_date` (string): Дата начала задачи в формате ISO 8601.
    * `finish_date` (string): Дата окончания задачи в формате ISO 8601.
     * `completed` (boolean): Статус выполнения задачи.
    * `user_id` (integer): Идентификатор пользователя, создавшего задачу.
     *  `subtasks` (array): Массив подзадач.
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
*  **Ошибка (500):**
     ```json
    {
        "message": "Internal server error",
        "error": "Some error description"
    }
    ```
       * `message` (string):  Сообщение об ошибке сервера.
       * `error` (string): Детальное описание ошибки

### 2.4. Обновление задачи

*   **URL:** `/api/tasks/:id`
*   **Метод:** `PUT`
*   **Авторизация:** Требуется Bearer токен.
*   **Параметры:**
    *   `id` (integer, required): Идентификатор задачи.
*   **Тело запроса:**
    ```json
    {
      "name": "Updated Task Name",
      "start_date": "2024-03-01T00:00:00.000Z",
      "finish_date": "2024-03-15T00:00:00.000Z",
       "completed": true
    }
    ```
    *   `name` (string, required): Обновленное название задачи.
    *   `start_date` (string, required): Обновленная дата начала задачи в формате ISO 8601.
    *   `finish_date` (string, required): Обновленная дата окончания задачи в формате ISO 8601.
      *  `completed` (boolean, required): Обновленный статус выполнения.
*   **Возвращаемый ответ (200):**
   ```json
      {
            "id": 1,
            "name": "Updated Task Name",
            "start_date": "2024-03-01T00:00:00.000Z",
            "finish_date": "2024-03-15T00:00:00.000Z",
             "completed": true,
            "user_id": 1,
            "subtasks": []
        }
    ```
    * `id` (integer): Уникальный идентификатор задачи.
    * `name` (string): Название задачи.
    * `start_date` (string): Дата начала задачи в формате ISO 8601.
    * `finish_date` (string): Дата окончания задачи в формате ISO 8601.
    * `completed` (boolean): Статус выполнения задачи.
    * `user_id` (integer): Идентификатор пользователя, создавшего задачу.
     *  `subtasks` (array): Массив подзадач.
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
      * `message` (string):  Сообщение об ошибке сервера.
      * `error` (string): Детальное описание ошибки

### 2.5. Удаление задачи

*   **URL:** `/api/tasks/:id`
*   **Метод:** `DELETE`
*   **Авторизация:** Требуется Bearer токен.
*   **Параметры:**
    *   `id` (integer, required): Идентификатор задачи.
*   **Возвращаемый ответ (204):** Без тела ответа.
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
        * `message` (string):  Сообщение об ошибке сервера.
        * `error` (string): Детальное описание ошибки

## 3. Подзадачи

### 3.1. Добавление подзадачи к задаче

*   **URL:** `/api/tasks/:taskId/subtasks`
*   **Метод:** `POST`
*   **Авторизация:** Требуется Bearer токен.
*   **Параметры:**
    *   `taskId` (integer, required): Идентификатор задачи, к которой нужно добавить подзадачу.
*   **Тело запроса:**
    ```json
    {
      "name": "Subtask 1",
      "manpower": 5,
      "completed": false
    }
    ```
    *   `name` (string, required): Название подзадачи.
    *   `manpower` (integer, required): Трудоемкость подзадачи.
    *    `completed` (boolean, required): Статус выполнения подзадачи
*   **Возвращаемый ответ (201):**
    ```json
    {
        "id": 1,
        "name": "Subtask 1",
        "manpower": 5,
        "completed": false,
        "task_id": 1
     }
    ```
     *   `id` (integer): Уникальный идентификатор подзадачи.
        *   `name` (string): Название подзадачи.
        *   `manpower` (integer): Трудоемкость подзадачи.
         *    `completed` (boolean): Статус выполнения подзадачи
        *   `task_id` (integer): Идентификатор задачи, к которой относится подзадача.
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
         * `errors` (array): Массив сообщений об ошибках.
          * `msg` (string): Сообщение об ошибке.
*  **Ошибка (404):**
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
       * `message` (string):  Сообщение об ошибке сервера.
       * `error` (string): Детальное описание ошибки

### 3.2. Получение списка подзадач задачи

*   **URL:** `/api/tasks/:taskId/subtasks`
*   **Метод:** `GET`
*  **Авторизация:** Требуется Bearer токен.
*   **Параметры:**
    *   `taskId` (integer, required): Идентификатор задачи.
*   **Возвращаемый ответ (200):**
    ```json
    [
        {
            "id": 1,
            "name": "Subtask 1",
            "manpower": 5,
            "completed": false,
            "task_id": 1
         },
         {
            "id": 2,
            "name": "Subtask 2",
            "manpower": 8,
            "completed": true,
             "task_id": 1
        }
    ]
    ```
    *   `id` (integer): Уникальный идентификатор подзадачи.
    *   `name` (string): Название подзадачи.
    *   `manpower` (integer): Трудоемкость подзадачи.
    *    `completed` (boolean): Статус выполнения подзадачи
    *   `task_id` (integer): Идентификатор задачи, к которой относится подзадача.
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
       * `message` (string):  Сообщение об ошибке сервера.
       * `error` (string): Детальное описание ошибки

### 3.3. Получение подзадачи по ID

*   **URL:** `/api/subtasks/:id`
*   **Метод:** `GET`
*   **Авторизация:** Требуется Bearer токен.
*   **Параметры:**
    *   `id` (integer, required): Идентификатор подзадачи.
*  **Возвращаемый ответ (200):**
    ```json
     {
        "id": 1,
        "name": "Subtask 1",
        "manpower": 5,
        "completed": false,
        "task_id": 1
     }
    ```
    *   `id` (integer): Уникальный идентификатор подзадачи.
    *   `name` (string): Название подзадачи.
    *   `manpower` (integer): Трудоемкость подзадачи.
     *    `completed` (boolean): Статус выполнения подзадачи
    *   `task_id` (integer): Идентификатор задачи, к которой относится подзадача.
*   **Ошибка (404):**
    ```json
    {
        "message": "Subtask not found"
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
      * `message` (string):  Сообщение об ошибке сервера.
      * `error` (string): Детальное описание ошибки

### 3.4. Обновление подзадачи

*   **URL:** `/api/subtasks/:id`
*   **Метод:** `PUT`
*   **Авторизация:** Требуется Bearer токен.
*   **Параметры:**
    *   `id` (integer, required): Идентификатор подзадачи.
*   **Тело запроса:**
    ```json
    {
      "name": "Updated Subtask 1",
      "manpower": 7,
       "completed": true
    }
    ```
    *   `name` (string, required): Обновленное название подзадачи.
    *   `manpower` (integer, required): Обновленная трудоемкость подзадачи.
     *  `completed` (boolean, required): Обновленный статус выполнения подзадачи
*   **Возвращаемый ответ (200):**
    ```json
     {
        "id": 1,
        "name": "Updated Subtask 1",
        "manpower": 7,
        "completed": true,
        "task_id": 1
     }
    ```
    *   `id` (integer): Уникальный идентификатор подзадачи.
    *   `name` (string): Название подзадачи.
    *   `manpower` (integer): Трудоемкость подзадачи.
     *    `completed` (boolean): Статус выполнения подзадачи
    *   `task_id` (integer): Идентификатор задачи, к которой относится подзадача.
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
        "message": "Subtask not found"
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
        * `message` (string):  Сообщение об ошибке сервера.
        * `error` (string): Детальное описание ошибки

### 3.5. Удаление подзадачи

*   **URL:** `/api/subtasks/:id`
*   **Метод:** `DELETE`
*  **Авторизация:** Требуется Bearer токен.
*   **Параметры:**
    *   `id` (integer, required): Идентификатор подзадачи.
*   **Возвращаемый ответ (204):** Без тела ответа.
*   **Ошибка (404):**
    ```json
    {
        "message": "Subtask not found"
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
       * `message` (string):  Сообщение об ошибке сервера.
      * `error` (string): Детальное описание ошибки

### 3.6. Массовое добавление подзадач к задаче

*   **URL:** `/api/tasks/:taskId/subtasks/bulk`
*   **Метод:** `POST`
*    **Авторизация:** Требуется Bearer токен.
*   **Параметры:**
     *   `taskId` (integer, required): Идентификатор задачи, к которой нужно добавить подзадачи.
*   **Тело запроса:**
    ```json
      [
        {
            "name": "Subtask 1",
            "manpower": 5,
            "completed": false
        },
        {
            "name": "Subtask 2",
            "manpower": 8,
            "completed": true
        }
     ]
    ```
    *   `name` (string, required): Название подзадачи.
    *   `manpower` (integer, required): Трудоемкость подзадачи.
    *    `completed` (boolean, required): Статус выполнения подзадачи
*   **Возвращаемый ответ (201):**
    ```json
    {
      "message": "Subtasks created successfully"
    }
    ```
    * `message` (string):  Сообщение об успешном создании подзадач.
*   **Ошибка (400):**
    ```json
    {
        "message": "Invalid subtasks data"
    }
    ```
        * `message` (string): Сообщение об ошибке.
*  **Ошибка (404):**
    ```json
    {
      "message": "Task not found"
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