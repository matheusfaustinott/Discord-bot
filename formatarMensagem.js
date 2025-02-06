const { EmbedBuilder } = require("discord.js");

const formatarMensagem = async (data, canal) => {
  try {
    console.log("Dados recebidos:", data);

    if (data.action === "work_package:updated") {
      const {
        _embedded: {
          project,
          type,
          priority,
          status,
          author,
          responsible,
          assignee,
          version,
        },
        subject,
        startDate,
        dueDate,
      } = data.work_package;

      const embed = new EmbedBuilder()
        .setColor("#0099ff") // Cor principal do embed
        .setTitle("STT - ATUALIZAÇÃO") // Título do embed
        .setDescription(`Atualização no pacote de trabalho: **${subject}**`)
        .setThumbnail("https://telemedicina.paginas.ufsc.br/files/2023/10/stt.png") // Icone do embed
        .addFields(
          { name: "Projeto", value: project.name, inline: true },
          { name: "Tipo", value: type.name, inline: true },
          { name: "Prioridade", value: priority.name, inline: true },
          { name: "Status", value: status.name, inline: true },
          { name: "Autor", value: author.name, inline: true },
          { name: "Responsável", value: responsible.name, inline: true },
          { name: "Atribuído para", value: assignee.name, inline: true },
          { name: "Versão", value: version.name, inline: true },
          { name: "Início", value: startDate || "Não definido", inline: true },
          { name: "Término", value: dueDate || "Não definido", inline: true }
        )
        .setFooter({
          text: "STT - Sistema de Telemedicina",
          iconURL: "https://telemedicina.paginas.ufsc.br/files/2023/10/stt.png",
        });

      console.log("Mensagem formatada com sucesso:", embed);

      // Envia a mensagem no canal "atualizações"
      if (canal) {
        await canal.send({ embeds: [embed] });
      } else {
        console.error("Canal de atualizações não encontrado.");
      }
    } else {
      console.warn("Ação não suportada ou inválida.");
    }
  } catch (error) {
    console.error("Erro ao formatar ou enviar mensagem:", error);
  }
};

module.exports = {
  formatarMensagem,
};
