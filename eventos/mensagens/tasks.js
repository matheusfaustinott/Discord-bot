function mensagemTask(bot, comando, args, message){

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

export default mensagemTask;