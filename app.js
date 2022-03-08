new Vue({
    data() {
        return {
            clouds: 50,
            particles: 300,
            particleArray: [],
            shootingParticles: 100,
            shootingParticlesArray: [],
            ringNumber: 8,
            stylesArray: [],
            ringArray: [],
            instances: 4,
            count: 300,
            countArray: [],
            start: 65,
            then: Date.now(),
            displayModeEngage: Date.now(),
            displayMode: false,
            angles: [[0, 25, 10, 'rgba(255,255,255,1)'],
            [50, 76, 10, 'rgba(255,255,255,1)'],
            [101, 126, 10, 'rgba(255,255,255,1)'],
            [152, 177, 10, 'rgba(255,255,255,1)'],
            [203, 227, 10, 'rgba(255,255,255,1)'],
            [258, 279, 10, 'rgba(255,255,255,1)'],
            [305, 334, 10, 'rgba(255,255,255,1)'],
            ],
        };
    },
    methods: {
        changeDisplay() {
            this.displayMode = !this.displayMode
            this.displayModeEngage = Date.now();
            //console.log("changed display!")
        },
        loop() {
            let now = Date.now();
            let delta = now - this.then;
            this.update();
            this.render();
            this.then = now;
            requestAnimationFrame(this.loop);
        },
        update() {
            if (this.displayMode === false) {
                this.start = this.start + 0.2;
                this.start >= 100 ? (this.changeDisplay(), this.start = 100) : null;
            }
            else {
                this.start = this.start - 0.4;
                this.start <= 0 ? (this.changeDisplay(), this.start = 0) : null;
            }
            //console.log(this.start)
            this.particleArray.forEach((item, index) => {
                this.adjustLength(item);
                this.moveParticle(item);
            })
            this.shootingParticlesArray.forEach((item, index) => {
                this.moveShootingParticle(item)
            })
            this.ringArray.forEach((item, index) => {
                this.updateRings(item)
            })
            this.countArray.forEach((item, index) => {
                this.updateCount(item)
            })
            //console.log("we updating!")
        },
        render() {
            let canvas1 = document.getElementById("coreCanvas");
            let canvas2 = document.getElementById("firstCanvas");
            let canvas3 = document.getElementById("secondCanvas");
            let canvas4 = document.getElementById("shootingParticles")
            let ctx = canvas1.getContext("2d");
            let ctx2 = canvas2.getContext("2d");
            let ctx3 = canvas3.getContext("2d");
            let ctx4 = canvas4.getContext("2d");
            ctx.globalCompositeOperation = 'screen'; //test */
            ctx4.globalCompositeOperation = 'screen'; //test */
            ctx.clearRect(0, 0, canvas1.width, canvas1.height);
            this.particleArray.forEach((item, index) => {
                this.renderParticle(item, ctx)
            })
            ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
            this.drawCircularPlate(this.angles, ctx2);
            ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
            this.countArray.forEach((item, index) => {
                this.drawCounter(item, ctx3)
            })
            this.drawShootTime(this.start, ctx3)
            this.drawOuterRing(this.ringArray, ctx3);
            ctx4.clearRect(0, 0, canvas4.width, canvas4.height);
            this.shootingParticlesArray.forEach((item, index) => {
                this.renderShootingParticles(item, ctx4)
            })
            /* ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = 'lighten'; //test */
            //console.log("we rendering!")
        },
        createShootingParticles(number) {
            for (let n = 0; n < number; n++) {
                let obj = {
                    x: 470,
                    y: 95 + (Math.random() * 12 - 6),
                    radius: Math.random() * 5 + 15,
                    speed: Math.random() * 7 + 1,
                    opacity: 1,
                    delay: Math.floor(Math.random() * 1000),
                }
                this.shootingParticlesArray.push(obj);
            }
        },
        drawCounterInitiation(number) {
            for (let n = 0; n < number; n++) {
                let obj = {
                    number: n,
                    opacity: Math.random(),
                    reverse: true,
                    start: n * (360 / number),
                    finish: (n + 1) * (360 / number),
                    fill: "transparent",
                    shadow: "rgba(255,255,255,0.5)",
                    strokeStyle: "255,255,255",
                    lineWidth: Math.floor(Math.random() * 5 + 3)
                }
                this.countArray.push(obj)
            }
        },
        drawShootTime(start, ctx) {
            let finish = 360 / 100 * start - 90;
            ctx.strokeStyle = "rgba(255,255,255," + start / 100 + ")";
            ctx.beginPath();
            ctx.arc(450 / 2, 450 / 2, 185, -90 * (Math.PI / 180), finish * (Math.PI / 180));
            ctx.stroke();
            ctx.closePath();
            //X = Math.cos(angle*Math.PI/180) * length + startPointX
            let calculateX = Math.cos((finish + 5) * Math.PI / 180) * 185 + (450 / 2)
            //Y = Math.sin(angle*Math.PI/180) * length + startPointY    
            let calculateY = Math.sin((finish + 5) * Math.PI / 180) * 185 + (450 / 2)
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.font = "10px Arial";
            ctx.fillText(start.toString().substring(0, 2) + "%", calculateX, calculateY);
        },
        updateCount(item) {
            if (item.reverse === true) {
                item.opacity -= 0.01;
                item.opacity < 0.1 ? item.reverse = false : null
            }
            if (item.reverse === false) {
                item.opacity += 0.01;
                item.opacity > 0.9 ? item.reverse = true : null
            }
        },
        drawCounter(item, ctx) {
            if (item.number % 2) {
                ctx.beginPath();
                ctx.strokeStyle = "rgba(" + item.strokeStyle + "," + item.opacity + ")";
                ctx.arc(450 / 2, 450 / 2, 215 + (item.lineWidth / 2), item.start * (Math.PI / 180), item.finish * (Math.PI / 180));
                ctx.fillStyle = item.fill;
                ctx.fill();
                ctx.shadowColor = item.shadow;
                ctx.shadowBlur = 8;
                ctx.lineWidth = item.lineWidth
                ctx.strokeStyle = 1;
                ctx.stroke();
                ctx.closePath();
            }
        },
        createCoreParticles(number) {
            for (let n = 0; n < number; n++) {
                let angle = Math.floor(Math.random() * 360);
                let ring = Math.floor(Math.random() * 25);
                let length = 80 + Math.random() * 40;
                let speed = Math.random() - 0.5;
                speed > 0.3 ? speed = 0.3 : speed = speed;
                let particle = {
                    x: 250 + (length + ring * Math.cos(angle * (Math.PI / 180))),
                    y: 250 + (length + ring * Math.sin(angle * (Math.PI / 180))),
                    radius: Math.random() * 2 + 2,
                    startRadius: Math.random() * 2 + 2,
                    length: length,
                    speed: speed,
                    usedLength: length,
                    grow: Math.random() > 0.5 ? true : false,
                    startAngle: angle,
                    number: n,
                    usedAngle: angle,
                    ring: ring,
                    color: Math.random() > 0.5 ? "rgba(255, 255, 255,0.3)" : "rgba(214,107,24,0.3)",
                    shadow: "rgba(0, 0, 0,1)",
                    number: n,
                }
                this.particleArray.push(particle);
            }
        },
        makeStarStyles(cloud) {
            if (document.getElementById("cloud-" + cloud) === null) {
                let radius = Math.floor(Math.random() * 230 + 130);
                let x = "top:" + Math.floor(Math.random() * document.body.clientHeight - radius / 2) + "px";
                let y = "left:" + Math.floor(Math.random() * document.body.clientWidth - radius / 2) + "px";
                let animationTime = Math.floor(Math.random() * 10 + 5);
                let animationDelay = Math.floor(Math.random() * 15);
                let background = "background:radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 34%, rgba(217,217,217,0.0) 70%)";
                let style = "position:absolute;" + x + ";" + y + ";" + "height:" + radius + "px;" + "width:" + radius + "px;" + "border-radius:180px;" + background + ";animation-duration: " + animationTime + "s;animation-delay:" + animationDelay + "s;";
                this.stylesArray.push(style)
                //console.log(style)
                return style;
            }
            else {
                return this.stylesArray[cloud]
            }
        },
        renderParticle(particle, ctx) {
            var grd = ctx.createRadialGradient(particle.x, particle.y, 1, particle.x, particle.y, particle.radius - particle.radius / 10);
            grd.addColorStop(0, particle.color);
            grd.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
        },
        renderShootingParticles(particle, ctx) {
            if (particle.x < 470) {
                ctx.fillStyle = "rgba(255,255,255," + particle.opacity + ")";
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.fill();
            }
        },
        moveShootingParticle(item) {
            if (this.displayMode === true && Date.now() > this.displayModeEngage + 1000) {
                item.opacity = item.x / 470;
                item.x / 470 * 10 > 0 ? item.radius = item.x / 470 * 10 : item.radius = 0;
                if (item.x > 0) {
                    if (Date.now() > this.displayModeEngage + 1000 + item.delay) {
                        item.x = item.x - item.speed
                    }
                }
                else {
                    item.x = 470
                }
            }
            else if (this.displayMode === false && Date.now() < this.displayModeEngage + 1500) {
                item.opacity = item.x / 470;
                item.x / 470 * 10 > 0 ? item.radius = item.x / 470 * 10 : item.radius = 0;
                item.x = item.x - item.speed
            }
            else if (this.displayMode === false && Date.now() > this.displayModeEngage + 1500) {
                item.x = 470;
            }
        },
        createRings(rings, array) {
            //console.logs
            for (let i = 0; i < rings; i++) {
                let distance = (360 / rings)
                let startAng = Math.floor(Math.random() * 360)
                let endAng = startAng + Math.random() * 50 + 50;
                //let distance = Math.floor(Math.random() * 50 + 50)
                let distandeDrawn = (360 / rings) / 100 * 90
                let distanceTransparent = (360 / rings) / 100 * 10
                let obj = {
                    startAng: startAng * (Math.PI / 180),
                    endAng: endAng * (Math.PI / 180),
                    length: 120 + 7 * i,
                    shown: true,
                    moveDirection: Math.random() > 0.5 ? true : false,
                    moveDone: false,
                }
                array.push(obj);
                console.log(obj)
            }
        },
        updateRings(ring) {
            if (ring.moveDone === false) {
                ring.moveDirection ?
                    (ring.startAng -= 0.01, ring.endAng -= 0.01) :
                    (ring.startAng += 0.01, ring.endAng += 0.01);
                Math.random() < 0.02 ? ring.moveDone = true : null;
            }
            else {
                ring.moveDirection = !ring.moveDirection;
                ring.moveDone = false
            }
        },
        drawOuterRing(points, ctx) {
            points.forEach(item => {
                if (item.shown === true) {
                    //console.log(item.startAng, item.endAng)
                    ctx.beginPath();
                    ctx.arc(450 / 2, 450 / 2, item.length, item.startAng, item.endAng, 0, 2 * Math.PI);
                    ctx.fillStyle = 'transparent'
                    ctx.fill();
                    ctx.shadowColor = 'rgba(255,255,255,1)';
                    ctx.shadowBlur = 15;
                    ctx.lineWidth = 5;
                    ctx.strokeStyle = "rgba(255,255,255,1)";
                    ctx.stroke();
                    ctx.closePath();
                }
            })
        },
        adjustLength(particle) {
            //particle.number === 0 ? console.log(particle.grow) : null
            if (particle.grow && !this.displayMode) {
                particle.usedLength += Math.abs(particle.speed) / 2;
                particle.usedLength > particle.length + 20 ? particle.grow = false : null;
                particle.radius > particle.startRadius ? (particle.radius -= 0.5, particle.usedLength += particle.radius / 3) : null;
            }
            else if (!particle.grow && !this.displayMode) {
                particle.usedLength -= Math.abs(particle.speed) / 2;
                particle.usedLength < particle.length - 20 ? particle.grow = true : null;
                particle.radius > particle.startRadius ? (particle.radius -= 1) : null;
            }
            else if (this.displayMode) {
                !particle.grow ? particle.grow = true : null;
                particle.usedLength > 0 ? particle.usedLength -= particle.radius / 10 : null;
                particle.radius < 25 ? particle.radius += 1 : null;
            }
        },
        moveParticle(particle) {
            //Math.random() < 0.5 ? particle.usedLength++ : particle.usedLength--;
            particle.usedAngle = particle.usedAngle + particle.speed;
            particle.x = 250 + particle.usedLength * Math.cos(particle.usedAngle * (Math.PI / 180));
            particle.y = 250 + particle.usedLength * Math.sin(particle.usedAngle * (Math.PI / 180));
        },
        drawCircularPlate(angles, ctx) {
            angles.forEach((item) => {
                ctx.beginPath();
                ctx.arc(450 / 2, 450 / 2, 150, item[0] * (Math.PI / 180), item[1] * (Math.PI / 180));
                ctx.fillStyle = 'transparent'
                ctx.fill();
                ctx.shadowColor = item[3];
                ctx.shadowBlur = 15;
                ctx.lineWidth = item[2];
                ctx.strokeStyle = item[3];
                ctx.stroke();
                ctx.closePath();
            })
            ctx.beginPath();
            ctx.arc(450 / 2, 450 / 2, 138, 0, 2 * Math.PI);
            ctx.fillStyle = 'transparent'
            ctx.fill();
            ctx.shadowColor = 'rgba(255,255,255,1)';
            ctx.shadowBlur = 15;
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgba(255,255,255,1)';
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.arc(450 / 2, 450 / 2, 163, 0, 2 * Math.PI);
            ctx.fillStyle = 'transparent'
            ctx.fill();
            ctx.shadowColor = 'rgba(255,255,255,1)';
            ctx.shadowBlur = 15;
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgba(255,255,255,1)';
            ctx.stroke();
            ctx.closePath();
        }
    },
    mounted() {
        this.drawCounterInitiation(this.count);
        this.createCoreParticles(this.particles);
        this.createShootingParticles(this.shootingParticles);
        this.createRings(this.ringNumber, this.ringArray);
        let canvas1 = document.getElementById("coreCanvas");
        canvas1.width = document.getElementById("core").offsetWidth;
        canvas1.height = document.getElementById("core").offsetHeight;
        let canvas2 = document.getElementById("firstCanvas");
        canvas2.width = document.getElementById("firstCircle").offsetWidth;
        canvas2.height = document.getElementById("firstCircle").offsetHeight;
        let ctx2 = canvas2.getContext("2d");
        this.drawCircularPlate(this.angles, ctx2);
        let canvas3 = document.getElementById("secondCanvas");
        canvas2.width = document.getElementById("firstCircle").offsetWidth;
        canvas2.height = document.getElementById("firstCircle").offsetHeight;
        window.addEventListener("resize", function () {
            let canvas1 = document.getElementById("coreCanvas");
            canvas1.width = document.getElementById("core").offsetWidth;
            canvas1.height = document.getElementById("core").offsetHeight;
            let canvas2 = document.getElementById("firstCanvas");
            canvas2.width = document.getElementById("firstCircle").offsetWidth;
            canvas2.height = document.getElementById("firstCircle").offsetHeight;
            let canvas3 = document.getElementById("secondCanvas");
            canvas2.width = document.getElementById("firstCircle").offsetWidth;
            canvas2.height = document.getElementById("firstCircle").offsetHeight;
        }, true);
        //Let's start this!
        //we go!
        this.loop();
    }
}) 