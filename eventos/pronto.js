function eventoProntidao(bot) {
    bot.once("ready", () => {
        console.log(`Bot conectado como ${bot.user.tag}`);

        const guild = bot.guilds.cache.get('1318225776369467453');
        if (guild) {
            let canalAtualizacoes = guild.channels.cache.get('1319672059563085906');
            if (canalAtualizacoes) {
                console.log(`Canal encontrado: ${canalAtualizacoes.name}`);
                canalAtualizacoes.send("Bot configurado e pronto para uso!");
            } else {
                console.log("Canal não encontrado.");
            }
        } else {
            console.log("Guild não encontrada.");
        }
    });
    return 
}

export default eventoProntidao;
