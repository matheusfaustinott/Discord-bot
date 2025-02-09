import { PermissionsBitField } from "discord.js";

async function criarEvento(bot, comando, args, message){
    
    const nomeDoEvento = args[1]; // Nome do evento cada [argumento recebe o que você insere]
    const dataDoEvento = args[2]; // Data do evento
    const cargoMencionado = message.mentions.roles.first(); // Cargo mencionado

    if (!nomeDoEvento || !dataDoEvento || !cargoMencionado) {
      return message.channel.send(
        "Opa! 🤖 Uso incorreto do comando! Use: `/Criar evento {nome} {data} @cargo`."
      );
    }

    try {
      // Cria um canal de texto para o evento
      const canalEvento = await message.guild.channels.create({
        name: `evento-${nomeDoEvento}`,
        type: 0, // Canal de texto
        permissionOverwrites: [
          {
            id: message.guild.id,
            deny: [PermissionsBitField.Flags.ViewChannel], // Impede que todos vejam o canal
          },
          {
            id: cargoMencionado.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
            ],
          },
          {
            id: message.author.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.ManageChannels,
            ],
          },
        ],
      });

      // Envia uma mensagem dentro do canal com os detalhes do evento
      await canalEvento.send({
        content: `📅 **Evento Criado!**\n\n**Nome:** ${nomeDoEvento}\n**Data:** ${dataDoEvento}\n\n🔔 Apenas o cargo <@&${cargoMencionado.id}> tem acesso a este evento.`,
      });

      // Notifica os membros do cargo mencionado
      cargoMencionado.members.forEach((membro) => {
        membro
          .send(
            `Olá! 🤖 Você foi convidado para o evento **${nomeDoEvento}** que acontecerá em **${dataDoEvento}**.\nAcesse o canal: <#${canalEvento.id}>`
          )
          .catch(() =>
            console.warn(
              `Não foi possível enviar mensagem para ${membro.user.tag}`
            )
          );
      });

      message.channel.send(
        `✅ O evento **${nomeDoEvento}** foi criado com sucesso para o cargo <@&${cargoMencionado.id}>.`
      );
    } catch (error) {
      console.error("Erro ao criar o evento:", error);
      message.channel.send("❌ Ocorreu um erro ao criar o evento.");
    }

}

export default criarEvento;