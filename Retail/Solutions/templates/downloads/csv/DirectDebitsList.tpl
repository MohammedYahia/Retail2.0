Your Direct Debits

Account Number:  $$InputParameters[1].AccountNo$

Payee Name,Payee Account,Description,Currency,Last Amount Paid,Start Date
$%for 1 to DirectDebitsList[C].lastInstance() $$$DirectDebitsList[C].AccountName$,$$DirectDebitsList[C].AccountNumber$,$$DirectDebitsList[C].Description[1].Description$,$$DirectDebitsList[C].Currency$,$$DirectDebitsList[C].StandAloneAmt$,$$DirectDebitsList[C].StartDate$
$%endfor$