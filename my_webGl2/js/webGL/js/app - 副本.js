function screenXY(vec3){
	var projector = new THREE.Projector();
	var vector = projector.projectVector( vec3.clone(), camera );
	var result = new Object();
    var windowWidth = window.innerWidth;
    var minWidth = 1280;
    if(windowWidth < minWidth) {
        windowWidth = minWidth;
    }
	result.x = Math.round( vector.x * (windowWidth/2) ) + windowWidth/2;
	result.y = Math.round( (0-vector.y) * (window.innerHeight/2) ) + window.innerHeight/2;
	return result;
}	
 function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function wrap(value, min, rangeSize) {
  rangeSize-=min;
    while (value < min) {
      value += rangeSize;
  }
  return value % rangeSize;
}


var mouseX = 0, mouseY = 0, pmouseX = 0, pmouseY = 0;
var pressX = 0, pressY = 0;

var dragging = false;						

var rotateX = 0, rotateY = 0;
var rotateVX = 0, rotateVY = 0;
var rotateXMax = 90 * Math.PI/180;	

var rotateTargetX = undefined;
var rotateTargetY = undefined;

var keyboard = new THREEx.KeyboardState();	

function onDocumentMouseMove( event ) {

	pmouseX = mouseX;
	pmouseY = mouseY;

	mouseX = event.clientX - window.innerWidth * 0.5;
	mouseY = event.clientY - window.innerHeight * 0.5;

	if(dragging){
		if(keyboard.pressed("shift") == false){
			rotateVY += (mouseX - pmouseX) / 2 * Math.PI / 180 * 0.3;
  			rotateVX += (mouseY - pmouseY) / 2 * Math.PI / 180 * 0.3;	
  		}
  		else{
  			camera.position.x -= (mouseX - pmouseX) * .5; 
  			camera.position.y += (mouseY - pmouseY) * .5;
  		}
	}
}

function onDocumentMouseDown( event ) {	
    if(event.target.className.indexOf('noMapDrag') !== -1) {
        return;
    }
    dragging = true;			   
    pressX = mouseX;
    pressY = mouseY;   	
    rotateTargetX = undefined;
    rotateTargetX = undefined;
}	

function onDocumentMouseUp( event ){
	// d3Graphs.zoomBtnMouseup();
	dragging = false;
	histogramPressed = false;
}

function onClick( event ){
	// make the rest not work if the event was actually a drag style click
	if( Math.abs(pressX - mouseX) > 3 || Math.abs(pressY - mouseY) > 3 )
		return;				

	var pickColorIndex = getPickColor();	
	// find it
	for( var i in countryColorMap ){
		var countryCode = i;
		var countryColorIndex = countryColorMap[i];
		if( pickColorIndex == countryColorIndex ){
			// console.log("selecting code " + countryCode);
			var countryName = countryLookup[countryCode];
			// console.log("converts to " + countryName);
			if( countryName === undefined )
				return;			
			if( $.inArray(countryName, selectableCountries) <= -1 )
				return;
			// console.log(countryName);
			var selection = selectionData;
			selection.selectedCountry = countryName;
			selectVisualization( timeBins, selection.selectedYear, [selection.selectedCountry], selection.getExportCategories(), selection.getImportCategories() );	
			// console.log('selecting ' + countryName + ' from click');
			return;
		}
	}	
}

function onKeyDown( event ){	
}

function handleMWheel( delta ) {
	camera.scale.z += delta * 0.1;
	camera.scale.z = constrain( camera.scale.z, 0.7, 5.0 );
}

function onMouseWheel( event ){
	var delta = 0;

	if (event.wheelDelta) { /* IE/Opera. */
	        delta = event.wheelDelta/120;
	} 
	// firefox
	else if( event.detail ){
		delta = -event.detail/3;
	}

	if (delta)
	        handleMWheel(delta);

	event.returnValue = false;			
}	

function onDocumentResize(e){
}









function buildDataVizGeometries( linearData ){	

	// var loadLayer = document.getElementById('loading');
	for( var i in linearData ){
		var yearBin = linearData[i].data;		

		var year = linearData[i].t;
		selectableYears.push(year);	

		var count = 0;
		// console.log('Building data for ...' + year);
		for( var s in yearBin ){
			var set = yearBin[s];

			var exporterName = set.e.toUpperCase();
			var importerName = set.i.toUpperCase();

			var exporter = countryData[exporterName];
			var importer = countryData[importerName];	
			
			// we couldn't find the country, it wasn't in our list...
			if( exporter === undefined || importer === undefined )
				continue;			

			// visualize this event
			set.lineGeometry = makeConnectionLineGeometry( exporter, importer, set.v, set.wc );		

			// if( s % 1000 == 0 )
			// console.log( 'calculating ' + s + ' of ' + yearBin.length + ' in year '
			// + year);
		}

		// use this break to only visualize one year (1992)
		// break;

		// how to make this work?
		// loadLayer.innerHTML = 'loading data for ' + year + '...';
		// console.log(loadLayer.innerHTML);
	}			

	// loadLayer.style.display = 'none';
}

function getVisualizedMesh( linearData, year, countries, exportCategories, importCategories ){
	// for comparison purposes, all caps the country names
	for( var i in countries ){
		countries[i] = countries[i].toUpperCase();
	}

	// pick out the year first from the data
	var indexFromYear = parseInt(year) - 1992;
	if( indexFromYear >= timeBins.length )
		indexFromYear = timeBins.length-1;

	var affectedCountries = [];

	var bin = linearData[indexFromYear].data;	

	var linesGeo = new THREE.Geometry();
	var lineColors = [];

	var particlesGeo = new THREE.Geometry();
	var particleColors = [];			

	// var careAboutExports = ( action === 'exports' );
	// var careAboutImports = ( action === 'imports' );
	// var careAboutBoth = ( action === 'both' );

	// go through the data from year, and find all relevant geometries
	for( i in bin ){
		var set = bin[i];

		// filter out countries we don't care about
		var exporterName = set.e.toUpperCase();
		var importerName = set.i.toUpperCase();
		var relevantExport = indexOfArr(exporterName, countries) >= 0;
		var relevantImport = indexOfArr(importerName, countries) >= 0;

		var useExporter = relevantExport;
		var useImporter = relevantImport;

		var categoryName = reverseWeaponLookup[set.wc];
		var relevantExportCategory = relevantExport && indexOfArr(categoryName,exportCategories) >= 0;		
		var relevantImportCategory = relevantImport && indexOfArr(categoryName,importCategories) >= 0;		

		if( (useImporter || useExporter) && (relevantExportCategory || relevantImportCategory) ){
			// we may not have line geometry... (?)
			if( set.lineGeometry === undefined )
				continue;

			var thisLineIsExport = false;

			if(exporterName == selectedCountry.countryName ){
				thisLineIsExport = true;
			}

			var lineColor = thisLineIsExport ? new THREE.Color(exportColor) : new THREE.Color(importColor);

			var lastColor;
			// grab the colors from the vertices
			for( s in set.lineGeometry.vertices ){
				var v = set.lineGeometry.vertices[s];		
				lineColors.push(lineColor);
				lastColor = lineColor;
			}

			// merge it all together
			THREE.GeometryUtils.merge( linesGeo, set.lineGeometry );

			var particleColor = lastColor.clone();		
			var points = set.lineGeometry.vertices;
			var particleCount = Math.floor(set.v / 8000 / set.lineGeometry.vertices.length) + 1;
			particleCount = constrain(particleCount,1,100);
			var particleSize = set.lineGeometry.size;			
			for( var s=0; s<particleCount; s++ ){
				// var rIndex = Math.floor( Math.random() * points.length );
				// var rIndex = Math.min(s,points.length-1);

				var desiredIndex = s / particleCount * points.length;
				var rIndex = constrain(Math.floor(desiredIndex),0,points.length-1);

				var point = points[rIndex];						
				var particle = point.clone();
				particle.moveIndex = rIndex;
				particle.nextIndex = rIndex+1;
				if(particle.nextIndex >= points.length )
					particle.nextIndex = 0;
				particle.lerpN = 0;
				particle.path = points;
				particlesGeo.vertices.push( particle );	
				particle.size = particleSize;
				particleColors.push( particleColor );						
			}			

			if( indexOfArr( exporterName, affectedCountries ) < 0 ){
				affectedCountries.push(exporterName);
			}							

			if( indexOfArr( importerName, affectedCountries ) < 0 ){
				affectedCountries.push(importerName);
			}

			var vb = set.v;
			var exporterCountry = countryData[exporterName];
			if( exporterCountry.mapColor === undefined ){
				exporterCountry.mapColor = vb;
			}
			else{				
				exporterCountry.mapColor += vb;
			}			

			var importerCountry = countryData[importerName];
			if( importerCountry.mapColor === undefined ){
				importerCountry.mapColor = vb;
			}
			else{				
				importerCountry.mapColor += vb;
			}	

			exporterCountry.exportedAmount += vb;
			importerCountry.importedAmount += vb;

			if( exporterCountry == selectedCountry ){				
				selectedCountry.summary.exported[set.wc] += set.v;
				selectedCountry.summary.exported.total += set.v;				
			}		
			if( importerCountry == selectedCountry ){
				selectedCountry.summary.imported[set.wc] += set.v;
				selectedCountry.summary.imported.total += set.v;
			}

			if( importerCountry == selectedCountry || exporterCountry == selectedCountry ){
				selectedCountry.summary.total += set.v;	
			}


		}		
	}

	// console.log(selectedCountry);

	linesGeo.colors = lineColors;	

	// make a final mesh out of this composite
	var splineOutline = new THREE.Line( linesGeo, new THREE.LineBasicMaterial( 
		{ 	color: 0xffffff, opacity: 1.0, blending: 
			THREE.AdditiveBlending, transparent:true, 
			depthWrite: false, vertexColors: true, 
			linewidth: 1 } ) 
	);

	splineOutline.renderDepth = false;


	attributes = {
		size: {	type: 'f', value: [] },
		customColor: { type: 'c', value: [] }
	};

	uniforms = {
		amplitude: { type: "f", value: 1.0 },
		color:     { type: "c", value: new THREE.Color( 0xffffff ) },
		texture:   { type: "t", value: 0, texture: THREE.ImageUtils.loadTexture( "images/particleA.png" ) },
	};

	var shaderMaterial = new THREE.ShaderMaterial( {
		uniforms: 		uniforms,
		attributes:     attributes,
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
		blending: 		THREE.AdditiveBlending,
		depthTest: 		true,
		depthWrite: 	false,
		transparent:	true,
		// sizeAttenuation: true,
	});



	var particleGraphic = THREE.ImageUtils.loadTexture("images/map_mask.png");
	var particleMat = new THREE.ParticleBasicMaterial( { map: particleGraphic, color: 0xffffff, size: 60, 
														blending: THREE.NormalBlending, transparent:true, 
														depthWrite: false, vertexColors: true,
														sizeAttenuation: true } );
	particlesGeo.colors = particleColors;
	var pSystem = new THREE.ParticleSystem( particlesGeo, shaderMaterial );
	pSystem.dynamic = true;
	splineOutline.add( pSystem );

	var vertices = pSystem.geometry.vertices;
	var values_size = attributes.size.value;
	var values_color = attributes.customColor.value;

	for( var v = 0; v < vertices.length; v++ ) {		
		values_size[ v ] = pSystem.geometry.vertices[v].size;
		values_color[ v ] = particleColors[v];
	}

	pSystem.update = function(){	
		// var time = Date.now()
		for( var i in this.geometry.vertices ){						
			var particle = this.geometry.vertices[i];
			var path = particle.path;
			var moveLength = path.length;
			
			particle.lerpN += 0.05;
			if(particle.lerpN > 1){
				particle.lerpN = 0;
				particle.moveIndex = particle.nextIndex;
				particle.nextIndex++;
				if( particle.nextIndex >= path.length ){
					particle.moveIndex = 0;
					particle.nextIndex = 1;
				}
			}

			var currentPoint = path[particle.moveIndex];
			var nextPoint = path[particle.nextIndex];
			

			particle.copy( currentPoint );
			particle.lerpSelf( nextPoint, particle.lerpN );			
		}
		this.geometry.verticesNeedUpdate = true;
	};		

	// return this info as part of the mesh package, we'll use this in
	// selectvisualization
	splineOutline.affectedCountries = affectedCountries;


	return splineOutline;	
}

function selectVisualization( linearData, year, countries, exportCategories, importCategories ){
	// we're only doing one country for now so...
	var cName = countries[0].toUpperCase();
	// $("#hudButtons .countryTextInput").val(cName);
	// document.getElementById("hudButtons").querySelector(".countryTextInput").value
	// = cName;
	previouslySelectedCountry = selectedCountry;
	selectedCountry = countryData[countries[0].toUpperCase()];
    
	selectedCountry.summary = {
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
		historical: getHistoricalData(selectedCountry),
	};

	// console.log(selectedCountry);

	// clear off the country's internally held color data we used from last
	// highlight
	for( var i in countryData ){
		var country = countryData[i];
		country.exportedAmount = 0;
		country.importedAmount = 0;
		country.mapColor = 0;
	}

	// clear markers
	for( var i in selectableCountries ){
		removeMarkerFromCountry( selectableCountries[i] );
	}

	// clear children
	while( visualizationMesh.children.length > 0 ){
		var c = visualizationMesh.children[0];
		visualizationMesh.remove(c);
	}

	// build the mesh
	console.time('getVisualizedMesh');
	var mesh = getVisualizedMesh( timeBins, year, countries, exportCategories, importCategories );				
	console.timeEnd('getVisualizedMesh');

	// add it to scene graph
	visualizationMesh.add( mesh );	


	// alright we got no data but at least highlight the country we've selected
	if( mesh.affectedCountries.length == 0 ){
		mesh.affectedCountries.push( cName );
	}	

	for( var i in mesh.affectedCountries ){
		var countryName = mesh.affectedCountries[i];
		var country = countryData[countryName];
		attachMarkerToCountry( countryName, country.mapColor );
	}

	// console.log( mesh.affectedCountries );
	highlightCountry( mesh.affectedCountries );

	if( previouslySelectedCountry !== selectedCountry ){
		if( selectedCountry ){
			rotateTargetX = selectedCountry.lat * Math.PI/180;
			var targetY0 = -(selectedCountry.lon - 9) * Math.PI / 180;
            var piCounter = 0;
			while(true) {
                var targetY0Neg = targetY0 - Math.PI * 2 * piCounter;
                var targetY0Pos = targetY0 + Math.PI * 2 * piCounter;
                if(Math.abs(targetY0Neg - rotating.rotation.y) < Math.PI) {
                    rotateTargetY = targetY0Neg;
                    break;
                } else if(Math.abs(targetY0Pos - rotating.rotation.y) < Math.PI) {
                    rotateTargetY = targetY0Pos;
                    break;
                }
                piCounter++;
                rotateTargetY = wrap(targetY0, -Math.PI, Math.PI);
			}
            // console.log(rotateTargetY);
            // lines commented below source of rotation error
			// is there a more reliable way to ensure we don't rotate around the globe
			// too much?
			/*
			 * if( Math.abs(rotateTargetY - rotating.rotation.y) > Math.PI )
			 * rotateTargetY += Math.PI;
			 */
			rotateVX *= 0.6;
			rotateVY *= 0.6;		
		}	
	}
    
    // d3Graphs.initGraphs();
}






var globeRadius = 1000;
var vec3_origin = new THREE.Vector3(0,0,0);

function makeConnectionLineGeometry( exporter, importer, value, type ){
	if( exporter.countryName == undefined || importer.countryName == undefined )
		return undefined;

	// console.log("making connection between " + exporter.countryName + " and " +
	// importer.countryName + " with code " + type );

	var distanceBetweenCountryCenter = exporter.center.clone().subSelf(importer.center).length();		

	// how high we want to shoot the curve upwards
	var anchorHeight = globeRadius + distanceBetweenCountryCenter * 0.7;

	// start of the line
	var start = exporter.center;

	// end of the line
	var end = importer.center;
	
	// midpoint for the curve
	var mid = start.clone().lerpSelf(end,0.5);		
	var midLength = mid.length()
	mid.normalize();
	mid.multiplyScalar( midLength + distanceBetweenCountryCenter * 0.7 );			

	// the normal from start to end
	var normal = (new THREE.Vector3()).sub(start,end);
	normal.normalize();

	/*
	 * The curve looks like this:
	 * 
	 * midStartAnchor---- mid ----- midEndAnchor / \ / \ / \ start/anchor
	 * end/anchor
	 * 
	 * splineCurveA splineCurveB
	 */

	var distanceHalf = distanceBetweenCountryCenter * 0.5;

	var startAnchor = start;
	var midStartAnchor = mid.clone().addSelf( normal.clone().multiplyScalar( distanceHalf ) );					
	var midEndAnchor = mid.clone().addSelf( normal.clone().multiplyScalar( -distanceHalf ) );
	var endAnchor = end;

	// now make a bezier curve out of the above like so in the diagram
	var splineCurveA = new THREE.CubicBezierCurve3( start, startAnchor, midStartAnchor, mid);											
	// splineCurveA.updateArcLengths();

	var splineCurveB = new THREE.CubicBezierCurve3( mid, midEndAnchor, endAnchor, end);
	// splineCurveB.updateArcLengths();

	// how many vertices do we want on this guy? this is for *each* side
	var vertexCountDesired = Math.floor( /* splineCurveA.getLength() */ distanceBetweenCountryCenter * 0.02 + 6 ) * 2;	

	// collect the vertices
	var points = splineCurveA.getPoints( vertexCountDesired );

	// remove the very last point since it will be duplicated on the next half of
	// the curve
	points = points.splice(0,points.length-1);

	points = points.concat( splineCurveB.getPoints( vertexCountDesired ) );

	// add one final point to the center of the earth
	// we need this for drawing multiple arcs, but piled into one geometry buffer
	points.push( vec3_origin );

	var val = value * 0.0003;
	
	var size = (10 + Math.sqrt(val));
	size = constrain(size,0.1, 60);

	// create a line geometry out of these
  var curveGeometry = new THREE.Geometry();
  for( var i = 0; i < points.length; i ++ ) {
  	curveGeometry.vertices.push( points[i] );
  }
	curveGeometry.size = size;

	return curveGeometry;
}

function constrain(v, min, max){
	if( v < min )
		v = min;
	else
	if( v > max )
		v = max;
	return v;
}





var markers = [];

function onMarkerHover( event ){
	var hx = event.clientX - window.innerWidth * 0.5;
	var hy = event.clientY - window.innerHeight * 0.5;
	var dx = mouseX - hx;
	var dy = mouseY - hy;
	var d = Math.sqrt( dx * dx + dy * dy );
	// if( event.target.style.visibility == 'visible' )
	// console.log('clicked on something!!');
}

function attachMarkerToCountry( countryName, importance ){
	// look up the name to mesh
	countryName = countryName.toUpperCase();
	var country = countryData[countryName];
	if( country === undefined )
		return;

	var container = document.getElementById( 'visualization' );	
	var template = document.getElementById( 'marker_template' );
	var marker = template.cloneNode(true);

	country.marker = marker;
	container.appendChild( marker );

	marker.countryName = countryName;

	marker.importance = importance;
	marker.selected = false;
	marker.hover = false;
    if( countryName === selectedCountry.countryName.toUpperCase() )
		marker.selected = true;

	marker.setPosition = function(x,y,z){
		this.style.left = x + 'px';
		this.style.top = y + 'px';	
		this.style.zIndex = z;
	}

	marker.setVisible = function( vis ){
		if( ! vis )
			this.style.display = 'none';
		else{
			this.style.display = 'inline';
		}
	}
    var countryLayer = marker.querySelector( '#countryText');
    marker.countryLayer = countryLayer;
	var detailLayer = marker.querySelector( '#detailText' );
	marker.detailLayer = detailLayer;
    // marker.jquery = $(marker);
	marker.setSize = function( s ){
	    var detailSize = Math.floor(2 + s * 0.5);	
		this.detailLayer.style.fontSize = detailSize + 'pt';
        var totalHeight = detailSize * 2;
		this.style.fontSize = totalHeight * 1.125 + 'pt';
		if(detailSize <= 8) {
            this.countryLayer.style.marginTop = "0px";  
		} else {
		    this.countryLayer.style.marginTop = "-1px";
		}
	}

	marker.update = function(){
		var matrix = rotating.matrixWorld;
		var abspos = matrix.multiplyVector3( country.center.clone() );
		var screenPos = screenXY(abspos);			

		var s = 0.3 + camera.scale.z * 1;
		var importanceScale = this.importance / 5000000;
		importanceScale = constrain( importanceScale, 0, 18 );
		s += importanceScale;

		if( this.tiny )
			s *= 0.75;

		if( this.selected )
			s = 30;

		if( this.hover )
			s = 15;
		
		this.setSize( s ); 

		// if( this.selected )
			// this.setVisible( true )
		// else
			this.setVisible( ( abspos.z > 60 ) && s > 3 );	

		var zIndex = Math.floor( 1000 - abspos.z + s );
		if( this.selected || this.hover )
			zIndex = 10000;

		this.setPosition( screenPos.x, screenPos.y, zIndex );	
	}

	var nameLayer = marker.querySelector( '#countryText' );		

	// right now, something arbitrary like 10 mil dollars or more to be
	// highlighted
	var tiny = (importance < 20000000) && (!marker.selected);	
	marker.tiny = tiny;

	// if( tiny )
	// nameLayer.innerHTML = country.countryCode;
	// else
		nameLayer.innerHTML = countryName.replace(' ','&nbsp;');	

	// marker.nameLayer = nameLayer;
	// marker.nameLayerText = countryName;
	// marker.nameLayerShorten = country.countryCode;;
	
	var importExportText = "";
	if(country.exportedAmount > 0 && country.importedAmount > 0) {
	   importExportText += "imported:&nbsp;$" + numberWithCommas(country.importedAmount) + "<br />" +
	       "exported:&nbsp;$"+numberWithCommas(country.exportedAmount);
	} else if(country.exportedAmount > 0 && country.importedAmount == 0) {
	   importExportText += "exported:&nbsp;$"+numberWithCommas(country.exportedAmount)+"<br />&nbsp;";
	} else if(country.exportedAmount == 0 && country.importedAmount > 0) {
	   importExportText += "imported:&nbsp;$"+numberWithCommas(country.importedAmount)+"<br />&nbsp;";
	}

	marker.importExportText = importExportText;


	var markerOver = function(e){
		this.detailLayer.innerHTML = importExportText;
		this.hover = true;
	}

	var markerOut = function(e){
		this.detailLayer.innerHTML = "";
		this.hover = false;
	}

	if( !tiny ) {		
		detailLayer.innerHTML = importExportText;
	}
	else{
		marker.addEventListener( 'mouseover', markerOver, false );
		marker.addEventListener( 'mouseout', markerOut, false );
	}


	var markerSelect = function(e){
		var selection = selectionData;
		selectVisualization( timeBins, selection.selectedYear, [this.countryName], selection.getExportCategories(), selection.getImportCategories() );	
	};
	marker.addEventListener('click', markerSelect, true);

	markers.push( marker );
}		

function removeMarkerFromCountry( countryName ){
	countryName = countryName.toUpperCase();
	var country = countryData[countryName];
	if( country === undefined )
		return;
	if( country.marker === undefined )
		return;

	var index = markers.indexOf(country.marker);
	if( index >= 0 )
		markers.splice( index, 1 );
	var container = document.getElementById( 'visualization' );		
	container.removeChild( country.marker );
	country.marker = undefined;		
}





var masterContainer = document.getElementById('visualization');

var overlay = document.getElementById('visualization');

var mapIndexedImage;
var mapOutlineImage;

var glContainer = document.getElementById('glContainer');

// var isoFile = 'country_iso3166.json';
// var latlonFile = 'country_lat_lon.json'

var camera, scene, renderer, controls;

var pinsBase, pinsBaseMat;
var lookupCanvas
var lookupTexture;
var backTexture;
var worldCanvas;
var sphere;
var rotating;	
var visualizationMesh;							
var mapUniforms;
// var timeBins;
// var latlonData;
var countryData = new Object();		
// var countryLookup;
var selectableYears = [];
var selectableCountries = [];			    
var weaponLookup = {
	'Military Weapons' 		: 'mil',
	'Civilian Weapons'		: 'civ',
	'Ammunition'			: 'ammo',
};
var reverseWeaponLookup = new Object();
for( var i in weaponLookup ){
	var name = i;
	var code = weaponLookup[i];
	reverseWeaponLookup[code] = name;
}	    	
var categoryColors = {
	'mil' : 0xdd380c,
	'civ' : 0x3dba00,
	'ammo' : 0x154492,
}
var exportColor = 0xdd380c;
var importColor = 0x154492;
var selectedCountry = null;
var previouslySelectedCountry = null;
var selectionData;
var idle = false;
var assetList = [];

var controllers = {
	speed: 			3,							
	multiplier: 	0.5,
	backgroundColor:"#000000",
	zoom: 			1,
	spin: 			0,
	transitionTime: 2000,
};

function start(e){	
// if ( ! Detector.webgl ) {
// Detector.addGetWebGLMessage();
// }
// else{
		mapIndexedImage = new Image();
		mapIndexedImage.src = 'images/map_indexed.png';
		mapIndexedImage.onload = function() {
			mapOutlineImage = new Image();
			mapOutlineImage.src = 'images/map_outline.png';
			mapOutlineImage.onload = function(){
// loadCountryCodes(
// function(){
// loadWorldPins(
// function(){
// loadContentData(
// function(){
// initScene();
// animate();
// }
// );
// }
// );
// }
// );
				initScene();
				animate();
			};			
		};		
	};
// }
var Selection = function(){
	this.selectedYear = '2010';
	this.selectedCountry = 'CHINA';

	this.exportCategories = new Object();
	this.importCategories = new Object();
	for( var i in weaponLookup ){
		this.exportCategories[i] = true;
		this.importCategories[i] = true;
	}				

	this.getExportCategories = function(){
		var list = [];
		for( var i in this.exportCategories ){
			if( this.exportCategories[i] )
				list.push(i);
		}
		return list;
	}		

	this.getImportCategories = function(){
		var list = [];
		for( var i in this.importCategories ){
			if( this.importCategories[i] )
				list.push(i);
		}
		return list;
	}
};
function initScene() {
	scene = new THREE.Scene();
	scene.matrixAutoUpdate = false;		

	light1 = new THREE.SpotLight(0xeeeeee, 3);
	light1.position.x = 730; 
	light1.position.y = 520;
	light1.position.z = 626;
	light1.castShadow = true;
	scene.add(light1);

	light2 = new THREE.PointLight(0x222222, 14.8);
	light2.position.x = -640;
	light2.position.y = -500;
	light2.position.z = -1000;
	scene.add( light2 );				

	rotating = new THREE.Object3D();
	scene.add(rotating);

	lookupCanvas = document.createElement('canvas');	
	lookupCanvas.width = 256;
	lookupCanvas.height = 1;
	
	lookupTexture = new THREE.Texture( lookupCanvas );
	lookupTexture.magFilter = THREE.NearestFilter;
	lookupTexture.minFilter = THREE.NearestFilter;
	lookupTexture.needsUpdate = true;

// var indexedMapTexture = new THREE.Texture( mapIndexedImage );
// // THREE.ImageUtils.loadTexture( 'images/map_indexed.png' );
// indexedMapTexture.needsUpdate = true;
// indexedMapTexture.magFilter = THREE.NearestFilter;
// indexedMapTexture.minFilter = THREE.NearestFilter;
// var outlinedMapTexture = new THREE.Texture( mapOutlineImage );
// outlinedMapTexture.needsUpdate = true;
	var uniforms = {
		// 'mapIndex': { type: 't', value: 0, texture: indexedMapTexture },
		// 'lookup': { type: 't', value: 1, texture: lookupTexture },
		// 'outline': { type: 't', value: 2, texture: outlinedMapTexture },
		'outlineLevel': {type: 'f', value: 1 }
	};
	mapUniforms = uniforms;

	var shaderMaterial = new THREE.ShaderMaterial({
		uniforms: uniforms,
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

	sphere = new THREE.Mesh( new THREE.SphereGeometry( 100, 40, 40 ), shaderMaterial );				
	sphere.doubleSided = false;
	sphere.rotation.x = Math.PI;				
	sphere.rotation.y = -Math.PI/2;
	sphere.rotation.z = Math.PI;
	sphere.id = "base";	
	rotating.add( sphere );	
	for(var i in timeBins) {					
		var bin = timeBins[i].data;
		for(var s in bin) {
			var set = bin[s];
			var exporterName = set.e.toUpperCase();
			var importerName = set.i.toUpperCase();
			if(indexOfArr(exporterName, selectableCountries) < 0)
				selectableCountries.push( exporterName );
			if(indexOfArr(importerName, selectableCountries) < 0)
				selectableCountries.push( importerName );
		}
	}
	loadGeoData( latlonData );				
	buildDataVizGeometries(timeBins);
	visualizationMesh = new THREE.Object3D();
	rotating.add(visualizationMesh);	
	buildGUI();
	selectVisualization(
	  timeBins,
	  '2010',
	  // ['CHINA'],
	  ['UNITED STATES'],
	  ['Military Weapons','Civilian Weapons', 'Ammunition'],
	  ['Military Weapons','Civilian Weapons', 'Ammunition']
	);					
	renderer = new THREE.WebGLRenderer({antialias:false});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.autoClear = false;
	renderer.sortObjects = false;		
	renderer.generateMipmaps = false;					
	glContainer.appendChild(renderer.domElement);									
	document.addEventListener('mousemove', onDocumentMouseMove, true);
	document.addEventListener('windowResize', onDocumentResize, false);
	document.addEventListener('mousedown', onDocumentMouseDown, true);	
	document.addEventListener('mouseup', onDocumentMouseUp, false);	
	masterContainer.addEventListener('click', onClick, true);	
	masterContainer.addEventListener('mousewheel', onMouseWheel, false);
	masterContainer.addEventListener('DOMMouseScroll', function(e){
    var evt=window.event || e;
  	onMouseWheel(evt);
	}, false);
	document.addEventListener( 'keydown', onKeyDown, false);												    			    	
  camera = new THREE.PerspectiveCamera(12, window.innerWidth / window.innerHeight, 1, 20000); 		        
	camera.position.z = 1400;
	camera.position.y = 0;
	camera.lookAt(scene.width/2, scene.height/2);	
	scene.add(camera);
	var windowResize = THREEx.WindowResize(renderer, camera)		
}
function animate() {	
	if( rotateTargetX !== undefined && rotateTargetY !== undefined ){
		rotateVX += (rotateTargetX - rotateX) * 0.012;
		rotateVY += (rotateTargetY - rotateY) * 0.012;
		if( Math.abs(rotateTargetX - rotateX) < 0.1 && Math.abs(rotateTargetY - rotateY) < 0.1 ){
			rotateTargetX = undefined;
			rotateTargetY = undefined;
		}
	}
	rotateX += rotateVX;
	rotateY += rotateVY;
	rotateVX *= 0.98;
	rotateVY *= 0.98;
	if(dragging || rotateTargetX !== undefined ){
		rotateVX *= 0.6;
		rotateVY *= 0.6;
	}	     
	rotateY += controllers.spin * 0.01;
	if(rotateX < -rotateXMax){
		rotateX = -rotateXMax;
		rotateVX *= -0.95;
	}
	if(rotateX > rotateXMax){
		rotateX = rotateXMax;
		rotateVX *= -0.95;
	}
	// TWEEN.update();
	rotating.rotation.x = rotateX;
	rotating.rotation.y = rotateY;
  render();
  requestAnimationFrame( animate );
	THREE.SceneUtils.traverseHierarchy( rotating, 
		function(mesh) {
			if (mesh.update !== undefined) {
				mesh.update();
			} 
		}
	);	
	for( var i in markers ){
		var marker = markers[i];
		marker.update();
	}		    	
}
function render() {	
	renderer.clear();		    				
  renderer.render( scene, camera );				
}		   
function findCode(countryName){
	countryName = countryName.toUpperCase();
	for( var i in countryLookup ) {
		if( countryLookup[i] === countryName )
			return i;
	}
	return 'not found';
}
var countryColorMap = {'PE':1,
'BF':2,'FR':3,'LY':4,'BY':5,'PK':6,'ID':7,'YE':8,'MG':9,'BO':10,'CI':11,'DZ':12,'CH':13,'CM':14,'MK':15,'BW':16,'UA':17,
'KE':18,'TW':19,'JO':20,'MX':21,'AE':22,'BZ':23,'BR':24,'SL':25,'ML':26,'CD':27,'IT':28,'SO':29,'AF':30,'BD':31,'DO':32,'GW':33,
'GH':34,'AT':35,'SE':36,'TR':37,'UG':38,'MZ':39,'JP':40,'NZ':41,'CU':42,'VE':43,'PT':44,'CO':45,'MR':46,'AO':47,'DE':48,'SD':49,
'TH':50,'AU':51,'PG':52,'IQ':53,'HR':54,'GL':55,'NE':56,'DK':57,'LV':58,'RO':59,'ZM':60,'IR':61,'MM':62,'ET':63,'GT':64,'SR':65,
'EH':66,'CZ':67,'TD':68,'AL':69,'FI':70,'SY':71,'KG':72,'SB':73,'OM':74,'PA':75,'AR':76,'GB':77,'CR':78,'PY':79,'GN':80,'IE':81,
'NG':82,'TN':83,'PL':84,'NA':85,'ZA':86,'EG':87,'TZ':88,'GE':89,'SA':90,'VN':91,'RU':92,'HT':93,'BA':94,'IN':95,'CN':96,'CA':97,
'SV':98,'GY':99,'BE':100,'GQ':101,'LS':102,'BG':103,'BI':104,'DJ':105,'AZ':106,'MY':107,'PH':108,'UY':109,'CG':110,'RS':111,'ME':112,'EE':113,
'RW':114,'AM':115,'SN':116,'TG':117,'ES':118,'GA':119,'HU':120,'MW':121,'TJ':122,'KH':123,'KR':124,'HN':125,'IS':126,'NI':127,'CL':128,'MA':129,
'LR':130,'NL':131,'CF':132,'SK':133,'LT':134,'ZW':135,'LK':136,'IL':137,'LA':138,'KP':139,'GR':140,'TM':141,'EC':142,'BJ':143,'SI':144,'NO':145,
'MD':146,'LB':147,'NP':148,'ER':149,'US':150,'KZ':151,'AQ':152,'SZ':153,'UZ':154,'MN':155,'BT':156,'NC':157,'FJ':158,'KW':159,'TL':160,'BS':161,
'VU':162,'FK':163,'GM':164,'QA':165,'JM':166,'CY':167,'PR':168,'PS':169,'BN':170,'TT':171,'CV':172,'PF':173,'WS':174,'LU':175,'KM':176,'MU':177,
'FO':178,'ST':179,'AN':180,'DM':181,'TO':182,'KI':183,'FM':184,'BH':185,'AD':186,'MP':187,'PW':188,'SC':189,'AG':190,'BB':191,'TC':192,'VC':193,
'LC':194,'YT':195,'VI':196,'GD':197,'MT':198,'MV':199,'KY':200,'KN':201,'MS':202,'BL':203,'NU':204,'PM':205,'CK':206,'WF':207,'AS':208,'MH':209,
'AW':210,'LI':211,'VG':212,'SH':213,'JE':214,'AI':215,'MF_1_':216,'GG':217,'SM':218,'BM':219,'TV':220,'NR':221,'GI':222,'PN':223,'MC':224,'VA':225,
'IM':226,'GU':227,'SG':228};

function highlightCountry( countries ){	
// var countryCodes = [];
// for( var i in countries ){
// var code = findCode(countries[i]);
// countryCodes.push(code);
// }
// var ctx = lookupCanvas.getContext('2d');
// ctx.clearRect(0,0,256,1);
// var pickMask = countries.length == 0 ? 0 : 1;
// var oceanFill = 10 * pickMask;
// ctx.fillStyle = 'rgb(' + oceanFill + ',' + oceanFill + ',' + oceanFill +')';
// ctx.fillRect( 0, 0, 1, 1 );
// var selectedCountryCode = selectedCountry.countryCode;
// for( var i in countryCodes ){
// var countryCode = countryCodes[i];
// var colorIndex = countryColorMap[ countryCode ];
// var mapColor = countryData[countries[i]].mapColor;
// var fillCSS = '#333333';
// if( countryCode === selectedCountryCode )
// fillCSS = '#eeeeee'
// ctx.fillStyle = fillCSS;
// ctx.fillRect( colorIndex, 0, 1, 1 );
// }
// lookupTexture.needsUpdate = true;
}
function getHistoricalData( country ){
	var history = [];	
	var countryName = country.countryName;
	var exportCategories = selectionData.getExportCategories();
	var importCategories = selectionData.getImportCategories();
	for( var i in timeBins ){
		var yearBin = timeBins[i].data;		
		var value = {imports: 0, exports:0};
		for( var s in yearBin ){
			var set = yearBin[s];
			var categoryName = reverseWeaponLookup[set.wc];
			var exporterCountryName = set.e.toUpperCase();
			var importerCountryName = set.i.toUpperCase();			
			var relevantCategory = ( countryName == exporterCountryName && indexOfArr(categoryName, exportCategories ) >= 0 ) || ( countryName == importerCountryName && indexOfArr(categoryName, importCategories ) >= 0 );				
			if( relevantCategory == false )
				continue;
			if( countryData[exporterCountryName] === undefined || countryData[importerCountryName] === undefined )
				continue;
			if( exporterCountryName == countryName )
				value.exports += set.v;
			if( importerCountryName == countryName )
				value.imports += set.v;
		}
		history.push(value);
	}
	return history;
}
function getPickColor(){
	var affectedCountries = undefined;
	if( visualizationMesh.children[0] !== undefined )
		affectedCountries = visualizationMesh.children[0].affectedCountries;
	highlightCountry([]);
	rotating.remove(visualizationMesh);
	mapUniforms['outlineLevel'].value = 0;
	lookupTexture.needsUpdate = true;
	renderer.autoClear = false;
	renderer.autoClearColor = false;
	renderer.autoClearDepth = false;
	renderer.autoClearStencil = false;	
	renderer.preserve
  renderer.clear();
  renderer.render(scene,camera);
  var gl = renderer.context;
  gl.preserveDrawingBuffer = true;
	var mx = ( mouseX + renderer.context.canvas.width/2 );
	var my = ( -mouseY + renderer.context.canvas.height/2 );
	mx = Math.floor( mx );
	my = Math.floor( my );
	var buf = new Uint8Array( 4 );		    	
	gl.readPixels( mx, my, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf );
	renderer.autoClear = true;
	renderer.autoClearColor = true;
	renderer.autoClearDepth = true;
	renderer.autoClearStencil = true;
	gl.preserveDrawingBuffer = false;	
	mapUniforms['outlineLevel'].value = 1;
	rotating.add(visualizationMesh);
	if( affectedCountries !== undefined ){
		highlightCountry(affectedCountries);
	}
	return buf[0]; 	
}

function buildGUI(){	
	var selection = new Selection();
	selectionData = selection;
    /*
		 * var updateVisualization = function(){ selectVisualization( timeBins,
		 * selection.selectedYear, [selection.selectedCountry],
		 * selection.getExportCategories(), selection.getImportCategories() ); }
		 * 
		 * var changeFunction = function(v){ updateVisualization(); }
		 * 
		 * var categoryFunction = function(v){ updateVisualization(); }
		 * 
		 * var gui = new dat.GUI(); var c = gui.add( selection, 'selectedYear',
		 * selectableYears ); c.onFinishChange( changeFunction );
		 * 
		 * c = gui.add( selection, 'selectedCountry', selectableCountries );
		 * c.onFinishChange( changeFunction ); // c = gui.add( selection,
		 * 'showExports' ); // c.onFinishChange( filterFunction ); // c = gui.add(
		 * selection, 'showImports' ); // c.onFinishChange( filterFunction );
		 * 
		 * var catFilterExports = gui.addFolder('Exports'); for( var i in
		 * selection.exportCategories ){ var catSwitch =
		 * selection.exportCategories[i]; c = catFilterExports.add(
		 * selection.exportCategories, i ); c.onFinishChange( categoryFunction ); }
		 * 
		 * var catFilterImports = gui.addFolder('Imports'); for( var i in
		 * selection.importCategories ){ var catSwitch =
		 * selection.importCategories[i]; c = catFilterImports.add(
		 * selection.importCategories, i ); c.onFinishChange( categoryFunction ); }
		 * gui.close();
		 */
}
function loadGeoData( latlonData ){
  // -----------------------------------------------------------------------------
  // Load the world geo data json, per country
var sphereRad = 1;				
var rad = 100;

// iterate through each set of country pins
for ( var i in latlonData.countries ) {										
	var country = latlonData.countries[i];	
	
	// can we even find the country in the list?
	// if( countryLookup[country.n.toUpperCase()] === undefined ){
	// console.log('could not find country that has country code: ' + country.n)
	// continue;
	// }

	// save out country name and code info
	country.countryCode = i;
	country.countryName = countryLookup[i];			

	// take the lat lon from the data and convert this to 3d globe space
      var lon = country.lon - 90;
      var lat = country.lat;
      
      var phi = Math.PI/2 - lat * Math.PI / 180 - Math.PI * 0.01;
      var theta = 2 * Math.PI - lon * Math.PI / 180 + Math.PI * 0.06;
	
	var center = new THREE.Vector3();                
      center.x = Math.sin(phi) * Math.cos(theta) * rad;
      center.y = Math.cos(phi) * rad;
      center.z = Math.sin(phi) * Math.sin(theta) * rad;  	

	// save and catalogue
	country.center = center;
	countryData[country.countryName] = country;	
}		

// console.log(countryData);
}					

// convenience function to get the country object by name
function getCountry(name){
return countryData[name.toUpperCase()]
}

function indexOfArr(C, arr) {
	if(!arr) return -1;
	for (var B = 0, A = arr.length; B < A; B++) {
		if (arr[B] == C) {
			return B;
		}
	}
	return -1;
}



















start();