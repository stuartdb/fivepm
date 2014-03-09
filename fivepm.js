(function () {
    'use strict';
    var canvas = document.getElementById('fivepm'),
        context = canvas.getContext('2d');

    function draw_grid(color, sx, sy, w, h, s) {
        var x = sx,
            y = sy;

        for (x; x < w; x = x + s) {
            context.moveTo(x, sy);
            context.lineTo(x, h);
        }

        for (y; y < h; y = y + s) {
            context.moveTo(sx, y);
            context.lineTo(w, y);
        }

        context.strokeStyle = color;
        context.stroke();
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
        var color_grid = 'rgb(220,220,220)',
            color_font = 'rgb(0,0,0)',
            color_ui = 'rgb(220,220,220)';


        draw_grid(color_grid, 9.5, 9.5, 390, 290, 10);
        draw_ui(color_ui, 9.5, 299.5, 380, 80);

        draw_text(color_font, "12px sans-serif", 14.5, 314.5, 370,
                  'It is 5:00 pm. Time to go home.');
    }

    return draw_fivepm();

}());
