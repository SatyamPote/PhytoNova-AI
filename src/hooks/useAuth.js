import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuthHook() {
  return useContext(AuthContext);
}

export default useAuthHook;