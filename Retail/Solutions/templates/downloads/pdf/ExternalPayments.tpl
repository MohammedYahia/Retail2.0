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

$%if InputParameters[C].SelectedAccountDetails[1].ShortTitle[C].NickName != ''$
<tr><td bgcolor="DBE5F1">Account name</td><td bgcolor="DBE5F1">$$InputParameters[C].SelectedAccountDetails[1].ShortTitle[C].NickName$</td></tr>
$%endif$

$%if InputParameters[C].SelectedAccountDetails[1].ShortTitle[C].NickName == '' AND InputParameters[C].SelectedAccountDetails[1].AccountName != ''$
<tr><td bgcolor="DBE5F1">Account name</td><td bgcolor="DBE5F1">$$InputParameters[C].SelectedAccountDetails[1].AccountName$</td></tr>
$%endif$

$%if InputParameters[C].SelectedAccountDetails[1].AccountNumber != ''$ 
<tr><td bgcolor="DBE5F1">Account number</td><td bgcolor="DBE5F1">$$InputParameters[C].SelectedAccountDetails[1].AccountNumber$</td></tr>
$%endif$

$%if ScreenElements[1].ExternalPayments[1].PaymentAmount != ''$
<tr><td bgcolor="DBE5F1">Amount</td><td bgcolor="DBE5F1">$$ScreenElements[1].ExternalPayments[1].PaymentAmountCcy$</td></tr>
$%endif$
 
</table>

<table width="100%" border="1" bordercolor="ffffff" cellspacing="2" cellpadding="5" cellsfitpage="true">  
<tr><td rowspan="2"><font size="10"><b>CREDIT ACCOUNT DETAILS</b></font><font size="8"></td></tr> 
</table>

<table width="100%" border="0" cellspacing="2" cellpadding="2"> 

$%if createExternalPaymentOrder[1].Response[1].SepaInstantPaymentResponse[1].body[1].beneficiaryName != ''$ 
<tr><td bgcolor="DBE5F1">Account name</td><td bgcolor="DBE5F1">$$createExternalPaymentOrder[1].Response[1].SepaInstantPaymentResponse[1].body[1].beneficiaryName$</td></tr>
$%endif$ 

$%if createExternalPaymentOrder[1].Response[1].SepaInstantPaymentResponse[1].body[1].beneficiaryIBAN != ''$ 
<tr><td bgcolor="DBE5F1">IBAN</td><td bgcolor="DBE5F1">$$createExternalPaymentOrder[1].Response[1].SepaInstantPaymentResponse[1].body[1].beneficiaryIBAN$</td></tr>
$%endif$

$%if createExternalPaymentOrder[1].Response[1].SepaInstantPaymentResponse[1].body[1].beneficiaryAccountId != ''$ 
<tr><td bgcolor="DBE5F1">Account number</td><td bgcolor="DBE5F1">$$createExternalPaymentOrder[1].Response[1].SepaInstantPaymentResponse[1].body[1].beneficiaryAccountId$</td></tr>
$%endif$ 

</table>
</pdf>

