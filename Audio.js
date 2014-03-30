var Audio = function ( url ) {

	var AudioContext = window.AudioContext || window.webkitAudioContext;
	var context = new AudioContext();

	var analyser = context.createAnalyser();
	analyser.fftSize = 1024;
	analyser.connect( context.destination );

	var gain = context.createGain();
	gain.gain.value = 2;
	gain.connect( analyser );

	var onLoadCallback = function () {};

    var self = this;
	var request = new XMLHttpRequest();
	request.open( 'GET', url, true );
	request.responseType = 'arraybuffer';
	request.onload = function () {

		context.decodeAudioData( request.response, function ( buffer ) {

			var source = context.createBufferSource();
			source.buffer = buffer;
			source.connect( gain );

		  
            var i = init.bind( self );
            i();

			source.start( 0 );

			onLoadCallback();

		} );

	};
	request.send();

	//


	var init = function () {

      console.log( this );
      console.log( analyser );
        this.analyser = analyser;
        this.analyser.array = new Uint8Array( analyser.frequencyBinCount);
        this.analyser.average = 0;

        var fbc = analyser.frequencyBinCount;

        // TODO: why 2 * 4 instead of 4 ?
        // fudge factor is to make sure texture reachs from 0 -> 1 in vUv coords
        this.pixels = fbc / 8.2; 

        console.log( 'pizels' );
        console.log( this.pixels );
        //creates a canvas element
        this.canvas              = document.createElement('canvas');
        this.canvas.style.zIndex     = 999;
        this.canvas.style.position   = 'absolute';
        this.canvas.style.top        = '0px';
        this.canvas.style.left        = '0px';
        this.canvas.style.border      = '1px solid #f00';

        // uncomment to see texture in upper left corner
        //document.body.appendChild( this.canvas );
        
        this.canvas.width = this.pixels;
        this.canvas.height = 1;
        
        this.c = this.canvas.getContext('2d');

        this.width = this.canvas.width;
        this.height = this.canvas.height;

        var imageData = this.c.createImageData( this.width , this.height );

        this.c.putImageData( imageData , 0 , 0 );

        this.texture = new THREE.Texture( this.canvas );




	};

	this.mark = 0;

	this.onLoad = function ( callback ) {

		onLoadCallback = callback;

	};

	this.getCanvas = function () {

		return frequencyCanvas;

	};

	this.getFrequency = function () {

		return frequencyData;

	};

	this.getCurrentTime = function () {

		return context.currentTime;

	};

	this.update = function () {


      if( this.analyser ){

      var imageData = this.c.createImageData( this.width , this.height );
      this.analyser.getByteFrequencyData( this.analyser.array );

      var total = 0;
      for( var i = 0; i< this.analyser.array.length; i++ ){

        total += this.analyser.array[i];

      }

      this.analyser.average = total / this.analyser.array.length;


      //transfers audio data to rgb values
      for (var i = 0; i < this.pixels ; i++) {
        
        var x = i;
        var y = 0;
        var r = this.analyser.array[i]   | 0;
        var g = this.analyser.array[i+1] | 0;       
        var b = this.analyser.array[i+2] | 0;
        var a = this.analyser.array[i+3] | 0;
        this.setPixelData( imageData , x , y , r , g , b , a ); 
      
      }


      this.c.putImageData( imageData , 0 , 0 );

      //updates the texture
      this.texture.needsUpdate =  true;

    }


	};

    this.setPixelData = function ( imageData, x, y, r, g, b, a) {

      index = ( x + y * imageData.width ) * 4;
      imageData.data[index+0] = r;
      imageData.data[index+1] = g;
      imageData.data[index+2] = b;
      imageData.data[index+3] = a;

  }
  
};
