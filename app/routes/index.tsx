import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <main className="text-center space-y-2">
      <header>
        <h1 className="text-4xl">Welcome to Hoop-le</h1>
      </header>
      <section className="space-y-2">
        <p>
          We provide up to 6 clues about a particular college basketball team
        </p>
        <p>You guess the team that matches</p>
        <p>Up to the task?</p>
        <div className="flex justify-center">
          <Link
            to="/game"
            className="bg-blue-600 text-gray-100 p-2 rounded hover:bg-blue-400 transition"
          >
            PLAY
          </Link>
        </div>
      </section>
    </main>
  );
}
