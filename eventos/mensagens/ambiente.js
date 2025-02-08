import { PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

async function mensagemAmbiente(bot, comando, args, message){
  // const PermissionsBitField = permissao.PermissionsBitField
  // console.log(teste.Flags.ViewChannel) 
  const nomeDoAmbiente = args[1];
  const usuarios = message.mentions.members;

  if (!nomeDoAmbiente) {
    return message.channel.send(
      "Opa! 🤖 Por favor, insira o nome do ambiente."
    );
  }

  if (usuarios.size === 0) {
    return message.channel.send(
      " Opa! 🤖 Por favor, mencione pelo menos um usuário."
    );
  }

  try {
    const categoria = await message.guild.channels.create({
      name: nomeDoAmbiente,
      type: 4,
    });

    const chatDev = await message.guild.channels.create({
      name: `DEV-${message.author.username}`,
      type: 0,
      parent: categoria.id,
      permissionOverwrites: [
        {
          id: message.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: message.author.id,
          allow: [PermissionsBitField.Flags.ViewChannel],
        },
      ],
    });

    const cargo = await message.guild.roles.create({
      name: nomeDoAmbiente,
    });

    usuarios.forEach((membro) => {
      membro.roles
        .add(cargo)
        .catch((err) => console.error(`❌ Erro ao adicionar cargo: ${err}`));
    });

    usuarios.forEach((membro) => {
      chatDev.permissionOverwrites.create(membro.id, {
        ViewChannel: true,
      });
    });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("criar_task")
        .setLabel("Criar Task")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("marcar_reuniao")
        .setLabel("Marcar Reunião")
        .setStyle(ButtonStyle.Success)
    );

    await chatDev.send({
      content: `Olá 🤖 ${message.author}, o que deseja fazer? Escolha uma opção abaixo:`,
      components: [row],
    });

    message.channel.send(
      `✅ Ambiente "${nomeDoAmbiente}" criado com sucesso!`
    );

    categoria.permissionOverwrites.create(cargo, {
      ViewChannel: true,
    });

    categoria.permissionOverwrites.create(message.guild.id, {
      ViewChannel: false,
    });

    categoria.permissionOverwrites.create(message.author.id, {
      ViewChannel: true,
    });

    // Adiciona evento para deletar o cargo ao excluir a categoria
    bot.on("channelDelete", async (canalDeletado) => {
      if (canalDeletado.id === categoria.id) {
        const roleToDelete = message.guild.roles.cache.find(
          (role) => role.id === cargo.id
        );
        if (roleToDelete) {
          await roleToDelete
            .delete()
            .catch((err) => console.error("Erro ao excluir o cargo:", err));
        }
      }
    });
  } catch (error) {
    console.error("Erro ao criar ambiente:", error);
    message.channel.send(
      " ❌ Ocorreu um erro ao criar o ambiente. Verifique minhas permissões e tente novamente."
    );
  }
      
}

export default mensagemAmbiente;