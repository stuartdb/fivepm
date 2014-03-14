(function () {
    'use strict';
    var bg_canvas,
        fg_canvas,
        bg_context,
        fg_context,
        state  = 'START',
        colors = {
            'grid'      : 'rgb(220,220,220)',
            'font'      : 'rgb(0,0,0)',
            'ui'        : 'rgb(220,220,220)',
            'ui_skill'  : 'rgb(0,0,0)',
            'ui_social' : 'rgb(140,170,255)'
        },
        grid = {
            'x'      : 9.5,
            'y'      : 9.5,
            'width'  : 390,
            'height' : 290,
            'cell'   : 10,
            'cellw'  : 38,
            'cellh'  : 28
        },
        player = {
            'x'      : 36,
            'y'      : 26,
            'steps'  : 0,
            'skill'  : 0,
            'social' : 0,
            reset    : function () {
                player.x = 36;
                player.y = 26;
                player.steps = 0;
                player.skill = 0;
                player.social = 0;
            }
        },
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
            debug : function (obj) {
                console.log(obj);
            },
            wrote : function () {
                log.line = log.data.length;
            },
            write_lines : function (p, line_from, line_to) {
                var i = line_from;
                for (i; i < line_to; i = i + 1) {
                    p.innerHTML = log.data[i] + '<br>' + p.innerHTML;
                }
            },
            write : function () {
                var p = document.getElementById('log'),
                    oldp = document.getElementById('oldlog'),
                    limit_line = log.line - 10,
                    new_line = log.line;

                if (log.data.length <= 0) {
                    return;
                }

                p.innerHTML = '';
                oldp.innerHTML = '';

                if (limit_line < 0 || limit_line > log.data.length) {
                    limit_line = 0;
                } else {
                    limit_line = new_line - 10;
                }

                log.write_lines(oldp, limit_line, new_line);
                log.write_lines(p, new_line, log.data.length);

                log.wrote();
            },
        },
        util = {
            random : function () {
                return Math.random();
            },
            random_dec : function (min, max) {
                return Math.random() * (max - min) + min;
            },
            random_int : function (min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
        },

        words = {
            names : ['Alex', 'Andy', 'Ash', 'Bobbi', 'Cass', 'Cassi', 'Charli',
                     'Chris', 'Danni', 'Eddy', 'Fran', 'Franki', 'Franni',
                     'Freddi', 'Gabbi', 'Georgie', 'Izzi', 'Jacki', 'Jay',
                     'Jess', 'Jerri', 'Joey', 'Joss', 'Kel', 'Kris', 'Liv',
                     'Lou', 'Louie', 'Maddi', 'Mandi', 'Manni', 'Matti', 'Max',
                     'Mel', 'Micki', 'Nat', 'Nicki', 'Oli', 'Pat', 'Patti',
                     'Robbi', 'Ronni', 'Sacha', 'Sal', 'Sam', 'Sammi', 'Sandi',
                     'Shelli', 'Terri', 'Theo', 'Val', 'Vic'],
            moods : ['infuriated', 'angry', 'frustrated', 'annoyed', 'uptight',
                     'anxious', 'tense', 'stressed', 'withdrawn', 'worried',
                     'disinterested', 'indifferent', 'mild', 'calm', 'relaxed',
                     'content', 'glad', 'flirty', 'happy', 'cheerful'],
            win  : ['laughs', 'high fives you', 'hugs you',
                    'giggles', 'smiles', 'fist bumps you',
                    'winks at you', 'whispers in your ear',
                    'waves at you'],
            fail : ['cries', 'slaps you', 'groans', 'screams',
                    'sobs', 'ignores you', 'looks the other way',
                    'pushes you away', 'completely ignores you'],
            begin : ['chat with', 'flirt with', 'gossip with',
                     'tease', 'mock', 'nudge', 'taunt',
                     'attempt to help', 'fart on', 'kiss'],
            empty : ['No one important here',
                     'Just you here, alone',
                     'Nothing here']
        },

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
            list : [],
            count : function (property) {
                var i  = 0,
                    count = 0;

                for (i = 0; i < npc.list.length; i = i + 1) {
                    if (npc.list[i][property] === true) {
                        count = count + 1;
                    }
                }

                return count;
            },
            interact : function (n) {
                var social_calc = 0,
                    mood_calc = 0,
                    rand_calc = 0,
                    calc = 0,
                    skill_mod = 0,
                    social_mod = 0;

                if (n.enemy === true) {
                    log.add(npc.chat.enemy(n));
                    return;
                }

                if (n.friend === true) {
                    log.add(npc.chat.friend(n));
                    return;
                }

                log.add(npc.chat.begin(n));

                social_calc = player.social - n.social;
                mood_calc = ((n.mood + 1) * (200 / words.moods.length)) - 100;
                rand_calc = util.random_int(-25, 25);
                calc = mood_calc + n.dna + rand_calc;
                social_mod = Math.abs(Math.floor(social_calc / 20));
                skill_mod = Math.floor(social_mod / 2);


                if (calc > 0) {
                    n.friend = true;
                    log.add(npc.chat.win(n));

                    if (player.skill + skill_mod > 100) {
                        player.skill = 100;
                    } else {
                        player.skill = player.skill + skill_mod;
                    }

                    if (player.social + social_mod > 100) {
                        player.social = 100;
                    } else {
                        player.social = player.social + social_mod;
                    }
                }

                if (calc <= 0) {
                    n.enemy = true;
                    log.add(npc.chat.fail(n));

                    if (player.social - social_mod < 0) {
                        player.social = 0;
                    } else {
                        player.social = player.social - social_mod;
                    }
                }
            }
        },
        map = {
            width  : grid.cellw,
            height : grid.cellh,
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
            data : [],
            layout : ['**************************************',
                      '*??..*...........??=.................*',
                      '*....*............?=................^*',
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
                      '*??.....*****........*****......*....*',
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
                      '*...?*....*........*..????..*...*....*',
                      '*....*..??*.?.?????*........*...*??..*',
                      '**************************************'],

            cell_in_bounds : function (x, y) {
                var valid = false;

                if (x >= 0 && x <= map.width) {
                    if (y >= 0 && y <= map.height) {
                        valid = true;
                    }
                }

                return valid;
            },

            valid_cell : function (entity, x, y) {
                var valid = false,
                    cell;

                if (map.cell_in_bounds(x, y) !== true) {
                    return false;
                }

                cell = map.legend[map.data[y][x]];

                if (cell.type !== 'empty') {
                    return false;
                }

                // entity specific checks
                if (entity === 'player') {
                    valid =  true;
                } else if (entity === 'npc') {
                    valid = true;
                }

                return valid;
            },

            empties : function () {
                var i = 0,
                    j = 0,
                    cell,
                    empties = [];

                for (i = 0; i < map.data.length; i = i + 1) {
                    for (j = 0; j < map.data[i].length; j = j + 1) {
                        cell = map.at_cell(j, i);
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
            rand_empties : function (no) {
                var empties = map.empties(),
                    picks = [],
                    r = 0,
                    i = 0;

                for (i = 0; i < no; i = i + 1) {
                    r = util.random_int(0, empties.length - 1);
                    picks[picks.length] = empties[r];
                    empties.splice(r, 1);
                }

                return picks;
            },

            random_loc : function (entity) {
                var xy = {
                    x : 0,
                    y : 0,
                };

                xy.x = util.random_int(1, grid.cellw - 1);
                xy.y = util.random_int(1, grid.cellh - 1);

                if (map.valid_cell(entity, xy.x, xy.y) !== true) {
                    xy = map.random_loc(entity);
                }

                return xy;
            },

            at_cell : function (x, y) {
                var cell,
                    i = 0;

                cell = map.legend[map.data[y][x]];

                if (cell.type !== 'empty') {
                    return cell;
                }

                for (i = 0; i < npc.list.length; i = i + 1) {
                    if (npc.list[i].x === x && npc.list[i].y === y) {
                        cell = map.legend['&'];
                        cell.npc = npc.list[i];
                        break;
                    }
                }

                return cell;
            }
        },
        clear = {
            all : function () {
                clear.fg();
                clear.bg();
            },
            canvas : function (context) {
                context.clearRect(0,
                                  0,
                                  context.canvas.width,
                                  context.canvas.height);
            },
            bg : function () {
                clear.canvas(bg_context);
            },
            fg : function () {
                clear.canvas(fg_context);
            }
        },
        draw = {
            all : function () {
                draw.grid();
                draw.ui();
                draw.ui_content();
                draw.map();
                draw.map_entities();
            },
            grid : function () {
                var x = grid.x,
                    y = grid.y;

                bg_context.strokeStyle = colors.grid;

                bg_context.beginPath();
                for (x; x < grid.width; x = x + grid.cell) {
                    bg_context.moveTo(x, grid.y);
                    bg_context.lineTo(x, grid.height);

                }

                for (y; y < grid.height; y = y + grid.cell) {
                    bg_context.moveTo(grid.x, y);
                    bg_context.lineTo(grid.width, y);
                }
                bg_context.stroke();
            },

            map : function () {
                var i, j;
                for (i = 0; i < map.data.length; i = i + 1) {
                    for (j = 0; j < map.data[i].length; j = j + 1) {
                        draw.cell(bg_context, j, i, map.data[i][j]);
                    }
                }
            },

            map_entities : function () {
                var n,
                    i = 0,
                    ctx = fg_context;

                for (i = 0; i < npc.list.length; i = i + 1) {
                    n = npc.list[i];

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

            cell : function (context, x, y, cell) {
                context.fillStyle = map.legend[cell].color;
                context.fillRect(grid.x + (x * grid.cell),
                                 grid.y + (y * grid.cell),
                                 grid.cell,
                                 grid.cell
                                );
            },

            ui : function () {
                bg_context.beginPath();
                bg_context.strokeStyle = colors.ui;
                bg_context.strokeRect(9.5, 300.5, 380, 10);
                bg_context.stroke();

                bg_context.beginPath();
                bg_context.strokeStyle = colors.ui;
                bg_context.strokeRect(9.5, 320.5, 380, 10);
                bg_context.stroke();
            },

            ui_content : function () {
                fg_context.fillStyle = colors.ui_skill;
                fg_context.fillRect(9.5, 300.5, player.skill * 3.8, 10);
                fg_context.fillStyle = colors.ui_social;
                fg_context.fillRect(9.5, 320.5, player.social * 3.8, 10);
            },
        },


        logic = {

            generate_npcs : function () {
                var i = 0,
                    npcs = 0,
                    locs = [];

                npc.list = [];
                npcs = util.random_int(10, 20);
                locs = map.rand_empties(npcs);

                for (i = 0; i < npcs; i = i + 1) {
                    npc.list[i] = {
                        'name'   : words.names[
                            util.random_int(0, words.names.length - 1)
                        ],
                        'mood'   : util.random_int(0, words.moods.length - 1),
                        'social' : util.random_int(0, 100),
                        'dna'    : util.random_int(-50, 50),
                        'friend' : false,
                        'enemy'  : false,
                        'x'      : locs[i].x,
                        'y'      : locs[i].y
                    };
                }
            },

            move_player : function (mx, my) {
                var x = player.x + mx,
                    y = player.y + my,
                    cell = map.at_cell(x, y);

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
            interact : function () {
                var cell = map.at_cell(player.x, player.y);

                if (cell.type === 'exit') {
                    logic.end();
                } else if (cell.type === 'npc') {
                    npc.interact(cell.npc);
                } else {
                    log.add(npc.chat.empty());
                }
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
                    logic.init();
                } else {
                    log.add("Something went wrong");
                    log.add("Please reload the web page");
                }

                log.write();
            },

            init : function () {
                state = 'START';

                log.reset();
                player.reset();

                map.data = map.layout;
                logic.generate_npcs();

                bg_canvas = document.getElementById('fivepmbg');
                bg_context = bg_canvas.getContext('2d');

                fg_canvas = document.getElementById('fivepmfg');
                fg_context = fg_canvas.getContext('2d');

                fg_canvas.focus();
                fg_canvas.addEventListener('keydown', logic.update, false);

                log.add("Welcome to fivepm");
                log.add("A 2014 7drl");
                log.add("Use WASD or IJKL to move around");
                log.add("You can sense co-worker moods by walking into them");
                log.add("Use E or U to interact");
                log.add("Read the help below for more detailed instructions");
                log.add("Press any key to start");

                clear.all();
                draw.all();
                log.write();

            },
        };
    logic.init();
}());
