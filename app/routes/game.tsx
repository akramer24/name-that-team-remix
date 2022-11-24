import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { GameStatuses } from "types";
import teamsData from "~/data/teams.json";
import dummy from "~/data/dummy.json";
import Modal from "~/components/Modal";
import Button from "~/components/Button";
import Select from "~/components/Select";

export const loader = async () => {
  const allDummyGames = dummy.games;
  return json(allDummyGames[Math.floor(Math.random() * allDummyGames.length)]);
};

export default function Game() {
  const [guess, setGuess] = useState<string>("");
  const [guesses, setGuesses] = useState<Array<string>>([]);
  const [choices, setChoices] = useState<Array<string>>(teamsData.teams);
  const [clueNumber, setClueNumber] = useState<number>(1);
  const [status, setStatus] = useState<GameStatuses>("active");
  const gameOver = ["won", "lost"].includes(status);
  const viewingHistory = clueNumber <= guesses.length;

  const { clues, answer } = useLoaderData();

  const handlePrev = () => {
    setClueNumber((oldNumber) => oldNumber - 1);
  };

  const handleNext = () => {
    setClueNumber((oldNumber) => oldNumber + 1);
  };

  const handleSubmitGuess = (value: string) => {
    const newGuesses = [...guesses, value];
    setGuesses(newGuesses);
    setGuess("");
    setChoices(teamsData.teams.filter((team) => !newGuesses.includes(team)));

    if (value === answer) {
      setStatus("won");
    } else if (newGuesses.length === clues.length) {
      setStatus("lost");
    } else {
      setClueNumber(clueNumber + 1);
    }
  };

  return (
    <main className="flex flex-col">
      <section className="flex flex-col items-center p-2 space-y-4">
        <div
          className="rounded border border-rounded shadow-md p-1 text-center space-y-1 w-10/12"
          style={{ maxWidth: 380 }}
        >
          <h3 className="text-3xl">Clue #{clueNumber}</h3>
          <p className="text-lg">{clues[clueNumber - 1]}</p>
        </div>
        <div
          id="search"
          className="flex flex-col bg-white space-y-2"
          style={{ width: 300 }}
        >
          <Select
            choices={choices}
            disableOpen={viewingHistory}
            filterFn={(value, choice) =>
              choice.toLowerCase().startsWith(value.toLowerCase()) &&
              !guesses.includes(choice)
            }
            onSelect={setGuess}
            value={viewingHistory ? guesses[clueNumber - 1] : guess}
          />
          <div className="flex space-x-2">
            <Button
              disabled={clueNumber === 1}
              grow
              onClick={() => handlePrev()}
            >
              Prev.
            </Button>
            {viewingHistory ? (
              <Button disabled={gameOver} grow onClick={() => handleNext()}>
                Next
              </Button>
            ) : (
              <Button
                disabled={!guess.length || gameOver}
                grow
                onClick={() => handleSubmitGuess(guess)}
                type="primary"
              >
                Submit Guess
              </Button>
            )}
          </div>
          {!!guesses.length && (
            <div className="flex flex-col">
              <h3 className="text-xl">History</h3>
              {guesses.map((g, i) => (
                <p key={g}>
                  {i + 1}) {g || "SKIPPED"}
                </p>
              ))}
            </div>
          )}
        </div>
      </section>
      {gameOver && (
        <Modal title={status === "won" ? "Congratulations!" : "Game over :("}>
          <p>You {status}!</p>
          {status === "won" ? (
            <p>
              You guessed{" "}
              <span className="font-bold">{guesses[guesses.length - 1]}</span>{" "}
              on Clue #{guesses.length}, and that was the correct answer.
            </p>
          ) : (
            <p>
              Despite seeing {clues.length} clues, you could not guess the
              correct team: <span className="font-bold">{answer}</span>
            </p>
          )}
        </Modal>
      )}
    </main>
  );
}
