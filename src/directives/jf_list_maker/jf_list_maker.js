export function jfListMaker() {

    return {
        restrict: 'E',
        scope: {
            values: '=',
            label: '@',
            helpTooltip: '=',
            objectName: '@',
            ngDisabled: '=',
            noSort: '=?',
            minLength: '@',
            inputType: '@?',
            predefinedValues: '=?',
            placeholder: '@?',
            listId: '@',
            onAddValue: '&?',
	        onAfterAddValue: '&?',
	        onAfterDeleteValue: '&?',
            hideAddNewFields: '@',
            validationRegex:'@',
            validationRegexMessage:'@',
	        caseInsensitive: '<?'
        },
        templateUrl: 'directives/jf_list_maker/jf_list_maker.html',
        controller: jfListMakerController,
        controllerAs: 'jfListMaker',
        bindToController: true
    }
}

/**
 * API for the jfDragDrop directive
 */
class jfListMakerController {
    /* @ngInject */
    constructor($attrs) {
        this.noSort = this.noSort || $attrs.hasOwnProperty('noSort');
        if (this.values && !this.noSort) this.values = _.sortBy(this.values);
        this.minLength = this.minLength || 0;

        let randomId = Math.floor(1000000000*Math.random());
        if (!this.listId) this.listId = 'list-id-' + randomId;

    }
    addValue() {

        if (!this.values) this.values = [];

        this.errorMessage = null;



        if (_.isEmpty(this.newValue)) {
            this.errorMessage = "Must input value";
        }
        else if (!this._isValueUnique(this.newValue)) {
            this.errorMessage = "Value already exists";
        }
        else if(!_.isEmpty(this.validationRegex) && !(new RegExp(this.validationRegex).test(this.newValue))){
            this.errorMessage= _.isEmpty(this.validationRegexMessage) ? "Value not valid" : this.validationRegexMessage;
        }

        else {
            if(this.onAddValue){
                this.newValue = this.onAddValue({newValue: this.newValue})
            }
            this.values.push(this.newValue);
            this.newValue = null;
	        if(this.onAfterAddValue){
		        this.onAfterAddValue()
	        }
        }
        if (!this.noSort) {
            this.values = _.sortBy(this.values);
        }
    }

    removeValue(index) {
        this.values.splice(index,1);

        if(this.onAfterDeleteValue && typeof this.onAfterDeleteValue === 'function') {
		    this.onAfterDeleteValue();
	    }
    }

    _isValueUnique(text) {
        if(this.caseInsensitive) {
            return !this.values || !_.find(this.values, (val) => {
                return val.toLowerCase() === text.toLowerCase();
            });
        }
        return !this.values || this.values.indexOf(text) == -1;
    }
}