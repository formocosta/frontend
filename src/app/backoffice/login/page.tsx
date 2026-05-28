export default function BackofficeLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-primary-green">
      <div className="w-[400px] bg-primary-white p-8 rounded-2xl shadow-2xl">

        <h1 className="text-3xl font-bold text-center text-primary-red mb-2">
          Login
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Faça login para continuar
        </p>

        <form className="space-y-4">

          <div>
            <label className="block mb-1 text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="admin@email.com"
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-primary-green"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Senha
            </label>

            <input
              type="password"
              placeholder="********"
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-primary-green"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-primary-red hover:underline"
            >
              Esqueceu a senha?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-red text-white p-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            Entrar
          </button>

        </form>
      </div>
    </main>
  );
}