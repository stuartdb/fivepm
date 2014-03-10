(function () {
    'use strict';
    var canvas = document.getElementById('fivepm'),
        context = canvas.getContext('2d'),

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

        map = '****************************';

    function log_event(e) {
        console.log(e.keyCode);
    }


    function handle_input(e) {
        if (e.keyCode === 87) {
            player.y = player.y - 1;
        } else if (e.keyCode === 83) {
            player.y = player.y + 1;
        } else if (e.keyCode === 65) {
            player.x = player.x - 1;
        } else if (e.keyCode === 68) {
            player.x = player.x + 1;
        } else {
            log_event(e);
        }
    }

    function draw_grid() {
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
    }

    function draw_at_grid_cell(x, y, code) {
        context.fillStyle = code;
        context.fillRect(grid.x + (x * grid.cell),
                 grid.y + (y * grid.cell),
                 grid.cell,
                 grid.cell
                );
    }

    function draw_ui(color, x, y, w, h) {
        context.strokeRect(x, y, w, h);
        context.strokeStyle = color;
        context.stroke();
    }

    function draw_text(color, font, x, y, w, text) {
        context.font = font;
        context.strokeStyle = color;
        context.fillText(text, x, y, w);
    }

    function draw_fivepm() {
        canvas.width = canvas.width;
        draw_grid(colors.grid, 9.5, 9.5, 390, 290, 10);
        draw_ui(colors.ui, 9.5, 299.5, 380, 80);

        draw_text(colors.font, "12px sans-serif", 14.5, 314.5, 370,
                  'It is 5:00 pm. Time to go home.');

        draw_at_grid_cell(player.x, player.y, 'rgb(0,0,0)');

    }

    function update(e) {
        handle_input(e);
        draw_fivepm();
    }

    canvas.focus();
    canvas.addEventListener('keydown', update, false);

    return draw_fivepm(map);

}());
