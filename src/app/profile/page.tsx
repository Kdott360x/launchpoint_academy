"use client";

import { useEffect, useState } from "react";
import { useRouter }           from "next/navigation";
import pb                     from "../lib/pocketbase";

type UserRecord = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  launchpoints: number;
  is_admin: boolean;
};

export default function ProfilePage() {
  const [user, setUser]     = useState<UserRecord|null>(null);
  const [allUsers, setAllUsers] = useState<UserRecord[]>([]);
  const router = useRouter();

  // 1) load/self-guard
  useEffect(() => {
    const m = pb.authStore.model as UserRecord|undefined;
    if (!m) return void router.replace("/login");
    setUser(m);
  }, [router]);

  // 2) keep authStore & realtime in sync (omitted here for brevity)
  //    …your existing useEffects for authStore.onChange and subscribe/unsubscribe…

  // 3) fetch everyone once (only admins)
  useEffect(() => {
    if (user?.is_admin) {
      pb.collection("users")
        .getFullList<UserRecord>({ sort: "email" })
        .then(setAllUsers);
    }
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

      {user.is_admin && (
        <div className="mt-8 p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Admin Actions</h2>
          <button
            onClick={async () => {
              // 1) pick which student by email
              const email = prompt(
                "Enter the student's email to update:"
              )?.trim();
              if (!email) return;

              const target = allUsers.find((u) => u.email === email);
              if (!target) return alert("No user found with that email");

              // 2) pick the new launchpoints value
              const val = prompt("Enter new launchpoints value:");
              if (val == null || isNaN(+val)) return;

              // 3) send the update
              const updated = await pb
                .collection("users")
                .update(target.id, { launchpoints: +val });

              // 4) sync local state
              setAllUsers((u) =>
                u.map((x) => (x.id === updated.id ? updated as UserRecord : x))
              );
              if (updated.id === user.id) setUser(updated as UserRecord);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Update Student Launchpoints
          </button>
        </div>
      )}
    </div>
  );
}
