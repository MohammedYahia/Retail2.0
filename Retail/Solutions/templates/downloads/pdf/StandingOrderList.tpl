<pdf baseFont="Helvetica,Cp1252,false">

<page>
<footer page="y"></footer>
<right><img src="$$PROJECTHOME$/images/TCIBIcons/img_logo.jpg" width="100" height="35"></img></right>
<center>

<br />
<br />
<font size="15">Your Standing orders</font>
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
	<td bgcolor="DBE5F1">Currency</td>
	<td bgcolor="DBE5F1">Amount</td>
	<td bgcolor="DBE5F1">Frequency</td>
	<td bgcolor="DBE5F1">Next Payment</td>
	<td bgcolor="DBE5F1">End Date</td>
  </tr>
$%for 1 to StandingOrderList[C].lastInstance() $
  <tr>
    <td bgcolor="DBE5F1">$$StandingOrderList[C].ToAcctName$</td>
    <td bgcolor="DBE5F1">$$StandingOrderList[C].ToAcctNo$</td>
	<td bgcolor="DBE5F1">$$StandingOrderList[C].Currency$</td>
	<td bgcolor="DBE5F1">$$StandingOrderList[C].CurrentAmountBal$</td>
	<td bgcolor="DBE5F1">$$StandingOrderList[C].Frequency$</td>
	<td bgcolor="DBE5F1">$$StandingOrderList[C].CurrFreqDate$</td>
	<td bgcolor="DBE5F1">$$StandingOrderList[C].CurrentEndDate$</td>
  </tr>
$%endfor$
</table>

$%endif$
</pdf>