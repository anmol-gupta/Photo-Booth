const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.shutter');
const butt = document.querySelectorAll('button');

function getVideo() {
	navigator.mediaDevices.getUserMedia({video: true, audio: false})
	.then(localMediaStream => {
		console.log(localMediaStream);
		video.srcObject = localMediaStream;
		video.play();
	})
	.catch(err => {
		console.error(`Hey! You denied the permission to the webcam.`, err);
	})
}

function paintToCanvas() {
	const width = video.videoWidth;
	const height = video.videoHeight;
	console.log(width, height);
	canvas.width = width;
	canvas.height = height;

	return setInterval(() => {
		ctx.drawImage(video, 0, 0, width, height);
		let pixels = ctx.getImageData(0, 0, width, height);
		ctx.globalAlpha = 0.1;
		if(butt.name == 'RE'){
		pixels = redEffect(pixels);
	} else{
		pixels = rgbSplit(pixels);
	}
		ctx.putImageData(pixels,0,0);
	}, 16);
}

function takePhoto() {
	snap.currentTime = 0;
	snap.play();

	const data = canvas.toDataURL('image/jpeg');
	console.log(data);
	const link = document.createElement('a');
	link.href = data;
	link.textContent = 'Download Image';
	link.setAttribute('download','smart');
	link.innerHTML = `<img src= "${data}" alt="Smart Man" />`;
	strip.insertBefore(link, strip.firstChild);

}

getVideo();

function redEffect(pixels) {
	for(var i = 0; i < pixels.data.length; i += 4){
		pixels.data[i + 0] += 100;
		pixels.data[i + 1] -+ 50;
		pixels.data[i + 2] *= 0.5;
	}
	return pixels;
}

function rgbSplit(pixels) {
	for(var i = 0; i < pixels.data.length; i+=4) {
		pixels.data[i - 150] = pixels.data[i + 0];
		pixels.data[i - 100] = pixels.data[i + 1];
		pixels.data[i - 150] = pixels.data[i + 2];
	}
	return pixels;
}

video.addEventListener('canplay', paintToCanvas);