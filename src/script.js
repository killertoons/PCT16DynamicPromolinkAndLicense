function returnCode() {
    var cid = document.getElementById('cid').value;
    var campaignName = document.getElementById('campaignName').value;
    var run = document.getElementById('run').value;
    var offer = document.getElementById('offer').value;
    var suppressedCountries = document.getElementById('suppressedCountries').value;
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
    result += '// cid: ' + cid + '\n\n';
    result += 'private $run = ' + run + ';\n';
    result += 'private $cid = ' + cid + ';\n\n';

    result += '// Cleaning - if you want clean all campaign marks\n';
    result += '/*\n';
    result += ' if ( exists $IDMARK_C' + cid + 'T ) {\n';
    result += '     unset $IDMARK_C' + cid + 'O;\n';
    result += '     unset $IDMARK_C' + cid + 'T;\n';
    result += '     pushbi(true,$cid."e98",$run);\n';
    result += '     back;\n';
    result += ' }\n';
    result += '*/\n\n';

    result += '//Rollback - if you want to rollback campaign please uncomment following code\n';
    result += '/*\n';
    result += 'if ( exists $IDMARK_C' + cid + 'T ) {\n';
    result += '     if ( $IDMARK_C' + cid + 'T <= $run ) {\n';
    result += '         if ( $IDMARK_C' + cid + 'O == 99 ) back;\n';
    result += '         else if ( $IDMARK_C' + cid + 'O < 99 ) {\n';
    result += '             $IDMARK_C' + cid + 'O = 99;\n';
    result += '             sethead( "x-avg-tnp-auto", "");\n';
    result += '             pushbi(true,$cid."e97",$run);\n';
    result += '             back;\n';
    result += '         }\n';
    result += '     }\n';
    result += '}\n';
    result += '*/\n\n';

    result += '//Stop distribution - if you want to stop this campaign uncomment folowing back\n';
    result += '//back;\n\n';

    result += '// Conditions\n';
    result += 'if ( exists $AKCE_MAKEID ) {\n';
    result += '     back;\n';
    result += '}\n\n';

    result += 'if (! exists $Instance_LicID) {\n';
    result += '     back;\n';
    result += '}\n\n';

    result += 'if ( exists $globalTrmTargetted ) back; // other trm campaign is distributed\n';
    result += 'if ($IDMARK_C' + cid + 'T == $run) back;    // campaign was already distributed\n\n';

    result += 'if ($avg_ver gbn< "16.22.1.58906") {    // build check\n';
    result += '     pushbi(true,$cid."e95",1);\n';
    result += '     back;\n';
    result += '}\n\n';

    result += '// other promolink is distributed\n';
    result += 'private $checkGlobalPromoLinkNonExistence = cmpPcTuGlobalPromolinkCheck("autoPromolink",$globalAutoPromoLink,$globalManualPromoLink);\n';
    result += 'if (! $checkGlobalPromoLinkNonExistence ) {\n';
    result += '     pushbi(true,$cid."e95",2);\n';
    result += '     back;\n';
    result += '}\n\n';

    result += '// license was sent in other campaign\n';
    result += 'if ( exists $globalSentLicense or exists $globalTrmTargetted ) {\n';
    result += '     pushbi( true,$cid."e95", 3 );\n';
    result += '     back;\n';
    result += '}\n\n';  
    
    result += '// user is not from targeted country\n';
    result += '//if (! ($ctry in "AU;IT;NL;FR;UK;US;DE;IE;ZA;AR;MX;ES;CH;AT;CZ;BE;PL;DK;PT;SE;SK;NO;IN;RU")) {\n';
    result += 'if ($ctry in "' + suppressedCountries + '") {\n';
    result += '     pushbi( true,$cid."e95", 4 );\n';
    result += '     back;\n';
    result += '}\n\n';

    result += '// enabled licenses\n';
    result += 'if (! ($lic_lct in "' + enabledLicenses + '")) {\n';
    result += '     pushbi( true,$cid."e95", 5 );\n';
    result += '     back;\n';
    result += '}\n\n';
    
    result += '// illegal suppress\n';
    result += 'if ($lic_licr != "' + illegalLicenses + '") {\n';
    result += '     pushbi( true,$cid."e95", 6 );\n';
    result += '     back;\n';
    result += '}\n\n';

    result += 'private $secondsAfterInstallation = $datetime_ts - $tmInstance_Created;\n';
    
    result += 'if (exists $IDMARK_TESTTIME) {\n';
    result += '     $secondsAfterInstallation = $IDMARK_TESTTIME;\n';
    result += '}\n\n';

    result += '// free at least 1 day after installation\n';
    result += 'if ($lic_lct == "1"){\n';
    result += '     if ($secondsAfterInstallation <= 86400) {\n';
    result += '     pushbi( true,$cid."e95", 7 );\n';    
    result += '     back;\n';
    result += '     }\n';
    result += '}\n\n';

    result += '// suppress trial up to 3 days after expiration\n';
    result += 'if ($lic_lct == "2"){\n';
    result += '     if ($lic_vap == "30"){\n';
    result += '         if ($secondsAfterInstallation <= 2851200) {\n';
    result += '             pushbi( true,$cid."e95", 8 );\n';
    result += '             back;\n';
    result += '         }\n';
    result += '     } else if ($lic_vap == "7") {\n';
    result += '         if ($secondsAfterInstallation <= 864000) {\n';
    result += '             pushbi( true,$cid."e95", 8 );\n';
    result += '             back;\n';
    result += '         }\n';
    result += '     } else if ($lic_vap == "1") {\n';
    result += '         if ($secondsAfterInstallation <= 345600) {\n';
    result += '             pushbi( true,$cid."e95", 8 );\n';
    result += '             back;\n';
    result += '         }\n';
    result += '     }\n';
    result += '}\n\n';

    result += '// suppress paid up to 14 days after purchase and less than 30 days before expiration\n';
    result += 'if ($lic_lct == "4"){\n';
    result += '     if ($secondsAfterInstallation <= 1209600) {\n';
    result += '         pushbi( true,$cid."e95", 9 );\n';
    result += '         back;\n';
    result += '     }\n';
    result += '     if ($lic_dte < 30) {\n';
    result += '         pushbi( true,$cid."e95", 9 );\n';
    result += '         back;\n';
    result += '     }\n';
    result += '}\n\n';

    result += '// AB test + pilot limit\n';
    result += 'private $pilotLimit = ' + limit + ';\n';
    result += 'command tcounter "c' + cid + 'test ".$pilotLimit." 864000";\n';

    result += 'if ($tcounter_c' + cid + 'test_max_reached) {\n';
    result += '     pushbi( true,$cid."e95", 10 );\n';
    result += '     back;\n';
    result += '}\n\n';

    result += '// app language is suppressed\n';
    result += 'if ($avg_loc in "' + suppressedLanguages + ';") {\n';
    result += '     pushbi( true,$cid."e95", 11 );\n';
    result += '     back;\n';
    result += '}\n\n';

    result += 'private $offer = distrib($tcounter_c' + cid + 'test, ' + abTest + ');\n';
    result += 'private $offerName = $offer from "' + offerNames + '";\n';

    result += '// offer variables\n';
    result += 'private $promoStartDate = ' + startDate + ';\n';
    result += 'private $promoEndDate = PromoTuEndDate("' + endDate + '");\n';
    result += 'private $promolinkTracking = "' + tracking + '";\n';
    result += 'private $webUrl = UrlDomain("' + urlDomain + '")."/".$cid."/".$offerName."/".$cmp_all_loc.".html";\n';
    result += 'private $promoFreq = ' + frequency + ';\n';
    result += 'private $promoCount = ' + count + ';\n\n';
    
    result += 'if ($lic_lct == "4"){\n';
    result += '     $promoCount = 1; // for paid users 1 in total\n';
    result += '}\n\n';

    result += 'private $promoAvStatus = "' + avStatus + '"; // yes - only show if AV is installed, no - only show if AV is NOT installed, nevermind - always show\n';
    result += 'private $promoDayOfWeek = "' + dayOfWeek + '";\n';
    result += 'private $cidAttrTracking = concat("?iid=", $Instance_Instance);\n';
    result += 'private $promoHash = concat("c",$cid,"o",$offer,"e",$run);\n';
    result += 'private $zenPresent = $avg_zen_present from "0,pct;1,gse";\n';
    result += 'private $trackingZen = "-".$zenPresent;\n';
    result += 'private $contentTracking = cmpPcTuTracking($trackingZen,$promolinkTracking,$avg_prd,$avg_prod,$lic_lct);\n';
    result += 'private $promoUri = concat($webUrl, $cidAttrTracking, "&LICR=".$lic_licr."&LT=".$lic_lct."&GEOIP=".$ctry."&ZEN=".$avg_zen_present, $contentTracking);\n\n';

    result += '// autopromolink\n';
    result += 'cmpPcTuSendDynamicPromolink ($promoHash, $promoEndDate, $promoUri, $promoStartDate, $promoFreq, $promoCount, $promoAvStatus, $promoDayOfWeek);\n\n';

    result += '// distribution\n';
    result += 'if ($IDMARK_C' + cid + 'T != $run or $IDMARK_C' + cid + 'O != $offer) {\n';
    result += '     if (! exists $IDMARK_C' + cid + 'T) {\n';
    result += '         private $distribGroup = cmpPcTuDistribGroup($avg_prd,$avg_prod,$avg_avg_ver,$lic_licr,$lic_lct,$AVinZen,$avg_zen_present);\n';
    result += '         pushbi(true,$cid."e1",$distribGroup);\n';
    result += '         pushbi(true,$cid."e2",25);\n';
    result += '     }\n';
    result += '     pushbi(true,$cid."e3",$offer);\n';
    result += '     pushbi(true,$cid."e4",$run);\n';
    result += '}\n\n';

    result += '$IDMARK_C' + cid + 'T = $run;\n';
    result += '$IDMARK_C' + cid + 'O = $offer;';

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
