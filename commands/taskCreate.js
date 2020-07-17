const { MessageEmbed } = require('discord.js');
const moment = require('moment');

const todayDate = moment().subtract(10, 'days').calendar();
const embed = new MessageEmbed();

module.exports = {
  name: 'new',
  description: 'Com o comando !new pode ser criado uma ou mais tasks.',

  execute(message, args, cmdValidation) {
    if (!cmdValidation.length) {
      message.channel.send('Adicone uma ou mais tarefas!').then(msg => {
        msg.delete({ timeout: 10000 });
      });
    }

    const taskRepository = [];

    args.forEach(async (task, index) => {
      const taskObject = { name: `Task ${index + 1}`, value: task };
      await taskRepository.push(taskObject);
    });

    const template = embed
      .setTitle(`Planning do dia ${todayDate}`)
      .addFields(taskRepository)
      .setColor('#0099ff');
    message.channel.send(template);
  },
};
