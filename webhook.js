// const express = require('express');
// const fetch = require('node-fetch');
// const app = express();

// app.use(express.json());

// app.post('/monitor-webhook', async (req, res) => {
//     const data = req.body;
//     console.log('Atualização recebida:', JSON.stringify(data));
//     res.status(200).send('Atualização recebida');
// });

// app.get('/monitor-webhook', async (req, res) => {
//     const data = req.body;
//     console.log('Atualização recebida:', data);
//     res.status(200).send('Atualização recebida');
//     return res;
// });

// const PORT = 3050;
// app.listen(PORT, () => {
//     console.log(`Servidor rodando na porta ${PORT}`);
// });

const express = require("express");
const { enviarMensagemFormatada } = require("./discord");

const app = express();
app.use(express.json());

app.post("/monitor-webhook", async (req, res) => {
  const data = req.body;

  try {
    await enviarMensagemFormatada(data);
    res.status(200).send("Atualização enviada ao Discord");
  } catch (error) {
    console.error("Erro ao processar a mensagem:", error);
    res.status(500).send("Erro ao enviar a mensagem ao Discord");
  }
});

const PORT = 3050;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
