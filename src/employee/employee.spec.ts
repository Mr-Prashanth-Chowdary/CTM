import app from '../app';
import { connectDB, closeDB, clearDB } from '../test-spec';
import supertest from 'supertest';

describe('Create employee', () => {
  const request = supertest(app);
  beforeEach(async () => {
    await connectDB();
  });

  afterEach(async () => {
    await clearDB();
    await closeDB();
  });

  it('should create an employee successfully', async () => {
    const employeeDetails = {
      firstName: 'Himanth',
      lastName: 'Godari',
      email: 'himanthgodari@gmail.com',
      phone: '9110717468',
      department: 'Engineering',
    };

    const response: any = await request
      .post('/employee/create-employee')
      .send(employeeDetails);

    expect(response.status).toBe(200);
    expect(response.body.firstName).toBe('Himanth');
    expect(response.body.lastName).toBe('Godari');
    expect(response.body.email).toBe('himanthgodari@gmail.com');
  });

  it('should throw an error if the employee already exists', async () => {
    const employeeDetails = {
      firstName: 'Himanth',
      lastName: 'Godari',
      email: 'himanthgodari@gmail.com',
      phone: '9110717468',
      department: 'Engineering',
    };

    await request.post('/employee/create-employee').send(employeeDetails);

    const response: any = await request
      .post('/employee/create-employee')
      .send(employeeDetails);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      'Employee with this email id already exists',
    );
  });
});

describe('Get all employee', () => {
  const request = supertest(app);
  beforeEach(async () => {
    await connectDB();
  });

  afterEach(async () => {
    await clearDB();
    await closeDB();
  });

  it('should get employees successfully', async () => {
    const employeeDetails = {
      firstName: 'Himanth',
      lastName: 'Godari',
      email: 'himanthgodari@gmail.com',
      phone: '9110717468',
      department: 'Engineering',
    };
    await request.post('/employee/create-employee').send(employeeDetails);
    const response: any = await request.get('/employee/get-all-employees');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });

  it('should get multiple employees successfully', async () => {
    const employeeDetails1 = {
      firstName: 'Himanth',
      lastName: 'Godari',
      email: 'himanthgodari@gmail.com',
      phone: '9110717468',
      department: 'Engineering',
    };
    const employeeDetails2 = {
      firstName: 'Himanth',
      lastName: 'Godari',
      email: 'himanthgodar@gmail.com',
      phone: '9110717468',
      department: 'Engineering',
    };
    await request.post('/employee/create-employee').send(employeeDetails1);
    await request.post('/employee/create-employee').send(employeeDetails2);
    const response: any = await request.get('/employee/get-all-employees');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });
});

describe('update employee', () => {
  const request = supertest(app);
  beforeEach(async () => {
    await connectDB();
  });

  afterEach(async () => {
    await clearDB();
    await closeDB();
  });

  it('should update the employee details successfully', async () => {
    const employeeDetails = {
      firstName: 'Himanth',
      lastName: 'Godari',
      email: 'himanthgodari@gmail.com',
      phone: '9110717468',
      department: 'Engineering',
    };
    const createdEmployee: any = await request
      .post('/employee/create-employee')
      .send(employeeDetails);
    const response: any = await request.post('/employee/update-employee').send({
      employeeId: createdEmployee._id,
      firstName: 'Himanth',
      lastName: 'Godari',
      email: 'himanthgodari@gmail.com',
      phone: '9110717468',
      department: 'Engineering',
    });
    expect(response.status).toBe(200);
  });
});
