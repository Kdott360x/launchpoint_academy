"use client";

import { FormEvent, useState } from "react";
import { useRouter }           from "next/navigation";
import pb                     from "../lib/pocketbase";

export default function LoginPage() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState<string|null>(null);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Authenticate against the 'users' collection
      await pb.collection("users").authWithPassword(email, password);
      router.push("/profile");
    } catch {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Log In</h1>
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full p-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-green-600 text-white rounded"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
