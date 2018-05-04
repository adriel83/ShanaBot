function stream(){
  const channel = message.member.voiceChannel;
  var link = message.content.slice('tocar'.length)
  channel.join()
  .then(connection => {
  const stream = ytdl(link, { filter : 'audioonly' });
  broadcast.playStream(stream);
  const dispatcher = connection.playBroadcast(broadcast);
  console.log('Tocando')
  broadcast.
  })
  }
