let bird =document.querySelector(".bird")
let screen = document.querySelector(".screen")
let screenWidth = screen.offsetWidth
let screenHeight = screen.offsetHeight        //屏幕的高度
let footer = document.querySelector(".footer")
let birdHeight = bird.offsetHeight      //鸟的高度
let birdWidth = bird.offsetWidth
let birdLeft = bird.offsetLeft
let footerTop = footer.offsetTop;
let footerHeight = footer.offsetHeight
let birdJumpMaxSize = 1;          //鸟上升的最大的高度(倍速)
let birdDropSpeed = 1;
let birdjumpSpeed = -1;
let conduitSpeed = -1;
let conduitWidth = 30;
let conduitProSpe = screenWidth / (Math.abs(conduitSpeed)/10)    //管道生成的速度
let conduitGap = 3;
let time1;      //保存bird掉落的定时器
let time2;      //保存bird上升的定时器
let time4;      //保存生成管道的定时器
let time5Arr = []   ////保存所有管道移动的定时器
let totalScore = 0   //游戏总分
let score = document.querySelector(".score")

function start(){
	birdDrop()
	produsConduit()
}
start()
//鸟掉落
function birdDrop(){
	time1 = setInterval(function(){
		ischeakFail()
		bird.style.top = (bird.offsetTop+birdDropSpeed)+"px"
	},10)
}
//鸟上升的
function birdJump(){
	//停止鸟下降
	clearInterval(time1)
	//停止上一次鸟的上升
	clearInterval(time2)
	let oldTop = bird.offsetTop
	time2 = setInterval(function(){
		let newTop = bird.offsetTop
		if(birdJumpMaxSize*birdHeight<=oldTop-newTop ||newTop<=0){
			clearInterval(time2)          //停止上升
			 birdDrop()                   // 开始下降
		}
		bird.style.top = (bird.offsetTop+birdjumpSpeed)+"px"
	},8)
}
//游戏失败
function stop(){
	clearInterval(time1)   //清除鸟掉落的定时器
	clearInterval(time4)   //停止生成管道
	time5Arr.forEach(function(val){
		clearInterval(val)
	})
	window.onkeydown=null
	screen.createTextNode("游戏失败")
	screen.innerText="游戏失败"
	screen.style.fontSize="100px"
	window.close();
}
//检查游戏是否失败
function ischeakFail(){
	if(bird.offsetTop+birdDropSpeed > footerTop-birdHeight){
		stop()
	}
}
//键盘监听事件
window.onkeydown =function(e){
	if(e.keyCode===32){
		birdJump()
	}
}
//创建管道
function createConduit(){
let Conduit1 = document.createElement("div")
let Conduit2 = document.createElement("div")
Conduit1.classList.add("Conduit1")
Conduit2.classList.add("Conduit2")
screen.appendChild(Conduit1)
screen.appendChild(Conduit2)
conduitGap=getRandow(2.5,4);
let height1 = getRandow(birdHeight*2,screenHeight-birdHeight*(1+conduitGap)-footerHeight)
let height2 = screenHeight-height1-conduitGap*birdHeight
Conduit1.style.height=height1+"px"
Conduit2.style.height=height2+"px"
//管道移动
let time3 = setInterval(function(){
	if(Conduit1.offsetLeft+conduitSpeed<=-conduitWidth){
		time5Arr.shift();
		clearInterval(time3)
		screen.removeChild(Conduit1)
		screen.removeChild(Conduit2)
	}
	if(Conduit1.offsetLeft+conduitWidth<birdLeft){
		if(!Conduit1.classList.contains("isSetScore")){
			setScore(1)
		}
		Conduit1.classList.add("isSetScore")
	}
	if(checkCrash(Conduit1)||checkCrash(Conduit2)){
		stop()
		}	
	Conduit1.style.left = (Conduit1.offsetLeft+conduitSpeed)+"px"
	Conduit2.style.left = (Conduit2.offsetLeft+conduitSpeed)+"px"
},10)
	time5Arr.push(time3);
}




//生成管道
function produsConduit(){
	createConduit()
	time4 = setInterval(createConduit,conduitProSpe/1.5)
}

function getRandow (start,end) {
	return Math.random()*(end-start)+start;
}

//判断是否碰撞
function checkCrash(conduitEle){
	let conduitLeft = conduitEle.offsetLeft;                                         //管道距离场景左边的距离
	let conduitTop = conduitEle.offsetTop;                                           //管道距离场景上边的距离
	let birdTop = bird.offsetTop;                                                    //鸟距离场景上边的距离
	let conduitWidth = conduitEle.offsetWidth;                                       //管道的宽度
	let conduitHeight = conduitEle.offsetHeight;                                     //管道的高度
	let size1 = Math.abs(conduitLeft-birdLeft);                                      //水平方向的距离
	let size2 = Math.abs(birdTop-conduitTop);                                        //垂直方向的距离
	let flag1 = birdLeft < conduitLeft && size1 < birdWidth;                          //如果鸟在管道的左边
	let flag2 = birdLeft >= conduitLeft && size1 < conduitWidth;                     //如果鸟在管道的右边
	let flag3 = birdTop < conduitTop && size2 < conduitWidth;                            //如果鸟在管道的上面
	let flag4 = birdTop >= conduitTop && size2 < conduitHeight;                      //如果鸟在管道的下面
	return (flag1||flag2)&&(flag3||flag4);
}

window.onblur = function() {
	stop();
}




function setScore(num) {
	totalScore += num;
	score.innerHTML = totalScore;
}
