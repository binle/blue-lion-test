export const AccountController = {
  path: 'account',
  children: {
    /**
     * all
     */
    signIn: 'sign-in',

    /**
     * all
     */
    signOut: 'sign-out',
    /**
     * admin
     */
    setPassword: 'set-password',
    /**
     * mentor student
     */
    changePassword: 'change-password',

    /**
     * mentor student
     */
    info: 'info',
  },
};
