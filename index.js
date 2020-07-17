const { Client, MessageEmbed, Collection } = require('discord.js');
const moment = require('moment');
const fs = require('fs');

const { prefix } = require('./config.json');
const { token } = require('./config');

const todayDate = moment().subtract(10, 'days').calendar();
const bot = new Client({ disableEveryone: false });
const embed = new MessageEmbed();

bot.commands = new Collection();

const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  bot.commands.set(command.name, command);
}

bot.once('ready', () => {
  console.log('Started!');
});

bot.on('message', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const cmdValidation = message.content.slice(prefix.length).trim().split(' ');
  const command = cmdValidation.shift().toLowerCase();
  const tasksValidation = cmdValidation.join(' ').trim().split(';');
  const args = await tasksValidation.filter((task) => task !== '');

  if (!bot.commands.has(command)) return;

  try {
    bot.commands
      .get(command)
      .execute(message, args, cmdValidation, command, tasksValidation);
  } catch (err) {
    console.log(err);
    message.replay('Algum erro aconteceu!');
  }
});

bot.login(token);

// fs.readdir('./commands', (err, files) => {
//   if (erro) {
//     console.log(err);
//   }

//   const fileJs = files.filter((file) => file.split('.').pop() === 'js');

//   fileJs.forEach((file, i) => {
//     const props = require(`./commands/${file}`);
//     console.log(`${file} iniciado com sucesso!`);
//     bot.commands.set(props.help.name, props);
//   });
// });

// bot.once('ready', () => {
//   console.log('Started!');
// });

// bot.login(token);

// bot.on('message', async message => {
//   if (!message.content.startsWith(prefix) || message.author.bot) return;
//   // Separating text by space to get prefix and the command name.
//   const cmdValidation = message.content.slice(prefix.length).trim().split(' ');
//   const command = cmdValidation.shift().toLowerCase();
//   // "Returning" the space for the text and creating an array of strings separated by ";".
//   const tasksValidation = cmdValidation.join(' ').trim().split(';');
//   const args = await tasksValidation.filter(task => task !== '');

//   // TASK CREATE COMMAND.args
//   if (command === 'new') {
//     try {
//       if (!cmdValidation.length) {
//         await message.channel
//           .send('Adicione uma ou mais tarefas separadas por ;')
//           .then(msg => {
//             msg.delete({ timeout: 10000 });
//           })
//           .catch(err => {
//             console.log(err);
//           });
//       }

//       const tasksRepository = [];

//       await args.forEach(async (task, index) => {
//         const taskObject = { name: `Task ${index + 1}`, value: task };
//         await tasksRepository.push(taskObject);
//       });

//       const template = embed
//         .setTitle(`Planning do dia ${todayDate}`)
//         .addFields(tasksRepository)
//         .setColor('#0099ff');
//       message.channel.send(template);
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   // BOT ACTIVITY COMMAND.
//   if (command === 'activity') {
//     try {
//       if (!cmdValidation.length) {
//         message.channel.send('A atividade do bot foi apagada!');
//         await bot.user.setActivity('');
//       }

//       await bot.user.setActivity(`${args}`);
//     } catch (err) {
//       console.log(err);
//     }
//   }
//   // Change bot's name.
//   if (command === 'name') {
//     try {
//       if (!cmdValidation.length) {
//         message.channel.send('O nome do bot foi alterado para o padrão!');
//         await bot.user.setUsername('CheckReview');
//       }
//       await bot.user.setUsername(`${args[0]}`);
//       message.channel.send(`Nome do bot alterado para ${args}`);
//     } catch (err) {
//       console.log(err);
//       message.channel.send(
//         'O nome do bot esta sendo alterado rápido demais! Tente novamente mais tarde!',
//       );
//     }
//   }

//   // Send a message to every waning about planning and review.
//   if (command === 'review' || 'planning') {
//     try {
//       switch (command) {
//         case 'review':
//           message.channel.send('@everyone Review começando!');
//           break;
//         case 'planning':
//           message.channel.send('@everyone Planning começando!');
//           break;
//         default:
//           message.channel.send('Digite !help para mais comandos!');
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   // Help command.
//   if (command === 'help') {
//     try {
//     } catch (err) {
//       console.log(err);
//     }
//   }
// });
