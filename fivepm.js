function draw_grid(context, color, sx, sy, w, h, s) {
    'use strict';
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

function draw_ui(context, color, x, y, w, h) {
    'use strict';

    context.strokeRect(x, y, w, h);
    context.strokeStyle = color;
    context.stroke();
}

function draw_text(context, color, font, x, y, w, text) {
    'use strict';

    context.font = font;
    context.strokeStyle = color;
    context.fillText(text, x, y, w);
}

function draw_fivepm() {
    'use strict';
    var canvas,
        context,
        color_grid = 'rgb(220,220,220)',
        color_font = 'rgb(0,0,0)',
        color_ui = 'rgb(220,220,220)';

    canvas = document.getElementById('fivepm');
    context = canvas.getContext('2d');

    draw_grid(context, color_grid, 9.5, 9.5, 390, 290, 10);
    draw_ui(context, color_ui, 9.5, 299.5, 380, 80);

    draw_text(context, color_font, "12px sans-serif", 14.5, 314.5, 370,
             'It is 5:00 pm. Time to go home.');
}

draw_fivepm();
