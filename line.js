"use strict";

/*
References:
* https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
* https://rosettacode.org/wiki/Bitmap/Bresenham%27s_line_algorithm
* https://www.cs.helsinki.fi/group/goa/mallinnus/lines/bresenh.html

* Mid-Point
* https://www.tutorialspoint.com/computer_graphics/line_generation_algorithm.htm


* https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
* http://tutorials.jenkov.com/html5-canvas/pixels.html
*/

var canvas, context, image, data;
var w = 280;
var h = 192;

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
    function mulpixel( x, y, r,g,b,a)
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

        data[i+0] *= r / 255;
        data[i+1] *= g / 255;
        data[i+2] *= b / 255;
        data[i+3] *= a / 255;
    }

// ========================================================================
function init()
{
    canvas  = document.getElementById( 'canvas' );
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
    var ds = dy / dx;

    for( x = x0; x <= x1; ++x )
    {
        // truncate to integer: y|0
        addpixel( x, y|0, color ); // normally, putpixel()
        y += ds;
    }
}

// integer
// ========================================================================
function line2( x0, y0, x1, y1 )
{
    var x, y = y0;
    var color = [0,0,255,128]; // blue

    var dx = x1 - x0;
    var dy = y1 - y0;
    var s  = 2*dy - dx;

    for( x = x0; x <= x1; ++x )
    {
        addpixel( x, y, color ); // normally, putpixel()

        if (s > 0)
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

// Uncomment 1, 2, or all 3
//    line0( 10, 20, 40, 30 ); get();
//    line1( 10, 20, 40, 30 ); draw();
    line2( 10, 20, 40, 30 ); draw();
}
