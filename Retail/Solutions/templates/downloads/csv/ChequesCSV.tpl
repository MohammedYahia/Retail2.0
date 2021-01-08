Your Cheques

Account Number:  $$InputParameters[1].AccountNo$

Date,Cheque Number,Amount,Status
$%for 1 to ChequeDetails[C].lastInstance() $$$ChequeDetails[C].Date$,$$ChequeDetails[C].ChequeNo$,$$ChequeDetails[C].Amount$,$$ChequeDetails[C].Status$
$%endfor$