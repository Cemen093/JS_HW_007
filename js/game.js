var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var bg = new Image();
var lighter = new Image();
var bulb_on = new Image();
var bulb_off = new Image();
var lightImg = new Image();

bg.src = "img/bg.jpg";
lighter.src = "img/lighter.png";
bulb_on.src = "img/bulb_on.png";
bulb_off.src = "img/bulb_off.png";
lightImg.src = "img/light.png";

var wBg = 700;
var hBg = 900;
var wBuld = 50;
var hBuld = 70;
var wLigter = 50;
var hLigter = 75;
var wLight = 16;
var hLight = 26;

var ligterDot = {x: wBg/2, y: hBg-hLigter-15};
var bulds = [
    {x: 50, y: 50, on: false},
    {x: wBg - 50 - wBuld, y: 50, on: false},
    {x: wBg/2 - wBuld/2, y: 50, on: false}];
var lights = [];

const mouse = {
    x: 0,
    y: 0,
    left: false,
    pLeft: false,
};

function mouseTick() {
    mouse.pLeft = mouse.left;
}

function mousemoveHandler(event){
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
}

function mousedownHandler(event) {
    if (event.buttons === 1) {
        mouse.left = true;
    }

}

function mouseupHandler(event) {
    if (event.button === 0) {
        mouse.left = false;
    }
}


/*function mouseenterHandler(event) {}
function mouseleaveHandler(event) {}*/
/*canvas.addEventListener("mouseenterHandler", mouseenterHandler);
canvas.addEventListener("mouseleave", mouseleaveHandler);*/
canvas.addEventListener("mousemove", mousemoveHandler);
canvas.addEventListener("mousedown", mousedownHandler);
canvas.addEventListener("mouseup", mouseupHandler);

animation({
    clear(){
        context.drawImage(bg, 0, 0);
        context.drawImage(lighter, wBg/2-wLigter/2-8, hBg-hLigter-15, wLigter, hLigter);
    },

    update() {
        if (mouse.pLeft && !mouse.left){
            lights.push({
                x: ligterDot.x-wLight/2,
                y: ligterDot.y-hLight/2,
                weightX: (mouse.x - ligterDot.x) / Math.max(Math.abs(mouse.x - ligterDot.x), Math.abs(ligterDot.y - mouse.y)),
                weightY: (ligterDot.y - mouse.y) / Math.max(Math.abs(mouse.x - ligterDot.x), Math.abs(ligterDot.y - mouse.y)),
                speed: 4,
                on: true
            })
        }

        lights.forEach(el => {
            el.x += el.weightX*el.speed;
            el.y -= el.weightY*el.speed;
        });

        bulds.forEach(buld => {
            if (buld.on === false){
                lights.forEach(light => {
                    if ( light.x + wLight >= buld.x &&
                    light.x <= buld.x + wBuld &&
                    light.y + hLight<= buld.y &&
                    light.y >= buld.y - hBuld){
                        buld.on = true;
                    }
                })
            }
        });

        mouseTick();
    },

    render() {
        context.beginPath();
        context.moveTo(ligterDot.x, ligterDot.y);

        context.lineTo(mouse.x + ((mouse.x-ligterDot.x)/Math.max(Math.abs(mouse.x-ligterDot.x), Math.abs(ligterDot.y - mouse.y)))*1000,
            mouse.y - ((ligterDot.y-mouse.y)/Math.max(Math.abs(mouse.x-ligterDot.x), Math.abs(ligterDot.y - mouse.y)))*1000);
        /*context.lineTo(mouse.x + (mouse.x-ligterDot.x) * 1000, mouse.y + (mouse.y - ligterDot.y)*1000);*/

        context.strokeStyle = "red";
        context.stroke();

        bulds.forEach(el => {
            if (el.on)
            {
                context.drawImage(bulb_on, el.x, el.y, wBuld, hBuld);
            } else
            {
                context.drawImage(bulb_off, el.x, el.y, wBuld, hBuld);
            }
        });


        lights.forEach(el => {
            context.drawImage(lightImg, el.x, el.y, wLight, hLight);
        });
    }
})