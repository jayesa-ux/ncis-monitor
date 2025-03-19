export const authService = {
    login: (username: string, password: string): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (username === 'admin' && password === 'admin') {
                    sessionStorage.setItem('isAuthenticated', 'true');
                    sessionStorage.setItem('user', username);
                    resolve(true);
                } else {
                    resolve(false);
                }
            }, 500);
        });
    },

    logout: (): void => {
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('user');
        window.dispatchEvent(new Event('storage'));
    },

    isAuthenticated: (): boolean => {
        return sessionStorage.getItem('isAuthenticated') === 'true';
    },

    getCurrentUser: (): string | null => {
        return sessionStorage.getItem('user');
    },
};

export default authService;
