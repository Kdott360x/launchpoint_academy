"use client";

import { FormEvent, useState } from "react";
import { useRouter }           from "next/navigation";
import pb                     from "../lib/pocketbase";

export default function SignUpPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [error,     setError]     = useState<string|null>(null);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Create a new user in the 'users' auth collection
      await pb.collection("users").create({
        first_name:      firstName,
        last_name:       lastName,
        email,
        password,
        passwordConfirm: password,
        launchpoints:    0,            // start everyone at zero
      });

      // Immediately authenticate
      await pb.collection("users").authWithPassword(email, password);

      router.push("/profile");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Sign Up</h1>
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          placeholder="First name"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          required
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Last name"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          required
        />
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
          className="w-full py-2 bg-blue-600 text-white rounded"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}
