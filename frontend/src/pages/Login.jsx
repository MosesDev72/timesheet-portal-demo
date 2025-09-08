import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/timesheet');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start">
      <div className="h-1/3 flex items-center justify-center">
        <img src="/logo.png" alt="Company Logo" className="h-40 mx-auto" />
      </div>
      <div className="mt-12 max-w-md w-full bg-white p-6 rounded-lg shadow-2xl">
        <h1 className="text-2xl font-bold mb-8 text-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>Login</h1>
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <input
              type="text"
              placeholder="Username"
              className="w-5/12 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              style={{ fontFamily: 'Merriweather, serif' }}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-5/12 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 ml-4"
              style={{ fontFamily: 'Merriweather, serif' }}
            />
          </div>
          <a href="#" className="block text-center text-blue-600 hover:underline mb-8" style={{ fontFamily: 'Merriweather, serif' }}>Forgot password?</a>
          <button
            onClick={handleLogin}
            className="w-5/6 bg-blue-600 text-white p-1 rounded-2xl hover:bg-blue-700 transition-colors mx-auto block"
            style={{ fontFamily: 'Merriweather, serif' }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
