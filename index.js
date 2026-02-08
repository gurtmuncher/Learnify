import { createServer } from "node:http";
import { fileURLToPath } from "url";
import { hostname } from "node:os";
import { readdir } from "node:fs/promises";
import path from "node:path";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";


const __dirname = fileURLToPath(new URL(".", import.meta.url));
const publicPath = path.join(__dirname, "public");

logging.set_level(logging.NONE);
Object.assign(wisp.options, {
    allow_udp_streams: false,
    dns_servers: ["1.1.1.3", "1.0.0.3"],
});

const fastify = Fastify({
    serverFactory: (handler) => {
        return createServer()
            .on("request", (req, res) => {
                res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
                res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
                handler(req, res);
            })
    },
});

fastify.get("/api/games", async (req, reply) => {
    try {
        const gmsPath = path.join(publicPath, "gms");
        const folders = await readdir(gmsPath, { withFileTypes: true });
        let games = [];

        for (const folder of folders) {
            if (folder.isDirectory()) {
                const files = await readdir(path.join(gmsPath, folder.name));
                const icon = files.find(f => f.endsWith(".png") || f.endsWith(".jpg"));

                games.push({
                    name: folder.name.replace(/-/g, " "),
                    url: `/gms/${folder.name}/index.html`,
                    icon: icon ? `/gms/${folder.name}/${icon}` : null
                });
            }
        }

        return games;
    } catch (e) {
        console.error(e);
        return [];
    }
});

const PORT = 8001;

fastify.listen({ port: PORT, host: "0.0.0.0" }, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});