
const verificarServidores = async (canalServidores) => {
  try {
    const response = await fetch(process.env.API_OXIGENOTERAPIA);
    if (response.ok) {
      const data = await response.json();
      await canalServidores.send(`🟢 Oxigenoterapia - ${data.message}`);
    } else {
      await canalServidores.send("🔴 Oxigenoterapia - Serviço off");
    }
  } catch (error) {
    console.error("Erro ao verificar o servidor:", error);
    await canalServidores.send("🔴 Oxigenoterapia - Serviço off");
  }
};

export default verificarServidores;