import eventoProntidao from "./pronto.js";
// import messageCreateEvent from "./messageCreate.js";
// import guildMemberAddEvent from "./guildMemberAdd.js";
// import voiceStateUpdateEvent from "./voiceStateUpdate.js";
// import mensagemTask from "./comandos/mensagens/tasks.js"
// import mensagemAmbiente from "./comandos/mensagens/ambiente.js"
import receberMensagem from "./mensagens/index.js"

export default function registrarEventos(bot){
    eventoProntidao(bot);
    console.log("RODANDO AQUI")
    receberMensagem(bot);
    // mensagemTask(bot);
    // mensagemAmbiente(bot);
}

