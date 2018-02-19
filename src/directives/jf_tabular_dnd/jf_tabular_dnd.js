export function jfTabularDnD() {

    return {
        restrict: 'E',
        scope: {
            availableItems: '=',
            selectedItems: '=',
            columns: '=',
            availableItemsColumns: '=?',
            selectedItemsColumns: '=?',
            entityName: '@?'
        },
        templateUrl: 'directives/jf_tabular_dnd/jf_tabular_dnd.html',
        controller: jfTabularDnDController,
        controllerAs: 'jfTabularDnD',
        bindToController: true,
    }
}

class jfTabularDnDController {
	/* @ngInject */
    constructor($scope, JFrogTableViewOptions) {
        this.$scope = $scope;
        this.JFrogTableViewOptions = JFrogTableViewOptions;

        if (this.columns) {
            this.availableItemsColumns = this.columns;
            this.selectedItemsColumns = this.columns;
        }

        this.createTables();
    }

    createTables() {
        this.availableItemsTableOptions = new this.JFrogTableViewOptions(this.$scope);
        this.selectedItemsTableOptions = new this.JFrogTableViewOptions(this.$scope);

        this.availableItemsTableOptions._registerTabularDnd(this, 'available', this.selectedItemsTableOptions);
        this.selectedItemsTableOptions._registerTabularDnd(this, 'selected', this.availableItemsTableOptions);

        let {availableObjectName, selectedObjectName} = this._getObjectNames();

        this.availableItemsTableOptions.setColumns(this.availableItemsColumns)
            .setSelection(this.availableItemsTableOptions.MULTI_SELECTION)
            .setPaginationMode(this.availableItemsTableOptions.VIRTUAL_SCROLL)
            .showPagination(false)
            .setDraggable()
            .setRowsPerPage(8)
            .setObjectName(availableObjectName)
            .setEmptyTableText('Drag Row Here');

        this.selectedItemsTableOptions.setColumns(this.selectedItemsColumns)
            .setSelection(this.selectedItemsTableOptions.MULTI_SELECTION)
            .setPaginationMode(this.selectedItemsTableOptions.VIRTUAL_SCROLL)
            .showPagination(false)
            .setDraggable()
            .setRowsPerPage(8)
            .setObjectName(selectedObjectName)
            .setEmptyTableText('Drag Row Here');

        this.availableItemsTableOptions.setData(this.availableItems);
        this.selectedItemsTableOptions.setData(this.selectedItems);
    }

    _getObjectNames() {

        let availableObjectName, selectedObjectName;

        if (this.entityName) {
            if (this.entityName.indexOf('/') !== -1) {
                let [single, plural] = this.entityName.split('/');
                availableObjectName = 'Available ' + single + '/' + 'Available ' + plural;
                selectedObjectName = 'Selected ' + single + '/' + 'Selected ' + plural;
            }
            else {
                availableObjectName = 'Available ' + this.entityName;
                selectedObjectName = 'Selected ' + this.entityName;
            }
        }
        else {
            availableObjectName = 'Available Item';
            selectedObjectName = 'Selected Item';
        }

        return {availableObjectName, selectedObjectName};
    }

    isIncludeListEmpty() {
        return !this.selectedItems.length;
    }

    isExcludeListEmpty() {
        return !this.availableItems.length;
    }

    isIncludeListItemSelected() {
        return !!this.selectedItemsTableOptions.getSelectedCount()
    }

    isExcludeListItemSelected() {
        return !!this.availableItemsTableOptions.getSelectedCount()
    }

    excludeAll() {
        let selected = this.selectedItemsTableOptions.getSelected();
        selected.forEach(s => delete s.$selected);
        let filtered = this.selectedItemsTableOptions.getFilteredData();
        Array.prototype.splice.apply(this.availableItems, [this.availableItems.length, 0].concat(filtered));
        _.remove(this.selectedItems, i => _.includes(filtered, i));
        this._refreshBothTables();
    }

    includeAll() {
        let selected = this.availableItemsTableOptions.getSelected();
        selected.forEach(s => delete s.$selected);
        let filtered = this.availableItemsTableOptions.getFilteredData();
        Array.prototype.splice.apply(this.selectedItems, [this.selectedItems.length, 0].concat(filtered));
        _.remove(this.availableItems, i => _.includes(filtered, i));
        this._refreshBothTables();
    }

    excludeSelected() {
        let selected = this.selectedItemsTableOptions.getSelected();
        selected.forEach(s => delete s.$selected);
        let filtered = this.selectedItemsTableOptions.getFilteredData();
        _.remove(selected, i => !_.includes(filtered, i));
        Array.prototype.splice.apply(this.availableItems, [this.availableItems.length, 0].concat(selected));
        _.remove(this.selectedItems, item => _.includes(selected, item));
        this._refreshBothTables();
    }

    includeSelected() {
        let selected = this.availableItemsTableOptions.getSelected();
        selected.forEach(s => delete s.$selected);
        let filtered = this.availableItemsTableOptions.getFilteredData();
        _.remove(selected, i => !_.includes(filtered, i));
        Array.prototype.splice.apply(this.selectedItems, [this.selectedItems.length, 0].concat(selected));
        _.remove(this.availableItems, item => _.includes(selected, item));
        this._refreshBothTables();
    }

    _refreshBothTables() {
        this.availableItemsTableOptions.update();
        this.availableItemsTableOptions.refreshFilter();
        this.selectedItemsTableOptions.update();
        this.selectedItemsTableOptions.refreshFilter();
    }

    onDragTransfer(draggedRow) {
        delete draggedRow.$selected;
    }
}


