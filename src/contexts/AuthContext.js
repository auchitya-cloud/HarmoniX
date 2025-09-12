import React, {
    createContext,
    useContext,
    useState,
    useEffect
} from 'react';
// import { 
//   signInWithEmailAndPassword, 
//   createUserWithEmailAndPassword, 
//   signOut, 
//   onAuthStateChanged,
//   updateProfile 
// } from 'firebase/auth';
// import { auth } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({
    children
}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mock authentication for development (remove when Firebase is set up)
    useEffect(() => {
        // Simulate checking for existing auth
        const savedUser = localStorage.getItem('mockUser');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    // Firebase auth state listener (uncomment when Firebase is set up)
    /*
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });

      return unsubscribe;
    }, []);
    */

    const login = async (email, password) => {
        try {
            setLoading(true);

            // Mock login (replace with Firebase)
            if (email && password) {
                const mockUser = {
                    uid: 'mock-uid',
                    email: email,
                    displayName: email.split('@')[0],
                    photoURL: null
                };
                setUser(mockUser);
                localStorage.setItem('mockUser', JSON.stringify(mockUser));
                return {
                    success: true
                };
            }

            // Firebase login (uncomment when set up)
            /*
            const result = await signInWithEmailAndPassword(auth, email, password);
            return { success: true, user: result.user };
            */

            throw new Error('Invalid credentials');
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Login failed'
            };
        } finally {
            setLoading(false);
        }
    };

    const register = async (email, password, displayName) => {
        try {
            setLoading(true);

            // Mock registration (replace with Firebase)
            if (email && password && displayName) {
                const mockUser = {
                    uid: 'mock-uid-' + Date.now(),
                    email: email,
                    displayName: displayName,
                    photoURL: null
                };
                setUser(mockUser);
                localStorage.setItem('mockUser', JSON.stringify(mockUser));
                return {
                    success: true
                };
            }

            // Firebase registration (uncomment when set up)
            /*
            const result = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(result.user, { displayName });
            return { success: true, user: result.user };
            */

            throw new Error('Registration failed');
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Registration failed'
            };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            // Mock logout (replace with Firebase)
            setUser(null);
            localStorage.removeItem('mockUser');

            // Firebase logout (uncomment when set up)
            // await signOut(auth);

            return {
                success: true
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Logout failed'
            };
        }
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user
    };

    return ( <
        AuthContext.Provider value = {
            value
        } > {
            children
        } <
        /AuthContext.Provider>
    );
};