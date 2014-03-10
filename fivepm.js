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
            'cell'   : 10
        },

        player = {
            'x'  : 10,
            'y'  : 10,
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

            at_cell : function (x, y, code) {
                context.fillStyle = code;
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

            text: function (color, font, x, y, w, text) {
                context.font = font;
                context.strokeStyle = color;
                context.fillText(text, x, y, w);
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
                draw.at_cell(player.x, player.y, 'rgb(0,0,0)');

            },

            update : function (e) {
                logic.handle_input(e);
                canvas.width = canvas.width;
                draw.grid(colors.grid, 9.5, 9.5, 390, 290, 10);
                draw.ui(colors.ui, 9.5, 299.5, 380, 80);

                draw.text(colors.font, "12px sans-serif", 14.5, 314.5, 370,
                          'It is 5:00 pm. Time to go home.');
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
