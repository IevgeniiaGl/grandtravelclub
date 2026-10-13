const http = require("http");
const fs = require("fs");
const path = require("path");
const projectRoot = path.resolve(__dirname, "..");

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};
http
  .createServer((request, response) => {
    const file = path.join(
      projectRoot,
      request.url === "/" ? "index.html" : request.url.split("?")[0],
    );
    fs.readFile(file, (error, data) => {
      if (error) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }
      response.writeHead(200, {
        "Content-Type": types[path.extname(file)] || "application/octet-stream",
      });
      response.end(data);
    });
  })
  .listen(4173, "127.0.0.1");
