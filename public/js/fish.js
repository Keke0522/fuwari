var RENDERER = {
    POINT_INTERVAL : 5,
    FISH_COUNT : 3,
    MAX_INTERVAL_COUNT : 50,
    INIT_HEIGHT_RATE : 0.5,
    THRESHOLD : 50,

    init : function(){
        this.setParameters();
        this.reconstructMethods();
        this.setup();
        this.bindEvent();
        this.render();
    },

    // 设置参数并初始化 DOM 元素引用
    setParameters : function(){
        this.$window = $(window);
        this.$container = $('#jsi-flying-fish-container');
        this.$canvas = $('<canvas />');
        this.context = this.$canvas.appendTo(this.$container).get(0).getContext('2d');
        this.points = [];
        this.fishes = [];
        this.watchIds = [];
    },

    // 创建水面上的一系列控制点
    createSurfacePoints : function(){
        var count = Math.round(this.width / this.POINT_INTERVAL);
        this.pointInterval = this.width / (count - 1);
        this.points.push(new SURFACE_POINT(this, 0));

        for(var i = 1; i < count; i++){
            var point = new SURFACE_POINT(this, i * this.pointInterval),
                previous = this.points[i - 1];

            point.setPreviousPoint(previous);
            previous.setNextPoint(point);
            this.points.push(point);
        }
    },

    // 绑定内部方法到实例，以便事件中使用
    reconstructMethods : function(){
        this.watchWindowSize = this.watchWindowSize.bind(this);
        this.jdugeToStopResize = this.jdugeToStopResize.bind(this);
        this.startEpicenter = this.startEpicenter.bind(this);
        this.moveEpicenter = this.moveEpicenter.bind(this);
        this.reverseVertical = this.reverseVertical.bind(this);
        this.render = this.render.bind(this);
    },

    // 初始化画布、鱼、水面等元素
    setup : function(){
        this.points.length = 0;
        this.fishes.length = 0;
        this.watchIds.length = 0;
        this.intervalCount = this.MAX_INTERVAL_COUNT;
        this.width = this.$container.width();
        this.height = this.$container.height();
        this.fishCount = this.FISH_COUNT * this.width / 500 * this.height / 500;
        this.$canvas.attr({width : this.width, height : this.height});
        this.reverse = false;

        this.fishes.push(new FISH(this));
        this.createSurfacePoints();
    },

    watchWindowSize : function(){
        this.clearTimer();
        this.tmpWidth = this.$window.width();
        this.tmpHeight = this.$window.height();
        this.watchIds.push(setTimeout(this.jdugeToStopResize, this.WATCH_INTERVAL));
    },

    clearTimer : function(){
        while(this.watchIds.length > 0){
            clearTimeout(this.watchIds.pop());
        }
    },

    jdugeToStopResize : function(){
        var width = this.$window.width(),
            height = this.$window.height(),
            stopped = (width == this.tmpWidth && height == this.tmpHeight);

        this.tmpWidth = width;
        this.tmpHeight = height;

        if(stopped){
            this.setup();
        }
    },

    // 绑定鼠标事件
    bindEvent : function(){
        this.$window.on('resize', this.watchWindowSize);
        this.$container.on('mouseenter', this.startEpicenter);
        this.$container.on('mousemove', this.moveEpicenter);
        this.$container.on('click', this.reverseVertical);
    },

    // 获取鼠标在容器内的坐标
    getAxis : function(event){
        var offset = this.$container.offset();

        return {
            x : event.clientX - offset.left + this.$window.scrollLeft(),
            y : event.clientY - offset.top + this.$window.scrollTop()
        };
    },

    // 鼠标开始干扰水面
    startEpicenter : function(event){
        this.axis = this.getAxis(event);
    },

    moveEpicenter : function(event){
        var axis = this.getAxis(event);

        if(!this.axis){
            this.axis = axis;
        }
        this.generateEpicenter(axis.x, axis.y, axis.y - this.axis.y);
        this.axis = axis;
    },

    // 生成干扰波
    generateEpicenter : function(x, y, velocity){
        if(y < this.height / 2 - this.THRESHOLD || y > this.height / 2 + this.THRESHOLD){
            return;
        }
        var index = Math.round(x / this.pointInterval);

        if(index < 0 || index >= this.points.length){
            return;
        }
        this.points[index].interfere(y, velocity);
    },

    // 翻转方向
    reverseVertical : function(){
        this.reverse = !this.reverse;

        for(var i = 0, count = this.fishes.length; i < count; i++){
            this.fishes[i].reverseVertical();
        }
    },

    // 更新所有状态
    controlStatus : function(){
        for(var i = 0, count = this.points.length; i < count; i++){
            this.points[i].updateSelf();
        }
        for(var i = 0, count = this.points.length; i < count; i++){
            this.points[i].updateNeighbors();
        }
        if(this.fishes.length < this.fishCount){
            if(--this.intervalCount == 0){
                this.intervalCount = this.MAX_INTERVAL_COUNT;
                this.fishes.push(new FISH(this));
            }
        }
    },

    // 渲染主循环
    render : function(){
        requestAnimationFrame(this.render);
        this.controlStatus();

        this.context.clearRect(0, 0, this.width, this.height);

        // 设置渐变背景色：从 #67aaeb 到 #e5f0fe
        let gradient = this.context.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#67aaeb');
        gradient.addColorStop(1, '#e5f0fe');
        this.context.fillStyle = gradient;

        // 渲染鱼
        for(var i = 0, count = this.fishes.length; i < count; i++){
            this.fishes[i].render(this.context);
        }

        // 渲染水面
        this.context.save();
        this.context.globalCompositeOperation = 'xor';
        this.context.beginPath();
        this.context.moveTo(0, this.reverse ? 0 : this.height);

        for(var i = 0, count = this.points.length; i < count; i++){
            this.points[i].render(this.context);
        }

        this.context.lineTo(this.width, this.reverse ? 0 : this.height);
        this.context.closePath();
        this.context.fill();
        this.context.restore();
    }
};

// 水面控制点构造器
var SURFACE_POINT = function(renderer, x){
    this.renderer = renderer;
    this.x = x;
    this.init();
};

SURFACE_POINT.prototype = {
    SPRING_CONSTANT : 0.03,
    SPRING_FRICTION : 0.9,
    WAVE_SPREAD : 0.3,
    ACCELARATION_RATE : 0.01,

    init : function(){
        this.initHeight = this.renderer.height * this.renderer.INIT_HEIGHT_RATE;
        this.height = this.initHeight;
        this.fy = 0;
        this.force = {previous : 0, next : 0};
    },

    setPreviousPoint : function(previous){ this.previous = previous; },
    setNextPoint : function(next){ this.next = next; },

    interfere : function(y, velocity){
        this.fy = this.renderer.height * this.ACCELARATION_RATE * ((this.renderer.height - this.height - y) >= 0 ? -1 : 1) * Math.abs(velocity);
    },

    updateSelf : function(){
        this.fy += this.SPRING_CONSTANT * (this.initHeight - this.height);
        this.fy *= this.SPRING_FRICTION;
        this.height += this.fy;
    },

    updateNeighbors : function(){
        if(this.previous){
            this.force.previous = this.WAVE_SPREAD * (this.height - this.previous.height);
        }
        if(this.next){
            this.force.next = this.WAVE_SPREAD * (this.height - this.next.height);
        }
    },

    render : function(context){
        if(this.previous){
            this.previous.height += this.force.previous;
            this.previous.fy += this.force.previous;
        }
        if(this.next){
            this.next.height += this.force.next;
            this.next.fy += this.force.next;
        }
        context.lineTo(this.x, this.renderer.height - this.height);
    }
};

// 鱼类构造器
var FISH = function(renderer){
    this.renderer = renderer;
    this.init();
};

FISH.prototype = {
    GRAVITY : 0.4,

    init : function(){
        this.direction = Math.random() < 0.5;
        this.x = this.direction ? (this.renderer.width + this.renderer.THRESHOLD) : -this.renderer.THRESHOLD;

        // 🐢 修改：减慢鱼的速度和跳跃加速度
        this.vx = this.getRandomValue(3, 7.5) * (this.direction ? -1 : 1);

        if(this.renderer.reverse){
            this.y = this.getRandomValue(this.renderer.height * 1 / 10, this.renderer.height * 4 / 10);
            this.vy = this.getRandomValue(1.5, 3.75);        // 原 2~5，现减 1/4
            this.ay = this.getRandomValue(0.0375, 0.15);     // 原 0.05~0.2，现减 1/4
        }else{
            this.y = this.getRandomValue(this.renderer.height * 6 / 10, this.renderer.height * 9 / 10);
            this.vy = this.getRandomValue(-3.75, -1.5);      // 原 -5~-2，现减 1/4
            this.ay = this.getRandomValue(-0.15, -0.0375);   // 原 -0.2~-0.05，现减 1/4
        }

        this.previousY = this.y;
        this.isOut = false;
        this.theta = 0;
        this.phi = 0;
    },

    getRandomValue : function(min, max){
        return min + (max - min) * Math.random();
    },

    reverseVertical : function(){
        this.isOut = !this.isOut;
        this.ay *= -1;
    },

    controlStatus : function(context){
        this.previousY = this.y;
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.ay;

        if(this.renderer.reverse){
            if(this.y > this.renderer.height * this.renderer.INIT_HEIGHT_RATE){
                this.vy -= this.GRAVITY;
                this.isOut = true;
            }else{
                if(this.isOut){
                    this.ay = this.getRandomValue(0.02, 0.1);
                }
                this.isOut = false;
            }
        }else{
            if(this.y < this.renderer.height * this.renderer.INIT_HEIGHT_RATE){
                this.vy += this.GRAVITY;
                this.isOut = true;
            }else{
                if(this.isOut){
                    this.ay = this.getRandomValue(-0.1, -0.02);
                }
                this.isOut = false;
            }
        }

        if(!this.isOut){
            this.theta += Math.PI / 20;
            this.theta %= Math.PI * 2;
            this.phi += Math.PI / 30;
            this.phi %= Math.PI * 2;
        }

        this.renderer.generateEpicenter(this.x + (this.direction ? -1 : 1) * this.renderer.THRESHOLD, this.y, this.y - this.previousY);

        if(this.vx > 0 && this.x > this.renderer.width + this.renderer.THRESHOLD || this.vx < 0 && this.x < -this.renderer.THRESHOLD){
            this.init();
        }
    },

    render : function(context){
        context.save();
        context.translate(this.x, this.y);
        context.rotate(Math.PI + Math.atan2(this.vy, this.vx));
        context.scale(0.85, this.direction ? 0.85 : -0.85);
        context.beginPath();
        context.moveTo(-30, 0);
        context.bezierCurveTo(-20, 15, 15, 10, 40, 0);
        context.bezierCurveTo(15, -10, -20, -15, -30, 0);
        context.fill();

        context.save();
        context.translate(40, 0);
        context.scale(0.9 + 0.2 * Math.sin(this.theta), 1);
        context.beginPath();
        context.moveTo(0, 0);
        context.quadraticCurveTo(5, 10, 20, 8);
        context.quadraticCurveTo(12, 5, 10, 0);
        context.quadraticCurveTo(12, -5, 20, -8);
        context.quadraticCurveTo(5, -10, 0, 0);
        context.fill();
        context.restore();

        context.save();
        context.translate(-3, 0);
        context.rotate((Math.PI / 3 + Math.PI / 10 * Math.sin(this.phi)) * (this.renderer.reverse ? -1 : 1));

        context.beginPath();
        if(this.renderer.reverse){
            context.moveTo(5, 0);
            context.bezierCurveTo(10, 10, 10, 30, 0, 40);
            context.bezierCurveTo(-12, 25, -8, 10, 0, 0);
        }else{
            context.moveTo(-5, 0);
            context.bezierCurveTo(-10, -10, -10, -30, 0, -40);
            context.bezierCurveTo(12, -25, 8, -10, 0, 0);
        }
        context.closePath();
        context.fill();
        context.restore();
        context.restore();

        this.controlStatus(context);
    }
};

// 启动入口
$(function(){
    RENDERER.init();
});
