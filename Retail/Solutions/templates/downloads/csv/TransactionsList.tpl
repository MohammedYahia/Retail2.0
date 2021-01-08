Your Transactions List

Account Number:  $$InputParameters[1].AccountNo$

Date,Description,Amount ($$InputParameters[1].AccountCurrencyPrefix$),$%if InputParameters[1].ListType = 'COMPLETED'$ $$WorkingElements[1].DynamicColumn$ ($$InputParameters[1].AccountCurrencyPrefix$) $%endif$
$%for 1 to TransactionsList[C].lastInstance() $$$TransactionsList[C].BookingDate$,$$TransactionsList[C].Narrative$ $$TransactionsList[C].parentCategoryName$ $$TransactionsList[C].CategoryName$,$$TransactionsList[C].StmtAmount$,$%if InputParameters[1].ListType = 'COMPLETED'$ $$TransactionsList[C].StmtBalance$ $%endif$
$%endfor$