const libraryinth = '<span style="font-size: 10px;/* color: #4AF626; */white-space: pre;">\
  <span style="color: burlywood;">  ooooo         o8o   .o8                                                o8o                  .   oooo </span><br>\
  <span style="color: #c39c6a;">  `888\'         `"\'  "888                                                `"\'                .o8   `888 <br>\
     888         oooo   888oooo.  oooo d8b  .oooo.   oooo d8b oooo    ooo oooo  ooo. .oo.   .o888oo  888 .oo. </span><br>\
  <span style="color: #e2bf91;">   888         `888   d88\' `88b `888""8P `P  )88b  `888""8P  `88.  .8\'  `888  `888P"Y88b    888    888P"Y88b <br>\
     888          888   888   888  888      .oP"888   888       `88..8\'    888   888   888    888    888   888 </span><br>\
  <span style="color: #a27b49;">   888       o  888   888   888  888     d8(  888   888        `888\'     888   888   888    888 .  888   888 <br>\
    o888ooooood8 o888o  `Y8bod8P\' d888b    `Y888""8o d888b        .8\'     o888o o888o o888o   "888" o888o o888o </span><br>\
  <span style="color: burlywood;"><span style="color: cyan;"> -----------------------------------------------------------</span>.o..P\'<span style="color: cyan;">--------------------------------------------</span> <br>\
                                                              `Y8P\'</span></span>';

const motdTitle = {
  msg: '<span style="font-size: 10px; color: #4AF626; white-space: pre;">' + libraryinth + '</span><br />', 
  html: true
};

const credits = () => {
  let us = {
    'Logan Scott': Math.random(),
    'Rachel Donahue': Math.random(),
    'Erik Ford': Math.random(),
    'Melissa Smoot': Math.random()
  };
  let random = Object.keys(us).sort((a, b) => us[a] - us[b]);
  return random;
};

const copyright = {
  msg: '<pre style="color:lime">    &copy; ' + new Date().getFullYear() + ' - ' + credits().join(', ') + '</pre><br />',
  html: true
};

const motd = {
  msg: '<span style="color:white">Welcome to the Libraryinth!\
  To play the game, please register using the command <span class="help">/signup &lt;username&gt; &lt;password&gt;</span>, or login using <span class="help">/login &lt;username&gt; &lt;password&gt;</span><br /><br />\
  Try actions <span class="action">look</span>, <span class="action">use</span>, <span class="action">take</span>, and <span class="action">talk</span> \
  to interact with the Libraryinth and stories within! \
  Use <span class="help">/help</span> for more information.<br /><br /></span><hr /><br />', 
  html: true
};

module.exports = {
  motdTitle,
  motd,
  copyright
};
