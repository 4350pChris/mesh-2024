import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createMiddleware } from "@hattip/adapter-node";
import express, { type Request } from "express";
import { telefunc } from "telefunc";
import { renderPage } from "vike/server";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isProduction = process.env.NODE_ENV === "production";
const root = __dirname;
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const hmrPort = process.env.HMR_PORT
  ? parseInt(process.env.HMR_PORT, 10)
  : 24678;

startServer();

async function startServer() {
  const app = express();

  if (isProduction) {
    app.use(express.static(`${root}/dist/client`));
  } else {
    // Instantiate Vite's development server and integrate its middleware to our server.
    // ⚠️ We should instantiate it *only* in development. (It isn't needed in production
    // and would unnecessarily bloat our server in production.)
    const vite = await import("vite");
    const viteDevMiddleware = (
      await vite.createServer({
        root,
        server: { middlewareMode: true, hmr: { port: hmrPort } },
      })
    ).middlewares;
    app.use(viteDevMiddleware);
  }

  app.post(
    "/_telefunc",
    createMiddleware(
      async (context) => {
        const httpResponse = await telefunc({
          url: context.request.url.toString(),
          method: context.request.method,
          body: await context.request.text(),
          context,
        });
        const { body, statusCode, contentType } = httpResponse;
        return new Response(body, {
          status: statusCode,
          headers: {
            "content-type": contentType,
          },
        });
      },
      {
        alwaysCallNext: false,
      },
    ),
  );

  /**
   * Vike route
   *
   * @link {@see https://vike.dev}
   **/
  app.all("*", async (req: Request, res, next) => {
    const pageContextInit = { urlOriginal: req.originalUrl };

    const pageContext = await renderPage(pageContextInit);
    const { httpResponse } = pageContext;

    if (!httpResponse) {
      return next();
    } else {
      const { statusCode, headers } = httpResponse;
      headers.forEach(([name, value]) => res.setHeader(name, value));
      res.status(statusCode);
      httpResponse.pipe(res);
    }
  });

  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });

}
