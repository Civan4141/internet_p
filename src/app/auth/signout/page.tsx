import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignOutForm from "./SignOutForm";

export default async function SignOutPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              Çıkış Yap
            </h3>
            <p className="text-sm text-gray-300 mb-6">
              Hesabınızdan çıkış yapmak istediğinizden emin misiniz?
            </p>
            <div className="space-y-3">
              <p className="text-sm text-purple-200">
                Merhaba, <span className="font-semibold">{session.user?.name}</span>
              </p>
              <p className="text-xs text-gray-400">
                {session.user?.email}
              </p>
            </div>
          </div>
          
          <SignOutForm />
        </div>
      </div>
    </div>
  );
}
