import LoginForm from "@/components/auth/LoginForm";
import GoogleButton from "@/components/auth/GoogleButton";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#5C0A0A] via-[#7B1113] to-[#320303]">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Left Side */}
        <div className="hidden lg:flex flex-col justify-center px-20 text-white">
          <h1 className="text-6xl font-extrabold leading-tight">
            Ravenshaw
            <br />
            Moments
          </h1>

          <p className="mt-8 max-w-xl text-lg text-white/80">
            A digital ecosystem connecting Ravenshawvians through
            memories, departments, hostels, organizations,
            competitions, achievements and alumni.
          </p>

          <div className="mt-12 flex gap-10">
            <div>
              <h2 className="text-4xl font-bold">25K+</h2>
              <p className="text-white/70">Students</p>
            </div>

            <div>
              <h2 className="text-4xl font-bold">150+</h2>
              <p className="text-white/70">Years Legacy</p>
            </div>

            <div>
              <h2 className="text-4xl font-bold">100K+</h2>
              <p className="text-white/70">Memories</p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-center p-6">
          <div className="w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8">

            <div className="text-center">
              <h2 className="text-3xl font-bold text-white">
                Welcome Back
              </h2>

              <p className="mt-2 text-white/70">
                Login to continue
              </p>
            </div>

            <div className="mt-8">
              <LoginForm />
            </div>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/20" />
              <span className="text-sm text-white/60">
                OR
              </span>
              <div className="h-px flex-1 bg-white/20" />
            </div>

            <GoogleButton />

            <div className="mt-6 flex justify-between text-sm">

              <Link
                href="/forgot-password"
                className="text-yellow-300 hover:underline"
              >
                Forgot Password?
              </Link>

              <Link
                href="/register"
                className="text-yellow-300 hover:underline"
              >
                Create Account
              </Link>

            </div>

          </div>
        </div>

      </div>
    </main>
  );
}