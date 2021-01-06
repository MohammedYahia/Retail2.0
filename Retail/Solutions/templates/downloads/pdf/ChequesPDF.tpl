<pdf baseFont="Helvetica,Cp1252,false">

<page>
<footer page="y"></footer>
<right><img src="$$PROJECTHOME$/images/TCIBIcons/img_logo.jpg" width="100" height="35"></img></right>
<center>

<br />
<br />
<font size="15">Your Cheques</font>
<br />
<br />

<font size="8">		
<table width="100%" border="0" bordercolor="ffffff" cellspacing="2" cellpadding="2">

<tr><td bgcolor="95B3D7">Account Number:  $$InputParameters[1].AccountNo$</td></tr>
</table>


<table width="100%" border="1" bordercolor="ffffff" cellspacing="2" cellpadding="2">
  <tr>
    <td bgcolor="DBE5F1">Date</td>
	<td bgcolor="DBE5F1">Cheque Number</td>
	<td bgcolor="DBE5F1">Amount</td>
	<td bgcolor="DBE5F1">Status</td>
	  </tr>
$%for 1 to ChequeDetails[C].lastInstance() $
  <tr>
    <td bgcolor="DBE5F1">$$ChequeDetails[C].Date$</td>
    <td bgcolor="DBE5F1">$$ChequeDetails[C].ChequeNo$</td>
	<td bgcolor="DBE5F1">$$ChequeDetails[C].Amount$</td>
	<td bgcolor="DBE5F1">$$ChequeDetails[C].Status$</td>
	
	
  </tr>
$%endfor$
</table>

$%endif$
</pdf>