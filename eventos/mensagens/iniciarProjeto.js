import verificarServidores from "../../utils/verificarServidores.js"
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"
let canalServidores;
const checarIntervalo = 2 * 60 * 1000;
async function iniciarProjeto(bot, comando, args=null, message){
    console.log("aqui")
    try {
          const categoriaSTT = await message.guild.channels.create({
            name: "STT",
            type: 4, // Tipo Categoria
          });
    
          // Canais da Categoria STT
          await message.guild.channels.create({
            name: "geral",
            type: 0, // Canal de texto
            parent: categoriaSTT.id,
          });
    
          await message.guild.channels.create({
            name: "executar-comandos",
            type: 0, // Canal de texto
            parent: categoriaSTT.id,
          });
    
          await message.guild.channels.create({
            name: "notificacoes-do-sistema",
            type: 0,
            parent: categoriaSTT.id,
          });
    
          await message.guild.channels.create({
            name: "duvidas",
            type: 0,
            parent: categoriaSTT.id,
          });
    
          const categoriaCODANDO = await message.guild.channels.create({
            name: "CODANDO",
            type: 4, // Tipo 'Categoria'
          });
    
          const canalDuvidasGerais = await message.guild.channels.create({
            name: "duvidas-gerais-STT",
            type: 0,
            parent: categoriaCODANDO.id,
          });
    
          await message.guild.channels.create({
            name: "CODANDO",
            type: 2,
            parent: categoriaCODANDO.id,
          });
    
          await message.guild.channels.create({
            name: "CODANDO2",
            type: 2,
            parent: categoriaCODANDO.id,
          });
    
          const categoriaServidores = await message.guild.channels.create({
            name: "SERVIDORES",
            type: 4,
          });
    
          await message.guild.channels.create({
            name: "servidores",
            type: 0,
            parent: categoriaServidores.id,
          });
    
          //  verificar status dos servidos da oxi
          canalServidores = message.guild.channels.cache.find(
            (ch) => ch.name === "servidores" && ch.type === 0
          );
          verificarServidores(canalServidores);
          setInterval(verificarServidores(canalServidores), checarIntervalo);
    
          const botaoInstalar = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("instalar_stt")
              .setLabel("Instalar STT")
              .setStyle(ButtonStyle.Primary)
          );
    
          await canalDuvidasGerais.send({
            content:
              "** 🤖 Bem-vindo ao canal de dúvidas gerais sobre o projeto STT!**",
            components: [botaoInstalar],
          });
    
          // Mensagem de confirmação no canal original geral
          message.channel.send(
            "✅ Estrutura do projeto **STT** criada com sucesso!"
          );
        } catch (error) {
          console.error("Erro ao criar o projeto STT:", error);
          message.channel.send("❌ Ocorreu um erro ao criar o projeto STT.");
        }
}

export default iniciarProjeto;