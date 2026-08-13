import { FC } from "hono/jsx";
import { Layout } from "./Layout";

type LoginProps = {
  error?: string;
  username?: string;
};

export const Login: FC<LoginProps> = ({ error, username = "" }) => (
  <Layout>
    <h1>Staff Login</h1>
    <form method="post" action="/login">
      <label>
        Username
        <input
          type="text"
          name="username"
          value={username}
          required
          autofocus
        />
      </label>
      <label>
        Password
        <input type="password" name="password" required />
      </label>
      {error && (
        <p role="alert">
          <strong>{error}</strong>
        </p>
      )}
      <button type="submit">Log In</button>
    </form>
  </Layout>
);
