(function () {
    'use strict';
    var bg_canvas,
        fg_canvas,
        bg_context,
        fg_context,
        colors = {
            'grid' : 'rgb(220,220,220)',
            'font' : 'rgb(0,0,0)',
            'ui'   : 'rgb(220,220,220)'
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
        },
        log = {
            data  : [],
            reset : function () {
                log.data = [];
            },
            add   : function (text) {
                log.data[log.data.length] = text;
            },
            debug : function (obj) {
                console.log(obj);
            },
            write : function () {
                var p = document.getElementById('log'),
                    i = 0;
                p.innerHTML = '';

                if (log.data.length < 5) {
                    i = 0;
                } else {
                    i = log.data.length - 5;
                }

                for (i; i < log.data.length; i = i + 1) {
                    p.innerHTML = log.data[i] + '<br>' + p.innerHTML;
                }
            }
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
        npc = {
            names : ['Alex', 'Andy', 'Ash', 'Bobbi', 'Cass', 'Cassi', 'Charli',
                     'Chris', 'Danni', 'Eddy', 'Fran', 'Franki', 'Franni',
                     'Freddi', 'Gabbi', 'Georgie', 'Izzi', 'Jacki', 'Jay',
                     'Jess', 'Jerri', 'Joey', 'Joss', 'Kel', 'Kris', 'Liv',
                     'Lou', 'Louie', 'Maddi', 'Mandi', 'Manni', 'Matti', 'Max',
                     'Mel', 'Micki', 'Nat', 'Nicki', 'Oli', 'Pat', 'Patti',
                     'Robbi', 'Ronni', 'Sacha', 'Sal', 'Sam', 'Sammi', 'Sandi',
                     'Shelli', 'Terri', 'Theo', 'Val', 'Vic'],
            moods : ['Infuriated', 'Angry', 'Frustrated', 'Annoyed', 'Uptight',
                     'Anxious', 'Tense', 'Stressed', 'Withdrawn', 'Worried',
                     'Disinterested', 'Indifferent', 'Mild', 'Calm', 'Relaxed',
                     'Content', 'Glad', 'Flirty', 'Happy', 'Cheerful'],
            list : [],
            interact : function (i) {
                var n = npc.list[i],
                    social_calc = 0,
                    mood_calc = 0,
                    rand_calc = 0,
                    calc = 0,
                    skill_mod = 0,
                    social_mod = 0;

                log.add(n.name +
                            " seems " +
                            npc.moods[n.mood].toLowerCase());

                social_calc = player.social - n.social;
                mood_calc = ((n.mood + 1) * (200 / npc.moods.length)) - 100;
                rand_calc = util.random_int(-25, 25);
                calc = mood_calc + n.dna + rand_calc;

                log.add('Their social status: ' + n.social);
                log.add('Your social status: ' + player.social);
//                log.add('Social calc: ' + social_calc);
                log.add('Mood calc: ' + mood_calc);
                log.add('DNA: ' + n.dna);
                log.add('Rand: ' + rand_calc);
                log.add('Calc: ' + calc);
                log.add('You attempt to chat...');

                social_mod = Math.abs(Math.floor(social_calc / 20));
                skill_mod = Math.floor(social_mod / 2);

                if (calc > 0) {
                    log.add('Success!');
                    log.add('Skill increased by ' + skill_mod);
                    log.add('Social Status increased by ' + social_mod);

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
                    log.add('Failed!');
                    log.add('Social Status decreased by ' + social_mod);

                    if (player.social - social_mod < 0) {
                        player.social = 0;
                    } else {
                        player.social = player.social - social_mod;
                    }
                }

                log.add(player.social);
                log.add(player.skill);
            }
        },
        map = {
            width  : grid.cellw,
            height : grid.cellh,
            legend : {
                '@' : { type : 'player', color : 'rgb(0,0,0)' },
                '&' : { type : 'npc',    color : 'rgb(50,100,200)' },
                '*' : { type : 'solid',  color : 'rgb(220,220,220)' },
                '?' : { type : 'solid',  color : 'rgb(190,190,190)' },
                '>' : { type : 'solid',  color : 'rgb(150,250,150)' },
                '=' : { type : 'solid',  color : 'rgb(240,240,240)' },
                '.' : { type : 'empty',  color : 'rgb(255,255,255)' }
            },
            data : [],
            layout : ['**************************************',
                      '*??..*...........??=.................*',
                      '*....*............?=.................>',
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
                        cell.npc = i;
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

                bg_context.beginPath();
                for (x; x < grid.width; x = x + grid.cell) {
                    bg_context.moveTo(x, grid.y);
                    bg_context.lineTo(x, grid.height);

                }

                for (y; y < grid.height; y = y + grid.cell) {
                    bg_context.moveTo(grid.x, y);
                    bg_context.lineTo(grid.width, y);
                }
                bg_context.strokeStyle = colors.grid;
                bg_context.stroke();
            },

            map : function () {
                var i, j;
                for (i = 0; i < map.data.length; i = i + 1) {
                    for (j = 0; j < map.data[i].length; j = j + 1) {
                        draw.at_cell(bg_context, j, i, map.data[i][j]);
                    }
                }
            },

            map_entities : function () {
                var i = 0;

                for (i = 0; i < npc.list.length; i = i + 1) {
                    draw.at_cell(fg_context,
                                 npc.list[i].x,
                                 npc.list[i].y,
                                 '&');
                }

                draw.at_cell(fg_context, player.x, player.y, '@');
            },

            at_cell : function (context, x, y, cell) {
                context.fillStyle = map.legend[cell].color;
                context.fillRect(grid.x + (x * grid.cell),
                                 grid.y + (y * grid.cell),
                                 grid.cell,
                                 grid.cell
                                );
            },

            ui : function () {
                bg_context.strokeRect(9.5, 300, 380, 10);
                bg_context.strokeRect(9.5, 320, 380, 10);
                bg_context.strokeStyle = colors.ui;
                bg_context.stroke();
            },

            ui_content : function () {
                fg_context.fillStyle = colors.ui;
                fg_context.fillRect(9.5, 320, player.social * 3.8, 10);
                fg_context.fillRect(9.5, 300, player.skill * 3.8, 10);
            }
        },


        logic = {

            generate_npcs : function () {
                var i = 0,
                    npcs = 0,
                    xy = {
                        x : 0,
                        y : 0
                    };

                npcs = util.random_int(10, 20);

                for (i = 0; i < npcs; i = i + 1) {

                    xy = map.random_loc('npc');

                    npc.list[i] = {
                        'name'   : npc.names[
                            util.random_int(0, npc.names.length - 1)
                        ],
                        'mood'   : util.random_int(0, npc.moods.length - 1),
                        'social' : util.random_int(0, 100),
                        'dna'    : util.random_int(-50, 50),
                        'x'      : xy.x,
                        'y'      : xy.y
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

                player.x = x;
                player.y = y;
            },

            interact : function () {
                var cell = map.at_cell(player.x, player.y);

                if (cell.type === 'empty') {
                    log.add("Nothing here");
                } else if (cell.type === 'npc') {
                    npc.interact(cell.npc);
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
                logic.handle_input(e);
                clear.fg();
                draw.map_entities();
                draw.ui_content();
                log.write();
            },

            init : function () {
                map.data = map.layout;
                logic.generate_npcs();

                bg_canvas = document.getElementById('fivepmbg');
                bg_context = bg_canvas.getContext('2d');

                fg_canvas = document.getElementById('fivepmfg');
                fg_context = fg_canvas.getContext('2d');

                fg_canvas.focus();
                fg_canvas.addEventListener('keydown', logic.update, false);

                log.add("It's 5:00 pm. Time to go home");
                log.add("Use WASD or IJKL to move around");
                log.add("Use E or U to interact");

                log.write();
                draw.all();
            },

        };

    logic.init();

}());
