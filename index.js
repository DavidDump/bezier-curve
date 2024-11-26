class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const points = [
    new Point(200, 450),
    new Point(400, 150),
    new Point(600, 450),
];

function lerp(a, t, b) {
    var x = (1 - t) * a.x + t * b.x;
    var y = (1 - t) * a.y + t * b.y;
    return new Point(x, y);
}

function DrawLerp(a, t, b, pointColor, drawPoints) {
    // Point 1
    if(drawPoints) {
        ctx.beginPath();
        ctx.arc(a.x, a.y, 10, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
    }
    
    // Point 2
    if(drawPoints) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 10, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
    }

    // Draw line
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.closePath();
    ctx.stroke();

    // Draw lerp point
    ctx.save();
    ctx.fillStyle = pointColor;
    var point = lerp(a, t, b);
    ctx.beginPath();
    ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    return point;
}

function DrawFrame() {
    const time = document.getElementById("time").value / 100;
    const drawLine = document.getElementById("draw").checked;

    var p1 = points[0];
    var p2 = points[1];
    var p3 = points[2];

    // clear background
    ctx.save();
    ctx.fillStyle = "#181818";
    ctx.fillRect(0, 0, 800, 600);
    ctx.restore();

    // draw bezier curve
    if(drawLine) {
        const stepSize = 0.001;
        for(var i = 0; i < time; i += stepSize) {
            var lerpP1 = lerp(p1, i, p2);
            var lerpP2 = lerp(p2, i, p3);
            var curvePoint = lerp(lerpP1, i, lerpP2);
    
            // draw curve point
            ctx.save();
            ctx.fillStyle = "green";
            ctx.beginPath();
            ctx.arc(curvePoint.x, curvePoint.y, 10, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }

    // draw background
    var newP1 = DrawLerp(p1, time, p2, "red", true);
    var newP2 = DrawLerp(p2, time, p3, "red", true);
    
    ctx.save();
    ctx.strokeStyle = "red";
    DrawLerp(newP1, time, newP2, "blue", false);
    ctx.restore();
}

function UpdateData() {
    // update the position of the point
    if(movingPointIndex != null) {
        points[movingPointIndex].x = mousePos.x;
        points[movingPointIndex].y = mousePos.y;
    }
}

function Frame() {
    UpdateData();
    DrawFrame();
}

function isPointInCircle(center, radius, point) {
    const distanceSquared = (point.x - center.x) ** 2 + (point.y - center.y) ** 2;
    const radiusSquared = radius ** 2;

    return distanceSquared < radiusSquared;
}

var canvas;
var ctx;

var movingPointIndex = null;
var mousePos; // Point

window.onload = () => {
    canvas = document.getElementById("bezier");
    ctx = canvas.getContext("2d");

    setInterval(Frame, 0.16);
    canvas.onmousedown = (e) => {
        var rect = e.target.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var mouse = new Point(x, y);
        
        points.forEach((p, index) => {
            if(isPointInCircle(p, 10, mouse)) {
                movingPointIndex = index;
            }
        });
    }

    canvas.onmouseup = (e) => {
        if(movingPointIndex != null) movingPointIndex = null;
    }

    canvas.onmousemove = (e) => {
        var rect = e.target.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        mousePos = new Point(x, y);
    }
}