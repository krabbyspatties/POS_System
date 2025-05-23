import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error("Route Error:", error);
  return (
    <div>
      <h1>Error!</h1>
      <pre>{JSON.stringify(error, null, 2)}</pre>
    </div>
  );
}
