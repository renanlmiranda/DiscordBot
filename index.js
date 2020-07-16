const { Client, MessageEmbed } = require('discord.js');
const moment = require('moment');
const { prefix, token } = require('./config.json');

const atualDate = moment().subtract(10, 'days').calendar();
const bot = new Client();
const embed = new MessageEmbed();

bot.once('ready', () => {
  bot.user.setActivity('Programming');
  console.log('Started!');
});

bot.login(token);

bot.on('message', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  // Separating text by space to get prefix and the command name.
  const cmdValidation = message.content.slice(prefix.length).trim().split(' ');
  const command = cmdValidation.shift().toLowerCase();
  // "Returning" the space for the text and creating an array of strings separated by ";".
  const tasksValidation = cmdValidation.join(' ').trim().split(';');
  const tasks = await tasksValidation.filter(task => task !== '');

  if (command === 'new') {
    if (!cmdValidation.length) {
      message.channel.send('Adicione uma ou mais tarefas separadas por ;');
    }

    const tasksRepository = [];

    await tasks.forEach(async (task, index) => {
      const taskObject = { name: index, value: task };
      await tasksRepository.push(taskObject);
    });

    const template = embed
      .setTitle(`Planning do dia ${atualDate}`)
      .addFields(tasksRepository)
      .setColor('#0099ff');
    message.channel.send(template);

    // message.channel.send(`Commando: ${command}\nArguments: ${tasksRepository}`);
  }
});
