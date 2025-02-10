import mensagemTask from  "../mensagens/tasks.js"
import mensagemAmbiente from "../mensagens/ambiente.js"
import criarEvento from "../mensagens/criarEvento.js"
import iniciarProjeto from "../mensagens/iniciarProjeto.js"
function rotasMensagens(bot, comando, args=null, message){
    console.log("comando, args", comando, args)
    //considerar todas as mensagens em letras minusculas

    if(comando === "/tasks"){
        mensagemTask(bot, comando, args, message)
    }

    if (comando === "/criar" && args[0] === "ambiente") {
        mensagemAmbiente(bot, comando, args, message)
    }

    if (comando === "/criar" && args[0] === "evento") {
        criarEvento(bot, comando, args, message)
    }

    if (comando === "/iniciar" && args[0] === "projeto" && args[1] === "stt"){
        iniciarProjeto(bot, comando, args, message)
    }

}

export default rotasMensagens