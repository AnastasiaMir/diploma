import request from 'supertest';
import app from './index.js';

let authToken;
let taskId;


describe('Auth API', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser2', password: 'testpassword123' });
    expect(response.statusCode).toBe(201);
  });

  it('should login a user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser2', password: 'testpassword123' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
    authToken = response.body.token;
  });
});

describe('Task API', () => {
  it('should return tasks for authenticated user', async () => {
    const response = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should create a new task', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Test Task', start_date: '2024-12-10', finish_date: '2024-12-20' });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    taskId = response.body.id;
  });

  it('should return a specific task', async () => {
    const response = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id');
  });

  it('should update a task', async () => {
    const response = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Updated Task', start_date: '2024-12-15', finish_date: '2024-12-25' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Updated Task');
  });

  it('should delete a task', async () => {
    const response = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.statusCode).toBe(204);
  });

  it('should not find deleted task', async () => {
    const response = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.statusCode).toBe(404);
  });
});

describe('Subtask API', () => {
  let taskId;

  beforeAll(async () => {
    const taskResponse = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Test Task', start_date: '2024-12-10', finish_date: '2024-12-20' });
    expect(taskResponse.statusCode).toBe(201);
    expect(taskResponse.body).toHaveProperty('id');
    taskId = taskResponse.body.id;
  });

  it('should create a new subtask', async () => {
    const response = await request(app)
      .post(`/api/tasks/${taskId}/subtasks`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Test Subtask', manpower: 1, completed: false });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    console.log("subtaskId после создания subtask:", JSON.stringify(response.body.id));
  });

  it('should delete a subtask', async () => {
    const subtaskResponse = await request(app)
      .post(`/api/tasks/${taskId}/subtasks`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Test Subtask', manpower: 1, completed: false });
    expect(subtaskResponse.statusCode).toBe(201);
    const deleteSubtaskId = subtaskResponse.body.id;
    console.log("subtaskId перед удалением subtask:", JSON.stringify(deleteSubtaskId));
    const response = await request(app)
      .delete(`/api/subtasks/${deleteSubtaskId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.statusCode).toBe(204);
  });

  it('should not find deleted subtask', async () => {
    const subtaskResponse = await request(app)
      .post(`/api/tasks/${taskId}/subtasks`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Test Subtask', manpower: 1, completed: false });
    expect(subtaskResponse.statusCode).toBe(201);
    const newSubtaskId = subtaskResponse.body.id;
    console.log("subtaskId перед получением subtask:", JSON.stringify(newSubtaskId));
    const deleteResponse = await request(app)
      .delete(`/api/subtasks/${newSubtaskId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(deleteResponse.statusCode).toBe(204);
    const response = await request(app)
      .get(`/api/subtasks/${newSubtaskId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.statusCode).toBe(404);
  });
});