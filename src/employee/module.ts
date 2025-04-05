import APIError from '../errors/APIError';
import { Employee } from '../models/EmployeeModel';

export async function createEmployee(
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  department: string,
) {
  try {
    if (!firstName || !email || !phone || !department) {
      throw new APIError('MISSING_DETAILS', 'Must provide necessary details');
    }
    const existingEmployee = await Employee.findOne({ email: email });
    if (existingEmployee) {
      throw new APIError(
        'EMPLOYEE_EXISTS',
        'Employee with this email id already exists',
      );
    }
    const employee: any = await Employee.insertOne({
      firstName,
      lastName,
      email,
      phone,
      department,
      isActive: true,
    });

    return employee;
  } catch (error: any) {
    console.error(error);
    throw new APIError(error.code, error.message);
  }
}

export async function getAllEmployees() {
  try {
    const employees = await Employee.find();
    return employees;
  } catch (error: any) {
    console.error(error);
    throw new APIError(error.code, error.message);
  }
}

export async function updateEmployee(
  employeeId: any,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  department: string,
) {
  try {
    const updatedEmployee: any = await Employee.updateOne(
      { _id: employeeId },
      {
        $set: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone,
          department: department,
        },
      },
      { new: true },
    );
    return updatedEmployee;
  } catch (error: any) {
    console.error(error);
    throw new APIError(error.code, error.message);
  }
}
