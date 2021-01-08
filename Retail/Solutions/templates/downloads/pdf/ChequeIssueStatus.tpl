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
    <td bgcolor="DBE5F1">Request date</td>
	<td bgcolor="DBE5F1">Start Cheque number</td>
	<td bgcolor="DBE5F1">Cheque Book Type</td>
	<td bgcolor="DBE5F1">Cheque Book Status</td>
	  </tr>
$%for 1 to ChequeIssueDetails[C].lastInstance() $
  <tr>
    <td bgcolor="DBE5F1">$$ChequeIssueDetails[C].FormattedDate$</td>
    <td bgcolor="DBE5F1">$$ChequeIssueDetails[C].ChqNoStart$</td>
	<td bgcolor="DBE5F1">$$ChequeIssueDetails[C].Description$</td>
	<td bgcolor="DBE5F1">$$ChequeIssueDetails[C].ChequeStatus$</td>
	
	
  </tr>
$%endfor$
</table>

$%endif$
</pdf>