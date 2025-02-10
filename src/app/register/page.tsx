"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

import { AuthService } from "@/services/auth/auth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    try {
      setLoading(true);
      await AuthService.register(email, password);

      router.push("/accounts");
      toast.success("Реєстрація успішна! 🎉");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <Link
        href="/"
        className="absolute top-6 left-6 text-white text-lg flex items-center gap-2 hover:text-gray-300 transition-all"
      >
        <ArrowLeft size={20} />
      </Link>
      <div className="relative w-full max-w-md bg-black p-6 text-white">
        <CardHeader className="flex flex-col items-center">
          <h2 className="text-2xl font-semibold mt-4">REGISTER</h2>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input
            type="email"
            autoComplete="new-password"
            placeholder="Email"
            className="group bg-white/20 border border-white/30 text-white focus:ring-gray-500 focus:border-gray-500"
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <Input
              autoComplete="new-password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="bg-white/20 border border-white/30 text-white focus:ring-gray-500 focus:border-gray-500 pr-10"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            disabled={loading}
            className="w-full bg-black hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-300 ease-in-out"
            onClick={handleRegister}
          >
            {loading ? "LOADING" : "SIGN UP"}
          </Button>
        </CardFooter>
      </div>
    </div>
  );
}
