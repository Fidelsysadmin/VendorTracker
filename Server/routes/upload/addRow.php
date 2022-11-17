<?php
/******************************************************************
 * Project: LST Application for internal usage @Fidel
 * Purpose: custom page for add extra row in clientSummary form
 * Author: Chetan Jadhav
 * Start Date:
 *******************************************************************/

// global variables
global $db, $app_list_strings;
include ("en_us.lang.php");
$arLanguage = $app_list_strings['ft_dd_language'];
$arTaskType = $app_list_strings['ft_dd_task_type'];
$arUOM = $app_list_strings['ft_dd_uom'];

?>
<tr id="clientDetailsRow">
<?php

echo '<th scope="row"><select name="sourceLanguage[]" id="sourceLanguage" class="formElement" required>';

foreach ($_REQUEST['fromLanguage'] as $key => $value)
{
    echo "<option value=$value>$arLanguage[$value]</option>";
} // showing from language values
echo '</select></th>';
echo '<th scope="row"><select name="targetLanguage[]" id="targetLanguage" class="formElement" required>';

foreach ($_REQUEST['toLanguage'] as $key => $value)
{
    echo "<option value=$value>$arLanguage[$value]</option>";
} // showing to langauge values
echo '</select></th>';
echo '<th scope="row"><select name="taskType[]" id="taskType" class="formElement" required>';

foreach ($arTaskType as $key => $value)
{
	$key = str_replace(" ", "__", $key);
	//$value = str_replace(" ", "__", $value);
    echo "<option value=$key>$value</option>";
} // showing task type values
echo '</select></th>';
echo "<th scope='row'><input type='text' name='volume[]' id='volume' required></th>";
echo '</select></th>';
echo '<th scope="row"><select name="unit[]" id="unit" class="formElement" required>';

foreach ($arUOM as $key => $value)
{
    echo "<option value=$key>$value</option>";
} // showing UOM values
echo '</select></th>';
echo '<th scope="row"><input type="button" class="btnDelete" onclick="deleteCorrespondingRow()" name="remove" id="remove" value="(-Remove)"> </th>';
?>

</tr>
