const express = require("express");
const http = require("http");
const https = require("https");
const cors = require("cors");
const { URL } = require("url");

const app = express();
app.use(cors());

app.get("/proxy", (req, res) => {
  const target = req.query.url;
  if (!target) return res.status(400).send("URL não informada");

  try {
    const parsedUrl = new URL(target);
    const client = parsedUrl.protocol === "https:" ? https : http;

    const options = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "*/*",
        "Accept-Language": "pt-BR,pt;q=0.9",
        "Connection": "keep-alive",
        "Referer": parsedUrl.origin,
        "Range": req.headers.range || ""
      }
    };

    client.get(target, options, (stream) => {
      res.writeHead(stream.statusCode, stream.headers);
      stream.pipe(res);
    }).on("error", () => {
      res.status(500).send("Erro ao conectar no servidor IPTV");
    });

  } catch {
    res.status(400).send("URL inválida");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log("Proxy IPTV rodando na porta " + PORT)
);
