import eventoProntidao from "./pronto.js";
import receberMensagem from "./mensagens/index.js"

export default function registrarEventos(bot){
    eventoProntidao(bot);
    receberMensagem(bot);
}
