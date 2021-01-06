<pdf baseFont="Helvetica,Cp1252,false">
<page>
<footer page="y"></footer>
<right><img src="$$PROJECTHOME$/images/TCIBIcons/img_logo.jpg" width="100" height="35"></img>
<center>
<br />
<br />
<font size="15">Payment Details </font>
<br />
<br />
<font size="8">

<table width="100%" border="1" bordercolor="ffffff" cellspacing="2" cellpadding="5" cellsfitpage="true">  
<tr><td rowspan="2"><font size="10"><b>DEBIT ACCOUNT DETAILS</b></font><font size="8"></td></tr>
</table>

<table width="100%" border="0" cellspacing="2" cellpadding="2"> 

$%if InputParameters[1].AccountsList[C].AccountName != ''$
<tr><td bgcolor="DBE5F1">Account name</td><td bgcolor="DBE5F1">$$InputParameters[1].AccountsList[C].AccountName$</td></tr>
$%endif$

$%if FundsTransfer[1].DebitAcctNo != ''$ 
<tr><td bgcolor="DBE5F1">Account number</td><td bgcolor="DBE5F1">$$FundsTransfer[1].DebitAcctNo$</td></tr>
$%endif$

$%if FundsTransfer[1].CreditAmount != ''$
<tr><td bgcolor="DBE5F1">Amount to send</td><td bgcolor="DBE5F1">$$InputParameters[1].SelectedLoanDetails[1].CurrencyPrefix$ $$FundsTransfer[1].CreditAmount$</td></tr>
$%endif$

$%if FundsTransfer[1].CustomerRate != ''$ 
<tr><td bgcolor="DBE5F1">Exchange rate </td><td bgcolor="DBE5F1">$$FundsTransfer[1].CustomerRate$</td></tr>
$%endif$
 
</table>

<table width="100%" border="1" bordercolor="ffffff" cellspacing="2" cellpadding="5" cellsfitpage="true">  
<tr><td rowspan="2"><font size="10"><b>CREDIT ACCOUNT DETAILS</b></font><font size="8"></td></tr> 
</table>

<table width="100%" border="0" cellspacing="2" cellpadding="2"> 
$%if InputParameters[1].SelectedLoanDetails[1].LinkedAppl[C].AccountTite != ''$ 
<tr><td bgcolor="DBE5F1">Credit account name</td><td bgcolor="DBE5F1">$$InputParameters[1].SelectedLoanDetails[1].LinkedAppl[C].AccountTite$</td></tr>
$%endif$ 
$%if FundsTransfer[1].CreditAcctNo != ''$ 
<tr><td bgcolor="DBE5F1">Credit account number</td><td bgcolor="DBE5F1">$$FundsTransfer[1].CreditAcctNo$</td></tr>
$%endif$ 
</table>
</pdf>

