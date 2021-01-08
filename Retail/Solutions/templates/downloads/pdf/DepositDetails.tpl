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
<tr><td rowspan="2"><font size="10"><b>DEBIT YOUR ACCOUNT</b></font><font size="8"></td></tr>
</table>

<table width="100%" border="0" cellspacing="2" cellpadding="2"> 

$%if InputParameters[1].AccountsList[C].ShortTitle[C].NickName != '' AND FundsTransfer[1].TransactionType == 'ACDF'$
<tr><td bgcolor="DBE5F1">Account name</td><td bgcolor="DBE5F1">$$InputParameters[1].AccountsList[C].ShortTitle[C].NickName$</td></tr>
$%endif$

$%if InputParameters[1].ProductDescription != '' AND FundsTransfer[1].TransactionType != 'ACDF'$
<tr><td bgcolor="DBE5F1">Account name</td><td bgcolor="DBE5F1">$$InputParameters[1].ProductDescription$</td></tr>
$%endif$

$%if FundsTransfer[1].DebitAcctNo != '' AND FundsTransfer[1].TransactionType == 'ACDF'$ 
<tr><td bgcolor="DBE5F1">Account number</td><td bgcolor="DBE5F1">$$FundsTransfer[1].DebitAcctNo$</td></tr>
$%endif$

$%if InputParameters[1].AccountNumber != '' AND FundsTransfer[1].TransactionType != 'ACDF'$
<tr><td bgcolor="DBE5F1">Account number</td><td bgcolor="DBE5F1">$$InputParameters[1].AccountNumber$</td></tr>
$%endif$

$%if FundsTransfer[1].debitAmount != '' AND FundsTransfer[1].TransactionType == 'ACDF'$
<tr><td bgcolor="DBE5F1">Debit amount</td><td bgcolor="DBE5F1">$$ScreenElements[1].AddFunds[1].CcySymbol$ $$FundsTransfer[1].debitAmount$</td></tr>
$%endif$

$%if FundsTransfer[1].debitAmount != '' AND FundsTransfer[1].TransactionType != 'ACDF'$
<tr><td bgcolor="DBE5F1">Debit amount</td><td bgcolor="DBE5F1">$$WorkingElements[1].CurrencySymbol$ $$FundsTransfer[1].debitAmount$</td></tr>
$%endif$

$%if AAWithdraw[1].TxnAmount != ''$
<tr><td bgcolor="DBE5F1">Debit amount</td><td bgcolor="DBE5F1">$$WorkingElements[1].CurrencySymbol$ $$AAWithdraw[1].TxnAmount$</td></tr>
$%endif$

$%if BillDetails[C].TotalAmount != ''$
<tr><td bgcolor="DBE5F1">Debit amount</td><td bgcolor="DBE5F1">$$WorkingElements[1].CurrencySymbol$ $$BillDetails[C].TotalAmount$</td></tr>
$%endif$

$%if FundsTransfer[1].CustomerRate != ''$ 
<tr><td bgcolor="DBE5F1">Exchange rate </td><td bgcolor="DBE5F1">$$FundsTransfer[1].CustomerRate$</td></tr>
$%endif$
 
</table>

<table width="100%" border="1" bordercolor="ffffff" cellspacing="2" cellpadding="5" cellsfitpage="true">  
<tr><td rowspan="2"><font size="10"><b>CREDIT ACCOUNT DETAILS</b></font><font size="8"></td></tr> 
</table>

<table width="100%" border="0" cellspacing="2" cellpadding="2"> 

$%if InputParameters[1].AccountsList[C].ShortTitle[C].NickName != '' AND FundsTransfer[1].TransactionType != 'ACDF'$ 
<tr><td bgcolor="DBE5F1">Credit account name</td><td bgcolor="DBE5F1">$$InputParameters[1].AccountsList[C].ShortTitle[C].NickName$</td></tr>
$%endif$ 

$%if InputParameters[1].ProductDescription != '' AND FundsTransfer[1].TransactionType == 'ACDF'$ 
<tr><td bgcolor="DBE5F1">Credit account name</td><td bgcolor="DBE5F1">$$InputParameters[1].ProductDescription$</td></tr>
$%endif$ 

$%if FundsTransfer[1].CreditAcctNo != '' AND FundsTransfer[1].TransactionType == 'ACDF'$ 
<tr><td bgcolor="DBE5F1">Credit account number</td><td bgcolor="DBE5F1">$$FundsTransfer[1].CreditAcctNo$</td></tr>
$%endif$

$%if InputParameters[1].AccountsList[C].AccountNo != '' AND FundsTransfer[1].TransactionType != 'ACDF'$ 
<tr><td bgcolor="DBE5F1">Credit account number</td><td bgcolor="DBE5F1">$$InputParameters[1].AccountsList[C].AccountNo$</td></tr>
$%endif$ 

$%if FundsTransfer[1].CreditAmount != '' AND FundsTransfer[1].TransactionType == 'ACDF'$
<tr><td bgcolor="DBE5F1">Amount to send</td><td bgcolor="DBE5F1">$$ScreenElements[1].AddFunds[1].CcySymbol$ $$FundsTransfer[1].CreditAmount$</td></tr>
$%endif$

</table>

$%endif$
</pdf>

