class Earth {
	constructor(opt) {
    this.bgColor = "0x00FFA7";
    this.sphereColor = "0x0B654B";
    this.ringColor = "0x00FFA7";
    this.earthColor = "0x0B553E";
    this.linghtColor = "0xffffff";
    this.spin = 0.1;
    this.moveAnim = true;
		this.flightLines = [];
		this.hotspots = [];
		this.city = [];
		this.markers = [];
		this.currentCity = 0;
		this.isAnimate = false;
		this.flightLineColor = {
      "0": new THREE.Color(0xA50026),   
      "1": new THREE.Color(0xF16740),   
      "2": new THREE.Color(0xFEC97A),   
      "3": new THREE.Color(0xCEFA00),   
      "4": new THREE.Color(0xDEFA00),
      "5": new THREE.Color(0xB9FA00)
      /*"0": new THREE.Color(0xA50026),   
      "1": new THREE.Color(0xF16740),   
      "2": new THREE.Color(0xFEC97A),   
      "3": new THREE.Color(0xCEFA00),   
      "4": new THREE.Color(0xDEFA00),
      "5": new THREE.Color(0xB9FA00)*/
			/*"0": new THREE.Color(0xA50026),   
      "1": new THREE.Color(0x32cd32),   
      "2": new THREE.Color(0x0D8E3E),
		  "3": new THREE.Color(0xFFD600),		
		  "4": new THREE.Color(0x2E8E0D),
		  //"5": new THREE.Color(0x32CD32)
		  "5": new THREE.Color(0x0D8E3E)*/
		};
		this.HotspotColor = {
      /*"0": new THREE.Color(0x2CFF00),   
      "1": new THREE.Color(0x39AA54),   
      "2": new THREE.Color(0x2CFF00),   
      "3": new THREE.Color(0xD52C27),   
      "4": new THREE.Color(0x2CFF00),
      "5": new THREE.Color(0xD52C27)*/
      "0": new THREE.Color(0xA50026),		
		  "1": new THREE.Color(0xF16740),		
		  "2": new THREE.Color(0xFEC97A),		
		  "3": new THREE.Color(0xCEFA00),		
		  "4": new THREE.Color(0xDEFA00),
		  "5": new THREE.Color(0xB9FA00)
		  //"5": new THREE.Color(0x32cd32)
		};
		this.radius = 100;
		this.segments = 60;
		this.rotateX = 0;
		this.rotateY = 0;
		this.rotateVX = 0;
		this.rotateVY = 0;
		this.rotateXMax = 90 * Math.PI / 180;
		this.rotateTargetX = 0;
		this.rotateTargetY = 0;
		this.dragging = false;
		this.apply(this, opt);
		this.wrap = this.el.get ? this.el.get(0) : (typeof this.el == "string" ? document.getElementById(this.el) : this.el);
		this.el = document.createElement("div");
		this.el.style = "user-select: none;";
		this.wrap.appendChild(this.el);
		this.containt = document.createElement("div");
		this.containt.style = "user-select: none;";
		this.wrap.appendChild(this.containt);
    if(!this._baseGeometry) {
      this._baseGeometry = new THREE.Geometry();
    }
    if(!this.point) {
      this.point = new THREE.Mesh(new THREE.CubeGeometry(0.5, 0.5, 1, 1, 1, 1));
    }
		this.initScene();
	}
	apply(a, b) {
    if(a && b && typeof b == 'object') {
      for(var p in b) {
        a[p] = b[p];
      }
    }
    return a;
  }
  initScene() {
		if(!this.renderer) {
			this.renderer = new THREE.WebGLRenderer({
	  		antialias: false,
	  		alpha: true
	  	});
      var w = this.el.offsetWidth || window.innerWidth,
      h = this.el.offsetHeight || window.innerHeight;
	  	this.renderer.setSize(w, h);
	  	this.renderer.autoClear = false;
	  	this.renderer.sortObjects = false;		
	  	this.renderer.generateMipmaps = false;					
	  	this.el.appendChild(this.renderer.domElement);
		}
		if(!this.scene) {
			this.scene = new THREE.Scene();
	  	this.scene.matrixAutoUpdate = false;
		}
		if(!this.camera) {
			this.camera = new THREE.PerspectiveCamera(12, w / h, 1, 20000);
	  	this.camera.position.z = 2800;
			//this.camera.position.z = 100;
	  	this.camera.position.y = 0;
	  	//this.camera.position.x = 40;
	  	//this.camera.lookAt(this.scene.width / 2, this.scene.height / 2);
	  	this.scene.add(this.camera);
		}
		if(!this.rotating) {
			this.rotating = new THREE.Object3D();
			//this.camera.position.x = 80;
	  	this.scene.add(this.rotating);
		}
		if(!this.visualizationMesh) {
			this.visualizationMesh = new THREE.Object3D();
	  	this.rotating.add(this.visualizationMesh);
		}
		this.addSkyBox();
		this.addRing();
		this.addGlow();
		this.addSphere();
		this.addMap();
	  //this.fire();
		//this.fireBall();
		//this.createGlow();
		this.addLinght();
		/*this.addFlightLine({
      lon: -43,
      lat: -22
    }, {
      lon: 116,
      lat: 40
    }, 1);
		this.addFlightLine({
      lon: -179,
      lat: 30
    }, {
      lon: 116,
      lat: 40
    }, 1);
		this.addFlightLine({
      lon: 140,
      lat: 35
    }, {
      lon: 116,
      lat: 40
    }, 1);
		this.addFlightLine({
      lon: 121.5,
      lat: 25
    }, {
      lon: 116,
      lat: 40
    }, 1);
		this.addFlightLine({
      lon: 106.5,
      lat: 6.2
    }, {
      lon: 116,
      lat: 40
    }, 1);
		this.addFlightLine({
      lon: 149,
      lat: -35
    }, {
      lon: 116,
      lat: 40
    }, 1);*/
		//this.initMap();
  	//this.sphere.rotation.y = (Math.PI / 180) * 270;
    //this.scene.add(this.earthContainer);
		
  	//this.rotating.rotation.y = (Math.PI / 180) * 270;
  	THREEx.WindowResize(this.renderer, this.camera);
  	//this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);
  	this.initTrackballControls();
	}
  /*createGlow() {
  	var glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        viewVector: {
          type: "v3",
          value: [0, 0, 1]
        }
      },
      vertexShader: `
        uniform vec3 viewVector;
        varying float intensity;
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normal);
          //vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float intensity;
        varying vec3 vNormal;
        void main() {
          float intensity = pow( 0.5 - dot(vNormal, vec3(0.0, 0.0, 0.5)), 0.8);
      	  vec3 glow = vec3(0, 1, 0) * intensity;
          gl_FragColor = vec4(glow, 0.5);
        }
      `,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    var glowGeometry = new THREE.SphereGeometry(this.radius + 15, this.segments, this.segments);
    var glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    glowMesh.position.z = -this.radius;
    this.scene.add(glowMesh);
  }*/
  addOutRing() {
  	/*var geo = new THREE.SphereGeometry(this.radius + 30, 50, 50);
		var mat = new THREE.MeshLambertMaterial({
			blending: THREE.AdditiveBlending,
			transparent: true,
			color: 0x1D3328,
			opacity: 0.2,
			depthWrite: false,
      depthTest: false,
      side: THREE.backSide,
      blending: THREE.AdditiveBlending,
			map: THREE.ImageUtils.loadTexture("js/webGL/images/clouds.jpg")
		});
		var earthPol = new THREE.Mesh(geo, mat);
		this.sphere.add(earthPol);*/
  }
  addSphere() {
  	this.sphere = new THREE.Mesh(
  		new THREE.SphereGeometry(this.radius, this.segments, this.segments),
  	  new THREE.MeshLambertMaterial({
  	    //map: new THREE.ImageUtils.loadTexture("js/webGL/images/earth.jpg"),
  	  	//map: new THREE.ImageUtils.loadTexture("js/webGL/images/earth_political_alpha.png"),  	
  	  	//map: new THREE.ImageUtils.loadTexture("js/webGL/images/fire4.png"),  	
  	  	map: new THREE.ImageUtils.loadTexture("js/webGL/images/map.png"),
        color: this.sphereColor,
  	  	//color: 0x33CCFF,
  	  	transparent: true,
  	  	opacity: 1.0,
  	  	depthWrite: true,
        depthTest: true,
        //blending: THREE.AdditiveBlending,
        //side: THREE.DoubleSide,
//    	    fog: true,
//    	    depthWrite: false,
//    	    depthTest: false
  	  })
  	);
  	this.rotating.add(this.sphere);
  	this.addOutRing();
    this.sphere.add(new THREE.Mesh(
      new THREE.SphereGeometry(this.radius + 1, 50, 50), 
      new THREE.MeshLambertMaterial({
        transparent: true,
        color: 0xff8340,
        blending: THREE.AdditiveBlending,
        opacity: 0.8,
        map: new THREE.ImageUtils.loadTexture("js/webGL/images/fire4.png")
      })
    ));
//		if(!this.sphere) {
//  		this.sphere = new THREE.Mesh(
//  		  new THREE.SphereGeometry(this.radius, this.segments, this.segments),
//  		  new THREE.MeshLambertMaterial({
//  		  	transparent: true,
//  		  	opacity: 1.0,
//  		  	color: 0x287299,
//  		  	//map: new THREE.ImageUtils.loadTexture("js/webGL/images/earth.jpg")
//  		  	map: new THREE.ImageUtils.loadTexture("js/webGL/images/earth_political_alpha.png")
//  		  })
//  		);
//  		this.rotating.add(this.sphere);
//  		
//  		/*var shadeGeo = new THREE.SphereGeometry(this.radius + 1, this.segments, this.segments);
//  		var shadeMesh = new THREE.Mesh(shadeGeo, new THREE.ShaderMaterial({
//        vertexShader: `
//          varying vec3 vNormal;
//          void main() {
//            //vNormal = normalize(normal);
//            vNormal = normalize(normalMatrix * normal);
//            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//          }
//        `,
//        fragmentShader: `
//          varying vec3 vNormal;
//          void main() {
//            float intensity = pow(0.3 - dot(vNormal, vec3(0.0, 0.0, 0.8)), 1.0);
//            vec3 glow = vec3(1.0, 0.0, 0) * intensity;
//            gl_FragColor = vec4(glow, 1.0);
//          }
//        `,
//        side: THREE.BackSide,
//        blending: THREE.AdditiveBlending,
//        opacity: 0.6,
//        transparent: true
//      }));
//  		shadeMesh.scale.set(1.1, 1.1, 1.1);
//      this.rotating.add(shadeMesh);*/
  		/*this.sphere.add(new THREE.Mesh(
  			new THREE.SphereGeometry(this.radius + 1, this.segments, this.segments), 
  			new THREE.MeshLambertMaterial({
  			  transparent: true,
  			  color: 0xE64853,
  			  blending: THREE.AdditiveBlending,
  			  opacity: 0.6,
  			  map: new THREE.ImageUtils.loadTexture("js/webGL/images/fire4.png")
  		  })
  		));*/
//  		/*this.sphere.add(new THREE.Mesh(
//  			new THREE.SphereGeometry(this.radius + 2, 50, 50),
//  			new THREE.MeshLambertMaterial({
//  			  blending: THREE.AdditiveBlending,
//  			  transparent: true,
//  			  color: 0x2AC7CC,
//  			  opacity: 0.8,
//  			  map: new THREE.ImageUtils.loadTexture("js/webGL/images/earth_political_alpha.png")
//  		  })
//  		));*/
//  		
//  	}
  }
  addSkyBox() {
  	var cube = new THREE.Mesh(
			new THREE.CubeGeometry(1920, 974, 1),
			new THREE.MeshBasicMaterial({
        color: this.bgColor,
  			//color: 0x6FD5F0,
  			map: THREE.ImageUtils.loadTexture("js/webGL/images/universe.jpg"),
  			//map: THREE.ImageUtils.loadTexture("js/webGL/images/bg.png"),
  			side: THREE.BackSide,
  			opacity: 1.0,
  			transparent: true,
  			blending: THREE.AdditiveBlending
  		})
		)
  	cube.position.z = -1800;
  	this.scene.add(cube);
	}
  addRing() {
  	var geometry = new THREE.CubeGeometry(580, 580, 1);
    var material = new THREE.MeshBasicMaterial({
    	map: THREE.ImageUtils.loadTexture("js/webGL/images/radial_layers_medium.jpg"),
      color: this.ringColor,
    	//color: 0x0c67a1,
    	opacity: 0.4,
    	transparent: true,
	  	depthWrite: false,
      depthTest: false,
			blending: THREE.AdditiveBlending
    });
    var cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);
  }
  addGlow() {
  	var moonGlow = new THREE.Mesh(
			new THREE.SphereGeometry(this.radius + 20, this.segments, this.segments),
			new THREE.ShaderMaterial({
				uniforms: {
	        'c': {
	          type: 'f',
	          value: 0.4
	        },
	        'p': {
	          type: 'f',
	          value: 9.0
	        },
	        glowColor: {
	          type: 'c',
	          //value: new THREE.Color(0x49FDD6)
	          //value: new THREE.Color(0x0C67A1)
	          //value: new THREE.Color(0x1CFFFF)
	          value: new THREE.Color(this.ringColor)
            //value: new THREE.Color(0x0F3340)
	        },
	        viewVector: {
	          type: 'v3',
	          //value: this.camera.position
	          value: new THREE.Vector3(0, 0, 100)
	        }
	      },
	      vertexShader: `
	        uniform vec3 viewVector;
	        uniform float c;
	        uniform float p;
	        varying float intensity;
	        void main() {
	          vec3 vNormal = -normalize(normalMatrix * normal);
	          vec3 vNormel = normalize(normalMatrix * viewVector);
	          intensity = pow(c - dot(vNormal, vNormel), p);
	          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	        }`
	      ,
	      fragmentShader: `
	        uniform vec3 glowColor;
	        varying float intensity;
	        void main() {
	          vec3 glow = glowColor * intensity;
	          gl_FragColor = vec4(glow, 0.6);
	        }`
	      ,
        //depthWrite: false,
        //depthTest: false,
	      opacity: 1.0,
	      side: THREE.DoubleSide,
	      //side: THREE.FrontSide,
	      blending: THREE.AdditiveBlending,
	      transparent: true
			})
		);
	  //moonGlow.position = this.sphere.position;
  	moonGlow.position.z = -this.radius;
		moonGlow.scale.multiplyScalar(1.01);
		this.scene.add(moonGlow);
  	/*var geo = new THREE.Geometry();
  	geo.vertices.push(new THREE.Vector3(0, 0, 1000));
  	this.scene.add(new THREE.ParticleSystem(geo, new THREE.ShaderMaterial({
    	uniforms: {
    		color: {
    			type: "c",
    			value: new THREE.Color(0xffffff)
    		},
    		customColor: {
    			type: 'c',
    			value: new THREE.Color(0x48EAB6)
    	  },
    		texture: {
    			type: "t",
    			value: 0,
    			texture: THREE.ImageUtils.loadTexture("js/webGL/images/map_mask.png")
    		}
    	},
      vertexShader: `
        attribute float size;
        void main() {
          gl_PointSize = 22000.0;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform vec3 customColor;
        uniform sampler2D texture;
        void main() {
          gl_FragColor = vec4(color * customColor, 1.0);
			    gl_FragColor = gl_FragColor * texture2D(texture, gl_PointCoord);
        }
      `,
      blending: THREE.AdditiveBlending,
  		depthTest: true,
  		depthWrite: false,
  		transparent: true
    })));*/
  }
  addMap() {
  	var img0 = new Image();
		img0.src = "js/webGL/images/map_inverted.png";
		img0.onload = () => {
			this.rotating.add(this.showEarth(img0));
		}
  }
  showEarth(img) {
  	var globeCloudVerticesArray = [], globeCloud, offset = 20;
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var geo = new THREE.Geometry();
    for (var i = 0; i < imageData.data.length; i += offset) {
      var curX = i / 4 % canvas.width;
      var curY = (i / 4 - curX) / canvas.width;
      if (i / offset % 2 === 1 && curY % (offset / 5) === 1) {
        var color = imageData.data[i];
        if (color === 0) {
          var x = curX;
          var y = curY;
          var lat = (y / (canvas.height / 180) - 90) / -1;
          var lon = x / (canvas.width / 360) - 180;
          geo.vertices.push(this.getVector3(lat, lon, this.radius));
        }
      }
    }
    var uniforms = {
  		color: {
  			type: "c",
  			//value: new THREE.Color(0x082B37)
  		  //value: new THREE.Color(0x033D37)
        value: new THREE.Color(this.earthColor)
        //value: new THREE.Color(0x33CCFF)
  		},
			glowColor: {
				type: "c",
				value: new THREE.Color(0xffffff)
			}/*,
			texture: {
  			type: "t",
  			value: 0,
  			texture: THREE.ImageUtils.loadTexture("js/webGL/images/sun_far_128.jpg")
  		}*/
  	};
    var mat = new THREE.ShaderMaterial({
    	uniforms: uniforms,    	
      vertexShader: `
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
			    gl_PointSize = 3.0;
			    gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform vec3 glowColor;
        uniform sampler2D texture;
        void main() {
          gl_FragColor = vec4(color, 0.8);
          //gl_FragColor = vec4(color * glowColor, 1.0);
				  //gl_FragColor = texture2D(texture, gl_PointCoord);
        }
      `,
      blending: THREE.AdditiveBlending,
  		depthTest: false,
  		depthWrite: false,
  		transparent: true
    });
    /*var mat = new THREE.MeshBasicMaterial({
  	  transparent: true,
  	  color: 0xE64853,
  	  opacity: 1.0
    });*/
    var globeCloud = new THREE.ParticleSystem(geo, mat);
    globeCloud.sortParticles = true;
    return globeCloud;
  }
  addLinght() {
  	/*var hemiLight = new THREE.PointLight(0x33CCFF, 2.0);
  	hemiLight.position.x = 0; 
  	hemiLight.position.y = 0;
  	hemiLight.position.z = 300;
  	hemiLight.castShadow = true;
    this.scene.add(hemiLight);*/
    
  	/*var hemiLight0 = new THREE.PointLight(0x095453, 1.5);
  	hemiLight0.position.x = -50;
  	hemiLight0.position.y = 150;
  	hemiLight0.position.z = 600;
  	this.scene.add(hemiLight0);

    var hemiLight1 = new THREE.PointLight(0x095453, 1.5);
    hemiLight1.position.x = 100;
    hemiLight1.position.y = 50;
    hemiLight1.position.z = 600;
    this.scene.add(hemiLight1);

    var hemiLight2 = new THREE.PointLight(0x095453, 1.5);
    hemiLight2.position.x = 0;
    hemiLight2.position.y = -300;
    hemiLight2.position.z = 600;
    this.scene.add(hemiLight2);*/
  	var hemiLight = new THREE.PointLight(this.linghtColor, 2.2);
  	hemiLight.position.x = -50; 
  	hemiLight.position.y = 0;
  	hemiLight.position.z = 350;
  	//hemiLight.castShadow = true;
    this.scene.add(hemiLight);
    var hemiLight1 = new THREE.PointLight(this.linghtColor, 2.2);
  	hemiLight1.position.x = 50; 
  	hemiLight1.position.y = 0;
  	hemiLight1.position.z = 350;
  	//hemiLight.castShadow = true;
    this.scene.add(hemiLight1);
    var hemiLight2 = new THREE.PointLight(this.linghtColor, 2.5);
  	hemiLight2.position.x = 0; 
  	hemiLight2.position.y = 0;
  	hemiLight2.position.z = 350;
  	//hemiLight.castShadow = true;
    this.scene.add(hemiLight2);
	}
  /*getPos(lat, lon) {
    var phi = (90 - lat) * Math.PI / 180;
    var theta = (lon - 180) * Math.PI / 180;
	  var center {};
	  center.x = -this.radius * Math.sin(phi) * Math.cos(theta);
	  center.y = this.radius * Math.cos(phi);
	  center.z = this.radius * Math.sin(phi) * Math.sin(theta);
    return center;
  }*/
  wrapFn(value, min, rangeSize) {
    rangeSize -= min;
      while (value < min) {
        value += rangeSize;
    }
    return value % rangeSize;
  }
  screenXY(vec3) {
  	if(!this.projector) {
  		this.projector = new THREE.Projector();
  	}
  	var clo = vec3.clone();
  	var vector = this.projector.projectVector(clo, this.camera);
    var windowWidth = window.innerWidth;
    var minWidth = 1280;
    if(windowWidth < minWidth) {
      windowWidth = minWidth;
    }
    clo = null;
  	return {
  		x: Math.round(vector.x * (windowWidth / 2)) + windowWidth / 2,
    	y: Math.round((0 - vector.y) * (window.innerHeight / 2)) + window.innerHeight / 2
  	};
  }
  addMarker(center) {
  	var marker = document.createElement("div");
  	marker.className ="earth-marker";
  	marker.innerHTML = '<div class="earth-detailText"></div>';
  	//country.marker = marker;
  	this.containt.appendChild(marker);
  	marker.center = center["center"];
  	marker.setPosition = function(x, y, z) {
  		this.style.left = x + 'px';
  		this.style.top = y + 'px';	
  		this.style.zIndex = z;
  	}
  	marker.setVisible = function(vis) {
  		if(!vis)
  			this.style.display = 'none';
  		else 
  			this.style.display = 'inline';
  	}
  	var detailLayer = marker.querySelector('.earth-detailText');
	  detailLayer.innerHTML = center["name"];
	  marker.detailLayer = detailLayer;
	  marker.setSize = function(s) {
	    var detailSize = Math.floor(2 + s * 0.5);	
      var totalHeight = detailSize * 2;
	  }
	  var self = this;
  	marker.update = function() {
  		var matrix = self.rotating.matrixWorld;
  		//var abspos = matrix.multiplyVector3(this.center.clone());
  		var clo = this.center.clone();
  		var abspos = matrix.multiplyVector3(clo);
  		var screenPos = self.screenXY(abspos);
  		var s = 0.3 + self.camera.scale.z * 1;
  		var importanceScale = this.importance / 5000000;
  		importanceScale = self.constrain(importanceScale, 0, 18);
  		s += importanceScale;
  		if(this.tiny)
  			s *= 0.75;
  		if(this.selected)
  			s = 30;
  		if(this.hover)
  			s = 15;
  		this.setSize(s); 
  		//this.setVisible((abspos.z > 60) && s > 3);
  		//this.setVisible(abspos.z > 60);
  		//console.log(abspos.z);
  		this.setVisible(abspos.z > 0.60);
  		var zIndex = Math.floor(1000 - abspos.z + s);
  		if(this.selected || this.hover)
  			zIndex = 10000;
  		this.setPosition(screenPos.x, screenPos.y, zIndex);
  		clo = null;
  	}
  	this.markers.push(marker);
  }
  rotateToLatLng(latLon, offsetY) {
  	/*if(!offsetY) {
  		offsetY = 0;
  	}
  	var rotX = this.rotating.rotation.x;
  	var rotY = this.rotating.rotation.y;
  	var rotZ = this.rotating.rotation.z;
  	var c = this.rotating.rotation.y;
  	var d = -latLon["lon"] * (Math.PI / 180) % (2 * Math.PI);
  	var f = Math.PI / (2 + offsetY) * -1;
  	this.rotating.rotation.y = c % (2 * Math.PI);
  	this.rotating.rotation.x = (latLon["lat"] * (Math.PI / 180) % Math.PI) + (Math.PI / 180 * -30);
  	this.rotating.rotation.y = d + f;
  	var newRotX = this.rotating.rotation.x;
  	var newRotY = this.rotating.rotation.y;
  	var newRotZ = this.rotating.rotation.z;
  	this.rotating.rotation.x = rotX;
  	this.rotating.rotation.y = rotY;
  	this.rotating.rotation.z = rotZ;*/
  	if(!latLon) {
  		return;
  	}
  	this.rotateTargetX = latLon["lat"] * Math.PI / 180;
  	var targetY0 = -(latLon["lon"] - 9 - 270) * Math.PI / 180, piCounter = 0;
  	while(true) {
      var targetY0Neg = targetY0 - Math.PI * 2 * piCounter;
      var targetY0Pos = targetY0 + Math.PI * 2 * piCounter;
      if(Math.abs(targetY0Neg - this.rotating.rotation.y) < Math.PI) {
      	this.rotateTargetY = targetY0Neg;
        break;
      } else if(Math.abs(targetY0Pos - this.rotating.rotation.y) < Math.PI) {
      	this.rotateTargetY = targetY0Pos;
        break;
      }
      piCounter++;
      this.rotateTargetY = this.wrapFn(targetY0, -Math.PI, Math.PI);
  	}
  	this.rotateVX *= 0.6;
  	this.rotateVY *= 0.6;
  	//this.showDesc(latLon["center"]);
  }
  rotateCallback(currentCity, preCity) {}
  autoRotateToCities() {
  	if(!this.isRotate) {
  		if(this.city[0]) {
  			this.ou = setTimeout(() => {
  				this.rotateToLatLng(this.city[0]);
      		this.rotateCallback(this.city[0]);
      		clearTimeout(this.ou);
  			}, 3500);
    		this.isRotate = true;
  		}
  	} else {
  		this.preCity = this.currentCity;
  		if(this.currentCity >= this.city.length) {
  			this.currentCity = 0;
    	} else {
    		this.currentCity += 0.003;
    		//this.currentCity = Math.floor(this.currentCity);
    		//console.log(this.currentCity);
    	}
  		if(Math.floor(this.currentCity) != Math.floor(this.preCity)) {
  			this.rotateToLatLng(this.city[Math.floor(this.currentCity)]);
  			this.rotateCallback(this.city[Math.floor(this.currentCity)]);
  		}
  	}
  }
  /*checkHurricanes() {
  	if(!this.projector) {
  		this.projector = new THREE.Projector();
  	}
  	function screenXY(vec3, projector, camera) {
  		var vector = projector.projectVector(vec3.clone(), camera);
  		// console.log(vector);
  		var result = {};
  		result.x = Math.round(vector.x * (window.innerWidth / 2)) + window.innerWidth / 2;
  		result.y = Math.round((0 - vector.y) * (window.innerHeight / 2)) + window.innerHeight / 2;
  		return result;
  	}
  	for(var i = 0; i < this.city.length; i++) {
  		var screenPos = screenXY(this.rotating.matrixWorld.getPosition(), this.projector, this.camera);
  		if(!this.city[i].marker) {
  			this.city[i].marker = document.createElement("div");;
  			this.city[i].marker.className ="earth-marker";
  			this.city[i].marker.innerHTML = '<div class="earth-detailText">sdfsdf</div>';
      	this.containt.appendChild(this.city[i].marker);
  		}
  		this.city[i].marker.style.left = screenPos.x + "px";
  		this.city[i].marker.style.top = screenPos.y + "px";
  		if(screenPos.z > 0)
  			this.city[i].marker.style.display = "block";
			else
				this.city[i].marker.style.display = "none";
  	}
  	
  }*/
  interpolation(from, to, fraction) {
    return (to - from) * fraction + from;
  }
  render() {
    if(this.moveAnim) {
      if(this.rotateTargetX !== undefined && this.rotateTargetY !== undefined) {
        this.rotateVX += (this.rotateTargetX - this.rotateX) * 0.012;
        this.rotateVY += (this.rotateTargetY - this.rotateY) * 0.012;
        if(Math.abs(this.rotateTargetX - this.rotateX) < 0.1 && Math.abs(this.rotateTargetY - this.rotateY) < 0.1) {
          this.rotateTargetX = undefined;
          this.rotateTargetY = undefined;
        }
      }
      this.rotateX += this.rotateVX;
      this.rotateY += this.rotateVY;
      this.rotateVX *= 0.98;
      this.rotateVY *= 0.98;
      if(this.dragging || this.rotateTargetX !== undefined) {
        this.rotateVX *= 0.6;
        this.rotateVY *= 0.6;
      }
      this.rotateY += this.spin * 0.01;
      if(this.rotateX < -this.rotateXMax){
        this.rotateX = -this.rotateXMax;
        this.rotateVX *= -0.95;
      }
      if(this.rotateX > this.rotateXMax){
        this.rotateX = this.rotateXMax;
        this.rotateVX *= -0.95;
      }
      // TWEEN.update();
      this.rotating.rotation.x = this.rotateX;
      this.rotating.rotation.y = this.rotateY;
    } else {
      if(this.rotateTargetX !== undefined && this.rotateTargetY !== undefined) {
        this.rotateVX += (this.rotateTargetX - this.rotateX) * 0.08;
        this.rotateVY += (this.rotateTargetY - this.rotateY) * 0.08;
        if(Math.abs(this.rotateTargetX - this.rotateX) < 0.1 && Math.abs(this.rotateTargetY - this.rotateY) < 0.1) {
          this.rotateTargetX = undefined;
          this.rotateTargetY = undefined;
        }
      }
      this.rotateX += this.rotateVX;
      this.rotateY += this.rotateVY;
      this.rotateVX *= 0.01;
      this.rotateVY *= 0.01;
      if(this.dragging || this.rotateTargetX !== undefined) {
        this.rotateVX *= 0.6;
        this.rotateVY *= 0.6;
      }
      //this.rotateY += this.spin * 0.01;
      if(this.rotateX < -this.rotateXMax){
        this.rotateX = -this.rotateXMax;
        //this.rotateVX *= -0.95;
      }
      if(this.rotateX > this.rotateXMax){
        this.rotateX = this.rotateXMax;
        //this.rotateVX *= -0.95;
      }
      // TWEEN.update();
      this.rotating.rotation.x = this.rotateX;
      this.rotating.rotation.y = this.rotateY;
    }
    //this.render();
    this.renderer.clear();               
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate);
    /*if(THREE.SceneUtils && THREE.SceneUtils.traverseHierarchy) {
    	THREE.SceneUtils.traverseHierarchy(this.rotating, function(mesh) {
        if(mesh.update !== undefined) {
          mesh.update();
        }
      });
    } else {*/
    	for(var i = 0; i < this.flightLines.length; i++) {	
    		if(this.flightLines[i] && this.flightLines[i].update !== undefined) {
    			this.flightLines[i].update();
        }
    	}
    //}
    //if(this.shaderMaterial) {
    	//this.shaderMaterial.uniforms.time.value += 1;
    //}
    //this.shaderMaterial.uniforms.time.value += 1;
    //this.controls.update();
  	//if(this.camera.position.z == 1200) {
  		//this.autoRotateToCities();
  	//} else {
    		this.camera.position.z = this.interpolation(this.camera.position.z, 1200, .05);
    		this.autoRotateToCities();
  	//}
    //if(this.markers && this.markers.length) {
    	//for(var i in this.markers) {
    		//this.markers[i].update();
      //}
    //}
    //this.checkHurricanes();
  }
  drawLine_type(start, end, lineType, type) {
lineType = 2;
  	var attributes = {
  		pos: {
  			type: 'f',
  			value: []
  	  },
  	  max: {
  			type: 'f',
  			value: []
  	  }
  	};
  	var number;
  	var linesGeo = new THREE.Geometry();
    if(lineType == 0) {
    	var distanceBetweenCountryCenter = start["center"].clone()[this.isVersion49() ? "subSelf" : "sub"](end["center"]).length();		
    	var anchorHeight = this.radius + distanceBetweenCountryCenter * 0.5;
    	var mid = start["center"].clone()[this.isVersion49() ? "lerpSelf" : "lerp"](end["center"], 0.5);		
    	var midLength = mid.length();
    	mid.normalize();
    	mid.multiplyScalar(midLength + distanceBetweenCountryCenter * 0.5);			
    	var normal = (new THREE.Vector3()).sub(start["center"], end["center"]);
    	normal.normalize();
    	var distanceHalf = distanceBetweenCountryCenter * 0.5;
    	var startAnchor = start["center"];
    	var midStartAnchor = mid.clone()[this.isVersion49() ? "addSelf" : "add"](normal.clone().multiplyScalar(distanceHalf));					
    	var midEndAnchor = mid.clone()[this.isVersion49() ? "addSelf" : "add"](normal.clone().multiplyScalar(-distanceHalf));
    	var endAnchor = end["center"];
    	var splineCurveA = new THREE.CubicBezierCurve3(start["center"], startAnchor, midStartAnchor, mid);											
    	var splineCurveB = new THREE.CubicBezierCurve3(mid, midEndAnchor, endAnchor, end["center"]);
    	var vertexCountDesired = Math.floor(distanceBetweenCountryCenter * 4.5) * 2;
    	var points = splineCurveA.getPoints(vertexCountDesired);
    	points = points.splice(0, points.length - 1);
    	points = points.concat(splineCurveB.getPoints(vertexCountDesired));
    	//points.push(new THREE.Vector3(0, 0, 0));
    	number = points.length;
    	for(var i = 0; i < points.length; i ++) {
    		linesGeo.vertices.push(points[i]);
    		attributes.pos.value.push(i);
        attributes.max.value.push(number);
      }
    } else if(lineType == 1) {
    	var pointNum = 0.15;
    	if(Math.abs(start["lon"] - end["lon"]) > 180) {
    		number = Math.ceil(Math.abs(-180 - start["lon"] - (180 - end["lon"])) / pointNum);
    		number = Math.ceil(Math.abs(-180 - start["lon"] - (180 - end["lon"])) / pointNum);
        var num1, num2;
        var a1, a2;
        a1 = -180 - start["lon"];
        a2 = 180 - end["lon"];
        num1 = Math.ceil(number * Math.abs(a1) / (a2 - a1));
        var lonP = Math.abs(start["lon"] - end["lon"]) / number;
        var latP = Math.abs(start["lat"] - end["lat"]) / number;
        for (var i = 1; i < number; i++) {
          var lonTmp, latTmp;
          if (i <= num1) {
          	lonTmp = start["lon"] + i * a1 / num1;
          } else {
          	lonTmp = 180 - (i - num1) * a2 / (number - num1);
          }
          if (start["lat"] > end["lat"]) {
            latTmp = start["lat"] - i * latP;
          } else if (start["lat"] < end["lat"]) {
            latTmp = start["lat"] + i * latP;
          }
          var r, h = this.radius / 10;
          if (i <= number / 2) {
            r = this.radius + 4 * h / (number + 2) * i - (i * (i - 1 ) / 2) * 8 * h / (Math.pow(number, 2) + 2 * number);
          } else {
            var count = number - i;
            r = this.radius + 4 * h / (number + 2) * count - (count * (count - 1 ) / 2) * 8 * h / (Math.pow(number, 2) + 2 * number);
          }
          linesGeo.vertices.push(this.getVector3(latTmp, lonTmp, r + 1));
          attributes.pos.value.push(i);
          attributes.max.value.push(number);
        }
    	} else {
    		if (Math.abs(start["lon"] - end["lon"]) > Math.abs(start["lat"] - end["lat"])) {
          number = Math.ceil(Math.abs(start["lon"] - end["lon"]) / pointNum);
        } else {
          number = Math.ceil(Math.abs(start["lat"] - end["lat"]) / pointNum);
        }
        var lonP = Math.abs(start["lon"] - end["lon"]) / number;
        var latP = Math.abs(start["lat"] - end["lat"]) / number;
        for (var i = 1; i < number; i++) {
          var lonTmp, latTmp;
          if (start["lon"] > end["lon"]) {
            lonTmp = start["lon"] - i * lonP;
          } else if (start["lon"] < end["lon"]) {
            lonTmp = start["lon"] + i * lonP;
          }
          if (start["lat"] > end["lat"]) {
            latTmp = start["lat"] - i * latP;
          } else if (start["lat"] < end["lat"]) {
            latTmp = start["lat"] + i * latP;
          }
          var r, h = this.radius / 10;
          if (i <= number / 2) {
            r = this.radius + 4 * h / (number + 2) * i - (i * (i - 1 ) / 2) * 8 * h / (Math.pow(number, 2) + 2 * number);
          } else {
            var count = number - i;
            r = this.radius + 4 * h / (number + 2) * count - (count * (count - 1 ) / 2) * 8 * h / (Math.pow(number, 2) + 2 * number);
          }
          linesGeo.vertices.push(this.getVector3(latTmp, lonTmp, r + 1));
          attributes.pos.value.push(i);
          attributes.max.value.push(number);
        }
    	}	
    } else if(lineType == 2) {
    	//start["lon"] - end["lon"]
    	var start_lat = start["lat"];
      var start_lon = start["lon"];
      var end_lat = end["lat"];
      var end_lon = end["lon"];
      var max_height = Math.random() * 35.1 + 0.05;
      var points = [];
      var G = Math.random().toFixed(2) * 300 + 400;
      //var points = [];
      number = G;
      for (var i = 0; i < G; i++) {
      	var arc_angle = i * 180.0 / G;
      	var arc_radius = this.radius + (Math.sin(arc_angle * Math.PI / 180.0)) * max_height;
      	var latlon = this.lat_lon_inter_point(start_lat, start_lon, end_lat, end_lon, i / G);
      	//points.push(this.getVector3(latlon["lat"], latlon["lon"], arc_radius));
      	linesGeo.vertices.push(this.getVector3(latlon["lat"], latlon["lon"], arc_radius));
      	attributes.pos.value.push(i);
        attributes.max.value.push(number);
      }
      //var spline = new THREE.CatmullRomCurve3(points);
      //var spline = new THREE.SplineCurve3(points);
      //console.log(spline);
    }
    var uniforms = {
			c: {
				type: "f",
				value: 1.0
		  },
			p: {
				type: "f",
				value: 1.4
			},
			glowColor: {
				type: "c",
				value: new THREE.Color(0xffffff)
			},
			viewVector: {
				type: "v3",
				value: this.camera.position
			},
			time: {
  			type: "f",
  			value: 0.0
  		},
  		leng: {
  			type: "f",
  			value: 200.0
  		},
  		color: {
  			type: "c",
  			//value: new THREE.Color(0xdd380c)
  			//value: new THREE.Color(0xE64853)
  		  //value: new THREE.Color(0x32CD32)
  		  //value: new THREE.Color(0x154492)
  			value: this.flightLineColor[type]
  		},
  		pColor: {
  			type: "c",
  			value: new THREE.Color(0xffffff)
  		},
  		texture: {
  			type: "t",
  			value: 0,
  			texture: THREE.ImageUtils.loadTexture("js/webGL/images/particleA.png")
  			//texture: THREE.ImageUtils.loadTexture('js/webGL/images/map_mask.png')
  		}
  	};
    var shaderMaterial = new THREE.ShaderMaterial({
    	attributes: attributes,
    	uniforms: uniforms,
      vertexShader: `
        uniform vec3 viewVector;
        uniform float c;
        uniform float p;
        varying float intensity;
        attribute float pos;
      	attribute float max;
      	varying float vMax;
        varying float vPos;
        varying vec3 vNormal;
      	uniform float leng;
        uniform float time;
        void main() {
          vPos = pos;
      	  vMax = max;
          //if(vPos >= time && vPos <= time + leng) {
            //vNormal = normalize(normal);
            //gl_PointSize = 10.0;
          //} else {
            //gl_PointSize = 3.0;
          //}
          if(vPos >= time && vPos <= time + leng) {
            //vNormal = normalize(normal);
            gl_PointSize = 6.0;
          } else {
            gl_PointSize = 1.0;
          }
          if(vPos == 5.0 || vPos == vMax - 5.0) {
            gl_PointSize = 13.0;
          }
          //vec3 vNormal = normalize(normalMatrix * normal);
        	//vec3 vNormel = normalize(normalMatrix * viewVector);
        	//intensity = pow(c - dot(vNormal, vNormel), p);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float time;
      	uniform float leng;
        uniform vec3 color;
        varying float vPos;
        varying float vMax;
        varying vec3 vNormal;
        uniform sampler2D texture;
      	uniform vec3 pColor;
        uniform vec3 glowColor;
        varying float intensity;
        void main() {
          //float light = 1.0 - fract((1.0) + fract(time * 0.6));
          //vec3 glow = glowColor * intensity;
          if(vPos >= time && vPos <= time + leng) {
            //gl_FragColor = vec4(vec3(light, 0.0, 0.0) * (1.0 - 0.5), 1.0);
            //gl_FragColor = 2.0 * vec4(1.0, 0.0, 0.0, 1.0);
            //gl_FragColor = vec4(color, 1.0);
            //gl_FragColor = gl_FragColor * texture2D(texture, gl_PointCoord);
            
            gl_FragColor = vec4(color * glowColor, 1.0);
	          gl_FragColor = gl_FragColor * texture2D(texture, gl_PointCoord);
	          
	          //gl_FragColor = vec4(color * vColor, 1.0);
				    //gl_FragColor = gl_FragColor * texture2D(texture, gl_PointCoord);
	        } else {
	          //gl_FragColor = vec4(color, 0.5);
	          
	          gl_FragColor = vec4(color * glowColor, 0.5);
				    gl_FragColor = gl_FragColor * texture2D(texture, gl_PointCoord);
	        }
          if(vPos == 5.0 || vPos == vMax - 5.0) {
            gl_FragColor = vec4(color * glowColor, 1.0);
  				  gl_FragColor = gl_FragColor * texture2D(texture, gl_PointCoord);
          }
        }
      `,
      blending: THREE.AdditiveBlending,
  		depthTest: true,
  		depthWrite: false,
  		transparent: true
    });
    //var splineOutline = new THREE.Line(geo, shaderMaterial);
    var points = new THREE.ParticleSystem(linesGeo, shaderMaterial);
    this.rotating.add(points);
    this.flightLines.push(points);
    points.update = function() {
    	/*var path = this.geometry.vertices.length;
	  	if(shaderMaterial.uniforms.time.value >= path) {
	  		shaderMaterial.uniforms.time.value = 0;
	  	} else {
	  		shaderMaterial.uniforms.time.value += 2;
	  	}*/
    	//particle.lerpN += 0.05;
    	if(this.material.uniforms.time.value >= this.geometry.vertices.length) {
    		this.material.uniforms.time.value = 0;
    	} else {
    		this.material.uniforms.time.value += 9.5;
    	}
    	this.geometry.verticesNeedUpdate = true;
    }
  	/*var src = store[0]["src"];
  	var dst = store[0]["dst"];
    var segments = [];
    var number;
    if (Math.abs(src["lon"] - dst["lon"]) > 180) {
      number = Math.ceil(Math.abs(-180 - src["lon"] - (180 - dst["lon"])) / 0.1);
      var num1, num2;
      var a1, a2;
      a1 = -180 - src["lon"];
      a2 = 180 - dst["lon"];
      num1 = Math.ceil(number * Math.abs(a1) / (a2 - a1));
      var lngP = Math.abs(src["lon"] - dst["lon"]) / number;
      var latP = Math.abs(src["lat"] - dst["lat"]) / number;
      segments.push( {
        lon: src["lon"],
        lat: src["lat"]
      });
      for (var index = 1; index < number; index++) {
        var lngTmp, latTmp;
        if (index <= num1)
          lngTmp = src["lon"] + index * a1 / num1;
        else
          lngTmp = 180 - (index - num1) * a2 / (number - num1);
        if (src["lat"] > dst["lat"]) {
          latTmp = src["lat"] - index * latP;
        } else if (src["lat"] < dst["lat"]) {
          latTmp = src["lat"] + index * latP;
        }
        segments.push({
          lon: lngTmp,
          lat: latTmp
        });
      }
      segments.push({
        lon: dst["lon"],
        lat: dst["lat"]
      });
    } else {
      if (Math.abs(src["lon"] - dst["lon"]) > Math.abs(src["lat"] - dst["lat"])) {
        number = Math.ceil(Math.abs(src["lon"] - dst["lon"]) / 0.1);
      } else {
        number = Math.ceil(Math.abs(src["lat"] - dst["lat"]) / 0.1);
      }
      var lngP = Math.abs(src["lon"] - dst["lon"]) / number;
      var latP = Math.abs(src["lat"] - dst["lat"]) / number;
      segments.push({
        lon: src["lon"],
        lat: src["lat"]
      });
      for (var index = 1; index < number; index++) {
        var lngTmp, latTmp;
        if (src["lon"] > dst["lon"]) {
          lngTmp = src["lon"] - index * lngP;
        } else if (src["lon"] < dst["lon"]) {
          lngTmp = src["lon"] + index * lngP;
        }
        if (src["lat"] > dst["lat"]) {
          latTmp = src["lat"] - index * latP;
        } else if (src["lat"] < dst["lat"]) {
          latTmp = src["lat"] + index * latP;
        }
        segments.push({
          lon: lngTmp,
          lat: latTmp
        });
      }
      segments.push({
        lon: dst["lon"],
        lat: dst["lat"]
      });
    }
    var flightPointsMaterial = new THREE.PointsMaterial({
    	transparent: true,
      opacity: 0.5,        	
      vertexColors: true,
      color: 0xffffff,
      size: 1,
      depthWrite: false
    });
    var flightPointsGeometry = new THREE.Geometry();
    for (var index = 1; index < segments.length - 1; index++) {
      var r, h = radius / 10;
      if (index <= number / 2) {
        r = radius + 4 * h / (number + 2) * index - (index * (index - 1 ) / 2) * 8 * h / (Math.pow(number, 2) + 2 * number );
      } else {
        var i = number - index;
        r = radius + 4 * h / (number + 2) * i - (i * (i - 1 ) / 2) * 8 * h / (Math.pow(number, 2) + 2 * number );
      }
      var coor = LngLat2Coordinate(segments[index]["lon"], segments[index]["lat"], r);
      flightPointsGeometry.vertices.push(
        new THREE.Vector3(coor["x"], coor["y"], coor["z"])
      );
      flightPointsGeometry.colors.push(
        new THREE.Color(0xffffff)
      );
    }
    var flightPoints = new THREE.Points(flightPointsGeometry, flightPointsMaterial);
    this.rotating.add(flightPoints);*/
  }
  addFlightLine(start, end, lineType, type) {
  	var s_lat = parseInt(start["lat"], 10);
  	var s_lon = parseInt(start["lon"], 10);
  	
  	var e_lat = parseInt(end["lat"], 10);
  	var e_lon = parseInt(end["lon"], 10);
  	
  	var sv = {
  		"lat": s_lat,
  		"lon": s_lon,
  		"name": start["name"],
  		"type": start["type"],
  		"value": start["value"],
  		"center": this.getVector3(s_lat, s_lon, this.radius)
  	};
  	var ev = {
  		"lat": e_lat,
  		"lon": e_lon,
  		"name": end["name"],
  		"type": end["type"],
  		"value": end["value"],
  		"center": this.getVector3(e_lat, e_lon, this.radius)
  	}
  	//this.addCityPoint(sv);
  	//this.addCityPoint(ev);
  	this.drawLine_type(sv, ev, lineType, type);
  }
  lat_lon_inter_point(start_lat, start_lon, end_lat, end_lon, offset) {
    start_lat = start_lat * Math.PI / 180.0;
    start_lon = start_lon * Math.PI / 180.0;
    end_lat = end_lat * Math.PI / 180.0;
    end_lon = end_lon * Math.PI / 180.0;

    var d = 2 * Math.asin(Math.sqrt(Math.pow((Math.sin((start_lat - end_lat) / 2)), 2) + Math.cos(start_lat) * Math.cos(end_lat) * Math.pow(Math.sin((start_lon - end_lon) / 2), 2)));
    var A = Math.sin((1 - offset) * d) / Math.sin(d);
    var B = Math.sin(offset * d) / Math.sin(d);
    var x = A * Math.cos(start_lat) * Math.cos(start_lon) + B * Math.cos(end_lat) * Math.cos(end_lon);
    var y = A * Math.cos(start_lat) * Math.sin(start_lon) + B * Math.cos(end_lat) * Math.sin(end_lon);
    var z = A * Math.sin(start_lat) + B * Math.sin(end_lat);
    var lat = Math.atan2(z, Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))) * 180 / Math.PI;
    var lon = Math.atan2(y, x) * 180 / Math.PI;
    return {
      lat: lat,
      lon: lon
    };
  }	
  indexOf(arr, C, key) {
  	if(!arr) return -1;
		for (var B = 0, A = arr.length; B < A; B++) {
			//console.log([arr[B][key], C[key]]);
			if (arr[B][key] == C[key]) {
				return B;
			}
		}
		return -1;
	}
  /*addCity(ct) {
  	if(this.indexOf(this.city, ct, "name") == -1) {
  		this.city.push(ct);
  	}
  }*/
  loadFlightLine(data, lineType) {
  	this.removeAllFlightLine();
  	for(var i = 0; i < data.length; i++) {
data[i]["type"] = this.getTestNumber(0, 3);
  		this.addFlightLine(data[i]["start"], data[i]["end"], data[i]["lineType"] !== undefined ? data[i]["lineType"] : lineType, data[i]["type"] || 1);
  	}
  }
  removeAllFlightLine() {
  	if (this.flightLines !== undefined && this.flightLines.length) {
			for(var i = 0; i < this.flightLines.length; i++) {
				this.rotating.remove(this.flightLines[i]);
				this.removeObject(this.scene, this.flightLines[i]);
				this.flightLines[i] = null;
				//this.flightLines.splice(i, 1);
			}
		}
  	this.flightLines = [];
  }
  removeObject(G, object) {
		var o, ol, zobject;
		console.log(object instanceof THREE.Mesh || object instanceof THREE.ParticleSystem);
		if (object instanceof THREE.Mesh || object instanceof THREE.ParticleSystem) {
			for (o = G.__webglObjects.length - 1; o >= 0; o--) {
				zobject = G.__webglObjects[o].object;
				if (object == zobject) {
					G.__webglObjects.splice(o, 1);
					//zobject.deallocate();
					//return;
				}
			}
		}
	}
  getTestNumber(n, m) {
    return Math.floor(Math.random() * (m - n)) + n;
  }
  removeAllHotspot() {
		if (this.hotspots !== undefined && this.hotspots.length) {
			for(var i = 0; i < this.hotspots.length; i++) {
				this.rotating.remove(this.hotspots[i]);
				this.removeObject(this.scene, this.hotspots[i]);
				this.hotspots[i] = null;
				//this.hotspots.splice(i, 1);
			}
		}
		this.hotspots = [];
	}
  loadHotspot(arr) {
  	this.removeAllHotspot();
  	for(var i = 0; i < arr.length; i++) {   
  		this.addHotspot({
  			"lat": arr[i]["lat"],
  			"lon": arr[i]["lon"],
  			"value": arr[i]["value"],
"type": this.getTestNumber(0, 3)
  		  //"type": arr[i]["type"]
  		})
  	}
    this.points = new THREE.Mesh(this._baseGeometry, new THREE.MeshBasicMaterial({
      color: 0xffffff,
      vertexColors: THREE.FaceColors,
      morphTargets: false
    }));
    this.rotating.add(this.points);
  }
  addHotspot(cs) {  
    var phi = (90 - cs["lat"]) * Math.PI / 180;
    var theta = (180 - cs["lon"]) * Math.PI / 180;
    this.point.position.x = this.radius * Math.sin(phi) * Math.cos(theta);
    this.point.position.y = this.radius * Math.cos(phi);
    this.point.position.z = this.radius * Math.sin(phi) * Math.sin(theta);
    this.point.lookAt(this.rotating.position);
    this.point.scale.z = -cs["value"];
    this.point.updateMatrix();
    for (var i = 0; i < this.point.geometry.faces.length; i++) {
      this.point.geometry.faces[i].color = this.HotspotColor[cs["type"]];
    }
    THREE.GeometryUtils.merge(this._baseGeometry, this.point);       
  }
  _addHotspot(cs) {
  	if(!this.hotspot) {
  		var geometry = new THREE.CubeGeometry(0.55, 0.55, 1);
  		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, -0.5));
  		this.hotspot = new THREE.Mesh(geometry);
    	if(!this.hotspotColor) {
    		this.hotspotColor = new THREE.Color(0x32CD32);
    	}
    	if(!this.hotspotMat) {
    		this.hotspotMat = new THREE.MeshBasicMaterial({
    			//color : 0xffffff,
    			vertexColors : THREE.FaceColors,
    			morphTargets : false
    		});
    	}
  	}
  	var subHotspotGeo = new THREE.Geometry();
  	//for(var i = 0; i < cs.length; i++) {
  		//this.city.push(cs[i]);
  		var pos = this.getPos(cs["lat"], cs["lon"], this.radius);
  		this.hotspot.position.x = pos.x;
  		this.hotspot.position.y = pos.y;
  		this.hotspot.position.z = pos.z;
  		this.hotspot.lookAt(this.rotating.position);
  		//this.hotspot.scale.z = Math.max(Math.round(Math.random() * 100), 0.1);
  		this.hotspot.scale.z = Math.max(cs["value"], 0.1);
  		this.hotspotColor = this.HotspotColor[cs["type"]];
  		this.hotspot.updateMatrix();
  		for (var i = 0; i < this.hotspot.geometry.faces.length; i++) {
  			this.hotspot.geometry.faces[i].color = this.hotspotColor;
  		}
  	//}
  	THREE.GeometryUtils.merge(subHotspotGeo, this.hotspot);
  	/*this.hotspotGeo.morphTargets.push({
			//'name': opts.name,
			vertices : subHotspotGeo.vertices
		});*/
  	//this.hotspotGeo = this.subHotspotGeo;
  	var mesh = new THREE.Mesh(subHotspotGeo, this.hotspotMat);
  	this.hotspots.push(mesh);
  	this.rotating.add(mesh);
  }
  _addCityPoint(cs, t) {
  	var type = t || 0;
    if(type == 0) {
    	for(var i = 0; i < cs.length; i++) {
    		this.city.push(cs[i]);
    		//this.addMarker(cs[i]);
    		var linesGeo = new THREE.Geometry();
    		for(var j = 0; j < 60; j++) {
    			linesGeo.vertices.push(this.getVector3(cs[i]["lat"], cs[i]["lon"], this.radius + j));
    		}
    		var points = new THREE.ParticleSystem(linesGeo, new THREE.ShaderMaterial({
    			uniforms: {
            color: {
              type: "c",
              value: new THREE.Color(0x32CD32)
            },
            texture: {
              type: "t",
              value: THREE.ImageUtils.loadTexture('js/webGL/images/particleA.jpg')
            }
          },
  	      vertexShader: `
  	      	//attribute float size;
  	      	//attribute vec3 customColor;
  	      	//varying vec3 vColor;
  	      	void main() {
  	      	  gl_PointSize = 7.0;
  	      	  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  	      	  gl_Position = projectionMatrix * mvPosition;
  	        }
  	      `,
  	      fragmentShader: `
  	        uniform vec3 color;
  	      	uniform sampler2D texture;
  	      	//varying vec3 vColor;
  	      	void main() {
  	      	  gl_FragColor = vec4(color, 1.0);
  	      	  gl_FragColor = gl_FragColor * texture2D(texture, gl_PointCoord);
  	        }
  	      `,
  	      blending: THREE.AdditiveBlending,
  	      depthTest: true,
  	      depthWrite: false,
  	      transparent: true
    		}));
        this.rotating.add(points);
    		/*var lineGeo = new THREE.CubeGeometry(1, 100, 1);
  			var line = new THREE.Mesh(lineGeo, new THREE.MeshBasicMaterial({
	  			color: 0x00FFA7,
	  			//color: 0x6FD5F0,
	  			//map: THREE.ImageUtils.loadTexture("js/webGL/images/universe.jpg"),
	  			//side: THREE.BackSide,
	  			opacity: 1.0,
	  			transparent: true,
	  			//blending: THREE.AdditiveBlending
	  		}))
  			//lineGeo.vertices.push(this.getVector3(cs[i]["lat"], cs[i]["lon"], this.radius + 10));
  			//lineGeo.vertices.push(this.getVector3(cs[i]["lat"], cs[i]["lon"], this.radius));
  			//var pos = this.getVector3(cs[i]["lat"], cs[i]["lon"], this.radius);
		  	//line.position.x = pos.x;
	  		//line.position.y = pos.y;
	  		//line.position.z = pos.z;
		  	this.rotating.add(line);*/
  		}
    	/*for(var i = 0; i < cs.length; i++) {
    		this.city.push(cs[i]);
    		var lineGeo = new THREE.Geometry();
    		var mat = new THREE.ShaderMaterial({
    			uniforms: {
            color: {
              type: "c",
              value: new THREE.Color(0x6FD5F0)
            },
            texture: {
              type: "t",
              value: THREE.ImageUtils.loadTexture('js/webGL/images/particleA.png')
            }
          },
  	    	color: 0x000000,
  	      vertexShader: `
  	      	//attribute float size;
  	      	//attribute vec3 customColor;
  	      	//varying vec3 vColor;
  	      	void main() {
  	      	  gl_PointSize = 300.0;
  	      	  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  	      	  gl_Position = projectionMatrix * mvPosition;
  	        }
  	      `,
  	      fragmentShader: `
  	        uniform vec3 color;
  	      	uniform sampler2D texture;
  	      	//varying vec3 vColor;
  	      	void main() {
  	      	  gl_FragColor = vec4(color, 1.0);
  	      	  gl_FragColor = gl_FragColor * texture2D(texture, gl_PointCoord);
  	        }
  	      `,
  	      blending: THREE.AdditiveBlending,
  	      depthTest: true,
  	      depthWrite: false,
  	      transparent: true
    		});
    		lineGeo.vertices.push(this.getVector3(cs[i]["lat"], cs[i]["lon"], this.radius + 10));
    		lineGeo.vertices.push(this.getVector3(cs[i]["lat"], cs[i]["lon"], this.radius));
    		var line = new THREE.Line(lineGeo, mat);
      	this.rotating.add(line);
    	}*/
    } else if(type == 1) {
  		for(var i = 0; i < cs.length; i++) {
  			this.city.push(cs[i]);
  			//this.addMarker(cs[i]);
  			var lineGeo = new THREE.CubeGeometry(1, 100, 1);
  			var line = new THREE.Mesh(lineGeo, new THREE.MeshBasicMaterial({
	  			color: 0x00FFA7,
	  			//color: 0x6FD5F0,
	  			//map: THREE.ImageUtils.loadTexture("js/webGL/images/universe.jpg"),
	  			//side: THREE.BackSide,
	  			opacity: 1.0,
	  			transparent: true,
	  			//blending: THREE.AdditiveBlending
	  		}))
  			//lineGeo.vertices.push(this.getVector3(cs[i]["lat"], cs[i]["lon"], this.radius + 10));
  			//lineGeo.vertices.push(this.getVector3(cs[i]["lat"], cs[i]["lon"], this.radius));
  			var pos = this.getVector3(cs[i]["lat"], cs[i]["lon"], this.radius);
		  	line.position.x = pos.x;
	  		line.position.y = pos.y;
	  		line.position.z = pos.z;
		  	this.rotating.add(line);
  		}
  	} else if(type == 2) {
  		for(var i = 0; i < cs.length; i++) {
    		this.city.push(cs[i]);
      	//this.addMarker(cs[i]);
    		var lineGeo = new THREE.Geometry();
    		var mat = new THREE.LineBasicMaterial({
    			linewidth: 1.5,
    			color: 0x6FD5F0,
    			transparent: true,
    			opacity: 1.0
    		});
    		lineGeo.vertices.push(this.getVector3(cs[i]["lat"], cs[i]["lon"], this.radius + 10));
    		lineGeo.vertices.push(this.getVector3(cs[i]["lat"], cs[i]["lon"], this.radius));
    		var line = new THREE.Line(lineGeo, mat);
      	this.rotating.add(line);
      	
      	/*var canvas = document.createElement('canvas');
      	canvas.width = 1024;
      	canvas.height = 256;
      	var context = canvas.getContext('2d');
      	context.font = "80px Borda-Bold";
      	context.fillStyle = "rgba(255,160,67,1)";
      	context.fillText("ABCDEFGHIJKLMNOPQRSTUVWXYZ&!", 0, 300);
      	context.font = "40px Borda-Bold";
      	context.fillText("0123456789.sdfsd", 0, 200);
      	var texture = new THREE.Texture(canvas);
      	var pMat = new THREE.MeshBasicMaterial({
      		color: 0xff8340,
      		blending: THREE.AdditiveBlending,
      		map: texture,
      		side: THREE.DoubleSide,
      		transparent: true
      	});
      	var title = new THREE.Mesh(new THREE.CubeGeometry(80, 80), pMat);
      	var pos = this.getVector3(cs[i]["lat"], cs[i]["lon"], this.radius + 10);
      	title.position.x = pos.x;
      	title.position.y = pos.y;
      	title.position.z = pos.z;
      	line.add(title);*/
      	
      	/*var hexGeo = new THREE.CircleGeometry(2, 6, 5);
      	var hexMat = new THREE.MeshBasicMaterial({
      		linewidth : 2,
      		color : 0xff8340,
      		transparent : true,
      		opacity : 0.5
      	});
      	line.hex = new THREE.Line(hexGeo, hexMat);
  			line.add(line.hex);*/
    	}
  	}
  }
  initMap() {
		/*if(!Float32BufferAttribute) {
  		THREE.BufferAttribute = function( array, itemSize, normalized ) {
  			if ( Array.isArray( array ) ) {
  				throw new TypeError( 'THREE.BufferAttribute: array should be a Typed Array.' );
  			}
  			this.uuid = _Math.generateUUID();
  			this.name = '';
  			this.array = array;
  			this.itemSize = itemSize;
  			this.count = array !== undefined ? array.length / itemSize : 0;
  			this.normalized = normalized === true;
  			this.dynamic = false;
  			this.updateRange = { offset: 0, count: - 1 };
  			this.onUploadCallback = function () {};
  			this.version = 0;
  		}
  		Object.defineProperty(THREE.BufferAttribute.prototype, 'needsUpdate', {
  			set: function (value) {
  				if (value === true) this.version ++;
  			}
  		});
  		Object.assign(THREE.BufferAttribute.prototype, {
  			isBufferAttribute: true,
  			setArray: function (array) {
  				if (Array.isArray(array)) {
  					throw new TypeError('THREE.BufferAttribute: array should be a Typed Array.');
  				}
  				this.count = array !== undefined ? array.length / this.itemSize : 0;
  				this.array = array;
  			},
  			setDynamic: function (value) {
  				this.dynamic = value;
  				return this;
  			},
  			copy: function (source) {
  				this.array = new source.array.constructor( source.array );
  				this.itemSize = source.itemSize;
  				this.count = source.count;
  				this.normalized = source.normalized;
  				this.dynamic = source.dynamic;
  				return this;
  			},
  			copyAt: function ( index1, attribute, index2 ) {
  				index1 *= this.itemSize;
  				index2 *= attribute.itemSize;
  				for ( var i = 0, l = this.itemSize; i < l; i ++ ) {
  					this.array[ index1 + i ] = attribute.array[ index2 + i ];
  				}
  				return this;
  			},
  			copyArray: function ( array ) {
  				this.array.set( array );
  				return this;
  			},
  			copyColorsArray: function ( colors ) {
  				var array = this.array, offset = 0;
  				for ( var i = 0, l = colors.length; i < l; i ++ ) {
  					var color = colors[ i ];
  					if ( color === undefined ) {
  						console.warn( 'THREE.BufferAttribute.copyColorsArray(): color is undefined', i );
  						color = new Color();
  					}
  					array[ offset ++ ] = color.r;
  					array[ offset ++ ] = color.g;
  					array[ offset ++ ] = color.b;
  				}
  				return this;
  			},
  			copyIndicesArray: function ( indices ) {
  				var array = this.array, offset = 0;
  				for ( var i = 0, l = indices.length; i < l; i ++ ) {
  					var index = indices[ i ];
  					array[ offset ++ ] = index.a;
  					array[ offset ++ ] = index.b;
  					array[ offset ++ ] = index.c;
  				}
  				return this;
  			},
  			copyVector2sArray: function ( vectors ) {
  				var array = this.array, offset = 0;
  				for ( var i = 0, l = vectors.length; i < l; i ++ ) {
  					var vector = vectors[ i ];
  					if ( vector === undefined ) {
  						console.warn( 'THREE.BufferAttribute.copyVector2sArray(): vector is undefined', i );
  						vector = new Vector2();
  					}
  					array[ offset ++ ] = vector.x;
  					array[ offset ++ ] = vector.y;
  				}
  				return this;
  			},
  			copyVector3sArray: function ( vectors ) {
  				var array = this.array, offset = 0;
  				for ( var i = 0, l = vectors.length; i < l; i ++ ) {
  					var vector = vectors[ i ];
  					if ( vector === undefined ) {
  						console.warn( 'THREE.BufferAttribute.copyVector3sArray(): vector is undefined', i );
  						vector = new Vector3();
  					}
  					array[ offset ++ ] = vector.x;
  					array[ offset ++ ] = vector.y;
  					array[ offset ++ ] = vector.z;
  				}
  				return this;
  			},
  			copyVector4sArray: function ( vectors ) {
  				var array = this.array, offset = 0;
  				for ( var i = 0, l = vectors.length; i < l; i ++ ) {
  					var vector = vectors[ i ];
  					if ( vector === undefined ) {
  						console.warn( 'THREE.BufferAttribute.copyVector4sArray(): vector is undefined', i );
  						vector = new Vector4();
  					}
  					array[ offset ++ ] = vector.x;
  					array[ offset ++ ] = vector.y;
  					array[ offset ++ ] = vector.z;
  					array[ offset ++ ] = vector.w;
  				}
  				return this;
  			},
  			set: function ( value, offset ) {
  				if ( offset === undefined ) offset = 0;
  				this.array.set( value, offset );
  				return this;
  			},
  			getX: function ( index ) {
  				return this.array[ index * this.itemSize ];
  			},
  			setX: function ( index, x ) {
  				this.array[ index * this.itemSize ] = x;
  				return this;
  			},
  			getY: function ( index ) {
  				return this.array[ index * this.itemSize + 1 ];
  			},
  			setY: function ( index, y ) {
  				this.array[ index * this.itemSize + 1 ] = y;
  				return this;
  			},
  			getZ: function ( index ) {
  				return this.array[ index * this.itemSize + 2 ];
  			},
  			setZ: function ( index, z ) {
  				this.array[ index * this.itemSize + 2 ] = z;
  				return this;
  			},
  			getW: function ( index ) {
  				return this.array[ index * this.itemSize + 3 ];
  			},
  			setW: function ( index, w ) {
  				this.array[ index * this.itemSize + 3 ] = w;
  				return this;
  			},
  			setXY: function ( index, x, y ) {
  				index *= this.itemSize;
  				this.array[ index + 0 ] = x;
  				this.array[ index + 1 ] = y;
  				return this;
  			},
  			setXYZ: function ( index, x, y, z ) {
  				index *= this.itemSize;
  				this.array[ index + 0 ] = x;
  				this.array[ index + 1 ] = y;
  				this.array[ index + 2 ] = z;
  				return this;
  			},
  			setXYZW: function ( index, x, y, z, w ) {
  				index *= this.itemSize;
  				this.array[ index + 0 ] = x;
  				this.array[ index + 1 ] = y;
  				this.array[ index + 2 ] = z;
  				this.array[ index + 3 ] = w;
  				return this;
  			},
  			onUpload: function ( callback ) {
  				this.onUploadCallback = callback;
  				return this;
  			},
  			clone: function () {
  				return new this.constructor(this.array, this.itemSize).copy(this);
  			}
  		});
  		function Float32BufferAttribute(array, itemSize) {
  			THREE.BufferAttribute.call(this, new Float32Array(array), itemSize);
  		}
  		Float32BufferAttribute.prototype = Object.create(THREE.BufferAttribute.prototype);
  		Float32BufferAttribute.prototype.constructor = Float32BufferAttribute;
  	}*/
  	if(!THREE.EdgesGeometry) {
  		THREE.Geometry.prototype.clone = function() {
  			return new THREE.Geometry().copy(this);
  		}
  		THREE.Geometry.prototype.copy = function(source) {
  			var i, il, j, jl, k, kl;
  			// reset
  			this.vertices = [];
  			this.colors = [];
  			this.faces = [];
  			this.faceVertexUvs = [[]];
  			this.morphTargets = [];
  			this.morphNormals = [];
  			this.skinWeights = [];
  			this.skinIndices = [];
  			this.lineDistances = [];
  			this.boundingBox = null;
  			this.boundingSphere = null;
  			// name
  			this.name = source.name;
  			// vertices
  			var vertices = source.vertices;
  			for (i = 0, il = vertices.length; i < il; i ++) {
  				this.vertices.push(vertices[i].clone());
  			}
  			// colors
  			var colors = source.colors;
  			for (i = 0, il = colors.length; i < il; i ++) {
  				this.colors.push(colors[i].clone());
  			}
  			// faces
  			var faces = source.faces;
  			for (i = 0, il = faces.length; i < il; i ++) {
  				this.faces.push(faces[i].clone());
  			}
  			// face vertex uvs
  			for (i = 0, il = source.faceVertexUvs.length; i < il; i ++) {
  				var faceVertexUvs = source.faceVertexUvs[i];
  				if (this.faceVertexUvs[i] === undefined) {
  					this.faceVertexUvs[i] = [];
  				}
  				for (j = 0, jl = faceVertexUvs.length; j < jl; j ++) {
  					var uvs = faceVertexUvs[j], uvsCopy = [];
  					for (k = 0, kl = uvs.length; k < kl; k ++) {
  						var uv = uvs[k];
  						uvsCopy.push(uv.clone());
  					}
  					this.faceVertexUvs[i].push(uvsCopy);
  				}
  			}
  			// morph targets
  			var morphTargets = source.morphTargets;
  			for (i = 0, il = morphTargets.length; i < il; i ++) {
  				var morphTarget = {};
  				morphTarget.name = morphTargets[i].name;
  				// vertices
  				if (morphTargets[i].vertices !== undefined) {
  					morphTarget.vertices = [];
  					for (j = 0, jl = morphTargets[i].vertices.length; j < jl; j ++) {
  						morphTarget.vertices.push(morphTargets[i].vertices[j].clone());
  					}
  				}
  				// normals
  				if (morphTargets[i].normals !== undefined) {
  					morphTarget.normals = [];
  					for (j = 0, jl = morphTargets[i].normals.length; j < jl; j ++) {
  						morphTarget.normals.push(morphTargets[i].normals[j].clone());
  					}
  				}
  				this.morphTargets.push(morphTarget);
  			}
  			// morph normals
  			var morphNormals = source.morphNormals;
  			for (i = 0, il = morphNormals.length; i < il; i ++) {
  				var morphNormal = {};
  				// vertex normals
  				if (morphNormals[i].vertexNormals !== undefined) {
  					morphNormal.vertexNormals = [];
  					for (j = 0, jl = morphNormals[i].vertexNormals.length; j < jl; j ++) {
  						var srcVertexNormal = morphNormals[i].vertexNormals[j];
  						var destVertexNormal = {};
  						destVertexNormal.a = srcVertexNormal.a.clone();
  						destVertexNormal.b = srcVertexNormal.b.clone();
  						destVertexNormal.c = srcVertexNormal.c.clone();
  						morphNormal.vertexNormals.push(destVertexNormal);
  					}
  				}
  				// face normals
  				if (morphNormals[i].faceNormals !== undefined) {
  					morphNormal.faceNormals = [];
  					for (j = 0, jl = morphNormals[i].faceNormals.length; j < jl; j ++) {
  						morphNormal.faceNormals.push(morphNormals[i].faceNormals[j].clone());
  					}
  				}
  				this.morphNormals.push(morphNormal);
  			}
  			/*// skin weights
  			var skinWeights = source.skinWeights;
  			for (i = 0, il = skinWeights.length; i < il; i ++) {
  				this.skinWeights.push(skinWeights[i].clone());
  			}
  			// skin indices
  			var skinIndices = source.skinIndices;
  			for (i = 0, il = skinIndices.length; i < il; i ++) {
  				this.skinIndices.push(skinIndices[i].clone());
  			}
  			// line distances
  			var lineDistances = source.lineDistances;
  			for (i = 0, il = lineDistances.length; i < il; i ++) {
  				this.lineDistances.push(lineDistances[i]);
  			}
  			// bounding box
  			var boundingBox = source.boundingBox;
  			if (boundingBox !== null) {
  				this.boundingBox = boundingBox.clone();
  			}
  			// bounding sphere
  			var boundingSphere = source.boundingSphere;
  			if (boundingSphere !== null) {
  				this.boundingSphere = boundingSphere.clone();
  			}*/
  			// update flags
  			this.elementsNeedUpdate = source.elementsNeedUpdate;
  			this.verticesNeedUpdate = source.verticesNeedUpdate;
  			this.uvsNeedUpdate = source.uvsNeedUpdate;
  			this.normalsNeedUpdate = source.normalsNeedUpdate;
  			this.colorsNeedUpdate = source.colorsNeedUpdate;
  			this.lineDistancesNeedUpdate = source.lineDistancesNeedUpdate;
  			this.groupsNeedUpdate = source.groupsNeedUpdate;
  			return this;
  		}
  		THREE.EdgesGeometry = function(geometry, thresholdAngle) {
  			//return new Geometry().copy(this);
  			THREE.BufferGeometry.call(this);
  			this.type = 'EdgesGeometry';
  			this.parameters = {
  				thresholdAngle: thresholdAngle
  			};
  			thresholdAngle = (thresholdAngle !== undefined) ? thresholdAngle : 1;
  			// buffer
  			var vertices = [];
  			// helper variables
  			var thresholdDot = Math.cos(THREE.Math.DEG2RAD * thresholdAngle);
  			var edge = [0, 0], edges = {}, edge1, edge2;
  			var key, keys = ['a', 'b', 'c'];
  			// prepare source geometry
  			var geometry2;
  			if (geometry.isBufferGeometry) {
  				geometry2 = new THREE.Geometry();
  				geometry2.fromBufferGeometry(geometry);
  			} else {
  				geometry2 = geometry.clone();
  				//geometry2 = new THREE.Geometry().copy(geometry);
  			}
  			geometry2.mergeVertices();
  			geometry2.computeFaceNormals();
  			var sourceVertices = geometry2.vertices;
  			var faces = geometry2.faces;
  			// now create a data structure where each entry represents an edge with its adjoining faces
  			for (var i = 0, l = faces.length; i < l; i ++) {
  				var face = faces[i];
  				for (var j = 0; j < 3; j ++) {
  					edge1 = face[keys[j]];
  					edge2 = face[keys[(j + 1) % 3]];
  					edge[0] = Math.min(edge1, edge2);
  					edge[1] = Math.max(edge1, edge2);
  					key = edge[0] + ',' + edge[1];
  					if (edges[key] === undefined) {
  						edges[key] = {index1: edge[0], index2: edge[1], face1: i, face2: undefined};
  					} else {
  						edges[key].face2 = i;
  					}
  				}
  			}
  			// generate vertices
  			for (key in edges) {
  				var e = edges[key];
  				// an edge is only rendered if the angle (in degrees) between the face normals of the adjoining faces exceeds this value. default = 1 degree.
  				if (e.face2 === undefined || faces[e.face1].normal.dot(faces[e.face2].normal) <= thresholdDot) {
  					var vertex = sourceVertices[e.index1];
  					vertices.push(vertex.x, vertex.y, vertex.z);
  					vertex = sourceVertices[e.index2];
  					vertices.push(vertex.x, vertex.y, vertex.z);
  				}
  			}
  			// build geometry
  			//this.addAttribute('position', new Float32BufferAttribute(vertices, 3));
  		}
  		THREE.EdgesGeometry.prototype = Object.create(THREE.BufferGeometry.prototype);
  		THREE.EdgesGeometry.prototype.constructor = THREE.EdgesGeometry;
  	}
  	if(!THREE.LineSegments) {
  		THREE.LineSegments = function(geometry, material) {
  			THREE.Line.call(this, geometry, material);
  			this.type = 'LineSegments';
  		}
  	}
  	if(!THREE.EdgesHelper) {
  		THREE.EdgesHelper = function (object, hex) {
  			console.warn('THREE.EdgesHelper has been removed. Use THREE.EdgesGeometry instead.');
  			return new THREE.LineSegments(
  			  new THREE.EdgesGeometry(object.geometry), 
  			  new THREE.LineBasicMaterial({color: hex !== undefined ? hex : 0xffffff})
  			);
  		}
  	}
		var t3d;
  	for (var name in country_data) {
  		//if(country_data[name].data.cont === "CH") {
  		  t3d = new Tessalator3D(country_data[name], 0);
        var continents = ["CH"];
        var color;
        //var hsl;
        if(country_data[name].data.cont == "CH") {
        	//hsl = this.toColor(147,155,150);
        	color = new THREE.Color(0x103C3F);
        } else {
        	//hsl = this.toColor(1,114,95);
        	color = new THREE.Color(0x103C3F);
        }
        //var h = hsl[0];
      	//var s = hsl[1];
      	//var l = hsl[2];
        //color.setHSL(h, s, l);
        var mesh = country_data[name].mesh = new THREE.Mesh(t3d, new THREE.MeshLambertMaterial({
        	//transparent: true,
          //depthTest: true,
          //depthWrite: false,
          //opacity: 1.0,
          emissive: 0x103C3F,
          //color: color
        }));
        //mesh.name = "land";
        //mesh.userData.country = name;
        this.rotating.add(mesh);
  	  }
    //}
	}
  initTrackballControls() {
		this.mouseX = 0;
		this.mouseY = 0;
		this.pmouseX = 0;
		this.pmouseY = 0;
		this.pressX = 0;
		this.pressY = 0;
		this.keyboard = new THREEx.KeyboardState();
		this.onDocumentResize = function(event) {}
		this.onDocumentMouseDown = function(event) {	
	    this.dragging = true;			   
	    this.pressX = this.mouseX;
	    this.pressY = this.mouseY;   	
	    this.rotateTargetX = undefined;
	    this.rotateTargetX = undefined;
	  }
		this.onDocumentMouseMove = function(event) {
	  	this.pmouseX = this.mouseX;
	  	this.pmouseY = this.mouseY;
	  	this.mouseX = event.clientX - window.innerWidth * 0.5;
	  	this.mouseY = event.clientY - window.innerHeight * 0.5;
	  	if(this.dragging) {
	  		if(this.keyboard.pressed("shift") == false) {
	  			this.rotateVY += (this.mouseX - this.pmouseX) / 2 * Math.PI / 180 * 0.3;
	  			this.rotateVX += (this.mouseY - this.pmouseY) / 2 * Math.PI / 180 * 0.3;	
	  		} else {
	  			this.camera.position.x -= (this.mouseX - this.pmouseX) * .5; 
	  			this.camera.position.y += (this.mouseY - this.pmouseY) * .5;
	  		}
	  	}
	  }
		this.onDocumentMouseUp = function(event) {
	  	this.dragging = false;
	  }
		this.onMouseWheel = function(event) {
	  	var delta = 0;
	    //IE Opera.
	  	if (event.wheelDelta) {
	  	  delta = event.wheelDelta / 120;
	  	} else if(event.detail) {
	  	  //firefox
	  		delta = -event.detail / 3;
	  	}
	  	if (delta) {
	  		this.camera.scale.z += delta * 0.1;
	  	  this.camera.scale.z = this.constrain(this.camera.scale.z, 0.7, 5.0);
	  	}
	  	event.returnValue = false;			
	  }
  	this.renderer.domElement.addEventListener('windowResize', (event) => {
    	this.onDocumentResize(event);
    }, false);
  	this.renderer.domElement.addEventListener('mousedown', (event) => {
    	this.onDocumentMouseDown(event);
    }, true);
  	this.renderer.domElement.addEventListener('mousemove', (event) => {
    	this.onDocumentMouseMove(event);
    }, true);
  	this.renderer.domElement.addEventListener('mouseup', (event) => {
    	this.onDocumentMouseUp(event);
    }, false);
  	this.renderer.domElement.addEventListener('mousewheel', (event) => {
    	this.onMouseWheel(event);
  	}, false);
  	this.renderer.domElement.addEventListener('DOMMouseScroll', (event) => {
    	this.onMouseWheel(window.event || event);
  	}, false);
  }
  getPos(lat, lon, radius) {
  	radius = radius || this.radius;
    var phi = (90 - lat) * Math.PI / 180;
    var theta = (lon - 180) * Math.PI / 180;
  	return {
  		x: -radius * Math.sin(phi) * Math.cos(theta),
  	  y: radius * Math.cos(phi),
  	  z: radius * Math.sin(phi) * Math.sin(theta)
  	};
  }
  getVector3(lat, lon, radius) {
  	var pos = this.getPos(lat, lon, radius);
	  var center = new THREE.Vector3();
	  center.x = pos.x;
	  center.y = pos.y;
	  center.z = pos.z;
    return center;
  }
  isVersion49() {
  	return THREE.REVISION == 49;
  }
//  drawLine(start, end, v, type) {
//  	//var value = v || 30;
//  	var value = 30;
//  	var distanceBetweenCountryCenter = start.clone()[this.isVersion49() ? "subSelf" : "sub"](end).length();		
//  	var anchorHeight = this.radius + distanceBetweenCountryCenter * 0.7;
//  	var mid = start.clone()[this.isVersion49() ? "lerpSelf" : "lerp"](end, 0.5);		
//  	var midLength = mid.length();
//  	mid.normalize();
//  	mid.multiplyScalar(midLength + distanceBetweenCountryCenter * 0.5);			
//  	var normal = (new THREE.Vector3()).sub(start, end);
//  	normal.normalize();
//  	var distanceHalf = distanceBetweenCountryCenter * 0.5;
//  	var startAnchor = start;
//  	var midStartAnchor = mid.clone()[this.isVersion49() ? "addSelf" : "add"](normal.clone().multiplyScalar(distanceHalf));					
//  	var midEndAnchor = mid.clone()[this.isVersion49() ? "addSelf" : "add"](normal.clone().multiplyScalar(-distanceHalf));
//  	var endAnchor = end;
//  	var splineCurveA = new THREE.CubicBezierCurve3( start, startAnchor, midStartAnchor, mid);											
//  	var splineCurveB = new THREE.CubicBezierCurve3(mid, midEndAnchor, endAnchor, end);
//  	var vertexCountDesired = Math.floor(distanceBetweenCountryCenter * 0.5 + 6) * 2;
//  	var points = splineCurveA.getPoints(vertexCountDesired);
//  	points = points.splice(0, points.length - 1);
//  	points = points.concat(splineCurveB.getPoints(vertexCountDesired));
//  	points.push(new THREE.Vector3(0, 0, 0));
//  	//var val = value * 10;
//  	var size = value;
//  	//var size = (1 + Math.sqrt(val));
//  	//size = this.constrain(size, 10, 100);
//  	var curveGeometry = new THREE.Geometry();
//  	for(var i = 0; i < points.length; i ++) {
//    	curveGeometry.vertices.push(points[i]);
//    }
//  	curveGeometry.size = size;
//    //this.rotating.add(this.getMesh(curveGeometry, value, type));
//  	//this.rotating.add(this.getSplineOutline(curveGeometry, value, type));
//  	this.rotating.add(this.getPoints(curveGeometry, value, type));
//  }
//  getPoints(lineGeometry, value, type) {
//  	/*var geo = new THREE.BufferGeometry();
//  	for(var s in lineGeometry.vertices) {
//			//var v = lineGeometry.vertices[s];
//			//geo.vertices.push(v);
//		}*/
//    //geometry.addAttribute('position', verticesPosition);
//  	var splineOutline = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({
//			//color: 0xE34031,
//			opacity: 1.0,
//			blending: THREE.AdditiveBlending,
//			transparent: true,
//			depthWrite: false,
//			vertexColors: true
//	    //linecap: 'butt'
//		}));
//  	splineOutline.renderDepth = false;
//  	
//  	
//  	
//  	var linesGeo = new THREE.Geometry();
//  	for(var s in lineGeometry.vertices) {
//  		linesGeo.vertices.push(lineGeometry.vertices[s]);
//		}
//  	
//  	
//  	var uniforms = {
//  		scale: {
//  			type: "v3", 
//  			value: new THREE.Vector3(1, 1, 1)
//  	  },	
//  		time: {
//  			type: "f",
//  			value: 0.0
//  		},
//  		color: {
//  			type: "c",
//  			value: new THREE.Color(0x00B7EE)
//  		}
//  	};
//    this.shaderMaterial = new THREE.ShaderMaterial({
//    	uniforms: uniforms,
//      vertexShader: `
//        uniform float time;
//        uniform vec3 scale;
//        varying vec3 vNormal;
//        void main() {
//          //vNormal = normal;
//          vec3 test = vec3(time, time, time);
//          vec3 newPosition = position * test;
//          //vec3 newPosition = position * scale;
//          //gl_PointSize = 10.0;
//          //gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
//          //vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
//  			  //gl_PointSize = time;
//  			  //gl_PointSize = 2.0;
//  			  //gl_Position = projectionMatrix * mvPosition;
//        }
//      `,
//      fragmentShader: `
//        uniform vec3 color;
//        varying vec3 vColor;
//        varying vec3 vNormal;
//        void main() {
//          //vec3 light = vec3(0.5, 0.2, 1.0);
//          //light = normalize(light);
//          //float dProd = max(0.0, dot(vNormal, light));
//          //gl_FragColor = vec4(dProd, dProd, dProd, 1.0);
//          //gl_FragColor = vec4(color, 1.0);
//          
//          gl_FragColor = 2.0 * vec4(1.0, 0.0, 0.0, 1.0);
//        }
//      `,
//    });
//    //var splineOutline = new THREE.Line(geo, shaderMaterial);
//    var points = new THREE.ParticleSystem(linesGeo, this.shaderMaterial);
//    splineOutline.add(points);
//    return splineOutline;
//  }
//  getSplineOutline(lineGeometry, value, type) {
//  	/*var attributes = {
//  		size: {
//  			type: 'f',
//  			value: []
//  	  },
//  		customColor: {
//  			type: 'c',
//  			value: []
//  	  }
//  	};
//  	var shaderMaterial = new THREE.ShaderMaterial({
//  		uniforms: {
//    		amplitude: {
//    			type: "f",
//    			value: 1.0
//    		},
//    		color: {
//    			type: "c",
//    			value: new THREE.Color(0xffffff)
//    	  },
//    		texture: {
//    			type: "t",
//    			value: 0,
//    			texture: THREE.ImageUtils.loadTexture("js/webGL/images/particleA.png")
//    		}
//    	},
//  		attributes: attributes,
//  		vertexShader: `
//			uniform float amplitude;
//			attribute float size;
//			attribute vec3 customColor;
//			varying vec3 vColor;
//			void main() {
//			  vColor = customColor;
//			  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
//			  gl_PointSize = size;
//			  gl_Position = projectionMatrix * mvPosition;
//  		}`,
//  		fragmentShader: `
//			uniform vec3 color;
//			uniform sampler2D texture;
//			varying vec3 vColor;
//			void main() {
//			  gl_FragColor = vec4(color * vColor, 1.0);
//			  //gl_FragColor = gl_FragColor * texture2D(texture, gl_PointCoord);
//  		}`,
//  		blending: THREE.AdditiveBlending,
//  		depthTest: true,
//  		depthWrite: false,
//  		transparent: true
//  		// sizeAttenuation: true,
//  	});*/
//  	/*var shaderMaterial = new THREE.LineBasicMaterial({
//			color: 0xE34031,
//			opacity: 1.0,
//			blending: THREE.AdditiveBlending,
//			transparent: true,
//			depthWrite: false,
//			vertexColors: true
//	    //linecap: 'butt'
//		});*/
//  	var shaderMaterial = new THREE.LineBasicMaterial({
//  		color: 0xE34031,
//  		opacity: 1.0,
//      linewidth: 1000
//		});
//  	var splineOutline = new THREE.Line(lineGeometry, shaderMaterial);
//  	return splineOutline;
//  }
//  getMesh(lineGeometry, value, type) {
//  	var linesGeo = new THREE.Geometry();
//  	var lineColors = [];
//  	var particlesGeo = new THREE.Geometry();
//  	var particleColors = [];
//  	//var lineColor = thisLineIsExport ? new THREE.Color(this.exportColor) : new THREE.Color(this.importColor);
//  	//var lineColor = new THREE.Color(0xdd380c);
//  	var lineColor = new THREE.Color(0x48EAB6);
//  	//var lineColor = new THREE.Color(0x154492);
//  	var lastColor;
//		for(var s in lineGeometry.vertices) {
//			var v = lineGeometry.vertices[s];		
//			lineColors.push(lineColor);
//			lastColor = lineColor;
//		}
//  	THREE.GeometryUtils.merge(linesGeo, lineGeometry);
//  	var particleColor = lastColor.clone();
//  	var points = lineGeometry.vertices;
//		var particleCount = Math.floor(value / 10 / lineGeometry.vertices.length) + 1;
//		particleCount = this.constrain(particleCount, 1, 100);
//		var particleSize = lineGeometry.size;
//		for(var s = 0; s < particleCount; s++) {
//			var desiredIndex = s / particleCount * points.length;
//			var rIndex = this.constrain(Math.floor(desiredIndex), 0, points.length - 1);
//			var point = points[rIndex];						
//			var particle = point.clone();
//			particle.moveIndex = rIndex;
//			particle.nextIndex = rIndex + 1;
//			if(particle.nextIndex >= points.length)
//				particle.nextIndex = 0;
//			particle.lerpN = 0;
//			particle.path = points;
//			particlesGeo.vertices.push(particle);	
//			particle.size = particleSize;
//			particleColors.push(particleColor);						
//		}
//		linesGeo.colors = lineColors;
//  	var splineOutline = new THREE.Line(linesGeo, new THREE.LineBasicMaterial({
//			//color: 0xE34031,
//			opacity: 1.0,
//			blending: THREE.AdditiveBlending,
//			transparent: true,
//			depthWrite: false,
//			vertexColors: true
//	    //linecap: 'butt'
//		}));
//  	splineOutline.renderDepth = false;
//  	var attributes = {
//  		size: {
//  			type: 'f',
//  			value: []
//  	  },
//  		customColor: {
//  			type: 'c',
//  			value: []
//  	  }
//  	};
//  	var shaderMaterial = new THREE.ShaderMaterial({
//  		uniforms: {
//    		amplitude: {
//    			type: "f",
//    			value: 1.0
//    		},
//    		color: {
//    			type: "c",
//    			value: new THREE.Color(0xffffff)
//    	  },
//    		texture: {
//    			type: "t",
//    			value: 0,
//    			texture: THREE.ImageUtils.loadTexture("js/webGL/images/particleA.png")
//    		}
//    	},
//  		attributes: attributes,
//  		vertexShader: `
//			uniform float amplitude;
//			attribute float size;
//			attribute vec3 customColor;
//			varying vec3 vColor;
//			void main() {
//			  vColor = customColor;
//			  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
//			  gl_PointSize = size;
//			  gl_Position = projectionMatrix * mvPosition;
//  		}`,
//  		fragmentShader: `
//			uniform vec3 color;
//			uniform sampler2D texture;
//			varying vec3 vColor;
//			void main() {
//			  gl_FragColor = vec4(color * vColor, 1.0);
//			  gl_FragColor = gl_FragColor * texture2D(texture, gl_PointCoord);
//  		}`,
//  		blending: THREE.AdditiveBlending,
//  		depthTest: true,
//  		depthWrite: false,
//  		transparent: true
//  		// sizeAttenuation: true,
//  	});
//  	/*var particleGraphic = THREE.ImageUtils.loadTexture("js/webGL/images/map_mask.png");
//  	var particleMat = new THREE.ParticleBasicMaterial({
//  		map: particleGraphic,
//  		color: 0xE34031,
//  		size: 1,
//  		blending: THREE.NormalBlending,
//  		transparent: true,
//  	  depthWrite: false,
//  	  vertexColors: true,
//  		sizeAttenuation: true
//  	});*/
//  	particlesGeo.colors = particleColors;
//  	var pSystem = new THREE.ParticleSystem(particlesGeo, shaderMaterial);
//  	pSystem.dynamic = true;
//  	splineOutline.add(pSystem);
//  	var vertices = pSystem.geometry.vertices;
//  	var values_size = attributes.size.value;
//  	var values_color = attributes.customColor.value;
//  	for(var v = 0; v < vertices.length; v++) {
//  		values_size[v] = pSystem.geometry.vertices[v].size;
//  		values_color[v] = particleColors[v];
//  	}
//  	pSystem.update = function() {
//  		for(var i in this.geometry.vertices) {
//  			var particle = this.geometry.vertices[i];
//  			var path = particle.path;
//  			var moveLength = path.length;
//  			particle.lerpN += 0.1;
//  			if(particle.lerpN > 1) {
//  				particle.lerpN = 0;
//  				particle.moveIndex = particle.nextIndex;
//  				particle.nextIndex++;
//  				if(particle.nextIndex >= path.length) {
//  					particle.moveIndex = 0;
//  					particle.nextIndex = 1;
//  				}
//  			}
//  			var currentPoint = path[particle.moveIndex];
//  			var nextPoint = path[particle.nextIndex];
//  			particle.copy(currentPoint);
//  			particle.lerpSelf(nextPoint, particle.lerpN);			
//  		}
//  		this.geometry.verticesNeedUpdate = true;
//  	};
//  	//splineOutline.affectedCountries = affectedCountries;
//  	return splineOutline;
//  }
  load(data, type) {
    if(!this.isAnimate) {
      this.animate();
      this.isAnimate = true;
    }
    if(data) {
    	//this.loadFlightLine(data, type);
    }
  }
  constrain(v, min, max) {
  	if(v < min)
  		v = min;
  	else
  	if(v > max)
  		v = max;
  	return v;
  }
//  addItem(item) {
//  	var start = item["source"], 
//  	end = item["target"],
//  	start_latLon = start["latlon"].split(","),
//  	end_latLon = end["latlon"].split(",");
//  	this.drawLine(this.getVector3(start_latLon[1], start_latLon[0]), this.getVector3(end_latLon[1], end_latLon[0]));
//  }
//  load(data) {
//  	if(!this.isAnimate) {
//  		this.animate();
//  		this.isAnimate = true;
//  	}
//  	for(var i = 0; i < data.length; i++) {
//  		this.addItem(data[i]);
//  	}
//  }
}
window.Earth=Earth;