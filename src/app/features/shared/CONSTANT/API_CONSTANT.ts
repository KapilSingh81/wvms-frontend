export const API_CONSTANT = {
  //auth api 
  login: 'auth/login',

   // ==================== DASHBOARD ====================
  dashboardData: 'dashboard/data?from_date={fromDate}&to_date={toDate}&type={type}',
 
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

  // ==================== ROLE ====================
roleList: 'role/list',
createRole: 'role/create',
updateRole: 'role/update/{id}',
deleteRole: 'role/delete/{id}',

// ==================== ADMIN USER ====================
userList: 'user/list',
createUser: 'user/create',
getUserById: 'user/{id}',
updateUser: 'user/update/{id}',
deleteUser: 'user/delete/{id}',

// ==================== VISITOR ====================
visitorList: 'visitor/list',
visitorSearch: 'visitor/search',
createVisitor: 'visitor/create',
getVisitorById: 'visitor/{id}',
updateVisitor: 'visitor/update/{id}',
visitorCheckout: 'visitor/checkout/{id}',
deleteVisitor: 'visitor/delete/{id}',
}