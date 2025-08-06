"use client";

import { useEffect, useState } from "react";
import { useRouter }           from "next/navigation";
import pb                     from "../lib/pocketbase";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // load auth model
  useEffect(() => {
    const model = pb.authStore.model;
    if (!model) {
      router.replace("/login");
      return;
    }
    setUser(model);
  }, [router]);

  // subscribe to authStore changes
  useEffect(() => {
    const unsubAuth = pb.authStore.onChange((_, model) => {
      if (!model) router.replace("/login");
      else setUser(model);
    });
    return () => unsubAuth();
  }, [router]);

  // subscribe to realtime updates for this user
  useEffect(() => {
    if (!user) return;

    // register the subscription
    pb.collection("users").subscribe(user.id, (e) => {
      if (e.action === "update" && e.record) {
        setUser(e.record);
      }
    });

    // cleanup by calling `.unsubscribe()` on the collection
    return () => {
      pb.collection("users").unsubscribe(user.id);
    };
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">
        Welcome, {user.first_name} {user.last_name}!
      </h1>
      <p>Email: {user.email}</p>
      <p>Launchpoints: {user.launchpoints}</p>
      <button
        onClick={() => {
          pb.authStore.clear();
          router.push("/login");
        }}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Log Out
      </button>
    </div>
  );
}
