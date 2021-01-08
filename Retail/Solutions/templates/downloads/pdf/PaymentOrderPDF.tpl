<pdf baseFont="Helvetica,Cp1252,false">
<page>
<footer align="center" page="y"></footer>
<right><img src="$$PROJECTHOME$/images/TCIBIcons/img_logo.jpg" width="100" height="35"></img>
<center>
<br />
<br />
<font size="15">Payment Details </font>
<br />
<br />
<font size="8">
<table width="100%" border="0" bordercolor="ffffff" cellspacing="2" cellpadding="2">
<tr><td bgcolor="95B3D7">Customer name </td><td bgcolor="95B3D7"> $$InputParameters[C].CustomerName$ </td></tr>
</table>

<table width="100%" border="1" bordercolor="ffffff" cellspacing="2" cellpadding="5" cellsfitpage="true">  
<tr><td rowspan="2"><font size="10"><b>DEBIT YOUR ACCOUNT</b></font><font size="8"></td></tr> 
</table>

<table width="100%" border="0" cellspacing="2" cellpadding="2"> 



<tr><td bgcolor="DBE5F1">Transaction reference</td>
$%if ScreenElements[1].PaymentOrderInput[1].PaymentExecutionDateList == 'RecurringPayment'$
<td bgcolor="DBE5F1">$$WorkingElements[1].StandingOrderId$</td>
$%endif$
$%if ScreenElements[1].PaymentOrderInput[1].PaymentExecutionDateList == 'Immediate' OR ScreenElements[1].PaymentOrderInput[1].PaymentExecutionDateList == 'FutureDate' OR ScreenElements[1].PaymentOrderInput[1].PaymentExecutionDateList == ''$
<td bgcolor="DBE5F1">$$ScreenElements[1].PaymentOrderInput[1].Id$</td>
$%endif$
</tr>

$%if InputParameters[C].AccountName != '' AND ScreenElements[1].PaymentOrderInput[1].PaymentOrderProduct == 'ACTRF'$
<tr><td bgcolor="DBE5F1">Account name</td><td bgcolor="DBE5F1">$$InputParameters[C].AccountName$</td></tr>
$%endif$

$%if InputParameters[C].FromAccount[C].AccountName != '' AND ScreenElements[1].PaymentOrderInput[1].PaymentOrderProduct != 'ACTRF'$
<tr><td bgcolor="DBE5F1">Account name</td><td bgcolor="DBE5F1">$$InputParameters[C].FromAccount[C].AccountName$</td></tr>
$%endif$

$%if ScreenElements[1].PaymentOrderInput[1].DebitAccount != ''$ 
<tr><td bgcolor="DBE5F1">Account number</td><td bgcolor="DBE5F1">$$ScreenElements[1].PaymentOrderInput[1].DebitAccount$</td></tr>
$%endif$

$%if ScreenElements[1].PaymentOrderInput[1].PaymentAmount != ''$
<tr><td bgcolor="DBE5F1">Amount to send</td><td bgcolor="DBE5F1">$$ScreenElements[1].PaymentOrderInput[1].CurrencySymbol$ $$ScreenElements[1].PaymentOrderInput[1].PaymentAmount$</td></tr>
$%endif$

$%if ScreenElements[1].PaymentOrderInput[1].TotalDebitAmount != ''$
<tr><td bgcolor="DBE5F1">Total amount debited</td><td bgcolor="DBE5F1">$$WorkingElements[1].DebitAccCurr$ $$ScreenElements[1].PaymentOrderInput[1].TotalDebitAmount$</td></tr>
$%endif$

$%if ScreenElements[1].PaymentOrderInput[1].OrderingPaymentFxCustRate != ''$ 
<tr><td bgcolor="DBE5F1">Exchange rate </td><td bgcolor="DBE5F1">$$ScreenElements[1].PaymentOrderInput[1].OrderingPaymentFxCustRate$</td></tr>
$%endif$

$%if ScreenElements[1].PaymentOrderInput[1].IndicativeRate != ''$ 
<tr><td bgcolor="DBE5F1">Indicative exchange rate </td><td bgcolor="DBE5F1">$$ScreenElements[1].PaymentOrderInput[1].IndicativeRate$</td></tr>
$%endif$
 
$%if ScreenElements[1].PaymentOrderInput[1].PaymentExecutionDateList == 'Immediate'$ 
<tr><td bgcolor="DBE5F1">When money is to leave your account</td><td bgcolor="DBE5F1">Immediately (as soon as possible)</td></tr>
$%endif$ 
 
$%if ScreenElements[1].PaymentOrderInput[1].PaymentExecutionDateList == 'FutureDate'$ 
<tr><td bgcolor="DBE5F1">On a future date</td><td bgcolor="DBE5F1">$$ScreenElements[1].PaymentOrderInput[1].PaymentExecutionDate$</td></tr> 
$%endif$

$%if ScreenElements[1].PaymentOrderInput[1].PaymentExecutionDateList == 'RecurringPayment'$ 
<tr><td bgcolor="DBE5F1">When money is to leave your account</td><td bgcolor="DBE5F1">As a recurring payment or standing order</td></tr> 
 
$%if ScreenElements[1].PaymentOrderInput[1].StartDate != ''$ 
<tr><td bgcolor="DBE5F1">Start date</td><td bgcolor="DBE5F1">$$ScreenElements[1].PaymentOrderInput[1].StartDate$</td></tr>
$%endif$ 
 
$%if ScreenElements[1].PaymentOrderInput[1].CurrentEndDate != ''$ 
<tr><td bgcolor="DBE5F1">End date</td><td bgcolor="DBE5F1">$$ScreenElements[1].PaymentOrderInput[1].CurrentEndDate$</td></tr>
$%endif$ 
 
$%if ScreenElements[1].PaymentOrderInput[1].Frequency != ''$ 
<tr><td bgcolor="DBE5F1">Frequency</td><td bgcolor="DBE5F1">$$ScreenElements[1].PaymentOrderInput[1].Frequency$</td></tr>
$%endif$ 
 
$%if ScreenElements[1].PaymentOrderInput[1].UntilFurtherNotice != ''$ 
<tr><td bgcolor="DBE5F1">Until further notice</td><td bgcolor="DBE5F1">$$ScreenElements[1].PaymentOrderInput[1].UntilFurtherNotice$</td></tr>
$%endif$ 
$%endif$
</table>

<table width="100%" border="1" bordercolor="ffffff" cellspacing="2" cellpadding="5" cellsfitpage="true">  
<tr><td rowspan="2"><font size="10"><b>CHARGES</b></font><font size="8"></td></tr> 
</table>

<table width="100%" border="0" cellspacing="2" cellpadding="2"> 
$%if ScreenElements[1].PaymentOrderInput[1].ChargeBearer != ''$ 
<tr><td bgcolor="DBE5F1">Charge Bearer</td><td bgcolor="DBE5F1">$$ScreenElements[1].PaymentOrderInput[1].ChargeBearer.value()$</td></tr>
$%endif$

$%if ScreenElements[1].PaymentOrderInput[1].TotalChargeCalculated != 0$ 
<tr><td bgcolor="DBE5F1">Charges to me</td><td bgcolor="DBE5F1">$$ScreenElements[1].PaymentOrderInput[1].ChargeAccountCcySymbol$ $$ScreenElements[1].PaymentOrderInput[1].TotalChargeCalculated$ </td></tr>
$%endif$ 
</table>

$%if ScreenElements[1].PaymentOrderInput[1].PaymentOrderProduct == 'ACTRF'$ 
<table width="100%" border="1" bordercolor="ffffff" cellspacing="2" cellpadding="5" cellsfitpage="true">  
<tr><td rowspan="2"><font size="10"><b>CREDIT ACCOUNT DETAILS</b></font><font size="8"></td></tr> 
</table>

<table width="100%" border="0" cellspacing="2" cellpadding="2"> 
$%if ScreenElements[1].PaymentOrderInput[1].CreditAccountName != ''$ 
<tr><td bgcolor="DBE5F1">Credit account name</td><td bgcolor="DBE5F1">$$ScreenElements[1].PaymentOrderInput[1].CreditAccountName$</td></tr>
$%endif$ 
$%if ScreenElements[1].PaymentOrderInput[1].CreditAccount != ''$ 
<tr><td bgcolor="DBE5F1">Credit account number</td><td bgcolor="DBE5F1">$$ScreenElements[1].PaymentOrderInput[1].CreditAccount$</td></tr>
$%endif$ 
$%if ScreenElements[1].PaymentOrderInput[1].FormattedExecutionDate != ''$ 
<tr><td bgcolor="DBE5F1">When</td><td bgcolor="DBE5F1">$$ScreenElements[1].PaymentOrderInput[1].FormattedExecutionDate$</td></tr>
$%endif$ 
</table>
$%endif$
$%if ScreenElements[1].PaymentOrderInput[1].PaymentOrderProduct != 'ACTRF'$ 
$%if ScreenElements[1].PaymentOrderInput[1].BeneficiaryIban != '' OR WorkingElements[1].InstitutionIBAN[C].IbanInstitution != '' OR ScreenElements[1].PaymentOrderInput[1].BIC[C].BeneficiaryBIC != '' OR ScreenElements[1].PaymentOrderInput[1].BenBankClearingCode != '' OR WorkingElements[1].DeBic[C].Institution[C].DeBicInstitution != '' OR ScreenElements[1].Payeename[C].PayeeName != '' OR SelectedUtilityBeneficiary[1].Nickname[C].Nickname != ''$ 
<table width="100%" border="1" bordercolor="ffffff" cellspacing="2" cellpadding="5" cellsfitpage="true">  
<tr><td rowspan="2"><font size="10"><b>CREDIT PAYEE ACCOUNT AND BANK DETAILS</b></font><font size="8"></td></tr> 
</table>

<table width="100%" border="0" cellspacing="2" cellpadding="2"> 
$%if ScreenElements[1].PaymentOrderInput[1].BeneficiaryAccountNo != ''$ 
<tr><td bgcolor="DBE5F1">Payee account number</td><td bgcolor="DBE5F1">$$ScreenElements[1].PaymentOrderInput[1].BeneficiaryAccountNo$</td></tr>
$%endif$ 

$%if ScreenElements[1].PaymentOrderInput[1].BeneficiaryAccountNo == '' AND ScreenElements[1].PaymentOrderInput[1].BeneficiaryIban != ''$ 
<tr><td bgcolor="DBE5F1">Payee account number</td><td bgcolor="DBE5F1">$$ScreenElements[1].PaymentOrderInput[1].BeneficiaryIban$</td></tr>
$%endif$ 

$%if ScreenElements[1].SelectedPaymentMethod == '1' AND ScreenElements[1].PaymentOrderInput[1].BeneficiaryIban != ''$ 
<tr><td bgcolor="DBE5F1">IBAN</td><td bgcolor="DBE5F1">$$ScreenElements[1].PaymentOrderInput[1].BeneficiaryIban$</td></tr>

$%if WorkingElements[1].InstitutionIBAN[A].IbanInstitution != ''$  
<tr><td bgcolor="DBE5F1">Bank name</td><td bgcolor="DBE5F1">$$WorkingElements[1].InstitutionIBAN[A].IbanInstitution$</td></tr>
$%endif$
$%endif$  

$%if ScreenElements[1].SelectedPaymentMethod == '2' AND ScreenElements[1].PaymentOrderInput[1].BIC[C].BeneficiaryBIC != ''$ 
<tr><td bgcolor="DBE5F1">BIC code</td><td bgcolor="DBE5F1">$$ScreenElements[1].PaymentOrderInput[1].BIC[C].BeneficiaryBIC$</td></tr>

$%if WorkingElements[1].DeBic[C].Institution[C].DeBicInstitution != ''$
<tr><td bgcolor="DBE5F1">Institution</td><td bgcolor="DBE5F1">$$WorkingElements[1].DeBic[C].Institution[C].DeBicInstitution$</td></tr>
$%endif$
$%endif$

$%if ScreenElements[1].SelectedPaymentMethod == '3' OR ScreenElements[1].SelectedPaymentMethod == '4'$ 
$%if ScreenElements[1].PaymentOrderInput[1].BenBankClearingCode != ''$
<tr><td bgcolor="DBE5F1">Beneficiary bank clearing code </td><td bgcolor="DBE5F1">$$ScreenElements[1].PaymentOrderInput[1].BenBankClearingCode$</td></tr>
$%endif$
$%if ScreenElements[1].PaymentOrderInput[1].AcctWithBankClearingCode != ''$
<tr><td bgcolor="DBE5F1">Account with bank clearing code</td><td bgcolor="DBE5F1">$$ScreenElements[1].PaymentOrderInput[1].AcctWithBankClearingCode$</td></tr>
$%endif$
$%if WorkingElements[1].DeBic[C].Institution[C].DeBicInstitution != ''$
<tr><td bgcolor="DBE5F1">Institution</td><td bgcolor="DBE5F1">$$WorkingElements[1].DeBic[C].Institution[C].DeBicInstitution$</td></tr>
$%endif$
$%endif$

$%if ScreenElements[1].SelectedPaymentMethod == '5' AND ScreenElements[1].PaymentOrderInput[1].BeneficiaryIban != ''$  
<tr><td bgcolor="DBE5F1">IBAN</td><td bgcolor="DBE5F1">$$ScreenElements[1].PaymentOrderInput[1].BeneficiaryIban$</td></tr>

$%if WorkingElements[1].InstitutionIBAN[A].IbanInstitution != ''$
<tr><td bgcolor="DBE5F1">Institution</td><td bgcolor="DBE5F1">$$WorkingElements[1].InstitutionIBAN[A].IbanInstitution$</td></tr>
$%endif$
$%endif$

$%if ScreenElements[1].Payeename[C].PayeeName != ''$
<tr><td bgcolor="DBE5F1">Payee name</td><td bgcolor="DBE5F1">$$ScreenElements[1].Payeename[C].PayeeName$</td></tr>
$%endif$

$%if SelectedUtilityBeneficiary[1].Nickname[C].Nickname != ''$
$%if WorkingElements[1].DeBic[C].Institution[C].DeBicInstitution != ''$
<tr><td bgcolor="DBE5F1">Institution</td><td bgcolor="DBE5F1">$$WorkingElements[1].DeBic[C].Institution[C].DeBicInstitution$</td></tr>
$%endif$
<tr><td bgcolor="DBE5F1">Payee name</td><td bgcolor="DBE5F1">$$SelectedUtilityBeneficiary[1].Nickname[C].Nickname$</td></tr>
$%endif$

$%if ScreenElements[1].PaymentOrderInput[1].FormattedExecutionDate != ''$ 
<tr><td bgcolor="DBE5F1">When</td><td bgcolor="DBE5F1">$$ScreenElements[1].PaymentOrderInput[1].FormattedExecutionDate$</td></tr>
$%endif$ 

</table>
$%endif$
$%endif$

$%if ScreenElements[1].PaymentOrderInput[1].Narrative[C].Narrative != '' OR ScreenElements[1].PaymentOrderInput[1].AdditionalInfo[C].AdditionalInfo != ''$
<table width="100%" border="1" bordercolor="ffffff" cellspacing="2" cellpadding="5" cellsfitpage="true">  
<tr><td rowspan="2"><font size="10"><b>PAYMENT REFERENCES</b></font><font size="8"></td></tr> 
</table>

<table width="100%" border="0" cellspacing="2" cellpadding="2"> 
$%if ScreenElements[1].PaymentOrderInput[1].Narrative[C].Narrative != ''$
<tr><td bgcolor="DBE5F1">Reference</td><td bgcolor="DBE5F1">$$ScreenElements[1].PaymentOrderInput[1].Narrative[C].Narrative$</td></tr>
$%endif$

$%if ScreenElements[1].PaymentOrderInput[1].AdditionalInfo[C].AdditionalInfo != '' AND ScreenElements[1].PaymentOrderInput[1].PaymentOrderProduct != 'ACTRF'$
<tr><td bgcolor="DBE5F1">My reference</td><td bgcolor="DBE5F1">$$ScreenElements[1].PaymentOrderInput[1].AdditionalInfo[C].AdditionalInfo$</td></tr>
$%endif$ 

$%if ScreenElements[1].PaymentOrderInput[1].PaymentOrderProduct != ''$
<tr><td bgcolor="DBE5F1">Payment order product</td><td bgcolor="DBE5F1">$$ScreenElements[1].PaymentOrderInput[1].PaymentOrderProduct$</td></tr>
$%endif$ 

$%if ScreenElements[1].SelectedPaymentMethod != '' AND ScreenElements[1].PaymentOrderInput[1].PaymentOrderProduct != 'ACTRF'$
<tr><td bgcolor="DBE5F1">Payment method</td><td bgcolor="DBE5F1">$$ScreenElements[1].SelectedPaymentMethod.value()$</td></tr>
$%endif$
</table>
$%endif$
</pdf>

