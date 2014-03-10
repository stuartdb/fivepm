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
            'x'  : 10,
            'y'  : 10,
        },
        map = {
            'legend' : {
                '*' : 'rgb(0,0,0)',
                '.' : 'rgb(255,255,255)'
            },
            'data' : ['**************************************',
                      '*....................................*',
                      '*....................................*',
                      '*....................................*',
                      '*....................................*',
                      '*....................................*',
                      '*....................................*',
                      '*....................................*',
                      '*....................................*',
                      '*....................................*',
                      '*....................................*',
                      '*....................................*',
                      '*....................................*',
                      '*....................................*',
                      '*....................................*',
                      '*....................................*',
                      '*....................................*',
                      '*....................................*',
                      '*....................................*',
                      '*....................................*',
                      '*....................................*',
                      '*....................................*',
                      '*....................................*',
                      '*....................................*',
                      '*....................................*',
                      '*....................................*',
                      '*....................................*',
                      '**************************************'],

            generate : function () {
                // Random map generation
            }
        },
        draw = {
            grid : function () {
                var x = grid.x,
                    y = grid.y;

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
                context.fillStyle = map.legend[cell];
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

            message: function (text) {
                context.font = '12px sans-serif';
                context.strokeStyle = colors.font;
                context.fillText(text, 14.5, 314.5, 370);
            },

        },

        logic = {
            handle_input : function (e) {
                if (e.keyCode === 87) {
                    player.y = player.y - 1;
                } else if (e.keyCode === 83) {
                    player.y = player.y + 1;
                } else if (e.keyCode === 65) {
                    player.x = player.x - 1;
                } else if (e.keyCode === 68) {
                    player.x = player.x + 1;
                } else {
                    console.log(e.keyCode);
                }
            },

            update_map : function () {
                draw.map();
                draw.at_cell(player.x, player.y, '*');

            },

            update : function (e) {
                logic.handle_input(e);
                canvas.width = canvas.width;
                draw.grid(colors.grid, 9.5, 9.5, 390, 290, 10);
                draw.ui(colors.ui, 9.5, 299.5, 380, 80);

                draw.message("It's 5:00 pm. Time to go home.");
                logic.update_map();

            },

            init : function () {
                canvas = document.getElementById('fivepm');
                context = canvas.getContext('2d');
                canvas.focus();
                canvas.addEventListener('keydown', logic.update, false);
            },

        };

    logic.init();

}());
