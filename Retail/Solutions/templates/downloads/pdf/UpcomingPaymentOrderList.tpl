<pdf baseFont="Helvetica,Cp1252,false">

<page>
<footer page="y"></footer>
<right><img src="$$PROJECTHOME$/images/TCIBIcons/img_logo.jpg" width="100" height="35"></img></right>
<center>

<br />
<br />
<font size="15">Upcoming $$!MAINSESSION.TRANSFER_TYPE$</font>
<br />
<br />

<font size="8">		
<table width="100%" border="0" bordercolor="ffffff" cellspacing="2" cellpadding="2">

<tr><td bgcolor="95B3D7">Account Number:  $$InputParameters[1].SelectedAccountDetails[1].AccountNo$</td></tr>
</table>


<table width="100%" border="1" bordercolor="ffffff" cellspacing="2" cellpadding="2">
  <tr>
    <td bgcolor="DBE5F1">Date</td>
	<td bgcolor="DBE5F1">Reference</td>
	<td bgcolor="DBE5F1">Description</td>
	<td bgcolor="DBE5F1">Amount</td>
  </tr>

  $%for 1 to PaymentOrderList[C].lastInstance() $
  <tr>
    <td bgcolor="DBE5F1">$$PaymentOrderList[C].PaymentExecutionDate$</td>
    <td bgcolor="DBE5F1">$$PaymentOrderList[C].id$</td>
	$%if WorkingElements[1].Flags[1].FutureTransferType == 'Transfer'$<td bgcolor="DBE5F1">Transfer to $$PaymentOrderList[C].CreditAccountName$ ($$PaymentOrderList[C].CreditAccount$)</td>$%endif$
	$%if WorkingElements[1].Flags[1].FutureTransferType == 'Payment'$<td bgcolor="DBE5F1">$$PaymentOrderList[C].BeneficiaryName$</td>$%endif$
	<td bgcolor="DBE5F1">$$PaymentOrderList[C].CurrencySymbol$ $$PaymentOrderList[C].PaymentAmount$</td>
  </tr>
$%endfor$
</table>

$%endif$
</pdf>