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
            list : []
        },
        map = {
            legend : {
                '@' : { fixed : false, color : 'rgb(0,0,0)' },
                '*' : { fixed : true, color : 'rgb(220,220,220)' },
                '?' : { fixed : true, color : 'rgb(190,190,190)' },
                '>' : { fixed : true, color : 'rgb(150,250,150)' },
                '=' : { fixed : true, color : 'rgb(240,240,240)' },
                '.' : { fixed : false, color : 'rgb(255,255,255)' },
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
                      '**************************************']
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
        draw = {
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

        browser = {

            debug : function (obj) {
                console.log(obj);
            },

            log : function (text) {
                var p = document.getElementById('log');
                p.innerHTML = text + '<br>' + p.innerHTML;
            }
        },

        logic = {

            generate_npcs : function () {
                var i = 0,
                    npcs = 0;

                npcs = util.random_int(10, 20);

                for (i = 0; i < npcs; i = i + 1) {
                    npc.list[i] = {
                        'name'   : npc.names[
                            util.random_int(0, npc.names.length - 1)
                        ],
                        'mood'   : util.random_int(0, npc.moods.length - 1),
                        'social' : util.random_int(0, 100),
                        'dna'    : util.random_dec(0, 2),
                    };
                }
            },

            update_player : function (x, y) {
                if (x !== 0) {
                    if (map.data[player.y][player.x + x] === '.') {
                        player.x = player.x + x;
                    }
                }
                if (y !== 0) {
                    if (map.data[player.y + y][player.x] === '.') {
                        player.y = player.y + y;
                    }
                }
            },

            handle_input : function (e) {
                if (e.keyCode === 87) {
                    logic.update_player(0, -1);
                } else if (e.keyCode === 83) {
                    logic.update_player(0, +1);
                } else if (e.keyCode === 65) {
                    logic.update_player(-1, 0);
                } else if (e.keyCode === 68) {
                    logic.update_player(+1, 0);
                }
            },

            update : function (e) {
                logic.handle_input(e);

                context.clearRect(0, 0, canvas.width, canvas.height);
                // canvas.width = canvas.width;

                draw.grid(colors.grid, 9.5, 9.5, 390, 290, 10);
                draw.ui(colors.ui, 9.5, 305.5, 380, 85);


                draw.map();
                draw.at_cell(player.x, player.y, '@');
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
                browser.log("Bump into people to interact with them");
            },

        };

    logic.init();

}());
