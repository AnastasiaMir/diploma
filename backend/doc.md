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
*   **Успешный ответ (201):**
    ```json
    {
      "message": "User registered successfully"
    }
    ```
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
*   **Успешный ответ (200):**
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
*   **Ошибка (401):**
    ```json
     {
         "message": "Invalid username or password"
     }
    ```

## 2. Задачи

### 2.1. Получение всех задач пользователя

*   **URL:** `/api/tasks`
*   **Метод:** `GET`
*   **Заголовок:** `Authorization: Bearer <token>`
*   **Успешный ответ (200):**
    ```json
    [
      {
          "id": 1,
        "name": "Test Task",
        "start_date": "2024-12-10T00:00:00.000Z",
        "finish_date": "2024-12-20T00:00:00.000Z",
        "user_id": 1,
        "createdAt": "2024-02-03T12:00:00.000Z",
        "updatedAt": "2024-02-03T12:00:00.000Z"
      },
       {
         "id": 2,
        "name": "Test Task 2",
        "start_date": "2024-12-10T00:00:00.000Z",
        "finish_date": "2024-12-20T00:00:00.000Z",
        "user_id": 1,
         "createdAt": "2024-02-03T12:00:00.000Z",
         "updatedAt": "2024-02-03T12:00:00.000Z"
       }
    ]
    ```
*   **Ошибка (401):**
    ```json
    {
      "message": "Unauthorized"
    }
    ```

### 2.2. Получение задачи по ID

*   **URL:** `/api/tasks/:id`
*   **Метод:** `GET`
*    **Заголовок:** `Authorization: Bearer <token>`
*   **Параметры URL:**
    *   `id`: ID задачи
*   **Успешный ответ (200):**
    ```json
    {
        "id": 1,
        "name": "Test Task",
        "start_date": "2024-12-10T00:00:00.000Z",
        "finish_date": "2024-12-20T00:00:00.000Z",
        "user_id": 1,
        "createdAt": "2024-02-03T12:00:00.000Z",
        "updatedAt": "2024-02-03T12:00:00.000Z"
    }
    ```
*   **Ошибка (401):**
    ```json
    {
      "message": "Unauthorized"
    }
    ```
*   **Ошибка (404):**
    ```json
    {
      "message": "Task not found"
    }
    ```

### 2.3. Создание новой задачи

*   **URL:** `/api/tasks`
*   **Метод:** `POST`
*   **Заголовок:** `Authorization: Bearer <token>`
*   **Тело запроса:**
    ```json
    {
      "name": "New Task",
      "start_date": "2024-12-25",
      "finish_date": "2025-01-05"
    }
    ```
*   **Успешный ответ (201):**
    ```json
    {
         "id": 3,
        "name": "New Task",
        "start_date": "2024-12-25T00:00:00.000Z",
        "finish_date": "2025-01-05T00:00:00.000Z",
        "user_id": 1,
         "createdAt": "2024-02-03T12:00:00.000Z",
        "updatedAt": "2024-02-03T12:00:00.000Z"
    }
    ```
    *   **Ошибка (400):**
    ```json
     {
       "errors": [
          { "msg": "Name is required" },
          { "msg": "Invalid start date" },
          { "msg": "Invalid finish date" }
         ]
      }
    ```
*   **Ошибка (401):**
    ```json
    {
      "message": "Unauthorized"
    }
    ```

### 2.4. Обновление задачи по ID

*   **URL:** `/api/tasks/:id`
*   **Метод:** `PUT`
*   **Заголовок:** `Authorization: Bearer <token>`
*   **Параметры URL:**
    *   `id`: ID задачи
*   **Тело запроса:**
    ```json
      {
         "name": "Updated Task",
        "start_date": "2024-12-26",
        "finish_date": "2025-01-06"
     }
    ```
*   **Успешный ответ (200):**
    ```json
      {
         "id": 3,
        "name": "Updated Task",
        "start_date": "2024-12-26T00:00:00.000Z",
        "finish_date": "2025-01-06T00:00:00.000Z",
         "user_id": 1,
         "createdAt": "2024-02-03T12:00:00.000Z",
         "updatedAt": "2024-02-03T12:00:00.000Z"
       }
    ```
  *   **Ошибка (400):**
    ```json
    {
      "errors": [
        { "msg": "Name is required" },
        { "msg": "Invalid start date" },
         { "msg": "Invalid finish date" }
        ]
     }
    ```
*   **Ошибка (401):**
    ```json
    {
      "message": "Unauthorized"
    }
    ```
*    **Ошибка (404):**
    ```json
    {
      "message": "Task not found"
    }
    ```

### 2.5. Удаление задачи по ID

*   **URL:** `/api/tasks/:id`
*   **Метод:** `DELETE`
*   **Заголовок:** `Authorization: Bearer <token>`
*   **Параметры URL:**
    *   `id`: ID задачи
*    **Успешный ответ (204):**
    ```
    No Content
    ```
*   **Ошибка (401):**
    ```json
    {
      "message": "Unauthorized"
    }
    ```
 *    **Ошибка (404):**
    ```json
    {
      "message": "Task not found"
    }
    ```

## 3. Подзадачи

### 3.1. Получение всех подзадач для задачи

*   **URL:** `/api/tasks/:taskId/subtasks`
*   **Метод:** `GET`
*   **Заголовок:** `Authorization: Bearer <token>`
*   **Параметры URL:**
    *   `taskId`: ID задачи
*   **Успешный ответ (200):**
    ```json
    [
      {
        "id": 1,
        "name": "Test Subtask",
        "manpower": 1,
        "completed": false,
         "task_id": 1,
        "createdAt": "2024-02-03T12:00:00.000Z",
       "updatedAt": "2024-02-03T12:00:00.000Z"
      },
      {
          "id": 2,
        "name": "Test Subtask 2",
         "manpower": 2,
        "completed": true,
        "task_id": 1,
          "createdAt": "2024-02-03T12:00:00.000Z",
        "updatedAt": "2024-02-03T12:00:00.000Z"
     }
    ]
    ```
*   **Ошибка (401):**
    ```json
    {
      "message": "Unauthorized"
    }
    ```
*   **Ошибка (404):**
    ```json
    {
      "message": "Task not found"
    }
    ```

### 3.2. Получение подзадачи по ID

*   **URL:** `/api/subtasks/:id`
*   **Метод:** `GET`
*   **Заголовок:** `Authorization: Bearer <token>`
*   **Параметры URL:**
    *   `id`: ID подзадачи
*   **Успешный ответ (200):**
    ```json
     {
        "id": 1,
         "name": "Test Subtask",
        "manpower": 1,
         "completed": false,
         "task_id": 1,
         "createdAt": "2024-02-03T12:00:00.000Z",
         "updatedAt": "2024-02-03T12:00:00.000Z"
       }
    ```
*   **Ошибка (401):**
    ```json
    {
      "message": "Unauthorized"
    }
    ```
*   **Ошибка (404):**
    ```json
    {
      "message": "Subtask not found"
    }
    ```

### 3.3. Создание новой подзадачи для задачи

*   **URL:** `/api/tasks/:taskId/subtasks`
*   **Метод:** `POST`
*   **Заголовок:** `Authorization: Bearer <token>`
*   **Параметры URL:**
    *    `taskId`: ID задачи
*   **Тело запроса:**
    ```json
    {
      "name": "New Subtask",
      "manpower": 1,
      "completed": false
    }
    ```
*   **Успешный ответ (201):**
    ```json
     {
        "id": 3,
        "name": "New Subtask",
        "manpower": 1,
        "completed": false,
       "task_id": 1,
       "createdAt": "2024-02-03T12:00:00.000Z",
         "updatedAt": "2024-02-03T12:00:00.000Z"
        }
    ```
*   **Ошибка (400):**
    ```json
    {
      "errors": [
        { "msg": "Name is required" },
        { "msg": "Manpower must be an integer" }
       ]
     }
    ```
*  **Ошибка (401):**
    ```json
    {
      "message": "Unauthorized"
    }
    ```
*    **Ошибка (404):**
    ```json
    {
      "message": "Task not found"
    }
    ```

### 3.4. Обновление подзадачи по ID

*   **URL:** `/api/subtasks/:id`
*   **Метод:** `PUT`
*   **Заголовок:** `Authorization: Bearer <token>`
*   **Параметры URL:**
    *   `id`: ID подзадачи
*    **Тело запроса:**
    ```json
     {
        "name": "Updated Subtask",
        "manpower": 2,
         "completed": true
    }
    ```
*   **Успешный ответ (200):**
    ```json
      {
        "id": 1,
         "name": "Updated Subtask",
        "manpower": 2,
        "completed": true,
         "task_id": 1,
         "createdAt": "2024-02-03T12:00:00.000Z",
         "updatedAt": "2024-02-03T12:00:00.000Z"
       }
    ```
    *   **Ошибка (400):**
    ```json
     {
       "errors": [
          { "msg": "Name is required" },
          { "msg": "Manpower must be an integer" }
         ]
      }
    ```
*    **Ошибка (401):**
    ```json
    {
      "message": "Unauthorized"
    }
    ```
*    **Ошибка (404):**
    ```json
    {
      "message": "Subtask not found"
    }
    ```

### 3.5. Удаление подзадачи по ID

*   **URL:** `/api/subtasks/:id`
*   **Метод:** `DELETE`
*   **Заголовок:** `Authorization: Bearer <token>`
*   **Параметры URL:**
    *   `id`: ID подзадачи
*   **Успешный ответ (204):**
    ```
    No Content
    ```
*    **Ошибка (401):**
    ```json
    {
      "message": "Unauthorized"
    }
    ```
*    **Ошибка (404):**
    ```json
    {
      "message": "Subtask not found"
    }
    ```