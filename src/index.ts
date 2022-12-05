import { Router } from '@tsndr/cloudflare-worker-router'
import createPage from './createPage';
import redirect from './redirectPage';
import Shortener from './shortener';

export interface Env {
    KEY: string,
    URLS: KVNamespace
}

const router = new Router<Env>();
let shortener: Shortener | null = null;

router.get("/", async ({ req, res, env }) => {
    res.headers.append("Content-Type", "text/html");
    res.body = createPage();
});

router.post("/delete", async ({ req, res, env }) => {
    const { id, key } = req.body;
    res.headers.append("Content-Type", "application/json");

    if (key != env.KEY) {
        res.status = 401;
        res.body = {err: 'Unauthorized'};
        return;
    }

    if (!shortener) shortener = new Shortener(env);

    try {
        if (!await shortener.deleteURL(id)) throw new Error("Could not delete");
        res.status = 200;
        res.body = { ok: true };
    } catch (err) {
        res.status = 403;
        res.body = { err: (err as Error).message };
    }
})

router.post("/create", async ({ req, res, env }) => {
    const { url, key } = req.body;
    res.headers.set("Content-Type", "application/json");

    if (key != env.KEY) {
        res.status = 401;
        res.body = {err: 'Unauthorized'};
        return;
    }

    if (!shortener) shortener = new Shortener(env);

    try {
        const id = await shortener.storeURL(url);
        if (id == null) throw new Error("Not a valid URL");

        res.status = 200;
        res.body = { id, url };
    } catch (err) {
        res.status = 403;
        res.body = { err: (err as Error).message };
    }
});

router.get("/:id", async ({ req, res, env }) => {
    const id = req.params.id;
    res.headers.append("Content-Type", "text/html");
    if (!shortener) shortener = new Shortener(env);

    try {
        const url = await shortener.getData(id);
        if (url == null) throw new Error('Not found');

        res.status = 200;
        res.body = redirect(url);
    } catch (err) {
        res.status = 404;
        res.body = `<h1>404</h1><p>${(err as Error).message}</p>`;
    }
})

export default {
    async fetch(request: Request, env: Env, context: ExecutionContext): Promise<Response> {
        if (!shortener) shortener = new Shortener(env);
        return router.handle(env, request);
    }
}