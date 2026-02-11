// ===== Customers Service (Factory Pattern) =====
import { createCrudService } from '../utils/serviceFactory.js';

const crud = createCrudService('customer');

export const customersService = {
  ...crud,
};
