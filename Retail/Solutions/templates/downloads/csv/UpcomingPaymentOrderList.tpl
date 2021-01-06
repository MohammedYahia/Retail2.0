Upcoming $$!MAINSESSION.TRANSFER_TYPE$

Account Number:  $$InputParameters[1].SelectedAccountDetails[1].AccountNo$

Date,Reference,Description,Amount
$%for 1 to PaymentOrderList[C].lastInstance() $$$PaymentOrderList[C].PaymentExecutionDate$,$$PaymentOrderList[C].id$,$%if WorkingElements[1].Flags[1].FutureTransferType == 'Transfer'$ Transfer to $$PaymentOrderList[C].CreditAccountName$ ($$PaymentOrderList[C].CreditAccount$)$%endif$ $%if WorkingElements[1].Flags[1].FutureTransferType == 'Payment'$$$PaymentOrderList[C].BeneficiaryName$$%endif$,$$PaymentOrderList[C].CurrencySymbol$ $$PaymentOrderList[C].PaymentAmount$
$%endfor$