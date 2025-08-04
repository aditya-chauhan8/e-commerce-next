"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const data = await res.json();
      console.log("data------------", data);
      // router.push("/admin");
      router.push(data.redirect);
    } else {
      alert("Invalid credentials");
    }
  };

  const redirectToRegister = () => {
    router.push('/register');
  };

  return (
    <main className="p-6 max-w-sm mx-auto">
      <h2 className="text-xl mb-4">Login</h2>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full mb-4"
      />
      <div className="flex gap-4">

        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-4 py-2"
        >
          Login
        </button>
        <button
          onClick={redirectToRegister}
          className="bg-blue-600 text-white px-4 py-2"
        >
          Register
        </button>
      </div>
    </main>
  );
}
