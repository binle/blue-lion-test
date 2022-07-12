export const MentorController = {
  path: 'mentor',
  children: {
    /**
     * admin, mentor(self), student(relationship)
     */
    detail: 'detail/:id',
    /**
     * admin, student
     */
    list: 'list',

    /**
     * admin
     */
    save: '',
  },
};
