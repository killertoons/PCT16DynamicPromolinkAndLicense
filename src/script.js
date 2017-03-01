function returnCode() {
    var cid = document.getElementById('cid').value;
    var campaignName = document.getElementById('campaignName').value;
    var run = document.getElementById('run').value;
    var offer = document.getElementById('offer').value;
    var trialLicSer = document.getElementById('trialLicSer').value;
    var enabledCountries = document.getElementById('enabledCountries').value;
    var suppressedLanguages = document.getElementById('suppressedLanguages').value;
    var enabledLicenses = document.getElementById('enabledLicenses').value;
    var illegalLicenses = document.getElementById('illegalLicenses').value;
    var limit = document.getElementById('limit').value;
    var abTest = document.getElementById('abTest').value;
    var offerNames = document.getElementById('offerNames').value;
    var startDate = document.getElementById('startDate').value;
    var endDate = document.getElementById('endDate').value;
    var tracking = document.getElementById('tracking').value;
    var urlDomain = document.getElementById('urlDomain').value;
    var frequency = document.getElementById('frequency').value;
    var count = document.getElementById('count').value;
    var avStatus = document.getElementById('avStatus').value;
    var dayOfWeek = document.getElementById('dayOfWeek').value;

    var result = '';

    result += '// webhalla chain: cid' + cid + '-dis-prg\n'; 
    result += '// CMMS: '+ campaignName + '\n';
    result += '// cid: ' + cid + '\n';
    result += '// run: ' + run + '\n\n';

    result += '// conversions\n';
    result += 'if ( $IDMARK_C' + cid + 'T == ' + run + ' and $IDMARK_C' + cid + 'O == 1 ) {\n';
    result += ' if ( exists $IDMARK_C' + cid + 'TC ) {\n\n';
    result += '   // converted to trial\n';
    result += '   if ( $lic_lct == 2 and $lic_licr == 0 and $lic_ser == "' + trialLicSer + '") {\n';
    result += '     pushbi( true,"' + cid + 'e5", $lic_lct );\n';
    result += '     unset $IDMARK_C' + cid + 'TC;\n';
    result += '   }\n\n';
    result += '   // converted to free\n';      
    result += '   if ( $lic_ser == "55616639" ) {\n';
    result += '     pushbi( true,"' + cid + 'e5", $lic_lct );\n';
    result += '     unset $IDMARK_C' + cid + 'TC;\n';
    result += '    }\n';
    result += ' }\n\n';

    result += ' // converted to paid\n';       
    result += ' if ( $lic_lct == 4 ) {\n';
    result += '   if (! exists $IDMARK_C796TP) {\n';
    result += '     pushbi( true,"' + cid + 'e5", $lic_lct );\n';
    result += '     unset $IDMARK_C' + cid + 'TC;\n';
    result += '     $IDMARK_C' + cid + 'TP = 1;\n';
    result += '   }\n';
    result += ' }\n\n';

    result += ' // 30 days after expiration back to free (30 + 15 days of trial)\n';
    result += ' if ($lic_lct < 4) {\n';
    result += '   if ($datetime_ts > ($IDMARK_C' + cid + 'F + 3888000)) {\n';
    result += '     if ($lic_ser != "55616639"){\n';
    result += '       setlic("TUCAD-72T7V-PMRDE-Q9JCM-ZMBFT-LKDUH");\n';
    result += '       $IDMARK_C' + cid + 'TC = 1;\n';
    result += '       pushbi( true,"' + cid + 'e5", 1 );\n';
    result += '       $globalSentLicense = 1;\n';
    result += '       back;\n';
    result += '     }\n';
    result += '   }\n';
    result += ' }\n\n';

    result += ' // LS Cleaning part - uncomment for cleaning\n';
    result += ' /*\n';
    result += ' if ( exists $IDMARK_C' + cid + 'T ) {\n';
    result += '   unset $IDMARK_C' + cid + 'TC;\n';
    result += '   unset $IDMARK_C' + cid + 'O;\n';
    result += '   unset $IDMARK_C' + cid + 'T;\n';
    result += '   unset $IDMARK_C' + cid + 'F;\n';
    result += '   unset $IDMARK_C' + cid + 'TP;\n';
    result += '   pushbi(true,"' + cid + 'e98",' + run + ');\n';
    result += '   back;\n';
    result += ' }\n';
    result += ' */\n\n';

    result += ' //Rollback - if you want to rollback campaign please uncomment following code\n';
    result += ' /*\n';
    result += ' if ( exists $IDMARK_C' + cid + 'T ) {\n';
    result += '   if ( $IDMARK_C' + cid + 'T <= ' + run + ' ) {\n';
    result += '     if ( $IDMARK_C' + cid + 'O == 99 ) back;\n';
    result += '     else if ( $IDMARK_C' + cid + 'O < 99 ) {\n';
    result += '       $IDMARK_C' + cid + 'O = 99;\n';
    result += '       sethead( "x-avg-tnp-auto", "");\n';
    result += '       pushbi(true,"' + cid + 'e97",' + run + ');\n';
    result += '       back;\n';
    result += '     }\n';
    result += '   }\n';
    result += ' }\n';
    result += ' */\n';
    result += '}\n\n';

    result += '//Stop distribution - if you want to stop this campaign uncomment folowing back\n';
    result += '//back;\n\n';

    result += '// license resend for targeted users in illegal campaigns\n';
    result += '/*\n';
    result += 'if (exists $IDMARK_C' + cid + 'F and $lic_licr == "2" ){\n';
    result += '	sentPCTLicense($IDMARK_C' + cid + 'F, "fixed", "75", "15", "TALWZ-GRHRF-HNTHD-QAV32-23K2O-YD3JT","OO-3135");\n';
    result += '	$globalSentLicense = 1;\n';
    result += '	back;\n';
    result += '}\n';
    result += '*/\n\n';

    result += '// Conditions\n';
    result += 'if ($lic_ser != "55616639") {\n';
    result += '   pushbi( true,"' + cid + 'e95", 1 );\n';
    result += '   back;\n';
    result += '}\n\n';

    result += 'if ( exists $AKCE_MAKEID ) {\n';
    result += '   pushbi( true,"' + cid + 'e95", 1 );\n';
    result += '   back;\n';
    result += '}\n\n';

    result += 'if (! exists $Instance_LicID) {\n';
    result += '   pushbi( true,"' + cid + 'e95", 1 );\n';
    result += '   back;\n';
    result += '}\n\n';

    result += 'if ( exists $globalTrmTargetted ) back;\n\n';
    result += '// already targetted\n';
    result += 'if ($IDMARK_C' + cid + 'T == ' + run + ') back;\n\n';

    result += 'if ($lic_lct != "1") {\n';
    result += '     pushbi( true,"' + cid + 'e95", 1 );\n';
    result += '     back;\n';
    result += '}\n\n';

    result += 'if ($lic_licr != "0") {\n';
    result += '     pushbi( true,"' + cid + 'e95", 2 );\n';
    result += '     back;\n';
    result += '}\n\n';

    result += 'if ($avg_zen_present == "1") {\n';
    result += '     pushbi( true,"' + cid + 'e95", 3 );\n';
    result += '     back;\n';
    result += '}\n\n';

    result += '// build condition\n';
    result += 'if ($avg_ver gbn< "16.22.1.58906") {    // build check\n';
    result += '     pushbi(true,"' + cid + 'e95",4);\n';
    result += '     back;\n';
    result += '}\n\n';

    result += '// other promolink is distributed\n';
    result += 'private $checkGlobalPromoLinkNonExistence = cmpPcTuGlobalPromolinkCheck("autoPromolink",$globalAutoPromoLink,$globalManualPromoLink);\n';
    result += 'if (! $checkGlobalPromoLinkNonExistence ) {\n';
    result += '     pushbi(true,"' + cid + 'e95",5);\n';
    result += '     back;\n';
    result += '}\n\n';

    result += '// license was sent in other campaign\n';
    result += 'if ( exists $globalSentLicense or exists $globalTrmTargetted ) {\n';
    result += '     pushbi( true,"' + cid + 'e95", 6 );\n';
    result += '     back;\n';
    result += '}\n\n';  
    
    result += 'if (! ($ctry in "' + enabledCountries + '")) {\n';
    result += '     pushbi( true,"' + cid + 'e95", 7 );\n';
    result += '     back;\n';
    result += '}\n\n';

    result += 'private $secondsAfterInstallation = $datetime_ts - $tmInstance_UserCreated;\n';
    
    result += 'if (exists $IDMARK_TESTTIME) {\n';
    result += '     $secondsAfterInstallation = $IDMARK_TESTTIME;\n';
    result += '}\n\n';

    result += '// at least 70 days after installation\n';
    result += 'if ($secondsAfterInstallation <= 6048000) {\n';
    result += ' pushbi( true,"' + cid + 'e95", 8 );\n';    
    result += ' back;\n';
    result += '}\n\n';

    result += '// campaign should be distributed until this unix timestamp\n';
    result += 'if ($datetime_ts > 1488326399) {\n';
    result += '   back;\n';
    result += '}\n\n';

    result += '// distribuce\n';
    result += 'private $cidAttrTracking = concat("?iid=", $Instance_Instance);\n';
    result += 'private $promoHash = concat("c","' + cid + '","o","' + offer + '","e",' + run + ');\n';
    result += 'private $promoEndDate = PromoTuEndDate("' + endDate + '");\n';
    result += 'private $contentTracking = cmpPcTuTracking("38-pct_lifecycle","Trial%20Reset",$avg_prd,$avg_prod,$lic_lct);\n';
    result += 'private $webUrl = UrlDomain("' + urlDomain + '")."/' + cid + '/".$cmp_all_loc.".html";\n';
    result += 'private $promoUri = concat($webUrl, $cidAttrTracking, "&LICR=".$lic_licr."&LT=".$lic_lct."&GEOIP=".$ctry."&ZEN=".$avg_zen_present, $contentTracking);\n';
    result += 'private $promoStartDate = ' + startDate + ';\n';
    result += 'private $promoFreq = ' + frequency + ';\n';
    result += 'private $promoCount = ' + count + ';\n';
    result += 'private $promoAvStatus = "' + avStatus + '"; // yes - only show if AV is installed, no - only show if AV is NOT installed, nevermind - always show\n';
    result += 'private $promoDayOfWeek = "' + dayOfWeek + '";\n\n';
  
    result += '// autopromolink\n';
    result += 'cmpPcTuSendDynamicPromolink ($promoHash, $promoEndDate, $promoUri, $promoStartDate, $promoFreq, $promoCount, $promoAvStatus, $promoDayOfWeek);\n\n';

    result += '// track distribution\n';
    result += 'if ($IDMARK_C' + cid + 'T != ' + run + ') {\n';
    result += '   private $distribGroup = cmpPcTuDistribGroup($avg_prd,$avg_prod,$avg_avg_ver,$lic_licr,$lic_lct,$AVinZen,$avg_zen_present);\n';
    result += '   pushbi(true,"' + cid + 'e1",$distribGroup);\n';
    result += '   pushbi(true,"' + cid + 'e2",25);\n';
    result += '}\n';
    result += 'pushbi(true,"' + cid + 'e3",' + offer + ');\n';
    result += 'pushbi(true,"' + cid + 'e4",' + run + ');\n';
    result += '\n\n';

    result += '$IDMARK_C' + cid + 'T = ' + run + ';\n';
    result += '$IDMARK_C' + cid + 'O = ' + offer + ';\n';
    result += '$IDMARK_C' + cid + 'F = $datetime_ts;\n';
    result += '$IDMARK_C' + cid + 'TC = 1;\n\n';

    return result;
}

function reload(){
    
    var resultCode = '<pre>';

    resultCode += returnCode();

    resultCode += '</pre>';
    document.getElementById('result').innerHTML = resultCode;
}



function loadFile() {
    var input, file, fr;

    if (typeof window.FileReader !== 'function') {
      alert("The file API isn't supported on this browser yet.");
      return;
    }

    input = document.getElementById('fileinput');
    if (!input) {
      alert("Um, couldn't find the fileinput element.");
    }
    else if (!input.files) {
      alert("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0]) {
      alert("Please select a file before clicking 'Load'");
    }
    else {
      file = input.files[0];
      fr = new FileReader();
      fr.onload = receivedText;
      fr.readAsText(file);
    }

    function receivedText(e) {
      lines = e.target.result;
      var importedDataObj = JSON.parse(lines); 
      console.log(importedDataObj.sourceData.length);

      for (var i = 0; i<importedDataObj.sourceData.length; i++) {
          console.log(importedDataObj.sourceData[i].description);
          document.getElementById(importedDataObj.sourceData[i].description).value = importedDataObj.sourceData[i].value;
      }

      reload();


    }
  }



function exportData(){
    var inputDescriptions = document.getElementsByClassName('inputDescription');
    var inputValues = document.getElementsByClassName('inputValue');
    var result = '{"sourceData":[';
    for (var i = 0; i<inputDescriptions.length; i++){
         //console.log(inputDescriptions[i].textContent + ' ' + inputValues[i].value);

         //result += '{"description":"' + inputDescriptions[i].textContent + '","value":"' + inputValues[i].value  + '"}';

         result += '{"description":"' + inputValues[i].id + '","value":"' + inputValues[i].value  + '"}';

         if (i != (inputDescriptions.length-1)){
         result += ',';
         }
     }

     result += ']}';

     console.log(result);

     var obj = JSON.parse(result);

        var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));

        var a = document.createElement('a');
        a.href = 'data:' + data;
        a.download = 'data.json';
        a.innerHTML = 'download JSON';

        var container = document.getElementById('container');
        container.appendChild(a);

        //var obj = JSON.parse(result);
        //console.log(obj.sourceData[1].value);
        //alert(exportResult[1].textContent);
    
}


function exportCode(){
    
        var result = returnCode();

        console.log(result);

        var cid = document.getElementById('cid').value;
        var name = 'cid' + cid + '-dis-prg'; 


        var data = "text/json;charset=utf-8," + encodeURIComponent(result);

        var a = document.createElement('a');
        a.href = 'data:' + data;
        a.download = name + '.txt';
        a.innerHTML = 'download source code';

        var container = document.getElementById('container');
        container.appendChild(a);

        //var obj = JSON.parse(result);
        //console.log(obj.sourceData[1].value);
        //alert(exportResult[1].textContent);
}
