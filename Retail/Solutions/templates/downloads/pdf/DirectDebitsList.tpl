<pdf baseFont="Helvetica,Cp1252,false">

<page>
<footer page="y"></footer>
<right><img src="$$PROJECTHOME$/images/TCIBIcons/img_logo.jpg" width="100" height="35"></img></right>
<center>

<br />
<br />
<font size="15">Your Direct debits</font>
<br />
<br />

<font size="8">		
<table width="100%" border="0" bordercolor="ffffff" cellspacing="2" cellpadding="2">

<tr><td bgcolor="95B3D7">Account Number:  $$InputParameters[1].AccountNo$</td></tr>
</table>


<table width="100%" border="1" bordercolor="ffffff" cellspacing="2" cellpadding="2">
  <tr>
    <td bgcolor="DBE5F1">Payee Name</td>
	<td bgcolor="DBE5F1">Payee Account</td>
	<td bgcolor="DBE5F1">Description</td>
	<td bgcolor="DBE5F1">Currency</td>
	<td bgcolor="DBE5F1">Last Amount Paid</td>
	<td bgcolor="DBE5F1">Start Date</td>
  </tr>
$%for 1 to DirectDebitsList[C].lastInstance() $
  <tr>
    <td bgcolor="DBE5F1">$$DirectDebitsList[C].AccountName$</td>
    <td bgcolor="DBE5F1">$$DirectDebitsList[C].AccountNumber$</td>
	<td bgcolor="DBE5F1">$$DirectDebitsList[C].Description$</td>
	<td bgcolor="DBE5F1">$$DirectDebitsList[C].Currency$</td>
	<td bgcolor="DBE5F1">$$DirectDebitsList[C].StandAloneAmt$</td>
	<td bgcolor="DBE5F1">$$DirectDebitsList[C].StartDate$</td>
  </tr>
$%endfor$
</table>

$%endif$
</pdf>