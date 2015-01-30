/*!
 * grunt-svg2png
 * https://github.com/dbushell/grunt-svg2png
 *
 * Copyright (c) 2013 David Bushell
 * Licensed under The MIT License (MIT)
 */

var fs = require('fs'),
    page = require('webpage').create(),
    files = JSON.parse(phantom.args[0]),
    total = files.length,
    next = 0,

    file, svgdata, frag, svg, width, height, box;

var nextFile = function()
{
    if (next >= total) {
        phantom.exit(0);
        return;
    }

    file = files[next++];

    svgdata = fs.read(file.src) || '';

    frag = window.document.createElement('div');
    frag.innerHTML = svgdata;

    svg = frag.querySelector('svg');
    box = svg.getAttribute('viewBox').split(/\s+/);
    
    height = box[3];
    width = box[2];

    page.viewportSize = {
        width: parseFloat(width),
        height: parseFloat(height)
    };

    // page.open('data:image/svg+xml;utf8,' + svgdata, function(status)
    page.open(file.src, function(status)
    {
        page.render(file.dest);
        console.log(JSON.stringify({ 'file': file, 'status': status }));
        nextFile();
    });
};

nextFile();
