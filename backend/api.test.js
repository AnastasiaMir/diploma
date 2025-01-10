import request from 'supertest';
import app from './index.js';

let authToken;
let aircraftId;


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

describe('Aircraft API', () => {
  it('should return aircrafts for authenticated user', async () => {
    const response = await request(app)
      .get('/api/aircrafts')
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should create a new aircraft', async () => {
    const response = await request(app)
      .post('/api/aircrafts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Test Aircraft', start_date: '2024-12-10', finish_date: '2024-12-20' });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    aircraftId = response.body.id;
  });

  it('should return a specific Aircraft', async () => {
    const response = await request(app)
      .get(`/api/aircrafts/${aircraftId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id');
  });

  it('should update an aircraft', async () => {
    const response = await request(app)
      .put(`/api/aircrafts/${aircraftId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Updated Aircraft', start_date: '2024-12-15', finish_date: '2024-12-25' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Updated Aircraft');
  });

  it('should delete an Aircraft', async () => {
    const response = await request(app)
      .delete(`/api/aircrafts/${aircraftId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.statusCode).toBe(204);
  });

  it('should not find deleted Aircraft', async () => {
    const response = await request(app)
      .get(`/api/aircrafts/${aircraftId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.statusCode).toBe(404);
  });
});

describe('Task API', () => {

  beforeAll(async () => {
    const aircraftResponse = await request(app)
      .post('/api/aircrafts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Test Aircraft', start_date: '2024-12-10', finish_date: '2024-12-20' });
    expect(aircraftResponse.statusCode).toBe(201);
    expect(aircraftResponse.body).toHaveProperty('id');
    aircraftId = aircraftResponse.body.id;
  });

  it('should create a new task', async () => {
    const response = await request(app)
      .post(`/api/aircrafts/${aircraftId}/tasks`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Test task', manpower: 1, completed: false });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    console.log("taskId после создания task:", JSON.stringify(response.body.id));
  });

  it('should delete a task', async () => {
    const taskResponse = await request(app)
      .post(`/api/aircrafts/${aircraftId}/tasks`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Test Subtask', manpower: 1, completed: false });
    expect(taskResponse.statusCode).toBe(201);
    const deleteTaskId = taskResponse.body.id;
    console.log("taskId перед удалением task:", JSON.stringify(deleteTaskId));
    const response = await request(app)
      .delete(`/api/tasks/${deleteTaskId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.statusCode).toBe(204);
  });

  it('should not find deleted task', async () => {
    const taskResponse = await request(app)
      .post(`/api/aircrafts/${aircraftId}/tasks`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Test task', manpower: 1, completed: false });
    expect(taskResponse.statusCode).toBe(201);
    const newTaskId = taskResponse.body.id;
    console.log("taskId перед получением task:", JSON.stringify(newTaskId));
    const deleteResponse = await request(app)
      .delete(`/api/tasks/${newTaskId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(deleteResponse.statusCode).toBe(204);
    const response = await request(app)
      .get(`/api/tasks/${newTaskId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(response.statusCode).toBe(404);
  });
});