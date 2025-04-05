import { Router } from 'express';
import { createEmployee, getAllEmployees, updateEmployee } from './module';

const router = Router();

router.post('/create-employee', async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, department } = req.body;
    const response = await createEmployee(
      firstName,
      lastName,
      email,
      phone,
      department,
    );
    res.status(200).send(response);
  } catch (error: any) {
    next(error);
  }
});

router.get('/get-all-employees', async (req, res, next) => {
  try {
    const response: any = await getAllEmployees();
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
});

router.post('/update-employee', async (req, res, next) => {
  try {
    const { employeeId, firstName, lastName, phone, email, department } =
      req.body;
    const response = await updateEmployee(
      employeeId,
      firstName,
      lastName,
      phone,
      email,
      department,
    );
    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
});

export = router;
