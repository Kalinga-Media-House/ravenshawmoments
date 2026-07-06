export default function GoogleButton() {
  return (
    <button
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/20 bg-white py-3 font-medium text-gray-700 transition hover:bg-gray-100"
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        className="h-5 w-5"
        alt="Google"
      />

      Continue with Google
    </button>
  );
}