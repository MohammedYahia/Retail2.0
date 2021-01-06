var TreeBuilder = (function() {
	var settings,
		saveForLater = [],
		nodeSize = 1,
		siblingDistance = 0,
		treeDistance = 0,
		objData = {}, hiddenObjData = [], hiddenBranchData = [],
		nodeLevelMap = {}, nodeLevelMap_lo = {},
		maxHeight = 0, maxWidth = 0,
		backupStyle = "", direction, hybrid,
		jspInstance, node_spacing,
		max_nodes = 8,
		zoom_threshold = 0.4,
		root;

	function TreeObject(id, rtId, parentId, layout, hidden) {
		this.id 		= id;
		this.rtId 		= rtId;
		this.parentId 	= parentId;
		this.layout 	= layout;
		this.hidden 	= hidden;
		this.switchInd  = false;
		this.parentSwitch = false;
		this.index 		= 0;
		this.depth 		= 0;
		this.childWidth = 0;
		this.X 			= -1;
		this.Y 			= 0;
		this.X_lo		= -1;
		this.Y_lo		= 0;
		this.mod 		= 0;
		this.parentNode = null;
		this.childNodes = [];
		this.allChildNodes = [];

		this.ifLeftMost = function() {
			return this.index == 0;
		};
		this.getLeftMostSibling = function() {
			return this.parentNode == null ? null : this.parentNode.childNodes[0];
		};
		this.getPreviousSibling = function() {
			return this.index > 0 ? this.parentNode.childNodes[this.index-1] : null;
		};
		this.getNextSibling = function() {
			return this.index < this.parentNode.childNodes.length - 1 ? this.parentNode.childNodes[this.index+1] : null;
		};
		this.getSiblings = function() {
			return this.parentNode == null ? null : this.parentNode.childNodes;
		}
		this.isLeaf = function() {
			return this.childNodes.length == 0;
		};


		this.addChild = function(obj) {
			this.allChildNodes.push(obj)
			if (obj.hidden !== true) {
				this.childNodes.push(obj)
				$("#" + this.rtId).addClass("hasChildren")
				obj.parentNode = this;
				$("#" + obj.rtId).addClass("hasParent")
				obj.index = this.childNodes.length - 1;

				this.updateDepth();
				//obj.updateChildWidth();

				return this.childNodes.length;				
			} else {
				//_setToggleStateToShow( $("#" + this.rtId));
			}
			return this.childNodes.length;				
		}

		this.updateChildWidth = function() {
			//update parents max width...
			var nodeIndex = this.index;
			if (this.parentNode == null || this.getSwitchInd())
				return;

			if (nodeIndex > this.parentNode.childWidth) {
				this.parentNode.childWidth = nodeIndex;
				var tmpNode = this.parentNode;
				while (( tmpNode = tmpNode.parentNode ) != null ) {
					if (nodeIndex > tmpNode.childWidth ) {
						tmpNode.childWidth = nodeIndex;
					}
				}
			}
		}

		this.updateDepth = function() {
			//increment the depth for this and all parents if it is the first child...
			if (this.childNodes.length == 1){
				this.depth++;
				var tmpNode = this;
				while ( (tmpNode = tmpNode.parentNode) != null) {
					tmpNode.depth++;
				}
			}
		}

		this.setSwitchInd = function(ind) {
			this.switchInd = ind;
			var parentSiblings = this.parentNode.getSiblings();
			$(parentSiblings).each(function(i,o) {
				o.parentSwitch = ind;
			})
		}
		this.getSwitchInd = function() {
			return hybrid && this.switchInd;
		}

		this.getParentSwitchInd = function() {
			return hybrid && this.parentSwitch;
		}
	} 
	
	function _getTreeContainer() {
		return $("#" + settings.id + "_treeContainer");
	}


	function _setToggleStateToShow( $node ) {
		$node.find(".toggle")
			.data("state", "hidden")
	}
	function _setToggleStateToHide( $node ) {
		$node.find(".toggle")
			.data("state", "shown")
	}

	
	function _buildObjectData() {
		objData = [];
		allChildNodes = [];
		nodeLevelMap = [];

		$(".node").each(function(i,o) {
			var id 			= $(this).data("id");
			var rtId 		= $(this).attr("id");
			var parentId 	= $(this).data("parentId");
			var layout 		= $(this).data("layout");
			var hidden 		= hiddenObjData.indexOf(rtId) >= 0 || hiddenBranchData.indexOf(rtId) >= 0;

			var obj 		= new TreeObject(id, rtId, parentId, layout, hidden);
			objData["" + id]= obj;

			if (hidden == true) {
				$("#" + rtId).hide()
			} else {
				$("#" + rtId).show()
			}
	
			//lets see if there is a parent, and add as child...
			var parent = objData[parentId]
			if (parent != null) {
				parent.addChild( obj )
			} else {
				saveForLater.push( obj );
			}
		});

		//resolve any unresolved child nodes...
		while( saveForLater.length > 0) { 
			var tmpSaveForLater = [];
			$(saveForLater).each(function(i,obj) {
				var parentId = obj.parentId;
				if (parentId > 0 || parentId.length > 0) {
					var parent = objData[parentId];
					if (parent != null) {
						parent.addChild( obj )
					}
					else {
						tmpSaveForLater.push( obj )
					}
				} else {
					root = obj;
				}
			})
			saveForLater = tmpSaveForLater;		
		}
	}


	function _addNodeLevelLookup(node, y) {
		var nodesAtLevel = nodeLevelMap[y] || [];
		nodesAtLevel.push(node);
		nodeLevelMap[y] = nodesAtLevel;

		if (nodesAtLevel.length > max_nodes) {
			$(nodesAtLevel).each(function(i,o) {
				o.setSwitchInd(true);
			})
		}
	}

	function _addNodeLevelLookup_lo(node, y) {
		var nodesAtLevel = nodeLevelMap_lo[y] || [];
		nodesAtLevel.push(node);
		nodeLevelMap_lo[y] = nodesAtLevel;
	}

	function _getNodesAtLevel(level) {
		return nodeLevelMap[level]
	}

	function _getNodesAtLevel_lo(level) {
		return nodeLevelMap_lo[level];
	}

	function _getLeftContour(node, modSum, values) {
		if (values[node.Y] == null) {
			values[node.Y] = node.X + modSum;
		} else if (node.getSwitchInd())  {
			values[node.Y] = 0;
		} else {
			values[node.Y] = Math.min(values[node.Y], node.X + modSum);
		}
		modSum += node.mod;
		$(node.childNodes).each(function(i,o) {
			_getLeftContour(o, modSum, values)
		})
	}

	function _getRightContour(node, modSum, values) {
		if (values[node.Y] == null ) {
			values[node.Y] = node.X + modSum;
		} else if (node.getSwitchInd())  {
			values[node.Y] = 0;
		} else {
			values[node.Y] = Math.max(values[node.Y], node.X + modSum);
		}
		modSum += node.mod;
		$(node.childNodes).each(function(i,o) {
			_getRightContour(o, modSum, values)
		})
	}

	function _getMaxOfArray(numArray) {
		return Math.max.apply(null, numArray);
	}

	function _getMinOfArray(numArray) {
		return Math.min.apply(null, numArray);
	}

	function _getMaxHeight(nodeArray) {
		var nodeHeights = [];
		for( var i = 0; i < nodeArray.length; i++) {
			nodeHeights.push($("#" + nodeArray[i].rtId).outerHeight())
		}
		//make sure height calc is atleast 100px
		return Math.max(100, _getMaxOfArray(nodeHeights))
	}

	function _getKeys(objArray) {
		var objKeys = [];
		for (var key in objArray) {
			if(objArray.hasOwnProperty(key)) {
				objKeys.push(key)
			}
		}		
		return objKeys;
	}

	function _centerNodesBetween(leftNode, rightNode) {
		var leftIndex = leftNode.index;
		var rightIndex = rightNode.index;
		var numNodesBetween = (rightIndex - leftIndex) - 1;
		if (numNodesBetween > 0) {
			var distanceBetweenNodes = (leftNode.X - rightNode.X) / (numNodesBetween + 1)
			var count = 1;
			for (var i = leftIndex + 1; i < rightIndex; i++) {
				var middleNode = leftNode.parentNode.childNodes[i];
				var desiredX = rightNode.X + (distanceBetweenNodes * count);
				var offset = desiredX - middleNode.X ;
				middleNode.X += offset;
				middleNode.mod += offset;
				count++;
			}
			_checkForConflicts(leftNode)
		}
	}

	function _checkForConflicts(node) {
		var minDistance = treeDistance + nodeSize;
		var shiftValue = 0;

		var nodeContour = {};
		_getLeftContour(node, 0, nodeContour);

		var sibling = node.getLeftMostSibling();
		while (sibling != null && sibling != node) {
			var siblingContour = {};
			_getRightContour(sibling, 0, siblingContour)

			var siblingContourKeys = _getKeys(siblingContour);
			var nodeContourKeys		= _getKeys(nodeContour);

			for (var level = node.Y + 1; level <= Math.min(_getMaxOfArray(siblingContourKeys), _getMaxOfArray(nodeContourKeys)); level++) {
				var distance = nodeContour[level] - siblingContour[level];
				if (distance + shiftValue < minDistance) {
					shiftValue = Math.max( (minDistance - distance) ,shiftValue)
				}
			}
			if (shiftValue > 0) {
				node.X += shiftValue;
				node.mod += shiftValue;
				_centerNodesBetween(node, sibling);
				shiftValue = 0;
			} 
			if (node.getSwitchInd()) {
				node.mod = 0;
			}
			sibling = sibling.getNextSibling();
		}
	}


	function _initialiseNodes(node, depth) {
		node.X = -1;
		//see if any children are layout type 1
		var anyFloats = false;
		$(node.childNodes).each(function(i,o){
			if (o.layout == "1")
				anyFloats = true;				
		})
		node.Y = node.layout == "1" ? depth - 1.25 : depth;
		_addNodeLevelLookup(node, node.Y)
		
		node.mod = 0;
		depth = anyFloats ? depth + 0.75 : depth;
		$(node.childNodes).each(function(i,o) {
			_initialiseNodes(o, depth + 1)
		})
	}

	function _updateNodeWidths(node) {
		node.updateChildWidth();
		$(node.childNodes).each(function(i,o) {
			_updateNodeWidths(o)
		})
	}

	function _calculateInitialX(node) {
		$(node.childNodes).each(function(i,o) {
			_calculateInitialX(o)
		})

		if (node.isLeaf()) {
			if (!node.ifLeftMost()) {
				node.X = node.getPreviousSibling().X + nodeSize + siblingDistance
			} else {
				node.X = 0
			}
		}
		else if(node.childNodes.length == 1) {
			var child = node.childNodes[0];
			if (node.ifLeftMost()) {
				node.X = node.childNodes[0].X
			} else {
				node.X = node.getPreviousSibling().X + nodeSize + siblingDistance
				node.mod = node.X - node.childNodes[0].X					
			}
		}
		else {
			var leftChild = node.childNodes[0];
			var rightChild = node.childNodes[node.childNodes.length -1]
			var mid = ( leftChild.X + rightChild.X ) / 2
			if (node.ifLeftMost()) {
				node.X = mid;
			} else {
				node.X = node.getPreviousSibling().X + nodeSize + siblingDistance
				node.mod = node.X - mid;
			}
		}
		if (node.childNodes.length > 0 && !node.ifLeftMost()) {
			_checkForConflicts(node)
		}		
	}

	function _checkAllChildrenOnScreen(node){
		var nodeContour = {};
		_getLeftContour(node, 0, nodeContour);

		var shiftAmount = 0;
		$(nodeContour.keys).each(function(i,o) {
				if (nodeContour[o] + shiftAmount < 0)
						shiftAmount = (nodeContour[o] * -1);
		})
		if (shiftAmount > 0){
				node.X += shiftAmount;
				node.mod += shiftAmount;
		}
	}

	function centerParentsForLayout(node) {
		if ( !node.isLeaf() ) {
			var leftChild = node.childNodes[0];
			var rightChild = node.childNodes[node.childNodes.length -1]
			var mid = ( leftChild.X_lo + rightChild.X_lo ) / 2
			node.X_lo = mid;

			if (node != root) {
				centerParentsForLayout(node.parentNode)
			}
		}
	}

	// assign final X values to nodes
	function _calculateFinalPositions(node, modSum) {
		
		node.X_lo = node.X + modSum;
		node.Y_lo = node.Y;
		modSum += node.mod;
		if (node.layout == 1) {
			node.X -= 1
		}


		var prevSibling = node.getPreviousSibling();
		var sibOffset = 0;
		if (prevSibling != null) { 
			sibOffset = prevSibling.childWidth
		}

		if (node.getParentSwitchInd()) {
			node.X_lo = node.index + sibOffset;
			centerParentsForLayout(node.parentNode)
		}
		if (node.getSwitchInd()) {
			node.X_lo = node.parentNode.X_lo + 0.5;
			if (node.getPreviousSibling() != null) {
				var prevSib = node.getPreviousSibling();
				node.Y_lo 	= prevSib.Y_lo + prevSib.depth + 1;
			} else {
				node.Y_lo 	= node.parentNode.Y_lo + 1;
			}
		}	
		if (node != root && node.parentNode.getSwitchInd()) {
			var nodeIndex = node.index;
			node.X_lo = node.parentNode.X_lo + nodeIndex;			
			node.Y_lo = node.parentNode.Y_lo + 1;
		}	

		//accumulate offsets...
		if (prevSibling != null) {
			node.childWidth += prevSibling.childWidth;
		}

		$(node.childNodes).each(function(i,o) {
			_calculateFinalPositions(o, modSum)
		});
	}

	//set the css
	var rootOffsetX, rootOffsetY;
	function _setCss(obj, dontMoveRoot) {
		var maxLevelHeight = _getMaxHeight(_getNodesAtLevel(obj.Y))
		if (dontMoveRoot === true  && (obj.parentId == null || obj.parentId == "") ) {
			if (direction == "ltr"){ 
				rootOffsetX = parseFloat( $("#" + obj.rtId).css("left") ) - (obj.Y * $("#" + obj.rtId).width()  * node_spacing)
				rootOffsetY = parseFloat( $("#" + obj.rtId).css("top") )  - (obj.X * $("#" + obj.rtId).height() * node_spacing)				
			} else {
				rootOffsetX = parseFloat( $("#" + obj.rtId).css("left") ) - (obj.X * $("#" + obj.rtId).width()  * node_spacing)
				rootOffsetY = parseFloat( $("#" + obj.rtId).css("top") )  - (obj.Y * $("#" + obj.rtId).height() * node_spacing)				
			}
		}

		var top, 
			left,
			xVal = obj.X_lo,
		    yVal = obj.Y_lo;


		if (direction == "ltr"){
			//use X as vertical co-oridinate and Y as horizontal
			top  =  xVal * maxLevelHeight * node_spacing + rootOffsetY;
			left = 	yVal * $("#" + obj.rtId).width() * node_spacing + rootOffsetX;				
		} else {
			top  =  ( yVal * maxLevelHeight * node_spacing ) + rootOffsetY;
			left = 	( xVal * $("#" + obj.rtId).width() * node_spacing ) + rootOffsetX ;
		}			
		$("#" + obj.rtId).css({
			"top":	top, 
			"left": left
		}).addClass("tv-level-" + obj.Y)

		if(obj.allChildNodes.length == 0) {
			$("#" + obj.rtId).find(".tv-hide-no-children").hide()
		}

		maxHeight = Math.max(maxHeight, top  + $("#" + obj.rtId).height() )
		maxWidth  = Math.max(maxWidth,  left + $("#" + obj.rtId).width() )

		$(obj.childNodes).each(function(i,o) {
			_setCss(o, false);
		})
	}

	function _setTreeContainerDimensions() {
		var $treeContainer = _getTreeContainer();
		$treeContainer.css({
			height: maxHeight,
			width:  maxWidth
		})
	}

	function _setInitialZoom() {
		var $treeContainer = _getTreeContainer()
		var viewPortWidth = $treeContainer.parent().width(),
		    viewPortHeight = $treeContainer.parent().height()

		//if the viewport goes off the bottom of the screen, try to fit within visible part...
		if ($treeContainer.offsetParent().offset().top + $treeContainer.parent().height() - $(window).scrollTop() > $(window).height()) {
			viewPortHeight = ($(window).height() - $treeContainer.offsetParent().offset().top + $(window).scrollTop())
		}


		var treeWidth = parseInt($treeContainer[0].scrollWidth),
		    treeHeight = parseInt($treeContainer[0].scrollHeight)

		var xScale = (viewPortWidth / treeWidth),
		    yScale = (viewPortHeight / treeHeight)
		//limit initial scale to 1.  or the min of x and y scale
		var scale = Math.min(1, Math.min(xScale, yScale));


		var initX = (viewPortWidth/2  - treeWidth/2),
		    initY = (viewPortHeight/2 - treeHeight/2) ;

		animateTo($treeContainer, scale, initX, initY)
	}

	function _getMatrixValues() {
		var $treeContainer = _getTreeContainer();
		var matrix = $treeContainer.css("transform");
		return matrix.substring(matrix.indexOf("(") + 1, matrix.indexOf(")")).split(",");
	}

	function _getCurrentScale() {
		var matrixVals = _getMatrixValues();
		return parseFloat(matrixVals[0]);
	}

	function _addNodeClickHandler() {
		var startTime;
		_getTreeContainer().find(".node")
			.off("click")
			.on("click touchstart", function(e) {
				var $this = $(this);
				if ($this.is(".dragged"))
					return;

				if ($this.is(".clicked")) {
					$this.removeClass("clicked");
				}
				else {
					var $treeContainer = _getTreeContainer();
					var currentVals = _getMatrixValues();
					$treeContainer
						.css("visibility", "hidden")
						.find(".node.clicked").removeClass("clicked")

					$treeContainer.removeClass("tv-zoom-out")
					_redraw();

					//all hidden from user....
					$this.addClass("clicked")
					$treeContainer.css("transform", "matrix(1, 0,0, 1, " + currentVals[4] + ", " + currentVals[5] + ")");
					var $node = $this;
					var nodeCenter = [($node.position().left + $node.width()/2), ($node.position().top + $node.height()/2)]
					var viewPortCenter = [$treeContainer.parent().width() / 2, $treeContainer.parent().height() /2];
					if ($treeContainer.offsetParent().offset().top + $treeContainer.parent().height() > $(window).height()) {
						viewPortCenter = [$treeContainer.parent().width() / 2,  ($(window).height() - $treeContainer.offsetParent().offset().top)/2]
					}
					var newX = viewPortCenter[0] - nodeCenter[0];
					var newY = viewPortCenter[1] - nodeCenter[1] + $(window).scrollTop();
					//put it back to where it was...
					$treeContainer.css("transform", "matrix(" + currentVals[0] + ", 0,0, " + currentVals[3] + ", " + currentVals[4] + ", " + currentVals[5] + ")");
					$treeContainer.css("visibility", "visible")

					$treeContainer.addClass("tv-animate")
					setTimeout(function() {
						$treeContainer.removeClass("tv-animate")
					}, 1000)



					setTimeout(function() {
						animateTo($treeContainer, 1, newX, newY, false);
					}, 100)
				}
			})

	}

	function _clearJSP() {
		jsPlumb.reset();
		_getTreeContainer().find(".jsplumb-endpoint, svg").remove();
	}
	function _addToolBarClickHandlers() {
		$("#" + settings.id + "_reset")
			.off("click")
			.on("click", function(e) {
				_clearJSP();
				settings.ajax = false;
				create(settings, false);
				return _cancelEvent(e)
			})
		$("#" + settings.id + "_hybrid")
			.off("click")
			.on("click", function(e) {
				hybrid = $(this).is(":checked");
				_clearJSP();
				settings.ajax = false;
				settings.hybrid = hybrid;
				create(settings, false);
			})
		$("#" + settings.id + "_dir")
			.off("click")
			.on("click", function(e) {
				var currentDir = settings.dir;
				settings.dir = settings.dir == "ltr" ? "ttb" : "ltr";
				$(this).toggleClass("icon-circle-right icon-circle-down")
				direction = settings.dir;
				_clearJSP();
				settings.ajax = false;
				create(settings, false);
				return _cancelEvent(e)
			})
		$("#" + settings.id + "_zoomIn, #" + settings.id + "_zoomOut")
			.off("click")
			.on("click", function(e) {
				var $treeContainer = _getTreeContainer();
				var matrixVals = _getMatrixValues();
				var currentScale = parseFloat(matrixVals[0]);
				var newScale = $(this).is("#" + settings.id + "_zoomOut") ? currentScale * 0.8 : currentScale * node_spacing;
				animateTo($treeContainer, newScale, parseFloat(matrixVals[4]), parseInt(matrixVals[5]));
				return _cancelEvent(e)
		})
	} 

	function _createJspInstance() {
		var color = "#003e75";
		var overlay = settings.arrow == "Y" ?
							 [ [ "Arrow", { location: 1,
			                 visible:true,
			                 width:11,
			                 length:11,
			                 id:"ARROW"} ]
	        				]	 :
	        				null
		jspInstance = jsPlumb.getInstance({
			Container: 			settings.id + "_treeContainer",
	        ConnectionOverlays: overlay,
			Connector: 			[ "Flowchart", {  } ],
			DragOptions: 		{ cursor: "pointer", zIndex: 2000 },
			PaintStyle: 		{ strokeStyle: color, lineWidth: 2 },
			EndpointStyle: 		{ radius: 1, fillStyle: color },
			HoverPaintStyle: 	{ strokeStyle: "orange" },
			EndpointHoverStyle: { fillStyle: "black" }
		});
		//return instance;
	}


	function _joinNodes() {
		// suspend drawing and initialise.
		var common = {
		    cssClass    :   "myCssClass",
		    hoverClass  :   "myHoverClass",
		    isSource	: true,
		    isTarget	: true
		};

		jspInstance.batch(function () {
			function addConnections(from) {
			  	$(from.childNodes).each(function(i,o) {
			  		//only connect if child is visible...
			  		if ($("#" + o.rtId).is(":visible")) {
						jspInstance.connect({
					  		source: from.rtId, 
					  		target: o.rtId,
					  		anchors:  (direction == "ltr") ? ["Right",  (o.getSwitchInd() ? "Top" : "Left") ] : ["Bottom", o.layout == 1 ? "Right" :  (o.getSwitchInd() ? "Left" : "Top")],
						})
						addConnections(o);
			  		}
			  	})
			}
			addConnections(root)
			//jspInstance.draggable(windows);
			$(window).resize(function(){
				jspInstance.repaintEverything();
			});
		});	

		jspInstance.bind("click", function (conn, originalEvent) {
			_getTreeContainer().find(".clicked").removeClass("clicked")
            $(conn.endpoints).each(function(i,o) {
            	$(o.element).addClass("clicked")
            })
        });

	}

	function _removeIdFromHiddenBranchData( id ) {
		hiddenBranchData = hiddenBranchData.filter( item => item !== id )
	}

	function hideNonBranchNodes(jspInstance, node, first_call) {
		if (first_call) {
			$(".node").data("branch-state", "hidden");
			//$(".toggle").hide();
			hiddenBranchData = [];
			for (var key in objData) {
			  //don't hide the top level node...
			  if (objData[key].parentId.length > 0){
				  hiddenBranchData.push(objData[key].rtId)
			  }
			}
			var tmpNode = node;
			//reveal parent path on first call
			while(tmpNode.parentId != null && tmpNode.parentId != "") {
				$("#" + tmpNode.rtId).data("branch-state", "shown")
				_removeIdFromHiddenBranchData( tmpNode.rtId)
				tmpNode = objData[tmpNode.parentId]
			}
		}

		$(node.childNodes).each( (i,o) => {
			$("#" + o.rtId).data("branch-state", "shown")
			_removeIdFromHiddenBranchData( o.rtId)
			hideNonBranchNodes(jspInstance, o, false)
		})
	}


	function showAllBranchNodes(jspInstance, node) {
		hiddenBranchData = [];
		var treeContainer = _getTreeContainer();
		treeContainer.find(".icon-hierarchy").toggleClass("icon-hierarchy icon-filter")
		treeContainer.find(".icon-circle-add-hollow").toggleClass("icon-circle-add-hollow icon-circle-remove-hollow")
		//treeContainer.find(".toggle").show();
	}

	function hideChildNodes(jspInstance, node) {
		$(node.allChildNodes).each( (i,o) => {
			//keep track of hidden children, so they can be hidden after an ajax call
			var hiddenIndex = hiddenObjData.indexOf(o.rtId);
			if (hiddenIndex < 0)
				hiddenObjData.push(o.rtId);
        	hideChildNodes(jspInstance, o);
        })
	}

	function showChildNodes(jspInstance, node) {
		$(node.allChildNodes).each( (i,o) => {
			//remove object id from hidden obj array, if it was there.
       		hiddenObjData = hiddenObjData.filter( item => item !== o.rtId )
       		hiddenBranchData = hiddenBranchData.filter( item => item !== o.rtId )
       		
       		_setToggleStateToHide( $("#" + node.rtId) );
        	showChildNodes(jspInstance, o);
        })
	}

	var to_timeout = null;
	function animateTo($obj, scale, x, y, updateZoomClassInd, forceRedrawInd) {
		if (to_timeout) clearTimeout(to_timeout)
	    to_timeout = setTimeout(function() {
	    	$obj.removeClass("tree_container")
	    }, 1000);

		$obj.addClass("tree_container")
			.css("transform", "matrix(" + scale + ", 0, 0, " + scale + ", " + x + ", " + y + ")")

		updateTextSize(updateZoomClassInd, forceRedrawInd);
	}

	var startPos, endPos, startTime,  speed;
    var getDistanceBetweenElements = function(a, b) {
        return Math.sqrt(
            Math.pow(a.x - b.x, 2) + 
            Math.pow(a.y - b.y, 2) 
        );
    };

	function _setupDragZoomHandler() {
		var $treeContainer = _getTreeContainer();
		var startTime;
		var $panzoom = $treeContainer.panzoom({
			 minScale: 0.1,
  			maxScale: 2,
			onStart: function(e) {
				startTime = (new Date()).getTime();
			},
			onEnd: function(e) {
				var duration = (new Date()).getTime() - startTime;
				//a drag not a click
				if (duration > 200) {
					var node = (e.target).closest(".node");
					$(node).addClass("dragged");
					setTimeout(function() {
						$(node).removeClass("dragged");
					}, 10)
				}
				return _cancelEvent(e);
			}
		});

		$panzoom.parent()
			.off('mousewheel.focal')
			.on('mousewheel.focal', function( e ) {
				e.preventDefault();
				var delta = e.delta || e.originalEvent.wheelDelta;
				var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
				$panzoom.panzoom('zoom', zoomOut, {
				  increment: 0.1,
				  animate: false,
				  focal: e
				});
				updateTextSize();
			});
	}

	var previousScale = 1;
	function updateTextSize(updateZoomClassInd, forceRedrawInd) {
		var scale = _getCurrentScale();

		if (updateZoomClassInd !== false) {
			if (scale < zoom_threshold) 
				_getTreeContainer().addClass("tv-zoom-out")
			else
				_getTreeContainer().removeClass("tv-zoom-out")
		}
		
			
		//redraw on scale switch...
		if ( (previousScale < zoom_threshold && scale >= zoom_threshold) || (scale < zoom_threshold && previousScale >= zoom_threshold))  {
			_redraw();
		}
		previousScale = scale;
	}

	function _redraw() {
		maxWidth = 0;
		maxHeight = 0;
		_setCss(root, false);
		_clearJSP();
		settings.ajax = true; //don't reposition...
		_draw(settings)
	}

	function _searchFilter() {
		if ($(".filterinput").is(".handlerAdded")) {
			return;
		}
		$(".filterinput").addClass("handlerAdded");
		var searchSelector = ".tc-question-part, .tc-form-control, .tc-uppercase, tc-page-title, th, .tc-prefix-part, .tc-card-title"
		$(".clearFilter").on("click", function() {
			$(".filterinput").val("").change();
		});
	    $(".filterinput")
	    	.off("change")
	    	.on("change", function () {
	      		var list = $("#EDGE_CONNECT_PROCESS", getContentDocument());
		        var searchtext = $(this).val();
		        if(searchtext) {
		        	$(this).parent().find(".searchIcon").hide();
		        	$(this).parent().find(".clearFilter").show();
		        	var $matches = $(list).find(':Contains(' + searchtext + ')');
		        	$(searchSelector, list).not($matches).closest(".tetris_rowPart").addClass("filterNotFound");
		        	$matches.closest(".tetris_rowPart").removeClass("filterNotFound");
		          
		        	//remove all filterHighlights...
		        	$(".filterHighlight", getContentDocument()).each(function(i,o) {
		        		$(o).closest(".node").css("border-color", "")
		        		$(o).replaceWith( $(o).text() );
		        	})
		        	$matches.filter(function(i) {
		        		return $(this).is(searchSelector);
		        	}).each(function(i,o){
		        		var text = $(o).text();
		        		var newText = text.split(searchtext).join("<span style='background: yellow; color: #666' class='filterHighlight'>" + searchtext + "</span>");
		        		$(o).html(newText);
		        		$(o).closest(".node").css("border-color", "yellow")
		        	})
		        } else {
		        	$(".node").css("border-color", "")
		        	$(this).parent().find(".searchIcon").show();
		        	$(this).parent().find(".clearFilter").hide();
		        	$(list).find(searchSelector).closest(".tetris_rowPart").removeClass("filterNotFound");
		        	$(".filterHighlight", getContentDocument()).each(function(i,o) {
		        		$(o).replaceWith( $(o).text() );
		        	})
		        }
		        return false;
	    })
	    .keyup( function () {
	    	 	$(this).change();
	    })
	     
	    .on("focus blur", function(){
	    	if ($(".filterinput").val() == "") {
	     	 	$(this).parent().find(".searchIcon").show();
		    	$(this).parent().find(".clearFilter").hide();
	    	} else {
	     	 	$(this).parent().find(".searchIcon").hide();
		    	$(this).parent().find(".clearFilter").show();
	    	}
	    })
	}


	var currentId;
	function saveStyle() {
		currentId = $(".node.show").attr("id");
		backupStyle = _getTreeContainer().attr("style");
		return true;
	}
	function restoreStyle() {
		if (currentId != null) {
			$("#" + currentId).addClass("show")
		}
		_getTreeContainer().attr("style", backupStyle);
	}

	function _cancelEvent(event) {
		event.preventDefault();
		event.stopPropagation();
		event.stopImmediatePropagation();
		return false;
	}

	function toggleChildState(buttonData) {
		var event = buttonData.event;
		var buttonId = buttonData.id;
		var $button = $("#" + buttonId)
		$(".tc-popup.show-popup").removeClass("show-popup")
		
		if ( $button.data("state") == "hidden") {
			$button.data("state", "shown")
			showChildNodes( jspInstance, objData[$button.closest(".node").attr("data-id")] );
		} else {
			$button.data("state", "hidden")
			hideChildNodes( jspInstance, objData[$button.closest(".node").attr("data-id")] );
		}
	    _clearJSP();
	    settings.ajax = true; //don't reposition...
		create(settings, true /*dpmt move root */)
		//draw(settings)

		return _cancelEvent;
	}

	function toggleBranchState(buttonData) {
		var event = buttonData.event;
		var buttonId = buttonData.id;
		var $button = $("#" + buttonId)
		$(".tc-popup.show-popup").removeClass("show-popup")
		
		if ( $button.data("branch-state") == "hidden") {
			$button.data("branch-state", "shown")
			showAllBranchNodes( jspInstance, objData[$button.closest(".node").attr("data-parent-id")] );
		} else {
			$button.data("branch-state", "hidden")
			hideNonBranchNodes( jspInstance, objData[$button.closest(".node").attr("data-id")], true );
		}
	    _clearJSP();
	    settings.ajax = true; //don't reposition...
		create(settings, true /*dpmt move root */)
		//draw(settings)		
		return _cancelEvent;
	}

	function create(params, dontMoveRoot) {
		maxWidth = 0,
		maxHeight = 0,
		rootOffsetX = 0,
		rootOffsetY = 0;

		if (params != null){
			settings = params;
			direction    = direction    || settings.dir     || "ttb";
			hybrid 	     = hybrid 		|| settings.hybrid  || false;
			node_spacing = node_spacing || settings.spacing || 1.2; 
		}
		if (dontMoveRoot !== true) {
			dontMoveRoot = false;
		}

		_buildObjectData();
		if (!root){
			return;
		}
		_initialiseNodes(root, 0)
		_updateNodeWidths(root);
		_calculateInitialX(root)
		//_checkAllChildrenOnScreen(root);
		_calculateFinalPositions(root, 0);
		_setCss(root, dontMoveRoot);
		_addNodeClickHandler();
		_addToolBarClickHandlers();
		_searchFilter();
		_draw(params);

		Hi.addHook('beforeAjaxButtonActionService', saveStyle)
		Hi.addHook('beforeAjaxQuestionActionService', saveStyle)
          .addHook('postProcessResponses', restoreStyle)
	}

	function _draw(params) {
		if (params != null) {
			settings = params;
		}
		if (!root){
			return;
		}
		_createJspInstance()
		_joinNodes()
		_setupDragZoomHandler();
		if (settings.ajax !== true) {
			_setTreeContainerDimensions()
			_setInitialZoom();
		}
	}

	return {
		create: create,
		toggleChildState: toggleChildState,
		toggleBranchState: toggleBranchState,
		getTreeContainer: _getTreeContainer
	}
})()

Hi.addHook('afterChangeTab', function(tabName) {
	var tabPaneName = buildCompID("", "Pane", tabName); 
	if ( $("#" + tabPaneName + " .node").length > 0 )	{
		setTimeout(function() {
			//if ( $("#" + tabPaneName + " .node").last().css("top") == "0px") {
				TreeBuilder.create();
				//TreeBuilder.draw();
			//}
			$(window).resize();
		}, 100);
	}
})

function makeDraggable() {

}