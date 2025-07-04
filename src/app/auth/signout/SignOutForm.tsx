"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignOutForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut({ 
        callbackUrl: "/",
        redirect: false 
      });
      router.push("/");
    } catch (error) {
      console.error("Çıkış hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="mt-6 flex flex-col space-y-3">
      <button
        onClick={handleSignOut}
        disabled={loading}
        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-md font-medium transition-colors"
      >
        {loading ? "Çıkış yapılıyor..." : "Evet, Çıkış Yap"}
      </button>
      
      <button
        onClick={handleCancel}
        disabled={loading}
        className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 text-white py-2 px-4 rounded-md font-medium transition-colors"
      >
        İptal
      </button>
    </div>
  );
}
