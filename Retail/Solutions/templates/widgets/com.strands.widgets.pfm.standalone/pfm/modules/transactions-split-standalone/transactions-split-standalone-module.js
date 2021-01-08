/**
 * Transaction Edit module
 *
 * @module modules/transactions-edit/transactions-edit-module
 */
define(["classes/item-view",
	"modules/transactions-edit/transactions-edit-module",
	"ui/modules/popup/popup-module",
	"data/transactions/transaction-model",
	"services/transactions-service",
	"services/categories-service",
	"utils/util",
	"jQuery"
], function(ItemView, TransactionsEdit, Popup, Model, TransactionsService, CategoriesService, util, $) {

	var TransactionsSplit = ItemView.extend({
		initialize: function() {
			this._super.apply(this, arguments);
			this.moduleContainer = $("#sf-split-module-placeholder");
			this.catService = CategoriesService.getInstance();
			this.transactionsService = TransactionsService.getInstance();
		},
		render: function (options) {
            var self = this;
            if (!this.model){
                util.when(self.transactionsService.getTransactionAndSplits(new Model({
                    "accType": self.config.transactionAccType,
                    "parentAccId": self.config.transactionAccId,
                    "parentOpId": self.config.transactionId,
                    "date": "01/01/2017",
                    "amount": "-1.01"
                }))).done(function(splitResult){
                        if(0 === splitResult.children.length) {
                            self.config.transactionId = splitResult.parent.attributes.id;
                            self.config.transactionAccType = splitResult.parent.attributes.accType;
                        } else {
                            self.config.transactionId =  splitResult.children.models[0].attributes.id;
                            self.config.transactionAccType =  splitResult.children.models[0].attributes.accType;
                        }
                        self.model = new Model();
                        util.when(self.transactionsService.get({
                                "opIds[0]": self.config.transactionId,
                                "opTypes[0]": self.config.transactionAccType
                            }), self.catService.get()
                        ).done(function(trResult, catsResult){
                            var opts = {
                                categories: catsResult
                            };

                            //Find the right model by opId
                            self.model = new Model(
                                trResult.data.models.find(function(tx){
                                    return tx.attributes.id === self.config.transactionId;
                                }).attributes, opts);
                            self.onRender();
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
            }
		},
		onRender: function() {
			//this._super();
			var popupOptions = {
					$container: this.moduleContainer,
					$opener: this.moduleContainer,
					title: "Split Transaction",
					closeCallback: util.bind(this._onCancel, this)
				},
				self = this;

			popupOptions["class"] = "sf-edit-transaction-form-popup";

			this.transactionsEdit = new TransactionsEdit(util.extend({}, this.contextConfig, {
					transaction: self.model,
					$popupContainer: this.moduleContainer,
					$tooltipContainer: this.moduleContainer
				}));
			popupOptions.contentView = this.transactionsEdit;
			this.popup = new Popup(popupOptions);
			this.popup.open();
			this.transactionsEdit.on("cancel", this._onCancel, this);
			this.transactionsEdit.on("done", this._onDone, this);
			this.transactionsEdit.on("show", this._openEditForm, this);
			this.transactionsEdit.on("categorySelectorShowed", function(){
				self.moduleContainer.find(".sf-transaction-split-toggle").find(".sf-accordion-toggle-link").click();
				//self.moduleContainer.find(".sf-transaction-included-analysis").css("visibility", "hidden");
				var remainingLabel = self.moduleContainer.find(".sf-remainder-amount-text"),
					rightRemaining = self.moduleContainer.find(".sf-column-transaction-amount")[1].children[0].innerHTML;
				if (remainingLabel.text().indexOf("null") >= 0){
					remainingLabel.text(rightRemaining);
				}
			});
			this.transactionsEdit.on("view:change", this._disableParentFields, this);
			this.publish("splitModuleOpened");
		},
		_disableParentFields: function(event) {
			var $fields = this.moduleContainer.find(".sf-transaction-edition.sf-form-row-relative").find("input, select, :checkbox");
				$fields.prop("disabled", true);
				this.transactionsEdit.parentCategorySelect.update();
				//this.moduleContainer.find(".sf-transaction-included-analysis").css("visibility", "hidden");
		},
		_hideEditForm: function () {
			this.popup.remove();
		},
		_onCancel: function () {
			this._hideEditForm();
			this.publish("cancelSplitEdition");
		},
		_onDone: function () {
			this._hideEditForm();
			this.publish("transactionSplitCompleted");
		},
		_openEditForm: function () {
			this.popup.open();

		}

	}, {
		ID: "transactions-split-standalone"
	});
	TransactionsSplit.type = "module";
	TransactionsSplit.itemId = "transactions-split-standalone";
	TransactionsSplit.id = "transactions-split-standalone";
	return TransactionsSplit;

});