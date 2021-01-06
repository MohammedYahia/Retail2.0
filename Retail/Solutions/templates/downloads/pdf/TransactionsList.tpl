<pdf baseFont="Helvetica,Cp1252,false">

<page>
<footer page="y"></footer>
<right><img src="$$PROJECTHOME$/images/TCIBIcons/img_logo.jpg" width="100" height="35"></img></right>
<center>

<br />
<br />
<font size="15">Your Transactions List</font>
<br />
<br />

<font size="8">		
<table width="100%" border="0" bordercolor="ffffff" cellspacing="2" cellpadding="2">

<tr><td bgcolor="95B3D7">Account Number:  $$InputParameters[1].AccountNo$</td></tr>
</table>


<table width="100%" border="1" bordercolor="ffffff" cellspacing="2" cellpadding="2">
  <tr>
    <td bgcolor="DBE5F1">Date</td>
	<td bgcolor="DBE5F1">Description</td>
	<td bgcolor="DBE5F1">Amount&nbsp;($$InputParameters[1].AccountCurrencyPrefix$)</td>
	$%if InputParameters[1].ListType = 'COMPLETED'$
	<td bgcolor="DBE5F1">$$WorkingElements[1].DynamicColumn$ ($$InputParameters[1].AccountCurrencyPrefix$)</td>
	$%endif$
  </tr>
$%for 1 to TransactionsList[C].lastInstance() $
  <tr>
    <td bgcolor="DBE5F1">$$TransactionsList[C].BookingDate$</td>
    <td bgcolor="DBE5F1">$$TransactionsList[C].Narrative$ $$TransactionsList[C].parentCategoryName$ $$TransactionsList[C].CategoryName$</td>
	<td bgcolor="DBE5F1">$$TransactionsList[C].StmtAmount$</td>
	$%if InputParameters[1].ListType = 'COMPLETED'$
	<td bgcolor="DBE5F1">$$TransactionsList[C].StmtBalance$</td>
	$%endif$
  </tr>
$%endfor$
</table>

$%endif$
</pdf>