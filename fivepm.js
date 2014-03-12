(function () {
    'use strict';
    var canvas,
        context,
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
            'mood'   : 10,
            'social' : 10,
        },
        browser = {
            debug : function (obj) {
                console.log(obj);
            },

            log : function (text) {
                var p = document.getElementById('log');
                p.innerHTML = text + '<br>' + p.innerHTML;
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
                browser.log(npc.list[i]);
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
        draw = {
            all : function () {
                draw.grid(colors.grid, 9.5, 9.5, 390, 290, 10);
                draw.ui(colors.ui, 9.5, 305.5, 380, 85);
                draw.map();
                draw.map_entities();
            },
            clear : function () {
                context.clearRect(0, 0, canvas.width, canvas.height);
            },
            grid : function () {
                var x = grid.x,
                    y = grid.y;

                context.beginPath();
                for (x; x < grid.width; x = x + grid.cell) {
                    context.moveTo(x, grid.y);
                    context.lineTo(x, grid.height);

                }

                for (y; y < grid.height; y = y + grid.cell) {
                    context.moveTo(grid.x, y);
                    context.lineTo(grid.width, y);
                }
                context.strokeStyle = colors.grid;
                context.stroke();
            },

            map : function () {
                var i, j;
                for (i = 0; i < map.data.length; i = i + 1) {
                    for (j = 0; j < map.data[i].length; j = j + 1) {
                        draw.at_cell(j, i, map.data[i][j]);
                    }
                }
            },

            map_entities : function () {
                var i = 0;

                draw.at_cell(player.x, player.y, '@');

                for (i = 0; i < npc.list.length; i = i + 1) {
                    draw.at_cell(npc.list[i].x, npc.list[i].y, '&');
                }
            },

            at_cell : function (x, y, cell) {
                context.fillStyle = map.legend[cell].color;
                context.fillRect(grid.x + (x * grid.cell),
                                 grid.y + (y * grid.cell),
                                 grid.cell,
                                 grid.cell
                                );
            },

            ui : function (color, x, y, w, h) {
                context.strokeRect(x, y, w, h);
                context.strokeStyle = color;
                context.stroke();
            },
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
                        'dna'    : util.random_dec(0, 2),
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

                if (cell.type === 'empty') {
                    player.x = x;
                    player.y = y;
                } else if (cell.type === 'npc') {
                    npc.interact(cell.npc);
                }
            },

            interact : function () {
                browser.log("Interacting at " + player.x + " " + player.y);
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
                draw.clear();
                draw.all();
            },

            init : function () {
                map.data = map.layout;
                logic.generate_npcs();

                canvas = document.getElementById('fivepm');
                context = canvas.getContext('2d');
                canvas.focus();

                canvas.addEventListener('keydown', logic.update, false);

                browser.log("It's 5:00 pm. Time to go home");
                browser.log("Use WASD or IJKL to move around");
                browser.log("Use E or U to interact");

                // sick of F5ing and seeing nothing until input, sort later
                draw.all();
            },

        };

    logic.init();

}());
