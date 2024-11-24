import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuthStore } from '../../store/auth';
import { authService } from '../../services/auth';

export const Login = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    console.log('Google Login Success:', credentialResponse);
    try {
      const user = await authService.googleLogin(credentialResponse);
      console.log('Processed User:', user);
      setUser(user);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleError = (error: any) => {
    console.error('Google Login Error:', error);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Welcome to MathMate AI
          </h2>
          <h3 className=" text-center f tracking-tight text-gray-900 dark:text-white">Please login to continue so that we dont get hammered on our backend</h3>
        </div>
        <div className="mt-8 flex justify-center">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap={false}
            flow="implicit"
            auto_select={false}
            ux_mode="popup"
          />
        </div>
      </div>
    </div>
  );
};