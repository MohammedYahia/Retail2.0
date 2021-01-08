<pdf baseFont="Helvetica,Cp1252,false">

<page>
<footer page="y"></footer>
<right><img src="$$PROJECTHOME$/images/TCIBIcons/img_logo.jpg" width="100" height="35"></img></right>
<center>

<br />
<br />
<font size="15">Your Loan Schedule</font>
<br />
<br />

<font size="8">		
<table width="100%" border="0" bordercolor="ffffff" cellspacing="2" cellpadding="2">
<tr><td bgcolor="95B3D7">Account Number:  $$InputParameters[1].SelectedLoanDetails[1].LinkedAppl[1].LinkedApplId$</td></tr>
</table>

<table width="100%" border="0" bordercolor="ffffff" cellspacing="2" cellpadding="2">
<tr><td bgcolor="95B3D7">Overdue Payments</td></tr>
</table>

$%if DueSchedule[C].ScheduleDate = ''$
<table width="100%" border="1" bordercolor="ffffff" cellspacing="2" cellpadding="2">
<tr><td bgcolor="DBE5F1">No overdue payments</td></tr>
</table>
$%else$
<table width="100%" border="1" bordercolor="ffffff" cellspacing="2" cellpadding="2">
  <tr>
    <td bgcolor="DBE5F1">Payment Date</td>
	<td bgcolor="DBE5F1">Amount($$InputParameters[1].SelectedLoanDetails[1].CurrencyPrefix$)</td>
	<td bgcolor="DBE5F1">OutStanding Amount($$InputParameters[1].SelectedLoanDetails[1].CurrencyPrefix$)</td>
  </tr>
$%for 1 to DueSchedule[C].lastInstance() $
  <tr>
    <td bgcolor="DBE5F1">$$DueSchedule[C].ScheduleDate$</td>
    <td bgcolor="DBE5F1">$$DueSchedule[C].TotalDue$</td>
	<td bgcolor="DBE5F1">$$DueSchedule[C].Outstanding$</td>
  </tr>
$%endfor$
</table>
$%endif$

<table width="100%" border="0" bordercolor="ffffff" cellspacing="2" cellpadding="2">
<tr><td bgcolor="95B3D7">Future Payments</td></tr>
</table>

$%if FutureSchedule[C].ScheduleDate = ''$
<table width="100%" border="1" bordercolor="ffffff" cellspacing="2" cellpadding="2">
<tr><td bgcolor="DBE5F1">No Future payments</td></tr>
</table>
$%else$
<table width="100%" border="1" bordercolor="ffffff" cellspacing="2" cellpadding="2">
  <tr>
    <td bgcolor="DBE5F1">Payment Date</td>
	<td bgcolor="DBE5F1">Amount($$InputParameters[1].SelectedLoanDetails[1].CurrencyPrefix$)</td>
	<td bgcolor="DBE5F1">OutStanding Amount($$InputParameters[1].SelectedLoanDetails[1].CurrencyPrefix$)</td>
  </tr>
$%for 1 to FutureSchedule[C].lastInstance() $
  <tr>
    <td bgcolor="DBE5F1">$$FutureSchedule[C].ScheduleDate$</td>
    <td bgcolor="DBE5F1">$$FutureSchedule[C].TotalDue$</td>
	<td bgcolor="DBE5F1">$$FutureSchedule[C].Outstanding$</td>
  </tr>
$%endfor$
</table>
$%endif$

<table width="100%" border="0" bordercolor="ffffff" cellspacing="2" cellpadding="2">
<tr><td bgcolor="95B3D7">Paid Installments</td></tr>
</table>
$%if PaidSchedule[C].ScheduleDate = ''$
<table width="100%" border="1" bordercolor="ffffff" cellspacing="2" cellpadding="2">
<tr><td bgcolor="DBE5F1">No Payments available</td></tr>
</table>
$%else$
<table width="100%" border="1" bordercolor="ffffff" cellspacing="2" cellpadding="2">
  <tr>
    <td bgcolor="DBE5F1">Payment Date</td>
	<td bgcolor="DBE5F1">Amount($$InputParameters[1].SelectedLoanDetails[1].CurrencyPrefix$)</td>
	<td bgcolor="DBE5F1">OutStanding Amount($$InputParameters[1].SelectedLoanDetails[1].CurrencyPrefix$)</td>
  </tr>
$%for 1 to PaidSchedule[C].lastInstance() $
  <tr>
    <td bgcolor="DBE5F1">$$PaidSchedule[C].ScheduleDate$</td>
    <td bgcolor="DBE5F1">$$PaidSchedule[C].TotalDue$</td>
	<td bgcolor="DBE5F1">$$PaidSchedule[C].Outstanding$</td>
  </tr>
$%endfor$
</table>
$%endif$

</pdf>