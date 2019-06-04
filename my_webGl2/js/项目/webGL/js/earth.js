class Earth {
	constructor(opt) {
		this.selectableCountries = [];
		this.countryData = {};
		//this.selectableYears = [];
		this.radius = 100;
		this.segments = 60;
		this.rotationSpeed = 1.000;
		this.reverseWeaponLookup = {};
		this.selectionData = null;
		this.previouslySelectedCountry = null;
		this.selectedCountry = null;
		this.markers = [];
		this.mouseX = 0;
		this.mouseY = 0;
		this.pmouseX = 0;
		this.pmouseY = 0;
		this.pressX = 0;
		this.pressY = 0;
		this.dragging = false;					
		this.rotateX = 0;
		this.rotateY = 0;
		this.rotateVX = 0;
		this.rotateVY = 0;
		this.rotateXMax = 90 * Math.PI / 180;
		this.rotateTargetX = 0;
		this.rotateTargetY = 0;
		this.keyboard = new THREEx.KeyboardState();
		this.controllers = {
			spin: 0.1
		};
		this.weaponLookup = {
			'm': 'm',
			'c': 'c',
			'a': 'a',
		};
		//this.exportColor = 0xdd380c;
		//this.importColor = 0xdd380c;
		
		//this.exportColor = 0xF5D348;
		//this.importColor = 0xF5D348;
		
	  //this.exportColor = 0xdd380c;
	  //this.importColor = 0xdd380c;
		
		this.exportColor = 0x48EAB6;
		this.importColor = 0x48EAB6;
		
		//this.exportColor = 0x154492;
		//this.importColor = 0x154492;
		this.vec3_origin = new THREE.Vector3(0, 0, 0);
		this.apply(this, opt);
		this.wrap = this.el.get ? this.el.get(0) : (typeof this.el == "string" ? document.getElementById(this.el) : this.el);
		this.el = document.createElement("div");
		this.el.style = "user-select: none;";
		this.wrap.appendChild(this.el);
		this.containt = document.createElement("div");
		this.containt.style = "user-select: none;";
		this.wrap.appendChild(this.containt);
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
	  	this.renderer.setSize(window.innerWidth, window.innerHeight);
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
			this.camera = new THREE.PerspectiveCamera(12, window.innerWidth / window.innerHeight, 1, 20000);
	  	this.camera.position.z = 1600;
	  	this.camera.position.y = 0;
	  	//this.camera.lookAt(this.scene.width / 2, this.scene.height / 2);
	  	this.scene.add(this.camera);
		}
		if(!this.rotating) {
			this.rotating = new THREE.Object3D();
	  	this.scene.add(this.rotating);
		}
		if(!this.visualizationMesh) {
			this.visualizationMesh = new THREE.Object3D();
	  	this.rotating.add(this.visualizationMesh);
		}
		if(!this.sphere) {
			this.sphere = new THREE.Mesh(
	      new THREE.SphereGeometry(this.radius, this.segments, this.segments),
	      new THREE.MeshLambertMaterial({
	      	//transparent: true,
	        //depthTest: false,
	        //depthWrite: false,
	      	//color: 0x0A1839,
	      	//color: 0x0A1E40,
	      	//color: 0x102042,
	        opacity: 0.8,
	        map: new THREE.ImageUtils.loadTexture('js/webGL/images/earth.jpg'),
	        //map: new THREE.ImageUtils.loadTexture('js/webGL/images/earth_political_alpha.png'),
	        //specularMap: new THREE.ImageUtils.loadTexture('js/webGL/images/fire4.png'),
	        //emissive: 0x000000,
	        //specular: new THREE.Color(0x000000)
	      })
	    );
			/*var shaderMaterial = new THREE.ShaderMaterial({
	  		uniforms: {
	    		//'mapIndex': {type: 't', value: 1, texture: indexedMapTexture},
	    		//'lookup': {type: 't', value: 1, texture: lookupTexture},
	    		//'outline': {type: 't', value: 1, texture: outlinedMapTexture},
	    		'outlineLevel': {type: 'f', value: 1}
	    	},
	  		vertexShader: [
	    		'varying vec3 vNormal;',
	  			'varying vec2 vUv;',
	  			'void main() {',
	  				'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0);',
	  				'vNormal = normalize( normalMatrix * normal );',
	  				'vUv = uv;',
	  			'}'
	    	].join("\n"),
	  		fragmentShader: [
	  			'uniform sampler2D mapIndex;',
	  			'uniform sampler2D lookup;',
	  			'uniform sampler2D outline;',
	  			'uniform float outlineLevel;',
	  			'varying vec3 vNormal;',
	  			'varying vec2 vUv;',
	  			'void main() {',
	  				'vec4 mapColor = texture2D( mapIndex, vUv );',
	  				'float indexedColor = mapColor.x;',
	  				'vec2 lookupUV = vec2( indexedColor, 1. );',
	  				'vec4 lookupColor = texture2D( lookup, lookupUV );',
	  				'float mask = lookupColor.x + (1.-outlineLevel) * indexedColor;',
	  				'mask = clamp(mask,0.,1.);',
	  				'float outlineColor = texture2D( outline, vUv ).x * outlineLevel;',
	  				'float diffuse = mask + outlineColor;',
	  				'gl_FragColor = vec4( vec3(diffuse), 1.  );',
	  			'}'
	  		].join("\n")
	  	});
			this.sphere = new THREE.Mesh(new THREE.SphereGeometry(this.radius, this.segments, this.segments), shaderMaterial);				
	  	this.sphere.doubleSided = false;
	  	this.sphere.rotation.x = Math.PI;				
	  	this.sphere.rotation.y = -Math.PI/2;
	  	this.sphere.rotation.z = Math.PI;
	  	this.sphere.id = "base";*/
	  	this.rotating.add(this.sphere);
		}
		this.initEffect();
		this.initLinght();
		//this.initMap();
  	//this.sphere.rotation.y = (Math.PI / 180) * 270;
    //this.scene.add(this.earthContainer);
		
  	//this.rotating.rotation.y = (Math.PI / 180) * 270;
  	THREEx.WindowResize(this.renderer, this.camera);
  	//this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);
  	this.initTrackballControls();
	}
  initLinght() {
  	//this.scene.add(new THREE.AmbientLight(0x444444));
    this.scene.add(new THREE.AmbientLight(0x010C42));
    this.scene.add(new THREE.AmbientLight(0x010C42));
  	/*var light1 = new THREE.SpotLight(0xeeeeee, 1);
  	light1.position.x = 730; 
  	light1.position.y = 520;
  	light1.position.z = 626;
  	light1.castShadow = true;
  	this.scene.add(light1);
  
  	var light2 = new THREE.PointLight(0x222222, 12);
  	light2.position.x = -640;
  	light2.position.y = -500;
  	light2.position.z = -1000;
  	this.scene.add(light2);*/
  	
    //var light0 = new THREE.DirectionalLight(0x7efaff, 1.5);
    /*var light0 = new THREE.DirectionalLight(0xD0FDFF, 1.5);
    light0.position.set(-.5, 1, 2).normalize();
		this.scene.add(light0);*/
  	
  	var light1 = new THREE.PointLight(0xD0FDFF, 0.8, 0);
  	light1.position.set(0, 0, 600);
  	//light1.lookAt(0, 0, 0);
  	this.scene.add(light1);
		
		var light2 = new THREE.DirectionalLight(0x7efaff, 1);
		light2.position.set(400, 400, 100);
		this.scene.add(light2);
		
		/*var light3 = new THREE.PointLight(0x7efaff, 1, 0);
		light3.position.set(0, 0, -200);
		light3.lookAt(0, 0, -500);
		this.scene.add(light3);
		
		var light4 = new THREE.PointLight(0x7efaff, 1, 0);
		light4.position.set(0, 0, -200);
		light4.lookAt(0, 0, -500);
		this.scene.add(light4);*/
		
		/*var light5 = new THREE.DirectionalLight(0xffffff, 5);
		light5.position.set(-5, 5, 50);
		this.scene.add(light5);*/
	}
	initEffect() {
		this.sphere.add(new THREE.Mesh(
			new THREE.SphereGeometry(this.radius + 1, 50, 50), 
			new THREE.MeshLambertMaterial({
			  transparent: true,
			  color: 0xff8340,
			  blending: THREE.AdditiveBlending,
			  opacity: 0.4,
			  map: new THREE.ImageUtils.loadTexture("js/webGL/images/fire4.png")
		  })
		));
		this.sphere.add(new THREE.Mesh(
			new THREE.SphereGeometry(this.radius + 2, 50, 50),
			new THREE.MeshLambertMaterial({
			  blending: THREE.AdditiveBlending,
			  transparent: true,
			  color: 0x2AC7CC,
			  opacity: 0.6,
			  map: new THREE.ImageUtils.loadTexture("js/webGL/images/earth_political_alpha.png")
		  })
		));
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
  			console.log(geometry);
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
        	color = new THREE.Color(0x010C42);
        } else {
        	//hsl = this.toColor(1,114,95);
        	color = new THREE.Color(0x010C42);
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
          emissive: 0x010C42,
          //color: color
        }));
        //mesh.name = "land";
        //mesh.userData.country = name;
        this.rotating.add(mesh);
  	  }
    //}
	}
  onDocumentResize(event) {}
  onDocumentMouseDown(event) {	
    this.dragging = true;			   
    this.pressX = this.mouseX;
    this.pressY = this.mouseY;   	
    this.rotateTargetX = undefined;
    this.rotateTargetX = undefined;
  }
  onDocumentMouseMove(event) {
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
  onDocumentMouseUp(event) {
  	this.dragging = false;
  }
  onMouseWheel(event) {
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
  initTrackballControls() {
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
  loadGeoData(latlon) {
		/*var phi = (90 - lat) * Math.PI / 180;
    var theta = (360 - lon) * Math.PI / 180;
    radius = radius || this.radius;
    return {
      x: radius * Math.sin(phi) * Math.cos(theta),
      y: radius * Math.cos(phi),
      z: radius * Math.sin(phi) * Math.sin(theta)
    };*/
    /*for (var i in latlon) {										
  	  var country = latlon[i];	
  	  country.countryCode = i;
  	  country.countryName = i;			
      var lat = country.lat;
      var lon = country.lon - 90;
      var phi = Math.PI / 2 - lat * Math.PI / 180 - Math.PI * 0.01;
      var theta = 2 * Math.PI - lon * Math.PI / 180 + Math.PI * 0.06;
  	  var center = new THREE.Vector3();                
      center.x = Math.sin(phi) * Math.cos(theta) * this.radius;
      center.y = Math.cos(phi) * this.radius;
      center.z = Math.sin(phi) * Math.sin(theta) * this.radius;  	
  	  country.center = center;
  	  this.countryData[country.countryName] = country;
    }*/
		for(var i in latlon) {
			var country = latlon[i];	
  	  country.countryCode = i;
  	  country.countryName = i;			
      var lat = country.lat;
      var lon = country.lon;
      var phi = phi = (90 - lat) * Math.PI / 180;
      var theta = (360 - lon) * Math.PI / 180;
  	  var center = new THREE.Vector3();                
      center.x = this.radius * Math.sin(phi) * Math.cos(theta);
      center.y = this.radius * Math.cos(phi);
      center.z = this.radius * Math.sin(phi) * Math.sin(theta);  	
  	  country.center = center;
  	  this.countryData[country.countryName] = country;
		}
  }
  show() {
  	
  }
  selectVisualization(countries, exportCategories, importCategories) {
  	//var cName = countries[0].toUpperCase();
  	var cName = countries[0];
  	this.previouslySelectedCountry = this.selectedCountry;
  	//this.selectedCountry = this.countryData[countries[0].toUpperCase()];
  	this.selectedCountry = this.countryData[countries[0]];
  	this.selectedCountry.summary = {
  		imported: {
  			mil: 0,
  			civ: 0,
  			ammo: 0,
  			total: 0,
  		},
  		exported: {
  			mil: 0,
  			civ: 0,
  			ammo: 0,
  			total: 0,
  		},
  		total: 0,
  		historical: this.getHistoricalData(this.selectedCountry),
  	};
  	for(var i in this.countryData) {
  		var country = this.countryData[i];
  		country.exportedAmount = 0;
  		country.importedAmount = 0;
  		country.mapColor = 0;
  	}
  	for(var i in this.selectableCountries) {
  		this.removeMarkerFromCountry(this.selectableCountries[i]);
  	}
  	while(this.visualizationMesh.children.length > 0) {
  		var c = this.visualizationMesh.children[0];
  		this.visualizationMesh.remove(c);
  	}
  	var mesh = this.getVisualizedMesh(this.data, countries, exportCategories, importCategories);
  	this.visualizationMesh.add(mesh);	
  	if(mesh.affectedCountries.length == 0) {
  		mesh.affectedCountries.push(cName);
  	}	
  	for(var i in mesh.affectedCountries) {
  		var countryName = mesh.affectedCountries[i];
  		var country = this.countryData[countryName];
  		this.attachMarkerToCountry(countryName, country.mapColor);
  	}
  	this.highlightCountry(mesh.affectedCountries);
  	if(this.previouslySelectedCountry !== this.selectedCountry) {
  		if(this.selectedCountry) {
  			this.rotateTargetX = this.selectedCountry.lat * Math.PI / 180;
  			var targetY0 = -(this.selectedCountry.lon - 9) * Math.PI / 180, piCounter = 0;
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
          this.rotateTargetY = wrap(targetY0, -Math.PI, Math.PI);
  			}
  			this.rotateVX *= 0.6;
  			this.rotateVY *= 0.6;		
  		}	
  	}
  }
  removeMarkerFromCountry(countryName) {
  	//countryName = countryName.toUpperCase();
  	countryName = countryName;
  	var country = this.countryData[countryName];
  	if(country === undefined)
  		return;
  	if(country.marker === undefined)
  		return;
  	var index = this.markers.indexOf(country.marker);
  	if(index >= 0)
  		this.markers.splice(index, 1);
  	this.containt.removeChild(country.marker);
  	country.marker = undefined;		
  }
  highlightCountry(countries) {}
  getHistoricalData(country) {
//  	var history = [];	
//  	var countryName = country.countryName;
//  	var exportCategories = this.selectionData.getExportCategories();
//  	var importCategories = this.selectionData.getImportCategories();
//  	for(var i in this.data) {
//  		var yearBin = this.data[i].data;		
//  		var value = {imports: 0, exports: 0};
//  		for(var s in yearBin) {
//  			var set = yearBin[s];
//  			var categoryName = this.reverseWeaponLookup[set["type"]];
//  			//var exporterCountryName = set["source"].toUpperCase();
//  			//var importerCountryName = set["target"].toUpperCase();
// 	      var exporterCountryName = set["source"];
//        var importerCountryName = set["target"];
//  			var relevantCategory = (countryName == exporterCountryName && this.indexOfArr(categoryName, exportCategories) >= 0) || (countryName == importerCountryName && this.indexOfArr(categoryName, importCategories) >= 0);				
//  			if(relevantCategory == false)
//  				continue;
//  			if(this.countryData[exporterCountryName] === undefined || this.countryData[importerCountryName] === undefined)
//  				continue;
//  			if(exporterCountryName == countryName)
//  				value.exports += set["value"];
//  			if(importerCountryName == countryName)
//  				value.imports += set["value"];
//  		}
//  		history.push(value);
//  	}
//  	return history;
  }
  makeConnectionLineGeometry(start, end, value, type) {
  	if(start.countryName == undefined || end.countryName == undefined)
  		return undefined;
  	var distanceBetweenCountryCenter = start.center.clone().subSelf(end.center).length();		
  	var anchorHeight = this.radius * 10 + distanceBetweenCountryCenter * 0.5;
  	var start = start.center;
  	var end = end.center;
  	var mid = start.clone().lerpSelf(end, 0.5);		
  	var midLength = mid.length();
  	mid.normalize();
  	mid.multiplyScalar(midLength + distanceBetweenCountryCenter * 0.45);			
  	var normal = (new THREE.Vector3()).sub(start,end);
  	normal.normalize();
  	var distanceHalf = distanceBetweenCountryCenter * 0.5;
  	var startAnchor = start;
  	var midStartAnchor = mid.clone().addSelf(normal.clone().multiplyScalar(distanceHalf));					
  	var midEndAnchor = mid.clone().addSelf(normal.clone().multiplyScalar(-distanceHalf));
  	var endAnchor = end;
  	var splineCurveA = new THREE.CubicBezierCurve3( start, startAnchor, midStartAnchor, mid);											
  	var splineCurveB = new THREE.CubicBezierCurve3(mid, midEndAnchor, endAnchor, end);
  	var vertexCountDesired = Math.floor(distanceBetweenCountryCenter * 0.02 + 5) * 2;	
  	var points = splineCurveA.getPoints(vertexCountDesired);
  	points = points.splice(0, points.length - 1);
  	points = points.concat(splineCurveB.getPoints(vertexCountDesired));
  	points.push(this.vec3_origin);
  	var val = value * 0.1;
  	var size = (10 + Math.sqrt(val));
  	size = this.constrain(size, 12, 100);
    var curveGeometry = new THREE.Geometry();
    for(var i = 0; i < points.length; i ++) {
    	curveGeometry.vertices.push(points[i]);
    }
  	curveGeometry.size = size;
  	return curveGeometry;
  }
  getVisualizedMesh(bin, countries, exportCategories, importCategories) {
  	for(var i in countries) {
  		countries[i] = countries[i];
  	}
  	var affectedCountries = [];
  	var linesGeo = new THREE.Geometry();
  	var lineColors = [];
  	var particlesGeo = new THREE.Geometry();
  	var particleColors = [];
  	for(i in bin) {
  		var set = bin[i];
  		//var exporterName = set["source"].toUpperCase();
  		//var importerName = set["target"].toUpperCase();
  		var exporterName = set["source"];
  		var importerName = set["target"];
  		var relevantExport = this.indexOfArr(exporterName, countries) >= 0;
  		var relevantImport = this.indexOfArr(importerName, countries) >= 0;
  		var useExporter = relevantExport;
  		var useImporter = relevantImport;
  		var categoryName = this.reverseWeaponLookup[set["type"]];
  		var relevantExportCategory = relevantExport && this.indexOfArr(categoryName, exportCategories) >= 0;		
  		var relevantImportCategory = relevantImport && this.indexOfArr(categoryName, importCategories) >= 0;
  		if((useImporter || useExporter) && (relevantExportCategory || 54)) {
  			if(set.lineGeometry === undefined)
  				continue;
  			var thisLineIsExport = false;
  			if(exporterName == this.selectedCountry.countryName) {
  				thisLineIsExport = true;
  			}
  			var lineColor = thisLineIsExport ? new THREE.Color(this.exportColor) : new THREE.Color(this.importColor);
  			var lastColor;
  			for(s in set.lineGeometry.vertices) {
  				var v = set.lineGeometry.vertices[s];		
  				lineColors.push(lineColor);
  				lastColor = lineColor;
  			}
  			THREE.GeometryUtils.merge(linesGeo, set.lineGeometry);
  			var particleColor = lastColor.clone();		
  			var points = set.lineGeometry.vertices;
  			var particleCount = Math.floor(set["value"] / 8000 / set.lineGeometry.vertices.length) + 1;
  			particleCount = this.constrain(particleCount, 1, 100);
  			var particleSize = set.lineGeometry.size;			
  			for(var s = 0; s < particleCount; s++) {
  				var desiredIndex = s / particleCount * points.length;
  				var rIndex = this.constrain(Math.floor(desiredIndex), 0, points.length - 1);
  				var point = points[rIndex];						
  				var particle = point.clone();
  				particle.moveIndex = rIndex;
  				particle.nextIndex = rIndex+1;
  				if(particle.nextIndex >= points.length)
  					particle.nextIndex = 0;
  				particle.lerpN = 0;
  				particle.path = points;
  				particlesGeo.vertices.push(particle);	
  				particle.size = particleSize;
  				particleColors.push(particleColor);						
  			}			
  			if(this.indexOfArr(exporterName, affectedCountries) < 0) {
  				affectedCountries.push(exporterName);
  			}							
  			if(this.indexOfArr(importerName, affectedCountries) < 0) {
  				affectedCountries.push(importerName);
  			}
  			var vb = set["value"];
  			var exporterCountry = this.countryData[exporterName];
  			if(exporterCountry.mapColor === undefined) {
  				exporterCountry.mapColor = vb;
  			} else{				
  				exporterCountry.mapColor += vb;
  			}			
  			var importerCountry = this.countryData[importerName];
  			if(importerCountry.mapColor === undefined) {
  				importerCountry.mapColor = vb;
  			} else {				
  				importerCountry.mapColor += vb;
  			}	
  			exporterCountry.exportedAmount += vb;
  			importerCountry.importedAmount += vb;
  			if(exporterCountry == this.selectedCountry) {				
  				this.selectedCountry.summary.exported[set["type"]] += set["value"];
  				this.selectedCountry.summary.exported.total += set["value"];				
  			}		
  			if(importerCountry == this.selectedCountry) {
  				this.selectedCountry.summary.imported[set["type"]] += set["value"];
  				this.selectedCountry.summary.imported.total += set["value"];
  			}
  			if(importerCountry == this.selectedCountry || exporterCountry == this.selectedCountry) {
  				this.selectedCountry.summary.total += set["value"];	
  			}
  		}		
  	}
  	linesGeo.colors = lineColors;	
  	var splineOutline = new THREE.Line(linesGeo, new THREE.LineBasicMaterial({
			color: 0xffffff,
			opacity: 0.6,
			blending: THREE.AdditiveBlending,
			transparent: true,
			depthWrite: false,
			vertexColors: true,
			linewidth: 1
		}));
  	splineOutline.renderDepth = false;
  	var attributes = {
  		size: {
  			type: 'f',
  			value: []
  	  },
  		customColor: {
  			type: 'c',
  			value: []
  	  }
  	};
  	var shaderMaterial = new THREE.ShaderMaterial( {
  		uniforms: {
    		amplitude: {
    			type: "f",
    			value: 1.0
    		},
    		color: {
    			type: "c",
    			value: new THREE.Color(0xffffff)
    	  },
    		texture: {
    			type: "t",
    			value: 0,
    			texture: THREE.ImageUtils.loadTexture("js/webGL/images/map_mask.png")
    		}
    	},
  		attributes: attributes,
  		vertexShader:  [
  			'uniform float amplitude;',
  			'attribute float size;',
  			'attribute vec3 customColor;',
  			'varying vec3 vColor;',
  			'void main() {',
  			'vColor = customColor;',
  			'vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
  			'gl_PointSize = size;',
  			'gl_Position = projectionMatrix * mvPosition;',
  			'}'
  		].join("\n"),
  		fragmentShader: [
  			'uniform vec3 color;',
  			'uniform sampler2D texture;',
  			'varying vec3 vColor;',
  			'void main() {',
  			'gl_FragColor = vec4( color * vColor, 1.0 );',
  			'gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );',
  			'}'
  		].join("\n"),
  		blending: THREE.AdditiveBlending,
  		depthTest: true,
  		depthWrite: false,
  		transparent: true
  		// sizeAttenuation: true,
  	});
  	var particleGraphic = THREE.ImageUtils.loadTexture("js/webGL/images/map_mask.png");
  	var particleMat = new THREE.ParticleBasicMaterial({
  		map: particleGraphic,
  		color: 0xffffff,
  		size: 60,
  		blending: THREE.NormalBlending,
  		transparent: true,
  	  depthWrite: false,
  	  vertexColors: true,
  		sizeAttenuation: true
  	});
  	particlesGeo.colors = particleColors;
  	var pSystem = new THREE.ParticleSystem(particlesGeo, shaderMaterial);
  	pSystem.dynamic = true;
  	splineOutline.add(pSystem);
  	var vertices = pSystem.geometry.vertices;
  	var values_size = attributes.size.value;
  	var values_color = attributes.customColor.value;
  	for(var v = 0; v < vertices.length; v++) {		
  		values_size[v] = pSystem.geometry.vertices[v].size;
  		values_color[v] = particleColors[v];
  	}
  	pSystem.update = function() {	
  		for(var i in this.geometry.vertices) {						
  			var particle = this.geometry.vertices[i];
  			var path = particle.path;
  			var moveLength = path.length;
  			particle.lerpN += 0.05;
  			if(particle.lerpN > 1) {
  				particle.lerpN = 0;
  				particle.moveIndex = particle.nextIndex;
  				particle.nextIndex++;
  				if(particle.nextIndex >= path.length) {
  					particle.moveIndex = 0;
  					particle.nextIndex = 1;
  				}
  			}
  			var currentPoint = path[particle.moveIndex];
  			var nextPoint = path[particle.nextIndex];
  			particle.copy(currentPoint);
  			particle.lerpSelf(nextPoint, particle.lerpN);			
  		}
  		this.geometry.verticesNeedUpdate = true;
  	};		
  	splineOutline.affectedCountries = affectedCountries;
  	return splineOutline;	
  }
  attachMarkerToCountry(countryName, importance) {
  	//countryName = countryName.toUpperCase();
  	countryName = countryName;
  	var country = this.countryData[countryName];
  	if(country === undefined)
  		return;
  	var marker = document.createElement("div");
  	marker.className ="earth-marker";
  	marker.innerHTML = '<div class="earth-detailText"></div>';
  	country.marker = marker;
  	this.containt.appendChild(marker);
  	marker.countryName = countryName;
  	marker.importance = importance;
  	marker.selected = false;
  	marker.hover = false;
    //if(countryName === this.selectedCountry.countryName.toUpperCase())
    if(countryName === this.selectedCountry.countryName)
		  marker.selected = true;
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
	  detailLayer.innerHTML = countryName;
	  marker.detailLayer = detailLayer;
	  marker.setSize = function(s) {
	    var detailSize = Math.floor(2 + s * 0.5);	
      var totalHeight = detailSize * 2;
	  }
	  var self = this;
  	marker.update = function() {
  		var matrix = self.rotating.matrixWorld;
  		var abspos = matrix.multiplyVector3(country.center.clone());
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
  		this.setVisible(abspos.z > 60);
  		var zIndex = Math.floor(1000 - abspos.z + s);
  		if(this.selected || this.hover)
  			zIndex = 10000;
  		this.setPosition(screenPos.x, screenPos.y, zIndex);
  	}
  	var tiny = (importance < 20000000) && (!marker.selected);	
  	marker.tiny = tiny;
  	detailLayer.innerHTML = countryName;
//  	var markerOver = function(e) {
//  		detailLayer.innerHTML = countryName;
//  		this.hover = true;
//  	}
//  	var markerOut = function(e) {
//  		detailLayer.innerHTML = "";
//  		this.hover = false;
//  	}
//  	if(!tiny) {		
//  		detailLayer.innerHTML = countryName;
//  	} else {
//  		marker.addEventListener('mouseover', markerOver, false);
//  		marker.addEventListener('mouseout', markerOut, false);
//  	}
//  	var self = this;
//    var markerSelect = function(e) {
//      self.selectVisualization([this.countryName], self.selectionData.getExportCategories(), self.selectionData.getImportCategories());	
//    };
//  	marker.addEventListener('click', markerSelect, true);
  	this.markers.push(marker);
  }
  screenXY(vec3) {
  	var projector = new THREE.Projector();
  	var vector = projector.projectVector(vec3.clone(), this.camera);
    var windowWidth = window.innerWidth;
    var minWidth = 1280;
    if(windowWidth < minWidth) {
      windowWidth = minWidth;
    }
  	return {
  		x: Math.round(vector.x * (windowWidth / 2)) + windowWidth / 2,
    	y: Math.round((0 - vector.y) * (window.innerHeight / 2)) + window.innerHeight / 2
  	};
  }
  indexOfArr(C, arr) {
  	if(!arr) return -1;
  	for (var B = 0, A = arr.length; B < A; B++) {
  		if (arr[B] == C) {
  			return B;
  		}
  	}
  	return -1;
  }
  constrain(v, min, max) {
  	if(v < min)
  		v = min;
  	else
  	if(v > max)
  		v = max;
  	return v;
  }
  resoleLatlon(obj) {
  	var rs = {}, latlog = obj["latlon"].split(",");
  	rs[obj["name"]] = {
  		"code": obj["latlon"],	
  		"name": obj["name"],
			"lat": latlog[0],
	    "lon": latlog[1]	
		}
  	return rs;
  }
  load(store) {
  	//this.data = data || [];
  	this.animate();
  	/*this.selectionData = {
  		exportCategories: {},
  		importCategories: {}
  	};
  	for(var i in this.weaponLookup) {
  		this.selectionData.exportCategories[i] = true;
  		this.selectionData.importCategories[i] = true;
		}
  	this.selectionData.getExportCategories = function() {
			var list = [];
			for(var i in this.exportCategories) {
				if(this.exportCategories[i])
					list.push(i);
			}
			return list;
		}
  	this.selectionData.getImportCategories = function() {
			var list = [];
			for(var i in this.importCategories) {
				if(this.importCategories[i])
					list.push(i);
			}
			return list;
		}*/
  	var latlon = {};
  	for(var i = 0; i < store.length; i++) {
  		var s = store[i]["source"];
  		var s_latlog = s["latlon"].split(",");
  		var t = store[i]["target"];
  		var t_latlog = t["latlon"].split(",");
  		latlon[s["name"]] = {
				"lat": s_latlog[1],
  		  "lon": s_latlog[0]	
  		};
  		latlon[t["name"]] = {
				"lat": t_latlog[1],
  		  "lon": t_latlog[0]		
  		};
  	}
  	this.loadGeoData(latlon);
  	var json = [], target = ["北京"];
  	for(var i = 0; i < store.length; i++) {
  		json.push({
  			"source": store[i]["source"]["name"],
  		  "target": store[i]["target"]["name"],
  		  "type": "mil",
  		  "value": 100
  		});
  		target.push(store[i]["target"]["name"]);
  	}
  	this.data = json;
		for(var n in this.data) {
			//var start = this.countryData[this.data[n]["source"].toUpperCase()];
			//var end = this.countryData[this.data[n]["target"].toUpperCase()];
		  var start = this.countryData[this.data[n]["source"]];
			var end = this.countryData[this.data[n]["target"]];
			if(start === undefined || end === undefined)
				continue;
			this.data[n].lineGeometry = this.makeConnectionLineGeometry(start, end, this.data[n]["value"], this.data[n]["type"]);
			//this.data[n].lineGeometry = this.makeConnectionLineGeometry(start, end, 100, "mil");
		}
  	
  	this.selectVisualization(target);
		//this.show();
  }
}

(function(global) {
  global.earth = new Earth({
    el: "webgl-content"
  });
  earth.animate = function() {
    if(earth.rotateTargetX !== undefined && earth.rotateTargetY !== undefined) {
      earth.rotateVX += (earth.rotateTargetX - earth.rotateX) * 0.012;
      earth.rotateVY += (earth.rotateTargetY - earth.rotateY) * 0.012;
      if(Math.abs(earth.rotateTargetX - earth.rotateX) < 0.1 && Math.abs(earth.rotateTargetY - earth.rotateY) < 0.1) {
        earth.rotateTargetX = undefined;
        earth.rotateTargetY = undefined;
      }
    }
    earth.rotateX += earth.rotateVX;
    earth.rotateY += earth.rotateVY;
    earth.rotateVX *= 0.98;
    earth.rotateVY *= 0.98;
    if(earth.dragging || earth.rotateTargetX !== undefined) {
      earth.rotateVX *= 0.6;
      earth.rotateVY *= 0.6;
    }
    earth.rotateY += earth.controllers.spin * 0.01;
    if(earth.rotateX < -earth.rotateXMax){
      earth.rotateX = -earth.rotateXMax;
      earth.rotateVX *= -0.95;
    }
    if(earth.rotateX > earth.rotateXMax){
      earth.rotateX = earth.rotateXMax;
      earth.rotateVX *= -0.95;
    }
    // TWEEN.update();
    earth.rotating.rotation.x = earth.rotateX;
    earth.rotating.rotation.y = earth.rotateY;
    //earth.render();
    earth.renderer.clear();               
    earth.renderer.render(earth.scene, earth.camera);
    requestAnimationFrame(earth.animate);
    THREE.SceneUtils.traverseHierarchy(earth.rotating, function(mesh) {
      if(mesh.update !== undefined) {
        mesh.update();
      } 
    });
    for(var i in earth.markers) {
      earth.markers[i].update()
    }
    //earth.controls.update();
  }
})(window);
//var data = {"message":"获取告警地图数据成功","data":[{"attackrout":[{"source":{"latlon":"120.153576,30.287459","name":"杭州","value":"7"},"target":{"latlon":"1.718190,46.710670","name":"法国","value":"7"}},{"source":{"latlon":"116.405285,39.904989","name":"北京","value":"6"},"target":{"latlon":"135.718933,35.098129","name":"日本","value":"6"}},{"source":{"latlon":"1.718190,46.710670","name":"法国","value":"6"},"target":{"latlon":"120.153576,30.287459","name":"杭州","value":"6"}},{"source":{"latlon":"127.850166,36.448151","name":"韩国","value":"6"},"target":{"latlon":"116.405285,39.904989","name":"北京","value":"6"}},{"source":{"latlon":"1.718190,46.710670","name":"法国","value":"6"},"target":{"latlon":"102.712251,25.040609","name":"昆明","value":"6"}},{"source":{"latlon":"135.718933,35.098129","name":"日本","value":"5"},"target":{"latlon":"1.718190,46.710670","name":"法国","value":"5"}},{"source":{"latlon":"116.507676,31.752889","name":"六安","value":"5"},"target":{"latlon":"120.153576,30.287459","name":"杭州","value":"5"}},{"source":{"latlon":"120.153576,30.287459","name":"杭州","value":"5"},"target":{"latlon":"127.850166,36.448151","name":"韩国","value":"5"}},{"source":{"latlon":"120.153576,30.287459","name":"杭州","value":"5"},"target":{"latlon":"108.830719,59.453751","name":"俄罗斯","value":"5"}},{"source":{"latlon":"109.939776,33.868319","name":"商洛","value":"5"},"target":{"latlon":"120.153576,30.287459","name":"杭州","value":"5"}},{"source":{"latlon":"135.718933,35.098129","name":"日本","value":"5"},"target":{"latlon":"116.405285,39.904989","name":"北京","value":"5"}},{"source":{"latlon":"1.718190,46.710670","name":"法国","value":"5"},"target":{"latlon":"109.939776,33.868319","name":"商洛","value":"5"}},{"source":{"latlon":"116.405285,39.904989","name":"北京","value":"5"},"target":{"latlon":"120.153576,30.287459","name":"杭州","value":"5"}},{"source":{"latlon":"120.153576,30.287459","name":"杭州","value":"5"},"target":{"latlon":"109.939776,33.868319","name":"商洛","value":"5"}},{"source":{"latlon":"1.718190,46.710670","name":"法国","value":"5"},"target":{"latlon":"127.850166,36.448151","name":"韩国","value":"5"}}]}],"code":0};