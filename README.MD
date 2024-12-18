# Bot Discord com Discord.js

Este é um bot desenvolvido utilizando a biblioteca **[Discord.js](https://discord.js.org/)** e os tipos da **[Discord API Types](https://discord-api-types.dev/)**. O bot foi projetado para interagir com servidores no Discord, oferecendo funcionalidades através de comandos personalizados.

# Dependencias:

- npm install

# Como usar: 

o prefixo adotado para os comanddos é determinado em **const prefixo = "/";**
para verificar **se o bot está on**, verifique seu **console**: 
o código se apresenta no projeto assim:

bot.once("ready", () => {
  console.log(`Bot conectado como ${bot.user.tag}`);
});

# Sobre o código

-o evento de chegada do bot é marcado como guildCreate

-os tipos de sala são classificados como:

0 = chat de texto
4 = categoria
2 = chat de voz

