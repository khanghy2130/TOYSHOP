import type { MetaFunction } from "@remix-run/node";


export const meta: MetaFunction = () => {
  return [
    { title: "New App" },
    { name: "description", content: "Project in progress" },
  ];
};

export default function Index() {
  return (
    <div>
      <h1 className="text-5xl hover:line-through">homepage</h1>
    </div>
  );
}
