export const API_CONSTANT = {
  //auth api 
  login: 'auth/login',
 
 // ==================== DEPARTMENT ====================
  departmentList: 'department/list',
  createDepartment: 'department/create',
  updateDepartment: 'department/update/{id}',
  deleteDepartment: 'department/delete/{id}',

  // ==================== DESIGNATION ====================
  designationList: 'designation/list',
  createDesignation: 'designation/create',
  updateDesignation: 'designation/update/{id}',
  deleteDesignation: 'designation/delete/{id}',

  // ==================== EMPLOYEE / VISITOR ====================
  employeeVisitorList: 'employee/list',
  createEmployeeVisitor: 'employee/create',
  updateEmployeeVisitor: 'employee/update/{id}',
  deleteEmployeeVisitor: 'employee/delete/{id}',
}