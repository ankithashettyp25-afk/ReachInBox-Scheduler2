
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const finishLogin = async () => {
      await refreshUser();
      navigate("/", { replace: true });
    };

    void finishLogin();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
      Completing Google login...
    </div>
  );
}
