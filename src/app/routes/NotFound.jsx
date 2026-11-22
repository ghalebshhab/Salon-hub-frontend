import ErrorPage from "../../shared/components/ErrorPage.jsx";

/** Any address that matches no route. */
export default function NotFound() {
  return <ErrorPage kind="notFound" />;
}
