class jfTreeItemController {
	/* @ngInject */
    constructor($scope, $element, $timeout, AdvancedStringMatch) {
        this.$element = $element;
        this.$timeout = $timeout;
        this.asm = AdvancedStringMatch;

        $(this.$element).prop('ctrl', this);
    }

    _getTreeContainer() {
        return $(this.tree.$element).find('.jf-tree-container');
    }

    onItemClick() {
        this.tree.api._setSelected(this.data);
        this.tree.api.fire('item.clicked', this.data.data);
    }

    isExpanded() {
        return this.tree.api.isNodeOpen(this.data.data);
    }

    toggleExpansion() {

        if (this.isExpanded()) {
            this.tree.api.closeNode(this.data.data);
        }
        else {
            let node = this.data;
//            node.$pending = true;
            this.tree.api.openNode(node.data)/*.then(() => {
                node.$pending = false;
            });*/
        }
    }

    isQuickFindMatch() {
        let elem = $(this.$element).find('.jf-tree-item-content .node-text');
        if (elem.length) {
            let text = elem.text();
            elem.unhighlight();
            if (text && this.tree.api.quickFindTerm) {
                let asmResponse = this.asm.match(text, this.tree.api.quickFindTerm);
                if (asmResponse.matched) {
                    this.asm.highlight(elem, asmResponse.segments);
                }
                return asmResponse.matched;
            }
            else return false;
        }
    }
}

export function jfTreeItem() {
    return {
        controller: jfTreeItemController,
        controllerAs: 'jfTreeItem',
        bindToController: true,
        replace: true,
        scope: {
            data: '=',
            itemId: '=',
            tree: '='
        },
        templateUrl: 'ui_components/jf_tree/jf_tree_item.html'
    }
}