(function () {
    'use strict';
    var clear,
        canvas = {
            fg : {},
            bg : {}
        },
        context = {
            bg : {},
            fg : {}
        },
        colors = {
            'grid'      : 'rgb(220,220,220)',
            'font'      : 'rgb(0,0,0)',
            'ui'        : 'rgb(220,220,220)',
            'ui_skill'  : 'rgb(0,0,0)',
            'ui_social' : 'rgb(140,170,255)'
        },
        draw,
        grid = {
            'x'      : 9.5,
            'y'      : 9.5,
            'width'  : 390,
            'height' : 290,
            'cell'   : 10,
            'cellw'  : 38,
            'cellh'  : 28
        },
        init,
        log,
        logic,
        map,
        maps,
        npc,
        player,
        state  = 'START',
        util,
        words = {
            names : ['Alex', 'Andy', 'Ash', 'Bobbi', 'Cass', 'Cassi', 'Charli',
                     'Chris', 'Danni', 'Eddy', 'Fran', 'Franki', 'Franni',
                     'Freddi', 'Gabbi', 'Georgie', 'Izzi', 'Jacki', 'Jay',
                     'Jess', 'Jerri', 'Joey', 'Joss', 'Kel', 'Kris', 'Liv',
                     'Lou', 'Louie', 'Maddi', 'Mandi', 'Manni', 'Matti', 'Max',
                     'Mel', 'Micki', 'Nat', 'Nicki', 'Oli', 'Pat', 'Patti',
                     'Robbi', 'Ronni', 'Sacha', 'Sal', 'Sam', 'Sammi', 'Sandi',
                     'Shelli', 'Terri', 'Theo', 'Val', 'Vic',
                     'Addison', 'Ashley', 'Ashton', 'Avery', 'Bailey',
                     'Cameron', 'Carson', 'Carter', 'Casey', 'Corey', 'Dakota',
                     'Devin', 'Drew', 'Emerson', 'Harley', 'Harper', 'Hayden',
                     'Hunter', 'Jaiden', 'Jamie', 'Jaylen', 'Jesse', 'Jordan',
                     'Justice', 'Kai', 'Kelly', 'Kelsey', 'Kendall', 'Kennedy',
                     'Lane', 'Logan', 'Mackenzie', 'Madison', 'Marley',
                     'Mason', 'Morgan', 'Parker', 'Peyton', 'Piper', 'Quinn',
                     'Reagan', 'Reese', 'Riley', 'Rowan', 'Ryan', 'Shane',
                     'Shawn', 'Sydney', 'Taylor', 'Tristan', ],
            moods : ['infuriated', 'angry', 'frustrated', 'annoyed', 'uptight',
                     'anxious', 'tense', 'stressed', 'withdrawn', 'worried',
                     'disinterested', 'indifferent', 'mild', 'calm', 'relaxed',
                     'content', 'glad', 'flirty', 'happy', 'cheerful'],
            win   : ['laughs', 'high fives you', 'hugs you',
                     'giggles', 'smiles', 'fist bumps you', 'dances with you',
                     'winks at you', 'whispers in your ear', 'chuckles',
                     'grins', 'tries to act casual', 'is embarrassed',
                     'enjoys your company', 'tells you a secret',
                     'looks happy with you', 'is impressed',
                     'stares into your eyes', 'offers you some candy',
                     'flirts with you', 'shares chocolate with you',
                     'swaps numbers with you', 'exchanges emails with you',
                     'waves at you'],
            fail  : ['cries', 'slaps you', 'groans', 'screams',
                     'hides', 'kicks you', 'threatens you',
                     'begins to call over the manager',
                     'reaches for a letter opener',
                     'goes back to their work', 'announces they hate you',
                     'covers their face with their hands',
                     'writes your name in a little note book',
                     'goes back to browsing the web', 'barfs', 'is sick',
                     'gives you the finger', 'is not impressed',
                     'stares at you', 'silently judges you',
                     'sobs', 'ignores you', 'looks the other way',
                     'pushes you away', 'completely ignores you'],
            begin : ['chat with', 'flirt with', 'gossip with',
                     'throw a paper clip at', 'laugh at', 'howl at',
                     'scream at', 'grin at', 'stare awkwardly at',
                     'leave your number with', 'make a face at',
                     'discuss roguelikes with', 'holla at',
                     'try to act casual with', 'discuss video games with',
                     'pretend to ignore', 'propose to', 'grope',
                     'start to rap with', 'bow towards', 'babble at',
                     'tease', 'mock', 'nudge', 'taunt', 'dance with',
                     'attempt to help', 'fart on', 'kiss'],
            empty : ['No one important here', 'Not much to see here',
                     'There is no one around', 'Wow, lots of O2 here!',
                     'The point is to talk to other people',
                     'I bet you wish you were playing Dungeon Crawl',
                     'You take out your cellphone, no new messages',
                     'Just you here, alone', 'Just some bent paperclips',
                     'There is some gum stuck to the floor here',
                     'Better not be seen talking to yourself',
                     'I think there is some air here',
                     'Nothing but silence', 'No one to talk to here',
                     'Nothing here'],
            intro : ['Welcome to fivepm',
                     'A 2014 7drl',
                     'Use WASD or IJKL to move around',
                     'You can sense co-worker moods by walking into them',
                     'Use E or U to interact',
                     'Read the help below for more detailed instructions',
                     'Press any key to start'],
            progress : ['You have just entered the ', 'This is the ',
                       'This floor holds the ', 'Entering the ',
                       'This place looks like the ']
        };

    player = {
        'x'      : 34,
        'y'      : 25,
        'steps'  : 0,
        'skill'  : 0,
        'social' : 0,
        reset    : function () {
            player.x = 34;
            player.y = 25;
            player.steps = 0;
            player.skill = 0;
            player.social = 0;
        }
    };

    util = {
        random : function () {
            return Math.random();
        },
        random_dec : function (min, max) {
            return Math.random() * (max - min) + min;
        },
        random_int : function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        random_array : function (source, num) {
            var result = [],
                r = 0,
                i = 0;

            for (i = 0; i < num; i += 1) {
                r = util.random_int(0, source.length - 1);
                result[result.length] = source[r];
                source.splice(r, 1);
            }

            return result;
        },
    };

    clear = {
        all : function () {
            clear.fg();
            clear.bg();
        },
        bg : function () {
            clear.canvas(context.bg);
        },
        fg : function () {
            clear.canvas(context.fg);
        },
        canvas : function (ctx) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }
    };

    log = {
        line  : 0,
        data  : [],
        reset : function () {
            log.line = 0;
            log.data = [];
        },
        add   : function (text) {
            log.data[log.data.length] = text;
        },
        add_array : function (arr) {
            log.data = log.data.concat(arr);
        },
        debug : function (obj) {
            console.log(obj);
        },
        write : function () {
            var node = document.getElementById('log'),
                old_node = document.getElementById('oldlog'),
                from = log.line - 10,
                to = log.line;

            if (log.data.length <= 0) {
                return;
            }

            node.innerHTML = '';
            old_node.innerHTML = '';

            if (from < 0 || from > log.data.length) {
                from = 0;
            } else {
                from = to - 10;
            }

            log.write_lines(node, to, log.data.length);
            log.write_lines(old_node, from, to);
            log.line = log.data.length;
        },
        write_lines : function (node, from, to) {
            for (from; from < to; from += 1) {
                node.innerHTML = log.data[from] + '<br>' + node.innerHTML;
            }
        },
    };

    npc = {
        chat : {
            begin : function (n) {
                return 'You ' + words.begin[
                    util.random_int(0, words.begin.length - 1)
                ] + ' ' + n.name;
            },
            win : function (n) {
                return n.name + ' ' + words.win[
                    util.random_int(0, words.win.length - 1)
                ];
            },
            fail : function (n) {
                return n.name + ' ' + words.fail[
                    util.random_int(0, words.fail.length - 1)
                ];
            },
            empty : function () {
                return words.empty[
                    util.random_int(0, words.empty.length - 1)
                ];
            },
            progress : function () {
                return words.progress[
                    util.random_int(0, words.progress.length - 1)
                ];
            },
            friend : function (n) {
                return 'You and ' + n.name + ' are already friendly';
            },
            enemy : function (n) {
                return 'You and ' + n.name + ' are not on speaking terms';
            },
            sense : function (n) {
                return n.name + ' seems ' + words.moods[n.mood];
            },
        },
        count : function (property) {
            var i  = 0,
                j = 0,
                n = [],
                count = 0;

            for (i = 0; i < map.all.length; i += 1) {
                n = map.all[i].npcs;
                for (j = 0; j < n.length; j += 1) {
                    if (n[j][property] === true) {
                        count = count + 1;
                    }
                }
            }

            return count;
        },
    };

    maps = {
        legend : {
            '@' : { type : 'player', color : 'rgb(0,0,0)' },
            '&' : { type : 'npc',    color : 'rgb(140,170,255)' },
            '-' : { type : 'npc',    color : 'rgb(255,170,170)' },
            '+' : { type : 'npc',    color : 'rgb(140,255,170)' },
            '*' : { type : 'solid',  color : 'rgb(220,220,220)' },
            '?' : { type : 'solid',  color : 'rgb(190,190,190)' },
            '=' : { type : 'solid',  color : 'rgb(240,240,240)' },
            '~' : { type : 'solid',  color : 'rgb(140,220,255)' },
            '^' : { type : 'exit',   color : 'rgb(255,220,140)' },
            '<' : { type : 'down',   color : 'rgb(160,140,255)' },
            '>' : { type : 'up',     color : 'rgb(255,140,255)' },
            '!' : { type : 'lift',   color : 'rgb(220,140,255)' },
            's' : { type : 'spawn',  color : 'rgb(255,255,255)' },
            '.' : { type : 'empty',  color : 'rgb(255,255,255)' }
        },
        layouts : [
            {
                name    : 'debug',
                npc_max : 20,
                npc_min : 15,
                spawn   : {
                    x : 2,
                    y : 13
                },
                layout  : ['**************************************',
                           '*...^^^^^^..................^^^^^^...*',
                           '*...........==========...............*',
                           '*...........=~~~~~~~~=...............*',
                           '*...........==========...............*',
                           '*....................................*',
                           '*...........??????????...............*',
                           '*....................................*',
                           '*....................................*',
                           '*....................................*',
                           '*....................................*',
                           '*....................................*',
                           '******...............................*',
                           '*.s..*...............................*',
                           '*....*...............................*',
                           '*....*...............................*',
                           '*....................................*',
                           '******...............................*',
                           '*....................................*',
                           '*....................................*',
                           '*............<.....>.................*',
                           '*....................................*',
                           '*....................................*',
                           '*...............!....................*',
                           '*....................................*',
                           '*....................................*',
                           '*....................................*',
                           '**************************************']
            },
            {
                name    : 'office',
                npc_max : 30,
                npc_min : 20,
                spawn   : {
                    x      : 34,
                    y      : 25,
                },
                layout  : ['**************************************',
                           '*??..*...........??=.................*',
                           '*....*............?=................<*',
                           '*..***............?=.................*',
                           '*.........******************....******',
                           '*..***.......?*..??.*?.?........*?..?*',
                           '*....*........*?....*...........*....*',
                           '*...?*..........................***..*',
                           '******....*............*.............*',
                           '**........*............*........***..*',
                           '*.........*??..........*?.......*....*',
                           '*......*******......*******.....*..??*',
                           '*.........*............*........******',
                           '*??......?*?..........?*?.......*..?.*',
                           '*??....*******......*******.....*....*',
                           '*??......?*............*........***..*',
                           '*.........*?..........?*.............*',
                           '*......*******......*******.....***..*',
                           '*.........*?..........???.......*....*',
                           '******....*.....................******',
                           '*....*..........................*..??*',
                           '*...?*..........................*....*',
                           '*..***....******..******..***...***..*',
                           '*.........*???....?*........*........*',
                           '*..***....*.......?*..????..*...***..*',
                           '*...?*....*........*..????..*...*.s..*',
                           '*....*..??*.?.?????*........*...*??..*',
                           '**************************************'],
            },
            {
                name    : 'server room',
                npc_max : 15,
                npc_min : 7,
                spawn   : {
                    x : 2,
                    y : 19
                },
                layout  : ['**************************************',
                           '*..........*.????????????.*..........*',
                           '*.??.??.??.*.????????????.*.??.??.??.*',
                           '*.??.??.??.*..............*.??.??.??.*',
                           '*.??.??.??.*.????????????.*.??.??.??.*',
                           '*.??.??.??.*.????????????.*.??.??.??.*',
                           '*..........*..............*..........*',
                           '*****..***********..***********..*****',
                           '*....................................*',
                           '*****..*****......**......*****..*****',
                           '*..........*......**......*..........*',
                           '*.??.??.??.*......**......*.??.??.??.*',
                           '*.??.??.??.*......**......*.??.??.??.*',
                           '*.??.??.??.*......**......*.??.??.??.*',
                           '*.??.??.??.*......**......*.??.??.??.*',
                           '*..........*......**......*..........*',
                           '************......**......************',
                           '*==??==...........**..........==??===*',
                           '*.................**??...............*',
                           '*>s...............**??..............<*',
                           '********..******************..********',
                           '*.................**.................*',
                           '*....??.??.??.??..**..??.??.??.??...=*',
                           '*=...??.??.??.??..**..??.??.??.??....*',
                           '*=...??.??.??.??..**..??.??.??.??....*',
                           '*=...??.??.??.??..**..??.??.??.??...=*',
                           '*.................**..............===*',
                           '**************************************']
            },
            {
                name    : 'boardroom',
                npc_max : 15,
                npc_min : 7,
                spawn   : {
                    x : 18,
                    y : 25
                },
                layout  : ['**************************************',
                           '*.............*.......<*.............*',
                           '*......?......*........*.............*',
                           '*.............*.....****.....???.....*',
                           '*.....???.....*........*...?.???.?...*',
                           '*...?.???.?...*........*.....???.....*',
                           '*.....???.....*........*.....???.....*',
                           '*.....???.....*........*...?.???.?...*',
                           '*...?.???.?...*........*.....???.....*',
                           '*.....???.....*........*.....???.....*',
                           '*.....???.....*........*...?.???.?...*',
                           '*...?.???.?...*........*.....???.....*',
                           '*.....???.....*........*.....???.....*',
                           '*.....???.....*........*...?.???.?...*',
                           '*...?.???.?...*........*.....???.....*',
                           '*.....???.....*........*.....???.....*',
                           '*.....???.....*........*...?.???.?...*',
                           '*...?.???.?...*........*.....???.....*',
                           '*.....???.....*........*.....???.....*',
                           '*.....???.....*........*...?.???.?...*',
                           '*...?.???.?...*........*.....???.....*',
                           '*....................................*',
                           '*......?.............................*',
                           '***************........***************',
                           '*==?................................=*',
                           '*.................s.................=*',
                           '*.................>.............=====*',
                           '**************************************']

            },
            {
                name    : 'cubicles',
                npc_max : 40,
                npc_min : 20,
                spawn   : {
                    x : 2,
                    y : 25
                },
                layout  : ['**************************************',
                           '*=?.?*..*..??*...?*..*.===*?=..*..<..*',
                           '*....*..*....*...?*..*....*=...*.....*',
                           '*..***..***..*..***..***..*..***.....*',
                           '*............*............*..........*',
                           '*..***..***..*..***..***..*..***.....*',
                           '*...?*..*....*....*..*...?*...?*.....*',
                           '*...=*..*..=?*?...*..*..??*...?*.....*',
                           '******..***********..***********.....*',
                           '*...?*..*...?*...?*..*....*.??.*.....*',
                           '*...=*..*....*...?*..*??..*....*.....*',
                           '*..***..***..*..***..***..*..***.....*',
                           '*............*............*..........*',
                           '*..***..***..*..***..***..*..***.....*',
                           '*...=*..*....*...=*..*....*?...*.....*',
                           '*...?*..*..?=*...?*..*?..?*....*.....*',
                           '******..***********..***********.....*',
                           '*...?*..*.?==*==?.*..*....*.==?*.....*',
                           '*...?*..*....*....*..*??..*....*.....*',
                           '*..***..***..*..***..***..*..***.....*',
                           '*............*............*..........*',
                           '*..***..***..*..***..***..*..***.....*',
                           '*....*..*....*....*..*....*....*.....*',
                           '*?...*..*..??*.?..*..*..=?*..??*.....*',
                           '******..***********..***********.....*',
                           '*>s..................................*',
                           '*....................................*',
                           '**************************************'],
            },
            {
                name    : 'cafeteria',
                npc_max : 20,
                npc_min : 10,
                spawn   : {
                    x : 2,
                    y : 25
                },
                layout  : ['**************************************',
                           '*????*====??=.==?..??====..?====.??..*',
                           '*??..*?.....=........=?..........??..*',
                           '*...........=........=?..............*',
                           '*????*?..............=...............*',
                           '*????*==============================.*',
                           '******...............................*',
                           '*....................................*',
                           '*..?.==.?..?.==.?....?.==.?..?.==.?..*',
                           '*....==......==........==......==....*',
                           '*..?.==.?..?.==.?....?.==.?..?.==.?..*',
                           '*....==......==........==......==....*',
                           '*..?.==.?..?.==.?....?.==.?..?.==.?..*',
                           '*....==......==........==......==....*',
                           '*..?.==.?..?.==.?....?.==.?..?.==.?..*',
                           '*....==......==........==......==....*',
                           '*..?.==.?..?.==.?....?.==.?..?.==.?..*',
                           '*....==......==........==......==....*',
                           '*..?.==.?..?.==.?....?.==.?..?.==.?..*',
                           '*....==......==........==......==....*',
                           '*..?.==.?..?.==.?....?.==.?..?.==.?..*',
                           '*....==......==........==......==....*',
                           '*..?.==.?..?.==.?....?.==.?..?.==.?..*',
                           '*...................................?*',
                           '*...................................?*',
                           '*>s..==.?.....??......?........?....<*',
                           '*....==.?....====.....==?....?.===...*',
                           '**************************************'],
            },
            {
                name    : 'lobby',
                npc_max : 10,
                npc_min : 5,
                spawn   : {
                    x : 19,
                    y : 25
                },
                layout  : ['**************************************',
                           '*.....^^....^^....^^....^^....^^.....*',
                           '*....................................*',
                           '*....................................*',
                           '*....................................*',
                           '*..................................***',
                           '*...................................!*',
                           '*..................................***',
                           '*...................................!*',
                           '*===...............................***',
                           '*.?=..............???...............!*',
                           '*..=...........********............***',
                           '*..=..........?*~~~~~~*.............!*',
                           '*..=..........?*~~~~~~*?...........***',
                           '*.?=...........*~~~~~~*.............!*',
                           '*..=...........*~~~~~~*............***',
                           '*..=...........********.............!*',
                           '*..=...............................***',
                           '*..=................................!*',
                           '*..=...............................***',
                           '*..=................................!*',
                           '*..=...............................***',
                           '*.?=................................!*',
                           '*.?=...............................***',
                           '*..=======...........................*',
                           '*........=.........s.................*',
                           '*..................>.................*',
                           '**************************************']
            },
        ],
    };

    map = {
        progress : 0,
        current  : {},
        all      : [],
        empties : function (m) {
            var i = 0,
                j = 0,
                cell,
                empties = [];

            for (i = 0; i < m.layout.length; i += 1) {
                for (j = 0; j < m.layout[i].length; j += 1) {
                    cell = map.at_cell(m, j, i);
                    if (cell.type === 'empty') {
                        empties[empties.length] = {
                            x : j,
                            y : i
                        };
                    }
                }
            }
            return empties;
        },

        at_cell : function (m, x, y) {
            var cell,
                i = 0;

            cell = maps.legend[m.layout[y][x]];

            if (cell.type !== 'empty') {
                return cell;
            }

            for (i = 0; i < m.npcs.length; i += 1) {
                if (m.npcs[i].x === x && m.npcs[i].y === y) {
                    cell = maps.legend['&'];
                    cell.npc = m.npcs[i];
                    break;
                }
            }

            return cell;
        },
    };

    draw = {
        all : function () {
            draw.grid();
            draw.ui();
            draw.ui_content();
            draw.map();
            draw.map_entities();
        },
        fg : function () {
            draw.ui_content();
            draw.map_entities();
        },
        bg : function () {
            draw.grid();
            draw.ui();
            draw.map();
        },
        grid : function () {
            var x = grid.x,
                y = grid.y;

            context.bg.strokeStyle = colors.grid;

            context.bg.beginPath();
            for (x; x < grid.width; x += grid.cell) {
                context.bg.moveTo(x, grid.y);
                context.bg.lineTo(x, grid.height);

            }

            for (y; y < grid.height; y += grid.cell) {
                context.bg.moveTo(grid.x, y);
                context.bg.lineTo(grid.width, y);
            }
            context.bg.stroke();
        },

        map : function () {
            var i = 0,
                j = 0;
            for (i = 0; i < map.current.layout.length; i += 1) {
                for (j = 0; j < map.current.layout[i].length; j += 1) {
                    draw.cell(context.bg, j, i, map.current.layout[i][j]);
                }
            }
        },

        map_entities : function () {
            var n,
                i = 0,
                ctx = context.fg;

            for (i = 0; i < map.current.npcs.length; i += 1) {
                n = map.current.npcs[i];

                if (n.enemy === true) {
                    draw.cell(ctx, n.x, n.y, '-');
                } else if (n.friend === true) {
                    draw.cell(ctx, n.x, n.y, '+');
                } else {
                    draw.cell(ctx, n.x, n.y, '&');
                }
            }

            draw.cell(ctx, player.x, player.y, '@');
        },

        cell : function (ctx, x, y, cell) {
            ctx.fillStyle = maps.legend[cell].color;
            ctx.fillRect(grid.x + (x * grid.cell),
                         grid.y + (y * grid.cell),
                         grid.cell,
                         grid.cell
                        );
        },

        ui : function () {
            context.bg.beginPath();
            context.bg.strokeStyle = colors.ui;
            context.bg.strokeRect(9.5, 300.5, 380, 10);
            context.bg.stroke();

            context.bg.beginPath();
            context.bg.strokeStyle = colors.ui;
            context.bg.strokeRect(9.5, 320.5, 380, 10);
            context.bg.stroke();
        },

        ui_content : function () {
            context.fg.fillStyle = colors.ui_skill;
            context.fg.fillRect(9.5, 300.5, player.skill * 3.8, 10);
            context.fg.fillStyle = colors.ui_social;
            context.fg.fillRect(9.5, 320.5, player.social * 3.8, 10);
        },
    };

    logic = {
        move_player : function (mx, my) {
            var x = player.x + mx,
                y = player.y + my,
                cell = map.at_cell(map.current, x, y);

            if (cell.type === 'solid') {
                return;
            }

            if (cell.type === 'exit') {
                log.add('This is the exit. There is no turning back now');
            }

            if (cell.type === 'up') {
                log.add('These are the stairs up');
            }

            if (cell.type === 'down') {
                log.add('These are the stairs down');
            }

            if (cell.type === 'lift') {
                log.add('An elevator. Probably should have used that');
            }

            if (cell.type === 'npc') {
                log.add(npc.chat.sense(cell.npc));
            }
            player.steps = player.steps + 1;
            player.x = x;
            player.y = y;
        },

        end : function () {
            log.add('Congrats, you managed to leave the office');
            log.add('Your social skills are at ' + player.skill + '%');
            log.add('Your social status is at ' + player.social + '%');
            log.add('You took ' + player.steps + ' steps getting out');
            log.add('You made ' + npc.count("friend") + ' friends');
            log.add('You made ' + npc.count("enemy") + ' enemies');
            log.add('Press any key to start again');
            state = 'END';
        },

        handle_input : function (e) {
            if (e.keyCode === 87 || e.keyCode === 73) {
                logic.move_player(0, -1);
            } else if (e.keyCode === 83 || e.keyCode === 75) {
                logic.move_player(0, +1);
            } else if (e.keyCode === 65 || e.keyCode === 74) {
                logic.move_player(-1, 0);
            } else if (e.keyCode === 68 || e.keyCode === 76) {
                logic.move_player(+1, 0);
            } else if (e.keyCode === 69 || e.keyCode === 85) {
                logic.interact();
            }
        },

        interact : function () {
            var cell = map.at_cell(map.current, player.x, player.y);

            if (cell.type === 'exit') {
                logic.end();
            } else if (cell.type === 'npc') {
                logic.socialise(cell.npc);
            } else if (cell.type === 'down') {
                logic.progress(1);
            } else if (cell.type === 'up') {
                log.add('No point going back upstairs');
            } else {
                log.add(npc.chat.empty());
            }
        },

        progress : function (num) {
            map.progress = map.progress + num;
            map.current = map.all[map.progress];
            log.add(npc.chat.progress() + map.current.name);
            player.x = map.current.spawn.x;
            player.y = map.current.spawn.y;
            clear.bg();
            draw.bg();
        },

        update : function (e) {
            if (state === 'PLAY') {
                logic.handle_input(e);
                clear.fg();
                draw.map_entities();
                draw.ui_content();
            } else if (state === 'START') {
                log.add("It's 5:00 pm. Time to go home");
                state = 'PLAY';
            } else if (state === 'END') {
                init.setup();
            } else {
                log.add("Something went wrong");
                log.add("Please reload the web page");
            }

            log.write();
        },

        socialise : function (n) {
            var social = 0,
                bonus = 0,
                mood = 0,
                rand = 0,
                result = 0;

            if (n.enemy === true) {
                log.add(npc.chat.enemy(n));
                return;
            }

            if (n.friend === true) {
                log.add(npc.chat.friend(n));
                return;
            }

            log.add(npc.chat.begin(n));

            mood = ((n.mood + 1) * (200 / words.moods.length)) - 100;
            rand = util.random_int(-25, 25);
            result = mood + n.dna + rand;
            social = player.social - n.social;
            bonus = Math.abs(Math.floor(social / 10));

            if (result > 0) {
                n.friend = true;
                log.add(npc.chat.win(n));
                player.skill += 2;
                player.social += bonus;

                if (player.skill > 100) {
                    player.skill = 100;
                }

                if (player.social > 100) {
                    player.social = 100;
                }
            } else {
                n.enemy = true;
                log.add(npc.chat.fail(n));
                player.social -= bonus;

                if (player.social < 0) {
                    player.social = 0;
                }
            }
        },
    };

    init = {
        generate_map : function () {
            map.progress = 0;
            map.all = maps.layouts.slice(1, maps.layouts.length);
            map.current = map.all[0];
        },

        generate_npcs : function (m) {
            var i = 0,
                npc_num = 0,
                locations = [];

            m.npcs = [];

            npc_num = util.random_int(m.npc_min, m.npc_max);
            locations = util.random_array(map.empties(m), npc_num);

            for (i = 0; i < npc_num; i += 1) {
                m.npcs[i] = {
                    'name'   : words.names[
                        util.random_int(0, words.names.length - 1)
                    ],
                    'mood'   : util.random_int(0, words.moods.length - 1),
                    'social' : util.random_int(0, 100),
                    'dna'    : util.random_int(-50, 50),
                    'friend' : false,
                    'enemy'  : false,
                    'x'      : locations[i].x,
                    'y'      : locations[i].y
                };
            }
        },

        generate_all_npcs : function () {
            var i = 0;

            for (i = 0; i < map.all.length; i += 1) {
                init.generate_npcs(map.all[i]);
            }
        },

        setup : function () {
            state = 'START';

            log.reset();
            player.reset();

            init.generate_map();
            init.generate_all_npcs();

            canvas.bg = document.getElementById('fivepmbg');
            context.bg = canvas.bg.getContext('2d');
            canvas.fg = document.getElementById('fivepmfg');
            context.fg = canvas.fg.getContext('2d');
            canvas.fg.focus();
            canvas.fg.addEventListener('keydown', logic.update, false);

            log.add_array(words.intro);
            clear.all();
            draw.all();
            log.write();
        },
    };

    init.setup();
}());
