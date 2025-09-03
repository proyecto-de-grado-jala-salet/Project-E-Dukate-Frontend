import { useRouter } from 'next/navigation';
import { useNavigationStore } from '@/stores/navigationStore';

export const useNavigation = () => {
  const router = useRouter();
  const { setNavigating } = useNavigationStore();

  const navigate = (path: string) => {
    setNavigating(true);
    router.push(path);
    
    setTimeout(() => {
      setNavigating(false);
    }, 5000);
  };

  const navigateWithCallback = (path: string, callback?: () => void) => {
    setNavigating(true);
    router.push(path);
    
    if (callback) {
      callback();
    }
    
    setTimeout(() => {
      setNavigating(false);
    }, 5000);
  };

  return { navigate, navigateWithCallback };
};