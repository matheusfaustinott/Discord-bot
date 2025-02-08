import rotasMensagens from "../rotas/index.js"

const prefixo = "/";
function receberMensagem(bot){
    bot.on("messageCreate", async (message) => {

        //Se a mensagem tiver "/" no começo e não for mensagem de uma conta bot:
        if (message.content.startsWith(prefixo) || message.author.bot){
            const mensagemUsuario = message.content.toLowerCase().split(' ');
            const args = mensagemUsuario.slice(1);
            const comando = mensagemUsuario[0]
            rotasMensagens(bot, comando,args, message)
        }
    })
}

export default receberMensagem;