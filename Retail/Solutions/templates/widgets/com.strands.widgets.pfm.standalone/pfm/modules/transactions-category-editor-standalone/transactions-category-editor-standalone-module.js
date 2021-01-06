/**
 * Transaction category editor module
 *
 * @module modules/transactions-category-editor-standalone/transactions-category-editor-standalone
 */
define([
	"modules/transactions-category-editor/transactions-category-editor-module",
	"modules/category-selector/category-selector-module",
	"services/categories-service",
	"data/transactions/transaction-model",
	"utils/util",
	"jQuery"
], function(CategoryEditor, CategorySelector, CatService, Model, util, $) {

	var TransactionsCategoryEditor = CategoryEditor.extend({
		initialize: function(options){
			this.catService = CatService.getInstance();
			this._super(options);
		},
		render: function (options) {
		    var self = this;
			if (!this.model && this.config.transactionId){
                util.when(self.transactionsService.getTransactionAndSplits(new Model({
                    "accType": self.config.transactionAccType,
                    "parentAccId": self.config.transactionAccId,
                    "parentOpId": self.config.transactionId,
                    "date": "01/01/2017",
                    "amount": "-1.01"
                }))).done(function(splitResult){
                		var transactionId, transactionAccType;
                        if(0 === splitResult.children.length) {
                            transactionId = splitResult.parent.attributes.id;
                            transactionAccType = splitResult.parent.attributes.accType;
                        } else {
                            transactionId =  splitResult.children.models[0].attributes.id;
                            transactionAccType =  splitResult.children.models[0].attributes.accType;
                        }
                        self.model = new Model();
                        util.when(self.transactionsService.get({
                                "opIds[0]": transactionId,
                                "opTypes[0]": transactionAccType
                            }), self.catService.get()
                        ).done(function(trResult, catsResult){
                            var opts = {
                                categories: catsResult
                            };

                            //Find the right model by opId
							var parentModel = trResult.data.models.find(function(tx){
                                return tx.attributes.id === self.config.transactionId;
                            });
                            self.model = new Model(parentModel?parentModel.attributes:splitResult.parent.attributes, opts);
                            self.render(options);
                        }).fail(function(){
                            alert("Error");
                        });
                    }
                ).fail(function(){
                    alert("Error");
                });
            } else {
                if (this.rendered)
                    return;
                this.rendered = true;
                return this._super(options);
            }
		},
		_renderCategorySelector: function () {
			this.$currentOpener = this.$el;

			var self = this,
				ops = util.extend({}, this.options, {
					el: this.$el,
					catId: this.model.get("category").get("catId"),
					isIncome: this.model.get("amount") > 0,
					rulesEdition: true
				},
				this.contextConfig);
			ops.$popupContainer = $("#sf-categorize-module-placeholder");
			var categoryEditor = new CategorySelector(ops);

			// Render and immediately open the selector passing the
			// triggering event to decide on accessible/default view

			categoryEditor.once("item:rendered", function () {
				categoryEditor.open(this.options.evt);
			});
			categoryEditor.render();

			// Register to editor events
			categoryEditor.on("categorySelector:selected", util.bind(this._executeUpdateAction, this));
			categoryEditor.on("categorySelector:cancel", util.bind(this._closeModule, this));


			this._categoryEditor = categoryEditor;
			this._categoryEditor.on("popupOpened", function(){
				self._categoryEditor.$el.css("display","none");
				self.publish("categorySelectorPopupOpened");
			});
		},
		_closeModule: function(){
			this.publish("closeCategorySelectorModule");
		},
		_executeUpdateAction: function (category) {
			this._selectedCatId = parseInt(category.id, 10);
			var self = this,
				changes = {};
			changes["catId"] = this._selectedCatId;
			//Calculate if the query is to update just one o a set of transactions.
			var hasMultipleTransactions = this.model.has("transactions");
			if (hasMultipleTransactions) {
				return util.bind(this.transactionsService.multipleUpdate, this.transactionsService);
			}
			util.when(this.transactionsService.update(self.model, changes)).done(function(){
				self._categoryEditor._accessiblePopup.remove();
				self.publish("transaction:change");
			});
		},


		onRender: function () {
			this.cell = $("#sf-categorize-module-placeholder");
			this._super();
		},
	}, {
		/**
		 * transactions-category-editor
		 *
		 * @property ID
		 * @static
		 * @final
		 * @type {String}
		 */
		ID: "transactions-category-editor-standalone"
	});
	TransactionsCategoryEditor.type = "module";
	TransactionsCategoryEditor.itemId = "transactions-category-editor-standalone";
	TransactionsCategoryEditor.id = "transactions-category-editor-standalone";
	return TransactionsCategoryEditor;
});