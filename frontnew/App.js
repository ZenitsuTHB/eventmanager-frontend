import { onAuthStateChanged } from 'firebase/auth';


const { user, setUser } = useUserContext();

useEffect(() => {
  onAuthStateChanged(auth, user => {
    setUser(user);
  });
}, []);

return user ? <Router /> : <Login />