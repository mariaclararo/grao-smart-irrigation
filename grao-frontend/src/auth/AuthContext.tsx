//gerencia se o usuario tem ou não o token gravado no navegador
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
interface AuthContextType {
    token: string | null;
    setToken: (token: string | null) => void;
    logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem('token');
    });
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);
    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
    };
    return (
        <AuthContext.Provider value={{ token, setToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de AuthProvider');
    }
    return context;
}
