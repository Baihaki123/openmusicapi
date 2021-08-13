require('dotenv').config();
const amqp = require('amqplib');
const MailSender = require('./MailSender');
const Listener = require('./Listener');
const PlaylistService = require('./PlaylistService');
 
const init = async () => {
  const playlistService = new PlaylistService();
  const mailSender = new MailSender();
  const listener = new Listener(playlistService, mailSender);
 
  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();
 
  await channel.assertQueue('export:songs', {
    durable: true,
  });
 
  await channel.consume('export:songs', listener.listen, { noAck: true });

  console.log(`Consumer berjalan pada ${process.env.RABBITMQ_SERVER}`);
};
 
init();