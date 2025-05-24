import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div className="App">
      <p className="text-2xl text-center bg-red-600">Hello</p>

      <Button variant="ghost">Its a button</Button>
    </div>
  );
}
