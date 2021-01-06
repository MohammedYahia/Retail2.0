Your Loan Schedule

Account Number:  $$InputParameters[1].SelectedLoanDetails[1].LinkedAppl[1].LinkedApplId$

Overdue Payments
$%if DueSchedule[C].ScheduleDate = ''$
No overdue payments
$%else$
Payment Date,Amount($$InputParameters[1].SelectedLoanDetails[1].CurrencyPrefix$),OutStanding Amount($$InputParameters[1].SelectedLoanDetails[1].CurrencyPrefix$)
$%for 1 to DueSchedule[C].lastInstance() $$$DueSchedule[C].ScheduleDate$,$$DueSchedule[C].TotalDue$,$$DueSchedule[C].Outstanding$
$%endfor$
$%endif$
Future Payments
$%if FutureSchedule[C].ScheduleDate = ''$
No Future payments
$%else$
Payment Date,Amount($$InputParameters[1].SelectedLoanDetails[1].CurrencyPrefix$),OutStanding Amount($$InputParameters[1].SelectedLoanDetails[1].CurrencyPrefix$)
$%for 1 to FutureSchedule[C].lastInstance() $$$FutureSchedule[C].ScheduleDate$,$$FutureSchedule[C].TotalDue$,$$FutureSchedule[C].Outstanding$
$%endfor$
$%endif$
Paid Installments
$%if PaidSchedule[C].ScheduleDate = ''$
No Payments available
$%else$
Payment Date,Amount($$InputParameters[1].SelectedLoanDetails[1].CurrencyPrefix$),OutStanding Amount($$InputParameters[1].SelectedLoanDetails[1].CurrencyPrefix$)
$%for 1 to PaidSchedule[C].lastInstance() $$$PaidSchedule[C].ScheduleDate$,$$PaidSchedule[C].TotalDue$,$$PaidSchedule[C].Outstanding$
$%endfor$
$%endif$