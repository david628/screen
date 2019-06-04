class Earth {
	constructor(opt) {
		this.selectableCountries = [];
		this.countryData = {};
		//this.selectableYears = [];
		this.radius = 100;
		this.segments = 60;
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
		this.rotateTargetX = undefined;
		this.rotateTargetY = undefined;
		this.controllers = {
			speed: 3,							
			multiplier: 0.5,
			backgroundColor: "#000000",
			zoom: 1,
			spin: 0,
			transitionTime: 2000
		};
		this.weaponLookup = {
			'Military Weapons': 'mil',
			'Civilian Weapons': 'civ',
			'Ammunition': 'ammo',
		};
		this.exportColor = 0xdd380c;
		this.importColor = 0x154492;
		this.vec3_origin = new THREE.Vector3(0, 0, 0);
		this.apply(this, opt);
		this.el = this.el.get ? this.el.get(0) : (typeof this.el == "string" ? document.getElementById(this.el) : this.el);
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
  	this.scene = new THREE.Scene();
  	this.scene.matrixAutoUpdate = false;					

  	this.rotating = new THREE.Object3D();
  	this.scene.add(this.rotating);

  	var mapIndexedImage = new Image();
		mapIndexedImage.src = 'js/webGL/images/map_indexed.png';
    var indexedMapTexture = new THREE.Texture(mapIndexedImage);
    indexedMapTexture.needsUpdate = true;
    indexedMapTexture.magFilter = THREE.NearestFilter;
    indexedMapTexture.minFilter = THREE.NearestFilter;
    
    var mapOutlineImage = new Image();
		mapOutlineImage.src = 'js/webGL/images/map_outline.png';
    var outlinedMapTexture = new THREE.Texture(mapOutlineImage);
    outlinedMapTexture.needsUpdate = true;
  	var shaderMaterial = new THREE.ShaderMaterial({
  		uniforms: {
    		'mapIndex': {type: 't', value: 0, texture: indexedMapTexture},
    		//'lookup': {type: 't', value: 1, texture: lookupTexture},
    		'outline': {type: 't', value: 2, texture: outlinedMapTexture},
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
  				'vec2 lookupUV = vec2( indexedColor, 0. );',
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
  	this.sphere.id = "base";	
  	this.rotating.add(this.sphere);	
  	
  	this.visualizationMesh = new THREE.Object3D();
  	this.rotating.add(this.visualizationMesh);	
  	this.renderer = new THREE.WebGLRenderer({
  		antialias: false
  	});
  	this.renderer.setSize(window.innerWidth, window.innerHeight);
  	this.renderer.autoClear = false;
  	this.renderer.sortObjects = false;		
  	this.renderer.generateMipmaps = false;					
  	this.el.appendChild(this.renderer.domElement);									
//  	document.addEventListener('mousemove', this.onDocumentMouseMove, true);
//  	document.addEventListener('windowResize', this.onDocumentResize, false);
//  	document.addEventListener('mousedown', this.onDocumentMouseDown, true);	
//  	document.addEventListener('mouseup', this.onDocumentMouseUp, false);
//  	this.masterContainer.addEventListener('click', onClick, true);	
//  	this.masterContainer.addEventListener('mousewheel', onMouseWheel, false);
//  	this.masterContainer.addEventListener('DOMMouseScroll', function(e){
//      var evt=window.event || e;
//    	onMouseWheel(evt);
//  	}, false);
  	document.addEventListener('keydown', this.onKeyDown, false);												    			    	
  	this.camera = new THREE.PerspectiveCamera(12, window.innerWidth / window.innerHeight, 1, 20000); 		        
  	this.camera.position.z = 1400;
  	this.camera.position.y = 0;
  	this.camera.lookAt(this.scene.width / 2, this.scene.height / 2);	
  	this.scene.add(this.camera);
  	var windowResize = THREEx.WindowResize(this.renderer, this.camera);
  }
  getCityPoints(country) {
    var lat = country.lat;
    var lon = country.lon - 90;
    var phi = Math.PI/2 - lat * Math.PI / 180 - Math.PI * 0.01;
    var theta = 2 * Math.PI - lon * Math.PI / 180 + Math.PI * 0.06;
	  var center = new THREE.Vector3();                
    center.x = Math.sin(phi) * Math.cos(theta) * this.radius;
    center.y = Math.cos(phi) * this.radius;
    center.z = Math.sin(phi) * Math.sin(theta) * this.radius;  	
	  country.center = center;
	  return country;
	  //this.countryData[country.countryName] = country;
  }
  loadGeoData(data) {
  	var start, end, latlon1, latlon2;
  	for(var i = 0; i < data.length; i++) {
  		latlon1 = data[i]["source"]["latlon"].split(",");
  		latlon2 = data[i]["target"]["latlon"].split(",");
  		start = this.getCityPoints({
  			name: data[i]["source"]["name"],
  			countryCode: data[i]["source"]["latlon"],
  			countryName: data[i]["source"]["latlon"],
  			lat: latlon1[0],
  			lon: latlon1[1],
  			value: 30,
  			type: "ammo"
  		});
  		end = this.getCityPoints({
  			name: data[i]["target"]["name"],
  			countryCode: data[i]["target"]["latlon"],
  			countryName: data[i]["target"]["latlon"],
  			lat: latlon2[0],
  			lon: latlon2[1],
  			value: 30,
  			type: "ammo"
  		});
  		var lineGeometry = this.makeConnectionLineGeometry(start, end, end.value, end.type);
  		console.log(this.getSplineOutline(lineGeometry));
  		this.visualizationMesh.add(this.getSplineOutline(lineGeometry));
  	}
    //set.wc = "ammo";//'Military Weapons': 'mil', 'Civilian Weapons': 'civ', 'Ammunition': 'ammo',
  }
  getSplineOutline(lineGeometry) {
  	var linesGeo = new THREE.Geometry();
  	var particlesGeo = new THREE.Geometry();
  	var particleColors = [];
  	var splineOutline = new THREE.Line(linesGeo, new THREE.LineBasicMaterial({
			color: 0xffffff,
			opacity: 1.0,
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
    			texture: THREE.ImageUtils.loadTexture("images/particleA.png")
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
  	var particleGraphic = THREE.ImageUtils.loadTexture("images/map_mask.png");
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
  	//splineOutline.affectedCountries = affectedCountries;
  	return splineOutline;	
  }
  /*loadGeoData(latlon) {
    for (var i in latlon) {										
  	  var country = latlon[i];	
  	  country.countryCode = i;
  	  country.countryName = i;			
      var lat = country.lat;
      var lon = country.lon - 90;
      var phi = Math.PI/2 - lat * Math.PI / 180 - Math.PI * 0.01;
      var theta = 2 * Math.PI - lon * Math.PI / 180 + Math.PI * 0.06;
  	  var center = new THREE.Vector3();                
      center.x = Math.sin(phi) * Math.cos(theta) * this.radius;
      center.y = Math.cos(phi) * this.radius;
      center.z = Math.sin(phi) * Math.sin(theta) * this.radius;  	
  	  country.center = center;
  	  this.countryData[country.countryName] = country;
    }
  }*/
  /*loadGeoData(latlon) {
    for (var i in latlon) {										
  	  var country = latlon[i];	
  	  country.countryCode = i;
  	  country.countryName = i;			
      var lat = country.lat;
      var lon = country.lon - 90;
      var phi = Math.PI/2 - lat * Math.PI / 180 - Math.PI * 0.01;
      var theta = 2 * Math.PI - lon * Math.PI / 180 + Math.PI * 0.06;
  	  var center = new THREE.Vector3();                
      center.x = Math.sin(phi) * Math.cos(theta) * this.radius;
      center.y = Math.cos(phi) * this.radius;
      center.z = Math.sin(phi) * Math.sin(theta) * this.radius;  	
  	  country.center = center;
  	  this.countryData[country.countryName] = country;
    }
  }*/
  selectVisualization(linearData, year, countries, exportCategories, importCategories) {
  	var cName = countries[0].toUpperCase();
  	this.previouslySelectedCountry = this.selectedCountry;
  	this.selectedCountry = this.countryData[countries[0].toUpperCase()];
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
  	var mesh = this.getVisualizedMesh(timeBins, year, countries, exportCategories, importCategories);
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
  			this.rotateTargetX = this.selectedCountry.lat * Math.PI/180;
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
  	countryName = countryName.toUpperCase();
  	var country = this.countryData[countryName];
  	if(country === undefined)
  		return;
  	if(country.marker === undefined)
  		return;
  	var index = this.markers.indexOf(country.marker);
  	if(index >= 0)
  		this.markers.splice(index, 1);
  	var container = document.getElementById('visualization');		
  	container.removeChild(country.marker);
  	country.marker = undefined;		
  }
  highlightCountry(countries) {}
  getHistoricalData(country) {
  	var history = [];	
  	var countryName = country.countryName;
  	var exportCategories = this.selectionData.getExportCategories();
  	var importCategories = this.selectionData.getImportCategories();
  	for(var i in timeBins) {
  		var yearBin = timeBins[i].data;		
  		var value = {imports: 0, exports: 0};
  		for(var s in yearBin) {
  			var set = yearBin[s];
  			var categoryName = this.reverseWeaponLookup[set.wc];
  			var exporterCountryName = set.e.toUpperCase();
  			var importerCountryName = set.i.toUpperCase();			
  			var relevantCategory = (countryName == exporterCountryName && this.indexOfArr(categoryName, exportCategories) >= 0) || (countryName == importerCountryName && this.indexOfArr(categoryName, importCategories) >= 0);				
  			if(relevantCategory == false)
  				continue;
  			if(this.countryData[exporterCountryName] === undefined || this.countryData[importerCountryName] === undefined)
  				continue;
  			if(exporterCountryName == countryName)
  				value.exports += set.v;
  			if(importerCountryName == countryName)
  				value.imports += set.v;
  		}
  		history.push(value);
  	}
  	return history;
  }
//  buildDataVizGeometries(linearData) {
//  	for(var i in linearData) {
//  		var store = linearData[i].data;		
//  		var count = 0;
//  		for(var s in store) {
//  			var set = store[s];
//  			var start = this.countryData[set.e.toUpperCase()];
//  			var end = this.countryData[set.i.toUpperCase()];	
//  			if(start === undefined || end === undefined)
//  				continue;
//  			set.wc = "ammo";//'Military Weapons': 'mil', 'Civilian Weapons': 'civ', 'Ammunition': 'ammo',
//  			set.lineGeometry = this.makeConnectionLineGeometry(start, end, set.v, set.wc);
//  		}
//  	}
//  }
  makeConnectionLineGeometry(start, end, value, type) {
  	if(start.countryName == undefined || end.countryName == undefined)
  		return undefined;
  	var distanceBetweenCountryCenter = start.center.clone().subSelf(end.center).length();		
  	var anchorHeight = this.radius * 10 + distanceBetweenCountryCenter * 0.7;
  	var start = start.center;
  	var end = end.center;
  	var mid = start.clone().lerpSelf(end, 0.5);		
  	var midLength = mid.length();
  	mid.normalize();
  	mid.multiplyScalar(midLength + distanceBetweenCountryCenter * 0.7);			
  	var normal = (new THREE.Vector3()).sub(start, end);
  	normal.normalize();
  	var distanceHalf = distanceBetweenCountryCenter * 0.5;
  	var startAnchor = start;
  	var midStartAnchor = mid.clone().addSelf(normal.clone().multiplyScalar(distanceHalf));					
  	var midEndAnchor = mid.clone().addSelf(normal.clone().multiplyScalar(-distanceHalf));
  	var endAnchor = end;
  	var splineCurveA = new THREE.CubicBezierCurve3( start, startAnchor, midStartAnchor, mid);											
  	var splineCurveB = new THREE.CubicBezierCurve3(mid, midEndAnchor, endAnchor, end);
  	var vertexCountDesired = Math.floor(distanceBetweenCountryCenter * 0.02 + 3) * 2;	
  	var points = splineCurveA.getPoints(vertexCountDesired);
  	points = points.splice(0, points.length - 1);
  	points = points.concat(splineCurveB.getPoints(vertexCountDesired));
  	points.push(this.vec3_origin);
  	//var val = value * 0.0001;
  	//var size = (0 + Math.sqrt(val));
  	//size = this.constrain(size, 0.1, 60);
    var curveGeometry = new THREE.Geometry();
    for(var i = 0; i < points.length; i ++) {
    	curveGeometry.vertices.push(points[i]);
    }
  	curveGeometry.size = 15;
  	return curveGeometry;
  }
  getVisualizedMesh(linearData, year, countries, exportCategories, importCategories) {
  	for(var i in countries) {
  		countries[i] = countries[i].toUpperCase();
  	}
  	var indexFromYear = parseInt(year) - 1992;
  	if(indexFromYear >= timeBins.length)
  		indexFromYear = timeBins.length - 1;
  	var affectedCountries = [];
  	var bin = linearData[indexFromYear].data;	
  	var linesGeo = new THREE.Geometry();
  	var lineColors = [];
  	var particlesGeo = new THREE.Geometry();
  	var particleColors = [];			
  	for(i in bin) {
  		var set = bin[i];
  		var exporterName = set.e.toUpperCase();
  		var importerName = set.i.toUpperCase();
  		var relevantExport = this.indexOfArr(exporterName, countries) >= 0;
  		var relevantImport = this.indexOfArr(importerName, countries) >= 0;
  		var useExporter = relevantExport;
  		var useImporter = relevantImport;
  		var categoryName = this.reverseWeaponLookup[set.wc];
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
  			var particleCount = Math.floor(set.v / 8000 / set.lineGeometry.vertices.length) + 1;
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
  			var vb = set.v;
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
  				this.selectedCountry.summary.exported[set.wc] += set.v;
  				this.selectedCountry.summary.exported.total += set.v;				
  			}		
  			if(importerCountry == this.selectedCountry) {
  				this.selectedCountry.summary.imported[set.wc] += set.v;
  				this.selectedCountry.summary.imported.total += set.v;
  			}
  			if(importerCountry == this.selectedCountry || exporterCountry == this.selectedCountry) {
  				this.selectedCountry.summary.total += set.v;	
  			}
  		}		
  	}
  	linesGeo.colors = lineColors;	
  	var splineOutline = new THREE.Line(linesGeo, new THREE.LineBasicMaterial({
			color: 0xffffff,
			opacity: 1.0,
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
    			texture: THREE.ImageUtils.loadTexture("images/particleA.png")
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
  	var particleGraphic = THREE.ImageUtils.loadTexture("images/map_mask.png");
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
  	countryName = countryName.toUpperCase();
  	var country = this.countryData[countryName];
  	if(country === undefined)
  		return;
  	var container = document.getElementById('visualization');	
  	var template = document.getElementById('marker_template');
  	var marker = template.cloneNode(true);
  	country.marker = marker;
  	container.appendChild(marker);
  	marker.countryName = countryName;
  	marker.importance = importance;
  	marker.selected = false;
  	marker.hover = false;
    if(countryName === this.selectedCountry.countryName.toUpperCase())
		  marker.selected = true;
  	marker.setPosition = function(x, y, z) {
  		this.style.left = x + 'px';
  		this.style.top = y + 'px';	
  		this.style.zIndex = z;
  	}
  	marker.setVisible = function(vis) {
  		if(! vis)
  			this.style.display = 'none';
  		else 
  			this.style.display = 'inline';
  	}
    var countryLayer = marker.querySelector('#countryText');
    marker.countryLayer = countryLayer;
	  var detailLayer = marker.querySelector('#detailText');
	  marker.detailLayer = detailLayer;
	  marker.setSize = function(s) {
	    var detailSize = Math.floor(2 + s * 0.5);	
		  //this.detailLayer.style.fontSize = detailSize + 'pt';
      var totalHeight = detailSize * 2;
		  //this.style.fontSize = totalHeight * 1.125 + 'pt';
		  if(detailSize <= 8) {
        this.countryLayer.style.marginTop = "0px";  
		  } else {
		    this.countryLayer.style.marginTop = "-1px";
		  }
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
  		this.setVisible((abspos.z > 60) && s > 3);	
  		var zIndex = Math.floor(1000 - abspos.z + s);
  		if(this.selected || this.hover)
  			zIndex = 10000;
  		this.setPosition(screenPos.x, screenPos.y, zIndex);
  	}
  	var nameLayer = marker.querySelector('#countryText');		
  	var tiny = (importance < 20000000) && (!marker.selected);	
  	marker.tiny = tiny;
  	nameLayer.innerHTML = countryName.replace(' ', '&nbsp;');	
  	/*var importExportText = "";
  	if(country.exportedAmount > 0 && country.importedAmount > 0) {
  	  importExportText += "imported:&nbsp;$" + this.numberWithCommas(country.importedAmount) + "<br />" + "exported:&nbsp;$" + this.numberWithCommas(country.exportedAmount);
  	} else if(country.exportedAmount > 0 && country.importedAmount == 0) {
  	  importExportText += "exported:&nbsp;$" + this.numberWithCommas(country.exportedAmount) + "<br />&nbsp;";
  	} else if(country.exportedAmount == 0 && country.importedAmount > 0) {
  	  importExportText += "imported:&nbsp;$" + this.numberWithCommas(country.importedAmount) + "<br />&nbsp;";
  	}*/
  	var importExportText = "";
  	marker.importExportText = importExportText;
  	var markerOver = function(e){
  		this.detailLayer.innerHTML = importExportText;
  		this.hover = true;
  	}
  	var markerOut = function(e){
  		this.detailLayer.innerHTML = "";
  		this.hover = false;
  	}
  	if(!tiny) {		
  		detailLayer.innerHTML = importExportText;
  	} else {
  		marker.addEventListener('mouseover', markerOver, false);
  		marker.addEventListener('mouseout', markerOut, false);
  	}
  	var self = this;
    var markerSelect = function(e) {
      self.selectVisualization(timeBins, self.selectionData.selectedYear, [this.countryName], self.selectionData.getExportCategories(), self.selectionData.getImportCategories());	
    };
  	marker.addEventListener('click', markerSelect, true);
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
  /*numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }*/
  load(data) {
  	this.initScene();
  	this.animate();
  	this.selectionData = {
  		selectedYear: '2010',
  		selectedCountry: 'CHINA',
  		exportCategories: {},
  		importCategories: {}
  		//weaponLookup: this.weaponLookup
  		//selectedYear: '2010',
  		//selectedYear: '2010',
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
		}
  	//this.loadGeoData(latlon);
  	this.loadGeoData(data);
  	//this.buildDataVizGeometries(timeBins);
//  	this.selectVisualization(
//  	  timeBins,
//  	  '2010',
//  	  ['CHINA']
//  	  //['UNITED STATES'],
//  	  //['Military Weapons','Civilian Weapons', 'Ammunition'],
//  	  //['Military Weapons','Civilian Weapons', 'Ammunition']
//  	);
  }
}




var earth = new Earth({
	el: "id-test"
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
}

var json = {
  "message": "获取告警地图成功",
  "data": [
    {
      "attackrout": [
        {
          "source": {
            "latlon": "116.405285,39.904989",
            "name": "北京",
            "value": "707"
          },
          "target": {
            "latlon": "120.153576,30.287459",
            "name": "浙江",
            "value": "707"
          }
        },
        {
          "source": {
            "latlon": "120.153576,30.287459",
            "name": "浙江",
            "value": "672"
          },
          "target": {
            "latlon": "116.405285,39.904989",
            "name": "北京",
            "value": "672"
          }
        },
        {
          "source": {
            "latlon": "120.153576,30.287459",
            "name": "浙江",
            "value": "510"
          },
          "target": {
            "latlon": "116.507676,31.752889",
            "name": "安徽",
            "value": "510"
          }
        },
        {
          "source": {
            "latlon": "116.507676,31.752889",
            "name": "安徽",
            "value": "509"
          },
          "target": {
            "latlon": "120.153576,30.287459",
            "name": "浙江",
            "value": "509"
          }
        },
        {
          "source": {
            "latlon": "116.405285,39.904989",
            "name": "北京",
            "value": "384"
          },
          "target": {
            "latlon": "116.507676,31.752889",
            "name": "安徽",
            "value": "384"
          }
        },
        {
          "source": {
            "latlon": "116.507676,31.752889",
            "name": "安徽",
            "value": "366"
          },
          "target": {
            "latlon": "116.405285,39.904989",
            "name": "北京",
            "value": "366"
          }
        },
        {
          "source": {
            "latlon": "113.280637,23.125178",
            "name": "广东",
            "value": "315"
          },
          "target": {
            "latlon": "120.153576,30.287459",
            "name": "浙江",
            "value": "315"
          }
        },
        {
          "source": {
            "latlon": "120.153576,30.287459",
            "name": "浙江",
            "value": "310"
          },
          "target": {
            "latlon": "113.280637,23.125178",
            "name": "广东",
            "value": "310"
          }
        },
        {
          "source": {
            "latlon": "120.153576,30.287459",
            "name": "浙江",
            "value": "277"
          },
          "target": {
            "latlon": "118.767413,32.041544",
            "name": "江苏",
            "value": "277"
          }
        },
        {
          "source": {
            "latlon": "118.767413,32.041544",
            "name": "江苏",
            "value": "249"
          },
          "target": {
            "latlon": "120.153576,30.287459",
            "name": "浙江",
            "value": "249"
          }
        },
        {
          "source": {
            "latlon": "120.153576,30.287459",
            "name": "浙江",
            "value": "231"
          },
          "target": {
            "latlon": "121.472644,31.231706",
            "name": "上海",
            "value": "231"
          }
        },
        {
          "source": {
            "latlon": "116.405285,39.904989",
            "name": "北京",
            "value": "215"
          },
          "target": {
            "latlon": "113.280637,23.125178",
            "name": "广东",
            "value": "215"
          }
        },
        {
          "source": {
            "latlon": "113.280637,23.125178",
            "name": "广东",
            "value": "214"
          },
          "target": {
            "latlon": "116.405285,39.904989",
            "name": "北京",
            "value": "214"
          }
        },
        {
          "source": {
            "latlon": "118.767413,32.041544",
            "name": "江苏",
            "value": "213"
          },
          "target": {
            "latlon": "116.405285,39.904989",
            "name": "北京",
            "value": "213"
          }
        },
        {
          "source": {
            "latlon": "121.472644,31.231706",
            "name": "上海",
            "value": "185"
          },
          "target": {
            "latlon": "120.153576,30.287459",
            "name": "浙江",
            "value": "185"
          }
        }
      ]
    }
  ],
  "code": 0
}
console.log(json.data[0]["attackrout"]);
earth.load(json.data[0]["attackrout"]);