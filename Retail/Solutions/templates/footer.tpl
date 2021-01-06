<!--
 * $RCSfile$
 * $Author$
 * $Revision$
 * $Date$
-->
    $%IF PRESENTATIONTYPE.LAYOUTCONTROL == "HTML Divs" || PRESENTATIONTYPE.LAYOUTCONTROL == "HTML DispInlineBlock"$
        $%IF PRESENTATIONTYPE.LAYOUTCONTROL == "HTML Divs"$
            <div style="clear:both"></div>
        $%ENDIF$
      </div>
	$%else$
	    </table>
	$%endif$     
    </form>
$%if PRESENTATIONTYPE != Portlet || IS_RUNPREVIEW == "Y"$
  </body>
</html>
$%endif$
