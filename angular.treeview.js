/*
	@license Angular Treeview version 0.1.6
	ⓒ 2013 AHN JAE-HA http://github.com/eu81273/angular.treeview
	License: MIT


	[TREE attribute]
	angular-treeview: the treeview directive
	tree-id : each tree's unique id.
	tree-model : the tree model on $scope.
	node-id : each node's id
	node-label : each node's label
	node-children: each node's children

	<div
		data-angular-treeview="true"
		data-tree-id="tree"
		data-tree-model="roleList"
		data-node-id="roleId"
		data-node-label="roleName"
		data-node-children="children" >
	</div>
*/

(function ( angular ) {
	'use strict';

	angular.module( 'angularTreeview', [] ).directive( 'treeModel', ['$compile', function( $compile ) {
		return {
			restrict: 'A',
			link: function ( scope, element, attrs ) {


			    //tree id
				var treeId = attrs.treeId;

				//tree model
				var treeModel = attrs.treeModel;

				//node id
				var nodeId = attrs.nodeId || 'id';

				//node label
				var nodeLabel = attrs.nodeLabel || 'label';

                //node check
                var nodeCheck = attrs.nodeCheck || 'check';

                //node readOnlyCheck
                var nodeReadOnlyCheck = attrs.nodeReadOnlyCheck || 'readOnlyCheck';

                //node size
                var nodeSize = attrs.nodeSize || 'size';

                //node sizeTransform
                var nodeSizeTransform = attrs.nodeSize || 'sizeTransform';

                //children
				var nodeChildren = attrs.nodeChildren || 'children';

				//tree template
				var template =
                    '<ul>' +
                        '<li data-ng-repeat="node in ' + treeModel + '">' +
                            '<input type="checkbox" ng-disabled="node.' + nodeReadOnlyCheck + '" ng-model="node.' + nodeCheck + '" data-ng-click="' + treeId + '.selectNodeCheckbox(node)"/>&nbsp&nbsp' +
                            '<i class="showMore" data-ng-show="node.' + nodeChildren + '.length && node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                            '<i class="collapsed" data-ng-show="node.' + nodeChildren + '.length && node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                            '<i class="showLess" data-ng-show="node.' + nodeChildren + '.length && !node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                            '<i class="expanded" data-ng-show="node.' + nodeChildren + '.length && !node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                            '<i class="normal" data-ng-hide="node.' + nodeChildren + '.length"></i> ' +
                            '<span data-ng-class="node.selected" data-ng-click="' + treeId + '.selectNodeLabel(node)">{{node.' + nodeLabel + '}}</span>' +
                            '<span ng-show="!node.' + nodeChildren + '.length" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' +
                            '<span ng-show="!node.' + nodeChildren + '.length && node.' + nodeSizeTransform + ' !== \'\'" class="uploadSizeFont bold">({{node.' + nodeSizeTransform + '}})</span>' +
                            '<div ng-if="!node.collapsed" data-tree-id="' + treeId + '" data-tree-model="node.' + nodeChildren + '" data-node-id=' + nodeId + ' data-node-label=' + nodeLabel + ' data-node-children=' + nodeChildren + '></div>' +
                        '</li>' +
                    '</ul>';


				//check tree id, tree model
				if( treeId && treeModel ) {

					//root node
					if( attrs.angularTreeview ) {

						//create tree object if not exists
						scope[treeId] = scope[treeId] || {};

						//if node head clicks,
						scope[treeId].selectNodeHead = scope[treeId].selectNodeHead || function( selectedNode ){

							//Collapse or Expand
							selectedNode.collapsed = !selectedNode.collapsed;
						};

						//if node label clicks,
						scope[treeId].selectNodeLabel = scope[treeId].selectNodeLabel || function( selectedNode ){

							//remove highlight from previous node
							if( scope[treeId].currentNode && scope[treeId].currentNode.selected ) {
								scope[treeId].currentNode.selected = undefined;
							}

							//set highlight to selected node
							selectedNode.selected = 'selected';

							//set currentNode
							scope[treeId].currentNode = selectedNode;
						};

                        //if node checkBox clicks,
                        scope[treeId].selectNodeCheckbox = scope[treeId].selectNodeCheckbox || function( selectedNode ){

                                //if folder => select or deselect all children
                                var children = selectedNode[nodeChildren];
                                if (children.length > 0) {
                                    _.forEach(children, function (child) {
                                        selectOrDeselectAllChildren(child, selectedNode[nodeCheck]);
                                    });
                                }


                                //update all tree all times
                                var splited = treeModel.split('.');
                                var controller = splited[0];
                                var variable = splited[1];

                                var allRoot = scope[controller][variable];
                                _.forEach(allRoot, function (root) {
                                    root[nodeCheck] = updateCheckboxTree(root);
                                });
                            };

					}

					//Rendering template.
					element.html('').append( $compile( template )( scope ) );
				}

                function updateCheckboxTree(currentNode) {

                    if (currentNode[nodeChildren].length === 0) {
                        return currentNode[nodeCheck];
                    }
                    else {

                        var folderIsCheck = false;
                        var children = currentNode[nodeChildren];
                        _.forEach(children, function (child) {
                            folderIsCheck = updateCheckboxTree(child) || folderIsCheck;
                        });

                        currentNode[nodeCheck] = folderIsCheck;
                        return folderIsCheck;
                    }
                }

                function selectOrDeselectAllChildren(currentNode, isCheck) {

                    currentNode[nodeCheck] = isCheck;

                    var children = currentNode[nodeChildren];
                    if (children.length > 0) {

                        _.forEach(children, function (child) {
                            selectOrDeselectAllChildren(child, isCheck);
                        });
                    }
                }
			}
		};
	}]);
})( angular );
