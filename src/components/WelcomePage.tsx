import React from "react";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A1A41]">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#121C48] rounded-lg shadow-lg text-white">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-yellow-500">PROVIDENCE TRADE</h1>
          <p className="text-sm text-gray-400">A LEGACY OF SMART INVESTMENTS</p>
        </div>

        {/* Products Selection */}
        <div className="flex justify-center space-x-4">
          <button className="px-4 py-2 border rounded-full bg-[#1E2A5A] text-white">
            📈 Stocks
          </button>
          <button className="px-4 py-2 border rounded-full bg-[#1E2A5A] text-white">
            💰 Mutual Funds
          </button>
          <button className="px-4 py-2 border rounded-full bg-[#1E2A5A] text-white">
            🏦 IPO
          </button>
        </div>

        {/* Sign-in Form */}
        <div>
          <h2 className="text-lg font-semibold">Sign in</h2>
          <p className="text-sm text-gray-400">
            If you don’t have an account,{" "}
            <a href="#" className="text-pink-400 underline">
              Register here!
            </a>
          </p>

          <form className="mt-4">
            <div className="mb-4">
              <label className="block text-sm">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 mt-1 rounded bg-[#1E2A5A] text-white outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 mt-1 rounded bg-[#1E2A5A] text-white outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div className="flex items-center justify-between text-sm text-gray-400">
              <div>
                <input type="checkbox" id="rememberMe" className="mr-2" />
                <label htmlFor="rememberMe">Remember me</label>
              </div>
              <a href="#" className="text-pink-400">Forgot password?</a>
            </div>

            <button className="w-full mt-4 py-2 bg-pink-500 rounded-lg text-white font-bold">
              Login
            </button>
          </form>
        </div>

        {/* Social Login */}
        <div className="text-center">
          <p className="text-sm text-gray-400">or continue with</p>
          <div className="flex justify-center space-x-4 mt-2">
            <button className="p-2 bg-[#1E2A5A] rounded-full">🔵 Facebook</button>
            <button className="p-2 bg-[#1E2A5A] rounded-full">🟢 Google</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
