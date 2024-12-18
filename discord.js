const {
  Client,
  GatewayIntentBits,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const path = require('path'); 
require('dotenv').config();

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const prefixo = "/";
const token =process.env.DISCORD_TOKEN;

bot.once("ready", () => {
  console.log(`Bot conectado como ${bot.user.tag}`);
});

// Evento de entrada no servidor
bot.on("guildCreate", async (guild) => {
  const canal = guild.channels.cache.find(
    (ch) => ch.name === "geral" && ch.type === 0
  );

  if (canal) {
    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("👋 Olá! Estou ativo no servidor para dar suporte a vocês!")
      .setDescription("Aqui estão meus comandos disponíveis:")
      .addFields(
        {
          name: "🛠️ /Iniciar projeto STT",
          value: "Configura o ambiente do nosso Discord de Telemed.",
        },
        {
          name: "🔒 Criar ambiente {nome} @usuário1 @usuário2 - aqui você dará permissoes espeficicas e cargos",
          value: "Cria um ambiente de trabalho privado.",
        },
        {
          name: " 📅 Criar evento {nome do evento} {data do evento ex: 12/12} @usuário1 @usuário2 - aqui você dará permissoes espeficicas e cargos",
          value: "Cria um evento de trabalho privado.",
        }
      )
      .setImage(
        "https://telemedicina.paginas.ufsc.br/files/2023/06/mapa-mental-STT-v2-1-e1715258886214-1024x515.png"
      )
      .setFooter({
        text: "Estou aqui para ajudar! 🤖",
        iconURL: "https://telemedicina.paginas.ufsc.br/files/2023/10/stt.png",
      });

    await canal.send({ embeds: [embed] });
  }
});

// Comandos de interação
bot.on("messageCreate", async (message) => {
  if (!message.content.startsWith(prefixo) || message.author.bot) return;

  const [comando, ...args] = message.content
    .slice(prefixo.length)
    .trim()
    .split(/ +/);

  if (comando === "tasks") {
    try {
      const categorias = message.guild.channels.cache
        .filter((ch) => ch.type === 4)
        .filter((categoria) =>
          categoria.permissionsFor(message.author).has("ViewChannel")
        );

      if (categorias.size === 0) {
        return message.channel.send(
          ` ❌ ${message.author}, você não está inserido em nenhuma categoria.`
        );
      }
      const tabela = categorias
        .map((categoria) => `- ${categoria.name}`)
        .join("\n");

      message.channel.send(
        `📂 **Categorias em que você está inserido:**\n${tabela}`
      );
    } catch (error) {
      console.error("Erro ao listar categorias:", error);
      message.channel.send(
        " ❌ Ocorreu um erro ao listar as categorias. Tente novamente mais tarde."
      );
    }
  }

  if (comando === "Criar" && args[0] === "ambiente") {
    const nomeDoAmbiente = args[1];
    const usuarios = message.mentions.members;

    if (!nomeDoAmbiente) {
      return message.channel.send("Opa! 🤖 Por favor, insira o nome do ambiente.");
    }

    if (usuarios.size === 0) {
      return message.channel.send(" Opa! 🤖 Por favor, mencione pelo menos um usuário.");
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

      message.channel.send(`✅ Ambiente "${nomeDoAmbiente}" criado com sucesso!`);

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
  if (comando === "Criar" && args[0] === "evento") {
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
  if (comando === "Iniciar" && args[0] === "projeto" && args[1] === "STT") {
    try {
      // Criação da Categoria STT
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

      // Criação da Categoria CODANDO
      const categoriaCODANDO = await message.guild.channels.create({
        name: "CODANDO",
        type: 4, // Tipo 'Categoria'
      });

      // Canal 'duvidas-gerais-STT' com botão interativo
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

      // Botão de interação
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

      // Mensagem de confirmação no canal original
      message.channel.send(
        "✅ Estrutura do projeto **STT** criada com sucesso!"
      );
    } catch (error) {
      console.error("Erro ao criar o projeto STT:", error);
      message.channel.send("❌ Ocorreu um erro ao criar o projeto STT.");
    }
  }
});

// Eventos para botões interativos
bot.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  const categoria = interaction.channel.parent;

  if (!categoria) {
    return interaction.reply({
      content:
        "Erro: Não foi possível encontrar a categoria. Certifique-se de estar em um canal associado a uma categoria.",
      ephemeral: true,
    });
  }

  if (interaction.customId === "criar_task") {
    await interaction.reply({
      content: "Olá 🤖 Por favor, digite o nome do chat de texto que deseja criar.",
      ephemeral: true,
    });

    const filter = (m) =>
      m.author.id === interaction.user.id &&
      m.channel.id === interaction.channel.id;
    const collector = interaction.channel.createMessageCollector({
      filter,
      time: 60000,
    });

    collector.on("collect", async (msg) => {
      collector.stop();
      const nomeDoCanal = msg.content;

      try {
        const taskChannel = await interaction.guild.channels.create({
          name: nomeDoCanal,
          type: 0, // Canal de texto
          parent: categoria.id,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
              id: interaction.user.id,
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
              ],
            },
          ],
        });

        interaction.channel.send(
          `✅ Canal de texto "${nomeDoCanal}" criado com sucesso.`
        );
        const membros = categoria.guild.members.cache.filter((membro) =>
          membro
            .permissionsIn(categoria)
            .has(PermissionsBitField.Flags.ViewChannel)
        );

        membros.forEach((membro) => {
          taskChannel.permissionOverwrites
            .create(membro.id, {
              ViewChannel: true,
              SendMessages: true,
            })
            .catch((err) =>
              console.error(
                `Erro ao dar permissão ao membro ${membro.id}:`,
                err
              )
            );
        });

        // Notifica os membros da categoria
        membros.forEach((membro) => {
          membro
            .send(
              `Olá 🤖, Um novo chat de texto "${nomeDoCanal}" foi criado na categoria ${categoria.name}. Veja a sala: <#${taskChannel.id}>.`
            )
            .catch(() => {});
        });
      } catch (err) {
        console.error("Erro ao criar o canal de texto:", err);
        interaction.channel.send("❌ Ocorreu um erro ao criar o canal de texto.");
      }
    });
  } else if (interaction.customId === "marcar_reuniao") {
    try {
      const voiceChannel = await interaction.guild.channels.create({
        name: `reuniao-${interaction.user.username}`,
        type: 2, // Canal de voz
        parent: categoria.id,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [PermissionsBitField.Flags.ViewChannel],
          },
          {
            id: interaction.user.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.Connect,
            ],
          },
        ],
      });

      interaction.reply(
        ` 🔈Canal de voz "${voiceChannel.name}" criado. Veja o canal: <#${voiceChannel.id}>. Será excluído automaticamente se não houver atividade em 5 minutos.`
      );

      // Permite que todos os membros da categoria vejam e entrem no novo canal de voz
      const membros = categoria.guild.members.cache.filter((membro) =>
        membro
          .permissionsIn(categoria)
          .has(PermissionsBitField.Flags.ViewChannel)
      );

      membros.forEach((membro) => {
        voiceChannel.permissionOverwrites
          .create(membro.id, {
            ViewChannel: true,
            Connect: true, // Permite que o membro entre no canal de voz
          })
          .catch((err) =>
            console.error(`Erro ao dar permissão ao membro ${membro.id}:`, err)
          );
      });

      // Monitorando a atividade no canal de voz
      const monitor = setInterval(async () => {
        const canalAtualizado = await voiceChannel.fetch();
        if (canalAtualizado.members.size === 0) {
          clearInterval(monitor);
          voiceChannel
            .delete()
            .catch((err) =>
              console.error("Erro ao deletar canal de voz:", err)
            );
        }
      }, 60000);

      // Notifica os membros da categoria
      membros.forEach((membro) => {
        membro
          .send(
            `Olá 🤖 Um novo canal de voz 🔈 "${voiceChannel.name}"  foi criado na categoria ${categoria.name}.Veja o canal: <#${voiceChannel.id}>`
          )
          .catch(() => {});
      });
    } catch (err) {
      console.error("Erro ao criar canal de voz:", err);
      interaction.reply({
        content: " ❌ Ocorreu um erro ao criar o canal de voz.",
        ephemeral: true,
      });
    }
  }

  if (interaction.customId === "instalar_stt") {
    const pdfPath = path.join(__dirname, 'instalacao_stt.pdf');
    await interaction.reply({
      content: "🚀 **Enviando tutorial para seu privado**\nPor favor, aguarde!",
      ephemeral: true,
    });

    await interaction.user.send({
      content: 'Olá 🤖, Segue abaixo o PDF de instalação do STT 📁 :',
      files: [pdfPath],
    });
  }
});

bot.login(token);
