import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const setToken = (token) => {
    Cookies.set(TOKEN_KEY, token, { expires: 1 }); // Expires in 1 day
};

export const getToken = () => {
    return Cookies.get(TOKEN_KEY);
};

export const removeToken = () => {
    Cookies.remove(TOKEN_KEY);
};

export const setUser = (user) => {
    Cookies.set(USER_KEY, JSON.stringify(user), { expires: 1 });
};

export const getUser = () => {
    const user = Cookies.get(USER_KEY);
    return user ? JSON.parse(user) : null;
};

export const removeUser = () => {
    Cookies.remove(USER_KEY);
};

export const logout = () => {
    removeToken();
    removeUser();
};

export const isAuthenticated = () => {
    return !!getToken();
};
