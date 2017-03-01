// webhalla chain: cid795-dis-prg
// CMMS: 17_Q1_PCT Trial Reset LC 16_OO-3135
// cid: 795

// conversions
if ( $IDMARK_C795T == 1 and $IDMARK_C795O == 1 ) {
    if ( exists $IDMARK_C795TC ) {

        // converted to trial
        if ( $lic_lct == 2 and $lic_licr == 0 and $lic_ser == '100950081') {
            pushbi( true,'795e5', $lic_lct );
            unset $IDMARK_C795TC;
        }

        // converted to free        
        if ( $lic_ser == '55616639' ) {
            pushbi( true,'795e5', $lic_lct );
            unset $IDMARK_C795TC;
        }
    }

    // converted to paid        
    if ( $lic_lct == 4 ) {
        if (! exists $IDMARK_C795TP) {
            pushbi( true,'795e5', $lic_lct );
            unset $IDMARK_C795TC;
            $IDMARK_C795TP = 1;
        }
    }

    // 30 days after expiration back to free (30 + 15 days of trial)
    if ($lic_lct < 4) {
        if ($datetime_ts > ($IDMARK_C795F + 3888000)) {
            if ($lic_ser != '55616639'){
                setlic('TUCAD-72T7V-PMRDE-Q9JCM-ZMBFT-LKDUH');
                $IDMARK_C795TC = 1;
                pushbi( true,'795e5', 1 );
                $globalSentLicense = 1;
                back;
            }
        }
    }

    // LS Cleaning part - uncomment for cleaning
    /*
    if ( exists $IDMARK_C795T ) {
        unset $IDMARK_C795TC;
        unset $IDMARK_C795O;
        unset $IDMARK_C795T;
        unset $IDMARK_C795F;
        unset $IDMARK_C795TP;
        pushbi( true,'795e98', 1 );
        back;
    }
    */

    //Rollback - if you want to rollback campaign please uncomment following code
    /*
    if ( exists $IDMARK_C795T ) {
        if ( $IDMARK_C795T <= 1 ) {
            if ( $IDMARK_C795O == 99 ) back;
            else if ( $IDMARK_C795O < 99 ) {
                $IDMARK_C795O = 99;
                sethead( "x-avg-tnp-auto", "");
                pushbi(true,"795e97",1);
                back;
            }
        }
    }
    */
}


//STOP DISTRIBUTION
//back;

// license resend for targeted users
/*
if (exists $IDMARK_C795F and $lic_licr == '2'){ 
	sentPCTLicense($IDMARK_C795F, 'fixed', '75', '15', 'TALWZ-GRHRF-HNTHD-QAV32-23K2O-YD3JT','OO-3135');
	$globalSentLicense = 1;
	back;
}
*/

// Conditions
if ( $lic_ser != '55616639' ) {
	pushbi( true, '795e95', 1 );
	back;
}

if ( exists $AKCE_MAKEID ) {
     back;
}

if (! exists $Instance_LicID) {
     back;
}

if ( exists $globalTrmTargetted ) back;

// already targetted
if ($IDMARK_C795T == 1) back;

if (!( $lic_lct in '1;2' )) {
	pushbi( true, '795e95', 1 );
	back;
}

if ($lic_lct == "2"){
    private $secondsAfterInstallation = $datetime_ts - $tmInstance_Created;
    if (exists $IDMARK_TESTTIME) {
        $secondsAfterInstallation = $IDMARK_TESTTIME;
    }
     if ($lic_vap == "30"){
         if ($secondsAfterInstallation <= 2592000) {
             pushbi( true,"795e95", 1 );
             back;
         }
     } else if ($lic_vap == "7") {
         if ($secondsAfterInstallation <= 604800) {
             pushbi( true,"795e95", 1 );
             back;
         }
     } else if ($lic_vap == "1") {
         if ($secondsAfterInstallation <= 86400) {
             pushbi( true,"795e95", 1 );
             back;
         }
     }
}


if ( $lic_licr != '0' ) {
	pushbi( true, '795e95', 2 );
	back;
}

if ( $avg_zen_present == 1 ) {
    pushbi(true,'795e95',3);
    back;
}

// build condition
if ($avg_ver gbn< '16.22.1.58906') {
	pushbi(true,'795e95',4);
	back;
}

// other promolink is distributed
private $checkGlobalPromoLinkNonExistence = cmpPcTuGlobalPromolinkCheck('autoPromolink',$globalAutoPromoLink,$globalManualPromoLink);
if (! $checkGlobalPromoLinkNonExistence) {
   pushbi(true,'795e95',5);
   back;
}

// license was sent in other campaign
if ( exists $globalSentLicense or exists $globalTrmTargetted ) {
   pushbi( true, '795e95', 6 );
   back;
}

if (!($ctry in "DE;US;ES;GB;IT;FR;CZ;CA;IE;NZ;AU;AT;NL;PT;ZA;CH")) {
    pushbi(true,'795e95',7);
    back;
}

private $secondsAfterInstallation = $datetime_ts - $tmInstance_UserCreated;
if (exists $IDMARK_TESTTIME) {
     $secondsAfterInstallation = $IDMARK_TESTTIME;
}

// at least 70 days after installation
if ($secondsAfterInstallation <= 6048000) {
     pushbi( true,"795e95", 8 );
     back;
}

// campaign should be distributed until 28. 2. 2017
if ($datetime_ts > 1488326399) {
    back;
} 

// distribuce
private $cidAttrTracking = concat('?iid=', $Instance_Instance);
private $promoHash = concat('c',795,'o',1,'e',1);
private $promoEndDate = PromoTuEndDate('15');
private $contentTracking = cmpPcTuTracking('38-pct_lifecycle','Trial%20Reset',$avg_prd,$avg_prod,$lic_lct);
private $promoUri = concat(''.UrlDomain('Production').'/795/'.$cmp_all_loc.'.html', $cidAttrTracking, '&LICR='.$lic_licr.'&LT='.$lic_lct.'&GEOIP='.$ctry, $contentTracking);
private $promoStartDate = 19700101;
private $promoFreq = PromoTuFreq('Once');
private $promoCount = 1;
private $promoAvStatus = cmpPcTuAvStatus('');
private $promoDayOfWeek = '1111111';

// autopromolink
cmpPcTuSendDynamicPromolink ($promoHash, $promoEndDate, $promoUri, $promoStartDate, $promoFreq, $promoCount, $promoAvStatus, $promoDayOfWeek);

// track distribution
if (! exists $IDMARK_C795T) {
    private $distribGroup = cmpPcTuDistribGroup($avg_prd,$avg_prod,$avg_avg_ver,$lic_licr,$lic_lct,$AVinZen,$avg_zen_present);
    pushbi(true,'795e1',$distribGroup);
    pushbi(true,'795e2',19);
}
pushbi(true,'795e3',1);
pushbi(true,'795e4',1);

$IDMARK_C795O = 1;
$IDMARK_C795T = 1;
$IDMARK_C795F = $datetime_ts;
$IDMARK_C795TC = 1;

