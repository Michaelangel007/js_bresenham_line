"use strict";

/*
References:
* https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
* https://csustan.csustan.edu/~tom/Lecture-Notes/Graphics/Bresenham-Line/Bresenham-Line.pdf
* https://rosettacode.org/wiki/Bitmap/Bresenham%27s_line_algorithm
* https://www.cs.helsinki.fi/group/goa/mallinnus/lines/bresenh.html

* Mid-Point
* https://www.tutorialspoint.com/computer_graphics/line_generation_algorithm.htm
* https://upload.wikimedia.org/wikipedia/commons/5/5a/Line_1.5x%2B1_--_planes.svg
* https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm#/media/File:Line_1.5x%2B1_--_planes.svg

* https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
* http://tutorials.jenkov.com/html5-canvas/pixels.html
*/

var canvas, context, image, data;
var w;
var h;

var sx = 10;
var sy = 10;

// Debug

    // ========================================================================
    function output( text )
    {
        var pre = document.getElementById( 'output' );
        pre.innerHTML = text;
    }

// Framebuffer

    // ========================================================================
    function draw()
    {
        context.putImageData( image, 0, 0 );
    }

    // ========================================================================
    function clear()
    {
        context.clearRect( 0, 0, canvas.width, canvas.height );
    }

    // ========================================================================
    function get()
    {
        image = context.getImageData(0,0,w,h);
        data  = image.data;
    }

// Pixel

    /**
     * {Number}           x
     * {Number}           y
     * {Number|Array}     r
     * {Number|Undefined} g
     * {Number|Undefined} b
     * {Number|Undefined} a
     * Note:
     *   a = 0   transparent
     *   a = 255 opaque
     * Example:
     *   putpixel( 1, 2, 255, 0, 0, 255 );
     *   putpixel( 3, 4, [255, 0, 0, 255] );
     */
    // ========================================================================
    function putpixel( x, y, r,g,b,a)
    {
        var i = ((y * image.width) + x) * 4;

        // r is array [r,g,b,a]
        if ((typeof r === 'object') && Array.isArray( r ))
        {
            var t = r;
            r = t[0];
            g = t[1];
            b = t[2];
            a = t[3];
        }
        // else: 'number'

        data[i+0] = r;
        data[i+1] = g;
        data[i+2] = b;
        data[i+3] = a;
    }

    // ========================================================================
    function addpixel( x, y, r,g,b,a)
    {
        var i = ((y * image.width) + x) * 4;

        // r is array [r,g,b,a]
        if ((typeof r === 'object') && Array.isArray( r ))
        {
            var t = r;
            r = t[0];
            g = t[1];
            b = t[2];
            a = t[3];
        }
        // else: 'number'

        data[i+0] += r;
        data[i+1] += g;
        data[i+2] += b;
        data[i+3] += a;
    }

    // ========================================================================
    function subpixel( x, y, r,g,b,a)
    {
        var i = ((y * image.width) + x) * 4;

        // r is array [r,g,b,a]
        if ((typeof r === 'object') && Array.isArray( r ))
        {
            var t = r;
            r = t[0];
            g = t[1];
            b = t[2];
            a = t[3];
        }
        // else: 'number'

        data[i+0] -= r;
        data[i+1] -= g;
        data[i+2] -= b;
        data[i+3] -= a;
    }

    // ========================================================================
    function mulpixel( x, y, r,g,b,a)
    {
        // var v = h - y; // put origin at bottom-left instead of top-left
        var i = ((y * image.width) + x) * 4;

        // r is array [r,g,b,a]
        if ((typeof r === 'object') && Array.isArray( r ))
        {
            var t = r;
            r = t[0];
            g = t[1];
            b = t[2];
            a = t[3];
        }
        // else: 'number'

        data[i+0] *= r / 255;
        data[i+1] *= g / 255;
        data[i+2] *= b / 255;
        data[i+3] *= a / 255;
    }

    // ========================================================================
    function zoompixel( x, y, op, color )
    {
        var i, j;
        var u = sx-1;
        var v = sy-1;

        for( j = 0; j < v; j++ )
        {
            for( i = 0 ; i < u; i++ )
            {
                op( x*sx + i, y*sy + j, color );
            }
        }
    }

function vline( x, color )
{
    var y;

    for( y = 0; y < h; y++ )
        putpixel( x, y, color );
}

function hline( y, color )
{
    var x;

    for( x = 0 ; x < w; x++ )
        putpixel( x, y, color );
}

// ========================================================================
function grid( color )
{
    var u = sx-1;
    var v = sy-1;
    var x,y;

    for( y = 0; y < h; y += sy )
        hline( y, color );

    for( x = 0 ; x < w; x += sx )
        vline( x, color );
}

// ========================================================================
function init()
{
    canvas  = document.getElementById( 'canvas' );
    w = canvas.width;
    h = canvas.height;
    context = canvas.getContext( '2d' );

    image   = context.createImageData( w, h );
    data    = image.data;
}

// ========================================================================
function line0( x0, y0, x1, y1 )
{
    context.beginPath();
    context.strokeStyle="#FF0000"; // red
    context.lineWidth = 1;
    context.imageSmoothingEnabled = false;

    context.moveTo( x0, y0 );
    context.lineTo( x1, y1 );
    context.stroke();
}

// floating-point
// ========================================================================
function line1( x0, y0, x1, y1 )
{
    var x, y = y0;
    var color = [0,255,0,128]; // green

    var dx = x1 - x0;
    var dy = y1 - y0;
    var m  = dy / dx;

    for( x = x0; x <= x1; ++x )
    {
        //setpixel( x, y, color );
        //addpixel( x, y, color );
        zoompixel( x, y|0, addpixel, color ); // truncate to integer: y|0

        y += m;
    }
}

// floating-point
// ========================================================================
function line2( x0, y0, x1, y1 )
{
    var x, y = y0;
    var color = [0,255,0,128]; // green

    var dx = x1 - x0;
    var dy = y1 - y0;
    var m  = dy / dx;
    var e  = 0;

    for( x = x0; x <= x1; ++x )
    {
        //setpixel( x, y, color );
        //addpixel( x, y, color );
        zoompixel( x, y|0, addpixel, color ); // truncate to integer: y|0

        e += m;
        if (e > 0.5)
        {
            y++;
            e -= 1;
        }
    }
}

// floating-point
// ========================================================================
function line3( x0, y0, x1, y1 )
{
    var x, y = y0;
    var color = [0,0,255,128]; // blue

    var dx = x1 - x0;
    var dy = y1 - y0;
    var m  = 2 * dy / dx;
    var e  = 0;

    for( x = x0; x <= x1; ++x )
    {
        //setpixel( x, y, color );
        //addpixel( x, y, color );
        zoompixel( x, y|0, addpixel, color ); // truncate to integer: y|0

        e += m;
        if (e > 1)
        {
            y++;
            e -= 2;
        }
    }
}

// floating-point
// ========================================================================
function line4( x0, y0, x1, y1 )
{
    var x, y = y0;
    var color = [0,0,255,128]; // blue

    var dx = x1 - x0;
    var dy = y1 - y0;
    var m  = 2*dy;
    var e  = 0;

    for( x = x0; x <= x1; ++x )
    {
        //setpixel( x, y, color );
        //addpixel( x, y, color );
        zoompixel( x, y, addpixel, color );

        e += m;
        if (e > dx)
        {
            y++;
            e -= 2*dx;
        }
    }
}

// floating-point
// ========================================================================
function line5( x0, y0, x1, y1 )
{
    var x, y = y0;
    var color = [0,255,0,128]; // green

    var dx = x1 - x0;
    var dy = y1 - y0;
    var m  = 2*dy;
    var e  = -dx;

    for( x = x0; x <= x1; ++x )
    {
        //setpixel( x, y, color );
        //addpixel( x, y, color );
        zoompixel( x, y, addpixel, color );

        e += m;
        if (e > 0)
        {
            y++;
            e -= 2*dx;
        }
    }
}

// integer: > 0
// ========================================================================
function linei( x0, y0, x1, y1 )
{
    var x, y = y0;
    var color = [0,0,255,128]; // blue

    var dx = x1 - x0;
    var dy = y1 - y0;
    var s  = 2*dy - dx;

    for( x = x0; x <= x1; ++x )
    {
        //setpixel( x, y, color );
        //addpixel( x, y, color );
        zoompixel( x, y, addpixel, color );

        if (s > 0)
        {
            s -= dx;
            y++;
        }
        s += dy;
    }
}

// integer: >= 0
// ========================================================================
function linej( x0, y0, x1, y1 )
{
    var x, y = y0;
    var color = [0,0,255,128]; // blue

    var dx = x1 - x0;
    var dy = y1 - y0;
    var s  = 2*dy - dx;

    for( x = x0; x <= x1; ++x )
    {
        //setpixel( x, y, color );
        //addpixel( x, y, color );
        zoompixel( x, y, addpixel, color );

        if (s >= 0)
        {
            s -= dx;
            y++;
        }
        s += dy;
    }
}

function onLoad()
{
    init();
    clear();

    grid( [128,128,128,255] );

    var x0 = 10, y0 = 20;
    var x1 = 40, y1 = 30;

// Uncomment 1, 2, or all 3
//    line0( x0, y0, x1, y1 ); get();
//    line1( x0, y0, x1, y1 ); draw(); // float
//    line2( x0, y0, x1, y1 ); draw(); // float
//    line3( x0, y0, x1, y1 ); draw(); // float
//    line4( x0, y0, x1, y1 ); draw(); // float
//    line5( x0, y0, x1, y1 ); draw(); // float
//    linei( x0, y0, x1, y1 ); draw(); // int
      linej( x0, y0, x1, y1 ); draw(); // int

    var black = [ 128, 128, 128, -64 ];
    zoompixel( x0, y0, subpixel, black ); draw();
    zoompixel( x1, y1, subpixel, black ); draw();
}
