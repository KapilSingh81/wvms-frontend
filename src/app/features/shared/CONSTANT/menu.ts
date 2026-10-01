export const ADMIN_MENU = [
  {
    name: 'Dashboard',
    iconPath:
      'M4 13h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1zm0 8h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1zm10 0h6a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1zm0-18v4a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1z',
    path: '/admin/dashboard/home',
    subNav: [],
    color: '#4CAF50'
  },

  {
    name: 'Master',
    iconPath:
      'M12 2C7.58 2 4 3.79 4 6v12c0 2.21 3.58 4 8 4s8-1.79 8-4V6c0-2.21-3.58-4-8-4zm0 2c3.31 0 6 .9 6 2s-2.69 2-6 2-6-.9-6-2 2.69-2 6-2zm0 16c-3.31 0-6-.9-6-2v-3.03C7.46 15.61 9.58 16 12 16s4.54-.39 6-1.03V18c0 1.1-2.69 2-6 2zm0-6c-3.31 0-6-.9-6-2V8.97C7.46 9.61 9.58 10 12 10s4.54-.39 6-1.03V12c0 1.1-2.69 2-6 2z',
    path: '/admin/master',
    color: '#673AB7',
    subNav: [
      {
        name: 'Department Master',
        iconPath:
          'M3 21V7l9-4 9 4v14h-6v-6H9v6H3zm2-2h2v-4h2v4h2V8L5 5.78V19zm12 0h2V8.3l-2-1V19z',
        path: '/admin/master/department',
        color: '#1976D2',
        subNav: []
      },
      {
        name: 'Designation Master',
        iconPath:
          'M12 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 20a8 8 0 0 1 16 0H4z',
        path: '/admin/master/designation',
        color: '#FF9800',
        subNav: []
      },
      {
        name: 'Employee Master',
        iconPath:
          'M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0zM2 21a10 10 0 0 1 20 0H2z',
        path: '/admin/master/employee-visitor',
        color: '#009688',
        subNav: []
      }
    ]
  },

  {
    name: 'Report',
    iconPath:
      'M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm3 13h2v3H7v-3zm4-5h2v8h-2v-8zm4-4h2v12h-2V7z',
    path: '/admin/report',
    color: '#E91E63',
    subNav: [
      {
        name: 'Employee Report',
        iconPath:
          'M6 2h9l5 5v15H6V2zm8 1.5V8h4.5L14 3.5zM8 11h10v1.5H8V11zm0 4h10v1.5H8V15zm0 4h7v1.5H8V19z',
        path: '/admin/report/employee-report',
        color: '#3F51B5',
        subNav: []
      }
    ]
  }
];