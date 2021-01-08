<pdf baseFont="Helvetica,Cp1252,false">

<page>
<footer page="y"></footer>
<right><img src="$$PROJECTHOME$/images/TCIBIcons/img_logo.jpg" width="100" height="35"></img></right>
<center>
<br />
<br />
<font size="15">Collateral Details</font>
<br />
<br />


<font size="8">
$%if CollateralDetails[C].lastInstance() != -1$
<table width="100%" border="1" bordercolor="ffffff" cellspacing="2" cellpadding="2">
  <tr>
    <td bgcolor="DBE5F1" ><b>Description</b></td>
	<td bgcolor="DBE5F1" ><b>Bank claim on collateral </b></td>
  </tr>
$%for 1 to CollateralDetails[C].lastInstance() $
  <tr>
    <td bgcolor="DBE5F1">$$CollateralDetails[C].CollateralType$</td>
    <td bgcolor="DBE5F1">$$CollateralDetails[C].Currency$ $$CollateralDetails[C].NetAmountValue$</td>
  </tr>
$%endfor$
</table>
$%endif$
</pdf>