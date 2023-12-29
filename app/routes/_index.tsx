import type { MetaFunction } from "@remix-run/node";
import { useState } from "react"

export const meta: MetaFunction = () => {
  return [
    { title: "New App" },
    { name: "description", content: "Project in progress" },
  ];
};

export default function Index() {
  const [isDone, setIsDone] = useState(false)
  const headingClicked = () => setIsDone(true)

  return (
    <div>
      <h1 className="
      text-5xl 
      hover:line-through
      text-color-2
      "
      onClick={headingClicked}>{isDone ? "done" : "click here"}</h1>

      {
        Array.from(Array(50)).map(
          (item, index) => (
            <p key={index}>{index}</p>
          )
        )
      }

    </div>
  );
}
