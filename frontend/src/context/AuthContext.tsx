// zentrale Authentifizierung im Frontend, jede Seite kann hierauf zugreifen 
import { createContext, useState, useEffect, useContext, type ReactNode } from 'react'
import api from '../api/axios';

// User Objekt 
export interface User {
    id: number;
    email: string;
    name: string;
    role: string;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean; 
    login: (token: string, user: User) => void; 
    logout: () => void;
}

//Zentraler Context für alle Komponenten
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

//useState(): gibt ein array mit zwei Elementen zurück:
//erste Stelle: aktueller Wert im Speicher, zweite Stelle: Funktion, mit der man den Wert ändern kann
// =>: eif andere schreibweise zur funktion
export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const login = (newToken: string, newUser: User) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    }

    useEffect(() => {
        const checkAuthStatus = async() => {
            if (token) {
                try {
                    const resp = await api.get<User>('/users/me');
                    setUser(resp.data);
                } catch (error) {
                    console.error('Session invalid or timed out:', error);
                    logout();
                }
            }
            setIsLoading(false);
        };
        checkAuthStatus();
    }, [token]);

    const isAuthenticated = !!token && !!user; //Beides muss geladen sein für true

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth has to be used inside a AuthProvider.');
    }
    return context;
};
