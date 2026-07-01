/* ============================================
   Skye — script.js
   ============================================ */

'use strict';

document.addEventListener('DOMContentLoaded', function () {

/* ── Modal system ── */
function setupModal(openBtnId, modalId, closeBtnId) {
  const openBtn  = document.getElementById(openBtnId);
  const modal    = document.getElementById(modalId);
  const closeBtn = document.getElementById(closeBtnId);
  if (!openBtn || !modal || !closeBtn) return;

  function open() {
    modal.classList.add('open');
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) close();
  });
}

try {
  setupModal('openCommands', 'commandsModal', 'closeCommands');
  setupModal('openTerms', 'termsModal', 'closeTerms');
} catch (e) { console.error('modal setup failed:', e); }



/* ── Command list ── */
try {
(function () {
  const p = '.'; // default prefix

  const commands = [
    // main
    { name: 'help', aliases: ['commands', 'h', 'menu'], cat: 'Main', emoji: '⚙️', desc: 'Show the help menu' },
    { name: 'ping', aliases: ['latency', 'pong', 'pang', 'speed'], cat: 'Main', emoji: '⚙️', desc: 'Bot latency' },
    { name: 'prefix', aliases: ['setprefix', 'changeprefix'], cat: 'Main', emoji: '⚙️', desc: 'Change the server prefix' },
    { name: 'invite', aliases: ['inv', 'addbot'], cat: 'Main', emoji: '⚙️', desc: 'Invite the bot to your server' },
    { name: 'botinfo', aliases: ['bi', 'stats', 'about', 'info', 'uptime'], cat: 'Main', emoji: '⚙️', desc: 'Info about the bot' },
    { name: 'bugreport', aliases: ['bug', 'reportbug'], cat: 'Main', emoji: '⚙️', desc: 'Report a bug to the developer — 1 hour cooldown' },

    // fun
    { name: 'dice', aliases: ['roll', 'r', 'diceroll'], cat: 'Fun', emoji: '🎮', desc: 'Roll dice' },
    { name: 'eightball', aliases: ['8ball', '8b', 'ask'], cat: 'Fun', emoji: '🎮', desc: 'Magic 8ball' },
    { name: 'say', aliases: ['echo', 'repeat'], cat: 'Fun', emoji: '🎮', desc: 'Repeat a message — needs Manage Messages' },
    { name: 'choose', aliases: ['pick', 'decide'], cat: 'Fun', emoji: '🎮', desc: 'Pick an option for you' },
    { name: 'guess', aliases: ['guessnumber', 'numguess'], cat: 'Fun', emoji: '🎮', desc: 'Guess a number' },
    { name: 'confess', aliases: ['anon', 'confession'], cat: 'Fun', emoji: '🎮', desc: 'Anonymously confess something' },
    { name: 'pi', aliases: ['digits', 'pival'], cat: 'Fun', emoji: '🎮', desc: 'Get digits of pi' },
    { name: 'ship', aliases: ['shiprate', 'compatibility', 'lovecalc', 'shipit'], cat: 'Fun', emoji: '🎮', desc: 'Get the compatibility % between two users' },
    { name: 'uwuify', aliases: ['uwu', 'owoify', 'uwuspeak'], cat: 'Fun', emoji: '🎮', desc: 'uwu-ify a message (or a reply)' },

    // actions
    { name: 'hug', aliases: ['embrace', 'cuddle'], cat: 'Actions', emoji: '🎭', desc: 'Hug someone' },
    { name: 'kill', aliases: ['slay', 'murder', 'destroy'], cat: 'Actions', emoji: '🎭', desc: 'Kill someone (roleplay)' },
    { name: 'tickle', aliases: ['poke', 'annoy'], cat: 'Actions', emoji: '🎭', desc: 'Tickle someone' },

    // utility
    { name: 'avatar', aliases: ['av', 'pfp', 'icon', 'pic'], cat: 'Utility', emoji: '🧰', desc: 'Get a user\u2019s avatar' },
    { name: 'whois', aliases: ['ui', 'user', 'profile', 'userinfo', 'whoami', 'lookup'], cat: 'Utility', emoji: '🧰', desc: 'User info' },
    { name: 'serverinfo', aliases: ['si', 'server', 'guildinfo', 'sinfo'], cat: 'Utility', emoji: '🧰', desc: 'Server info' },
    { name: 'afk', aliases: ['away', 'brb', 'gone'], cat: 'Utility', emoji: '🧰', desc: 'Set yourself as AFK' },
    { name: 'poll', aliases: ['vote', 'survey'], cat: 'Utility', emoji: '🧰', desc: 'Create a poll' },
    { name: 'encode', aliases: ['b64encode', 'b64'], cat: 'Utility', emoji: '🧰', desc: 'Base64 encode text' },
    { name: 'decode', aliases: ['b64decode', 'unb64'], cat: 'Utility', emoji: '🧰', desc: 'Base64 decode text' },
    { name: 'remind', aliases: ['reminder', 'remindme', 'timer', 'reminders'], cat: 'Utility', emoji: '🧰', desc: '<time> <text> — set a reminder' },
    { name: 'remind list', aliases: ['ls', 'all', 'show'], cat: 'Utility', emoji: '🧰', desc: 'View your pending reminders' },
    { name: 'remind cancel', aliases: ['delete', 'remove', 'del'], cat: 'Utility', emoji: '🧰', desc: '<#> — cancel one reminder' },
    { name: 'remind clear', aliases: ['clearall', 'purge'], cat: 'Utility', emoji: '🧰', desc: 'Cancel all your reminders' },
    { name: 'giveaway', aliases: ['gstart', 'gcreate', 'gw'], cat: 'Utility', emoji: '🧰', desc: 'Start a giveaway — needs Manage Server' },

    // tools
    { name: 'translate', aliases: ['tr', 'trans'], cat: 'Tools', emoji: '🌐', desc: 'Translate text or a message' },
    { name: 'weather', aliases: ['wx', 'forecast'], cat: 'Tools', emoji: '🌐', desc: 'Weather info for a location' },
    { name: 'slowmode', aliases: ['sm', 'slow'], cat: 'Tools', emoji: '🌐', desc: 'Set channel slowmode — needs Manage Channels' },
    { name: 'define', aliases: ['def', 'dictionary', 'meaning'], cat: 'Tools', emoji: '🌐', desc: 'Define a word' },

    // economy
    { name: 'economy', aliases: ['econ', 'ecosettings', 'econtoggle'], cat: 'Economy', emoji: '💰', desc: 'enable/disable — toggle economy for this server — needs Administrator. Disabled by default.' },
    { name: 'setxprate', aliases: ['xprate', 'setxp', 'xpmultiplier'], cat: 'Economy', emoji: '💰', desc: '<multiplier> — set the XP gain rate — needs Administrator' },
    { name: 'balance', aliases: ['bal', 'money', 'cash', 'wallet', 'coins'], cat: 'Economy', emoji: '💰', desc: 'Check your balance' },
    { name: 'daily', aliases: ['claim', 'collect', 'dailyreward'], cat: 'Economy', emoji: '💰', desc: 'Claim daily coins — scales with level' },
    { name: 'level', aliases: ['xp', 'rank', 'lvl', 'levels'], cat: 'Economy', emoji: '💰', desc: '[@user] — view level & XP progress' },
    { name: 'give', aliases: ['givecash', 'givemoney', 'givecoins', 'paycoins', 'transfer', 'pay'], cat: 'Economy', emoji: '💰', desc: '@user <amount> — give coins to someone' },
    { name: 'leaderboard cash', aliases: ['lb cash', 'moneyboard', 'cashboard', 'richest', 'balancetop'], cat: 'Economy', emoji: '💰', desc: '[amount] — top balances (plain .leaderboard defaults to this)' },
    { name: 'leaderboard xp', aliases: ['lb xp', 'xpboard', 'levelboard', 'ranktop'], cat: 'Economy', emoji: '💰', desc: '[amount] — top levels/XP' },
    { name: 'gamble', aliases: ['bet', 'wager', 'risk'], cat: 'Economy', emoji: '💰', desc: '<amount> — 45% chance to double your bet' },
    { name: 'coinflip', aliases: ['cf', 'flip', 'toss', 'cointoss'], cat: 'Economy', emoji: '💰', desc: '<heads/tails> <amount> — bet on a coinflip' },
    { name: 'slots', aliases: ['slot', 'spin', 'slotmachine'], cat: 'Economy', emoji: '💰', desc: '<amount> — spin the slot machine' },
    { name: 'blackjack', aliases: ['bj', '21', 'cards'], cat: 'Economy', emoji: '💰', desc: '<amount> — play blackjack vs the dealer' },
    { name: 'roulette', aliases: ['roul', 'spinwheel', 'wheel'], cat: 'Economy', emoji: '💰', desc: '<amount> <red/black/green/0-36> — spin the wheel' },
    { name: 'crash', aliases: ['rocket', 'multiplier'], cat: 'Economy', emoji: '💰', desc: '<amount> [target] — cash out before it crashes' },
    { name: 'higherlower', aliases: ['hl', 'higherorlower', 'hilo'], cat: 'Economy', emoji: '💰', desc: '<amount> <higher/lower> — guess the next card' },

    // snipe
    { name: 'snipe', aliases: ['s', 'recover'], cat: 'Snipe', emoji: '🗑️', desc: '[n] — show the nth-last deleted message — needs Manage Messages' },
    { name: 'clearsnipes', aliases: ['clearsnipe', 'sclear', 'snipeclear'], cat: 'Snipe', emoji: '🗑️', desc: 'Clear tracked deleted messages — needs Manage Messages' },

    // moderation
    { name: 'kick', aliases: ['kickuser', 'boot'], cat: 'Moderation', emoji: '🛡️', desc: 'Kick a user — needs Kick Members' },
    { name: 'ban', aliases: ['banuser', 'banish'], cat: 'Moderation', emoji: '🛡️', desc: '<member> [time] [reason] — ban, optionally temporary — needs Ban Members' },
    { name: 'unban', aliases: ['pardon', 'unbanuser'], cat: 'Moderation', emoji: '🛡️', desc: 'Unban a user by ID — needs Ban Members' },
    { name: 'mute', aliases: ['timeout', 'silence'], cat: 'Moderation', emoji: '🛡️', desc: '<member> [time] [reason] — timeout a user — needs Moderate Members' },
    { name: 'unmute', aliases: ['untimeout', 'unsilence'], cat: 'Moderation', emoji: '🛡️', desc: 'Remove a timeout — needs Moderate Members' },
    { name: 'nick', aliases: ['nickname', 'setnick', 'renick'], cat: 'Moderation', emoji: '🛡️', desc: '<member> [nick] — change/reset a nickname — needs Manage Nicknames' },
    { name: 'role add', aliases: ['roles add', 'give', 'grant'], cat: 'Moderation', emoji: '🛡️', desc: '<member> <role id> — add a role — needs Manage Roles' },
    { name: 'role remove', aliases: ['roles remove', 'take', 'revoke'], cat: 'Moderation', emoji: '🛡️', desc: '<member> <role id> — remove a role — needs Manage Roles' },
    { name: 'warn', aliases: ['addwarn', 'warnuser'], cat: 'Moderation', emoji: '🛡️', desc: '<member> [time] [reason] — warn a user, optionally expiring — needs Moderate Members' },
    { name: 'warnings', aliases: ['warns', 'checkwarnings', 'infractions'], cat: 'Moderation', emoji: '🛡️', desc: 'View a user\u2019s warnings — needs Moderate Members' },
    { name: 'unwarn', aliases: ['delwarn', 'removewarn', 'warnremove'], cat: 'Moderation', emoji: '🛡️', desc: 'Remove a specific warning — needs Moderate Members' },
    { name: 'clearwarnings', aliases: ['clearwarns', 'resetwarnings'], cat: 'Moderation', emoji: '🛡️', desc: 'Clear all warnings for a user — needs Moderate Members' },
    { name: 'purge', aliases: ['clear', 'clean', 'prune'], cat: 'Moderation', emoji: '🛡️', desc: '<amount> — delete messages (also supports @user or bots) — needs Manage Messages' },
    { name: 'lock', aliases: ['lockchannel', 'channellock'], cat: 'Moderation', emoji: '🛡️', desc: '[time] — lock the channel, optionally auto-unlock — needs Manage Channels' },
    { name: 'unlock', aliases: ['unlockchannel', 'channelunlock'], cat: 'Moderation', emoji: '🛡️', desc: 'Unlock the channel — needs Manage Channels' },
    { name: 'nuke', aliases: ['clearchannel', 'resetchannel'], cat: 'Moderation', emoji: '🛡️', desc: 'Reset the channel — needs Manage Channels' },
  ];

  const listEl   = document.getElementById('commandsList');
  const searchEl = document.getElementById('commandsSearch');
  const countEl  = document.getElementById('commandsCount');
  if (!listEl || !searchEl) return;

  function render(filter) {
    const q = (filter || '').trim().toLowerCase();
    const filtered = commands.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.cat.toLowerCase().includes(q) ||
      c.aliases.some(a => a.toLowerCase().includes(q))
    );

    if (countEl) countEl.textContent = `${filtered.length} / ${commands.length}`;

    if (!filtered.length) {
      listEl.innerHTML = '<p class="book-list-empty">no commands match that search</p>';
      return;
    }

    listEl.innerHTML = filtered.map(c => `
      <div class="dragon-card">
        <div class="dragon-card-head">
          <span class="dragon-card-name">${p}${c.name}</span>
          <span class="dragon-card-class">${c.emoji} ${c.cat}</span>
        </div>
        <div class="dragon-card-stats">
          <span><b>Aliases:</b> ${c.aliases.length ? c.aliases.map(a => `${p}${a}`).join(', ') : 'none'}</span>
        </div>
        <p class="dragon-card-behaviour">${c.desc}</p>
      </div>
    `).join('');
  }

  render('');
  searchEl.addEventListener('input', () => render(searchEl.value));
})();
} catch (e) { console.error('command list setup failed:', e); }



/* ── Per-tile subtle 3D tilt ── */
try {
(function () {
  const tiles = document.querySelectorAll('.tile');
  const MAX_TILT = 4; // degrees, kept subtle

  tiles.forEach((tile) => {
    let rect = null;
    let pending = null;

    tile.addEventListener('mouseenter', () => {
      rect = tile.getBoundingClientRect();
      tile.classList.remove('tile-resetting');
    });

    tile.addEventListener('mousemove', (e) => {
      if (!rect) rect = tile.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (pending) return;
      pending = requestAnimationFrame(() => {
        pending = null;
        const px = (x / rect.width) - 0.5;
        const py = (y / rect.height) - 0.5;
        const rotateY = (px * MAX_TILT * 2).toFixed(2);
        const rotateX = (py * -MAX_TILT * 2).toFixed(2);
        tile.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
      });
    });

    tile.addEventListener('mouseleave', () => {
      rect = null;
      tile.classList.add('tile-resetting');
      tile.style.transform = '';
    });
  });
})();
} catch (e) { console.error('tile tilt setup failed:', e); }



/* ── Theme toggle (dark / light) ── */
try {
(function () {
  const root   = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    if (isLight) {
      root.removeAttribute('data-theme');
      localStorage.setItem('jdkcube-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('jdkcube-theme', 'light');
    }
  });
})();
} catch (e) { console.error('theme toggle setup failed:', e); }

});