import {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import {signInWithEmailAndPassword } from "firebase/auth";
import { auth,db } from '../config/firebase';
import { useUserStore } from '../store/UserStore';
import { collection, query, where, getDocs } from "firebase/firestore";


const getUserData = async (uid) => {
    try {
        // 👇 Query the 'Users' collection where uid == your UID
        const usersRef = collection(db, "Users");
        const q = query(usersRef, where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            // Get the first matching document
            const userDoc = querySnapshot.docs[0];
            return { id: userDoc.id, ...userDoc.data() };
        } else {
            console.log("No user found with UID:", uid);
            return null;
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}



const Login = () => {

    const { user, setUser, clearUser } = useUserStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            const uid = auth.currentUser.uid;
            const userData = await getUserData(uid);
            setUser(userData);
            if(userData.role === 'doctor') navigate('/doctor');
            if(userData.role === 'student') navigate('/student');
        } catch (error) {
            console.error("Error signing in:", error);
        }
    };

return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from- orange-400 to-blue-600">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">Sign In</h1>
            <form className="space-y-5">
                <div>
                    <label className="block text-gray-700 mb-1" htmlFor="email">Email</label>
                    <input
                        onChange={(e) => { setEmail(e.target.value) }}
                        id="email"
                        type="email"
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="you@example.com"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-1" htmlFor="password">Password</label>
                    <div className="relative">
                        <input
                            onChange={(e) => { setPassword(e.target.value) }}
                            id="password"
                            type={showPassword ? "text" : "password"}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-blue-800 focus:outline-none"
                            tabIndex={-1}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>
                <button
                    type="submit"
                    onClick={handleLogin}
                    className="w-full bg-blue-400 text-white py-2 rounded hover:bg-blue-800 transition font-semibold"
                >
                    Login
                </button>
            </form>
                        <p className="text-center text-gray-500 mt-6">
                                Don't have an account?{' '}
                                <button
                                    type="button"
                                    className="text-blue-800 hover:underline bg-transparent border-none p-0 m-0 cursor-pointer"
                                    onClick={() => navigate('/signup')}
                                >
                                    Sign up
                                </button>
                        </p>
        </div>
    </div>
)
}

export default Login