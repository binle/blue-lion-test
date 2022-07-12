export const StudentController = {
  path: 'student',
  children: {
    /**
     * admin, student(self), mentor(relationship)
     */
    detail: 'detail/:id',
    /**
     * admin, mentor
     */
    list: 'list',
    /**
     * admin
     */
    save: '',
  },
};
