import mensagemTask from  "../mensagens/tasks.js"
import mensagemAmbiente from "../mensagens/ambiente.js"
import criarEvento from "../mensagens/criarEvento.js"
function rotasMensagens(bot, comando, args=null, message){

    if(comando === "/tasks"){
        mensagemTask(bot, comando, args, message)
    }

    if (comando === "/criar" && args[0] === "ambiente") {
        mensagemAmbiente(bot, comando, args, message)
    }

    if (comando === "/criar" && args[0] === "evento") {
        criarEvento(bot, comando, args, message)
    }

}

export default rotasMensagens