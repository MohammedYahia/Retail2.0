Your Cheques

Account Number:  $$InputParameters[1].AccountNo$

Request date,Start Cheque number,Cheque Book Type, Cheque Book Status
$%for 1 to ChequeIssueDetails[C].lastInstance() $$$ChequeIssueDetails[C].FormattedDate$,$$ChequeIssueDetails[C].ChqNoStart$,$$ChequeIssueDetails[C].Description$,$$ChequeIssueDetails[C].ChequeStatus$
$%endfor$