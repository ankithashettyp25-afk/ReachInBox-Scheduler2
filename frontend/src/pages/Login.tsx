
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import api from "../services/api";
import { loginWithGoogle } from "../services/auth";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/login", { email, password });
      await refreshUser();
      navigate("/");
    } catch (error: any) {
  const message =
    error.response?.data?.message ||
    "Unable to login. Please try again.";

  toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">

      <div className="w-full max-w-[306px] border border-gray-200 rounded-lg p-[34px]">

        <h1 className="text-center text-[24px] font-bold mb-4">
          Login
        </h1>

        <button
          onClick={loginWithGoogle}
          className="w-full h-[30px] rounded-lg bg-[#e4f5eb] hover:bg-[#d8f0e2] text-[11px] flex justify-center items-center gap-2"
        >
          <span className="font-bold text-blue-500 text-sm">G</span>
          Login with Google
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-[9px] text-gray-400">
            or sign up through email
          </span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        <form onSubmit={handleLogin} className="space-y-[7px]">

          <div className="relative">
            <Mail size={13} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              required
              placeholder="Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[36px] rounded-lg bg-[#f3f6f4] pl-9 pr-3 text-[11px] outline-none focus:ring-1 focus:ring-green-400"
            />
          </div>

          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-[36px] rounded-lg bg-[#f3f6f4] px-3 text-[11px] outline-none focus:ring-1 focus:ring-green-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[30px] mt-[10px] rounded-lg bg-[#00a63e] hover:bg-green-700 text-white text-[11px] disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>
      </div>
    </div>
  );
}
