import { FC } from "hono/jsx";
import { Layout } from "./Layout";

type ErrorPageProps = { code: 404 | 500; message: string };

export const ErrorPage: FC<ErrorPageProps> = ({ code, message }) => (
  <Layout>
    <article>
      <header>
        <h1>{code === 404 ? "Page Not Found" : "Something Went Wrong"}</h1>
      </header>
      <p>{message}</p>
      <p>
        <a href="/">← Back to AgentClinic</a>
      </p>
    </article>
  </Layout>
);
