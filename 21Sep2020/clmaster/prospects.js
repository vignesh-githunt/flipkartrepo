/**
 * @author Sumanth
 */
let searchParams = new URLSearchParams( location.search );


$( document ).ready( function() {
	
	$(window).load(function() {
		$('#loading').show();
	});

	$( '#cadence_url' ).attr( 'href', '/' + window.location.pathname.split( '/' )[ 1 ] + '/showCadence.action?userId=' + searchParams.get( 'userId' ) + '&orgId=' + searchParams.get( 'orgId' ) );

	var getData = {
		'userId' : searchParams.get( 'userId' ),
		'orgId' : searchParams.get( 'orgId' ),
		'pageNumber' : 1
	};

	$.ajax( {
		type : 'GET',
		url : 'getallprospects',
		data : getData,
		dataType : "json",
		success : function( data ) {

			populateProspectTable( data )
		},
		error : function( error ) {

			alert( 'Error occurred while fetching the prospect data' );
		}

	} );

	$( document ).on( 'click', '#model_close', function() {

		$( '#myModal' ).hide();

	} );

	$( '#step_forward' ).on( 'click', function() {

		$( '#loading' ).show();
		var pageNumber = !isNaN( $( '#page_number' ).val() ) ? parseInt( $( '#page_number' ).val() ) + 1 : parseInt( $( '#total_pages' ).text() );

		if ( pageNumber == $( '#total_pages' ).text() ) {

			$( '#forward,#step_forward' ).css( {
				'opacity' : '0.6',
				'pointer-events' : 'none'
			} );
			$( '#backward,#step_backward' ).css( {
				'opacity' : '1',
				'pointer-events' : 'visible'
			} );
		} else if ( pageNumber > 1 ) {
			$( '#forward,#step_forward,#backward,#step_backward' ).css( {
				'opacity' : '1',
				'pointer-events' : 'visible'
			} );

		}

		$( '#page_number' ).val( pageNumber );

		const url = $.trim( $( '#my_input' ).val() ) == '' ? 'getallprospects?orgId=' + searchParams.get( 'orgId' ) + '&userId=' + searchParams.get( 'userId' ) + '&pageNumber=' + pageNumber : 'getallprospects?orgId=' + searchParams.get( 'orgId' ) + '&userId=' + searchParams.get( 'userId' ) + '&pageNumber=' + pageNumber + '&contactName=' + $( '#my_input' ).val();

		getAllProspectData( url );

	} );

	$( '#step_backward' ).on( 'click', function() {

		$( '#loading' ).show();
		var pageNumber = !isNaN( $( '#page_number' ).val() ) ? parseInt( $( '#page_number' ).val() ) - 1 : 1;

		if ( pageNumber == 1 ) {

			$( '#backward,#step_backward' ).css( {
				'opacity' : '0.6',
				'pointer-events' : 'none'
			} );

			$( '#forward,#step_forward' ).css( {
				'opacity' : '1',
				'pointer-events' : 'visible'
			} );
		} else if ( pageNumber > 1 ) {
			$( '#forward,#step_forward,#backward,#step_backward' ).css( {
				'opacity' : '1',
				'pointer-events' : 'visible'
			} );

		}
		$( '#page_number' ).val( pageNumber );

		const url = $.trim( $( '#my_input' ).val() ) == '' ? 'getallprospects?orgId=' + searchParams.get( 'orgId' ) + '&userId=' + searchParams.get( 'userId' ) + '&pageNumber=' + pageNumber : 'getallprospects?orgId=' + searchParams.get( 'orgId' ) + '&userId=' + searchParams.get( 'userId' ) + '&pageNumber=' + pageNumber + '&contactName=' + $( '#my_input' ).val();


		getAllProspectData( url );

	} );

	$( '#backward' ).on( 'click', function() {

		$( '#page_number' ).val( 1 );
		$( '#loading' ).show();

		if ( !isNaN( $( '#page_number' ).val() ) && $( '#page_number' ).val() == 1 ) {

			$( '#backward,#step_backward' ).css( {
				'opacity' : '0.6',
				'pointer-events' : 'none'
			} );

			$( '#forward, #step_forward' ).css( {
				'opacity' : '1',
				'pointer-events' : 'visible'
			} );
		}

		const url = $.trim( $( '#my_input' ).val() ) == '' ? 'getallprospects?orgId=' + searchParams.get( 'orgId' ) + '&userId=' + searchParams.get( 'userId' ) + '&pageNumber=' + 1 : 'getallprospects?orgId=' + searchParams.get( 'orgId' ) + '&userId=' + searchParams.get( 'userId' ) + '&pageNumber=' + 1 + '&contactName=' + $( '#my_input' ).val();

		getAllProspectData( url );

	} );


	$( '#forward' ).on( 'click', function() {

		$( '#page_number' ).val( parseInt( $( '#total_pages' ).text() ) );
		$( '#loading' ).show();

		if ( !isNaN( $( '#page_number' ).val() ) && $( '#page_number' ).val() == $( '#total_pages' ).text() ) {

			$( '#forward,#step_forward' ).css( {
				'opacity' : '0.6',
				'pointer-events' : 'none'
			} );

			$( '#backward, #step_backward' ).css( {
				'opacity' : '1',
				'pointer-events' : 'visible'
			} );

		}

		const url = $.trim( $( '#my_input' ).val() ) == '' ? 'getallprospects?orgId=' + searchParams.get( 'orgId' ) + '&userId=' + searchParams.get( 'userId' ) + '&pageNumber=' + parseInt( $( '#total_pages' ).text() ) : 'getallprospects?orgId=' + searchParams.get( 'orgId' ) + '&userId=' + searchParams.get( 'userId' ) + '&pageNumber=' + parseInt( $( '#total_pages' ).text() )

		+ '&contactName=' + $( '#my_input' ).val();
		getAllProspectData( url );

	} );

	$( document ).on( 'click', '#search_btn', function() {

		$( '#loading' ).show();
		if ( $.trim( $( '#my_input' ).val() ) != '' ) {
			const url = 'getallprospects?orgId=' + searchParams.get( 'orgId' ) + '&userId=' + searchParams.get( 'userId' ) + '&pageNumber=' + 1 + '&contactName=' + $( '#my_input' ).val();
			$( '#page_number' ).val( 1 );

			getAllProspectData( url );

		} else {
			window.location.reload();
		}

	} );

	$( document ).on( 'click', '.contactName', function( e ) {

		e.preventDefault();
		$activityHistory = $( "#activityList" );
		$( '#loading' ).show();

		$activityHistory.empty();
		$.ajax( {
			type : 'get',
			url : $( this ).attr( 'href' ),
			dataType : "json",
			success : function( data ) {


				data = data.responseData;
				/*Prospect custom field block*/
				$( '#ul_id' ).empty();
				$.each( data.prospect_custom_fields, function( i, ele ) {

					if ( !ele.field_name.includes( 'contact_name' ) && !ele.field_name.includes( 'account_name' ) && ( $( '#ul_id li label' ).text().indexOf( ele.field_label ) == -1 ) ) {// !ele.field_name.includes( 'crm_id' ) && !ele.field_name.includes( 'member_id' ) && !ele.field_name.includes( 'user_timezone' )

						var $li = $( '<li>' ).appendTo( $( '#ul_id' ) );
						var $label = $( '<label>' ).css( 'width', '50%' ).appendTo( $li );
						var $span = $( '<span>' ).appendTo( $li );

						$label.append( ele.field_label )
						$span.append( $.trim( ele.value ).length > 15 ? ele.value.substring( 0, 15 ) + '...' : ele.value ).attr( 'title', ele.value );

					}

				} );

				$.each( data.prospect_general_info, function( i, ele ) {

					if ( 'phone' == i ) {
						$( '#contact_info span' ).not( $( '#email_id' ) ).parents( 'p' ).remove()
						$.each( ele, function( index, value ) {

							$( '#contact_info' ).append( $( '<p>' ).text( ( value.field_label + ': ' ) ).append( $( '<span>' ).text( value.value ) ) );

						} );

					} else {
						$( '#' + i ).text( $.trim( ele ) );
					}


				} );

				$.each( data.prospect_stats, function( i, ele ) {

					$( '#' + i ).text( $.trim( ele ) );

				} );

				$.each( data.prospect_all_data, function( i, ele ) {

					if ( i.includes( 'campaign_name' ) || i.includes( 'current_touch_type' ) || i.includes( 'next_touch' ) )
						$( '#' + i ).text( $.trim( ele ) );
					else if ( i.includes( 'last_touch_date_time' ) )
						$( '#last_touch_date_time_1' ).text( $.trim( ele ) );

				} );

				$( '#contact_nameandaccount_name' ).text( data.prospect_all_data.contact_name + " (" + data.prospect_all_data.account_name + ")" )

			},
			error : function( error ) {

				alert( 'Error while getting the view prospect' );
			}
		} );

		$( '#filterAction option:first' ).prop( 'selected', true );
		var getData = {
			user_id : searchParams.get( 'userId' ),
			member_id : $( this ).attr( 'member_id' ),
			filter_action : $( '#filterAction' ).val(),
			org_id : searchParams.get( 'orgId' )
		}


		getAllMemberActivity( getData );

		$( '#myModal' ).show();
		$('#loading').hide();

	} );

	$( '#page_number' ).keyup( function( event ) {

		if ( event.keyCode === 13 ) {
			var pNum = $( '.navigation-bar input' ).val();
			$('#loading').show();

			if ( $.trim( $( '#my_input' ).val() ) == "" ) {

				if ( !isNaN( pNum ) && parseInt( pNum ) >= 1 && parseInt( pNum ) <= parseInt( $( '#total_pages' ).text() ) ) {
					var searchUrl = 'getallprospects?orgId=' + searchParams.get( 'orgId' ) + '&userId=' + searchParams.get( 'userId' ) + '&pageNumber=' + pNum;
					getAllProspectData( searchUrl );

				} else {
					$( '.navigation-bar input' ).val( $( '#total_pages' ).text() );
					var searchUrl = 'getallprospects?orgId=' + searchParams.get( 'orgId' ) + '&userId=' + searchParams.get( 'userId' ) + '&pageNumber=' + $( '#total_pages' ).text();
					getAllProspectData( searchUrl );
				}
			} else {

				if ( !isNaN( pNum ) && parseInt( pNum ) >= 1 && parseInt( pNum ) <= parseInt( $( '#total_pages' ).text() ) ) {
					var searchUrl = 'getallprospects?orgId=' + searchParams.get( 'orgId' ) + '&userId=' + searchParams.get( 'userId' ) + '&pageNumber=' + pNum + '&contactName=' + $( '#my_input' ).val();
					getAllProspectData( searchUrl );

				} else {
					$( '.navigation-bar input' ).val( $( '#total_pages' ).text() );
					var searchUrl = 'getallprospects?orgId=' + searchParams.get( 'orgId' ) + '&userId=' + searchParams.get( 'userId' ) + '&pageNumber=' + $( '#total_pages' ).text() + '&contactName=' + $( '#my_input' ).val();

					getAllProspectData( searchUrl );
				}

			}
		}
	} );

	$( '#my_input' ).keyup( function( event ) {

		if ( event.keyCode === 13 ) {
			var searchUrl = 'getallprospects?orgId=' + searchParams.get( 'orgId' ) + '&userId=' + searchParams.get( 'userId' ) + '&pageNumber=' + 1 + '&contactName=' + $( '#my_input' ).val();
			$( '#page_number' ).val( 1 );
			getAllProspectData( searchUrl );

		}
	} );


} );


function populateProspectTable( data ) {

	$( '#prospect_tbody' ).empty();

	if ( Array.isArray( data.viewProspectJsonArr ) && data.viewProspectJsonArr.length > 0 ) {

		$('#loading').hide();
		$( '.navigation-bar' ).show();
		$( '#total_pages' ).text( Math.ceil( data.total / 50 ) );

		if ( $( '#total_pages' ).text() == 1 && $( '#page_number' ).val() == 1 ) {
			$( '#forward,#step_forward,#backward,#step_backward' ).css( {
				'opacity' : '0.6',
				'pointer-events' : 'none'
			} );
		} else if ( $( '#total_pages' ).text() == $( '#page_number' ).val() && $( '#page_number' ).val() > 1 ) {
			$( '#forward,#step_forward' ).css( {
				'opacity' : '0.6',
				'pointer-events' : 'none'
			} );
			$( '#backward,#step_backward' ).css( {
				'opacity' : '1',
				'pointer-events' : 'visible'
			} );
		} else if ( $( '#page_number' ).val() == 1 && $( '#total_pages' ).text() > $( '#page_number' ).val() ) {
			$( '#backward,#step_backward' ).css( {
				'opacity' : '0.6',
				'pointer-events' : 'none'
			} );
			$( '#forward,#step_forward' ).css( {
				'opacity' : '1',
				'pointer-events' : 'visible'
			} );
		} else if ( $( '#page_number' ).val() > 1 ) {
			$( '#forward,#step_forward' ).css( {
				'opacity' : '1',
				'pointer-events' : 'visible'
			} );
			$( '#backward,#step_backward' ).css( {
				'opacity' : '1',
				'pointer-events' : 'visible'
			} );
		}

		$.each( data.viewProspectJsonArr, function( index, element ) {

			$tr = $( '<tr>' ).appendTo( $( '#prospect_tbody' ) );

			$( '<td>' ).text( element.member_id ).css( 'display', 'none' ).appendTo( $tr );

			$( '<td>' ).attr( 'title', element.account_name ).text( $.trim( element.account_name ).length > 15 ? element.account_name.substring( 0, 15 ) + '...' : element.account_name ).appendTo( $tr );

			$( '<td>' ).append( $( '<a>' ).attr( {
				'href' : '/' + window.location.pathname.split( '/' )[ 1 ] + '/viewProspect.action?orgId=' + searchParams.get( 'orgId' ) + '&userId=' + searchParams.get( 'userId' ) + '&member_id=' + $.trim( element.member_id ) + '&page_name=prospects',
				'class' : 'contactName',
				'member_id' : $.trim( element.member_id ),
			} ).text( $.trim( element.contact_name ) ) ).appendTo( $tr );

			$( '<td>' ).attr( 'title', element.title_name ).text( $.trim( element.title_name ).length > 15 ? element.title_name.substring( 0, 15 ) + '...' : element.title_name ).appendTo( $tr );

			$( '<td>' ).text( element.member_status ).appendTo( $tr );

			$( '<td>' ).text( element.phone ).appendTo( $tr );

			$( '<td>' ).text( element.email_id ).appendTo( $tr );

			$( '<td>' ).text( element.activity_date ).appendTo( $tr );

			$( '<td>' ).text( element.outcomes ).appendTo( $tr );
		} );

		$( '#displaying_count' ).text( 'Displaying ' + ( $( '#page_number' ).val() * 50 - 49 ) + ' - ' + ( ( $( '#page_number' ).val() * 50 ) - 50 + $( '#prospect_tbody tr' ).length ) + ' of ' + data.total );

	} else {
		if ( $( '#prospect_tbody' ).find( 'tr' ).length == 0 ) {
			$( '#prospect_tbody' ).append( '<tr><td  class="alert alert-danger" role="alert" align="center" colspan = "15">' + "No records found " + '</td></tr>' );
			$( '.navigation-bar' ).hide();
			$('#loading').hide();
		}
	}
}

function getAllProspectData( url ) {

	$.ajax( {
		type : 'GET',
		url : url,
		success : function( data ) {

			populateProspectTable( data )
		},
		error : function( error ) {

			alert( 'Error occurred while fetching the prospect data' );
		}

	} );

}

function getAllMemberActivity( getData ) {

	var url = '/' + window.location.pathname.split( '/' )[ 1 ] + '/getAllMemberActivity.action'

	$.ajax( {
		type : 'get',
		url : url,
		dataType : "json",
		data : getData,
		success : function( data ) {

			renderActivityInfo( data.responseData, 'prospects' );
		},
		error : function( data ) {

			alert( 'Error while getting the member activity details' );
		}

	} );


}

function renderActivityInfo( activityList, flagCheck ) {

	var emailTemplateName = '';
	counter = activityList.offsetLimit;

	if ( flagCheck != "accounts" ) {

		/*Enabling show more activity icon*/
		$listed_activity_count = activityList.listed_activity_count;
		$total_prospect_activity_count = activityList.total_prospect_activity_count;
		$offsetLimit = activityList.offsetLimit;

		if ( $offsetLimit <= 0 ) {
			$activityHistory.empty();
		}
	} else if ( flagCheck == "accounts" ) {
		$offsetLimit = counter;
	}

	// Looping activity details here
	$.each( activityList.member_activity_data, function( index, val ) {

		var addExtraLineFor = '';
		$('#loading').hide();

		val.outcome_comments = ( val.outcome_comments != '' ? '</br><span class=\"activity-note\">Notes: </span><span class="activity-note-desc">' + val.outcome_comments + '</span></br>' : '' );
		val.current_touch_emails_for_review = val.current_touch_emails_for_review == '' ? val.current_touch_emails_for_review : '(' + val.current_touch_emails_for_review + ')';
		if ( val.touch_type == "SOCIAL" || val.touch_type == 'OTHERS' || val.touch_type == 'OTHER' ) {
			val.touch_type = OtherTouchName[ val.touch_type ];
		}
		/*if ($.trim( val.email_content ) != '') {

			// Added CSRF token in email content
			var regEx = /fileName/gi;
			val.email_content = val.email_content.replace( regEx, "csrfToken=" + csrfTokenValue + "&fileName" );

			var regExp = /<a/gi;
			var replaceAnchorTagString = "<a href=\"#\" onclick=\"alert(\'This action is not allowed in this section.\');\"";
			val.email_content = val.email_content.replace( regExp, replaceAnchorTagString );
			var regEx = /\bemailservices\/et.*\w/gi;
			val.email_content = val.email_content.replace( regEx, "i/track.png" );
			val.email_content = val.email_content.split('target="_blank"').join('').split('target="_top"').join('').split('target="_parent"');
		}
		*/
		var $innerSectionDiv = $( '<div class="inner-section"/>' );
		$( '<div class="number-section"/>' ).text( val.duration == "" ? 'Now' : val.duration ).appendTo( $innerSectionDiv );

		var $iconsSpan = $( '<span class="icon"/>' );
		var $actionIconsSpan = $( '<span/>' );
		var $paraTag = $( '<p/>' );
		var $contentSectionDiv = $( '<div class="content-section"/>' );
		$('#loading').hide();

		if ( val.action_type == 'IMPORT' ) {

			$actionIconsSpan.attr( 'class', 'fas ' + val.action_icon );
			$actionIconsSpan.appendTo( $iconsSpan );
			$iconsSpan.appendTo( $innerSectionDiv );

			$( '<span class="text-warning person_name"/>' ).text( val.person_name ).appendTo( $paraTag );

			if ( val.action_changes == '' || val.action_changes == undefined ) {

				$paraTag.append( ' is added to TruCadence via Call Disposition window by ' );
			} else {
				$paraTag.append( ' is added to TruCadence - ' + val.action_changes.split( "," )[ 0 ] );
				$( '<span class="text-primary"/>' ).text( val.action_changes.split( "," )[ 1 ] ).appendTo( $paraTag );
				$paraTag.append( ' by ' );
			}

			$( '<span class="text-warning"/>' ).text( val.userName ).appendTo( $paraTag );
			$paraTag.appendTo( $contentSectionDiv );

		} else if ( val.action_type == 'ASSIGNED' ) {

			$iconsSpan.attr( 'class', 'icon bg-primary' );
			$actionIconsSpan.attr( 'class', 'fas ' + val.action_icon );

			$actionIconsSpan.appendTo( $iconsSpan );
			$iconsSpan.appendTo( $innerSectionDiv );

			$( '<span class="text-warning person_name"/>' ).text( val.person_name ).appendTo( $paraTag );
			$paraTag.append( ' assigned to Cadence: ' );

			$( '<span class="text-danger"/>' ).text( val.cadence_name ).appendTo( $paraTag );
			$paraTag.appendTo( $contentSectionDiv );

			// Add Advance Touch line item
			addExtraLineItem( val, 'Advanced' );

		} else if ( val.action_type == 'UPDATE' || 'TAG PROSPECT' == val.action_type ) {

			$iconsSpan.attr( 'class', 'icon bg-info' );
			$actionIconsSpan.attr( 'class', 'fas ' + val.action_icon );

			$actionIconsSpan.appendTo( $iconsSpan );
			$iconsSpan.appendTo( $innerSectionDiv );

			$( '<span class="text-warning person_name"/>' ).text( val.person_name ).appendTo( $paraTag );
			$paraTag.append( ' - Field(s) Updated: ' );
			$( '<span class="text-primary"/>' ).text( val.action_type == 'TAG PROSPECT' ? 'Tag' : val.action_changes ).appendTo( $paraTag );
			$paraTag.appendTo( $contentSectionDiv );

		} else if ( val.action_type == 'REMOVE PROSPECT FROM CADENCE' ) {

			$iconsSpan.attr( 'class', 'icon bg-danger' );
			$actionIconsSpan.attr( 'class', 'fas ' + val.action_icon );

			$actionIconsSpan.appendTo( $iconsSpan );
			$iconsSpan.appendTo( $innerSectionDiv );

			$( '<span class="text-warning person_name"/>' ).text( val.person_name ).appendTo( $paraTag );
			$paraTag.append( ' was removed from Cadence: ' );

			$( '<span class="text-danger"/>' ).text( val.cadence_name ).appendTo( $paraTag );
			$paraTag.append( ( val.action_changes.indexOf( 'USER' ) != -1 ? ' (User Driven) ' : '' ) + ' by user ' );
			$( '<span class="text-primary"/>' ).text( val.userName ).appendTo( $paraTag );

			$paraTag.appendTo( $contentSectionDiv );

		} else if ( val.action_type == 'REMOVE MEMBER FROM CADENCE' ) {

			$iconsSpan.attr( 'class', 'icon bg-danger' );
			$actionIconsSpan.attr( 'class', 'fas ' + val.action_icon );

			$actionIconsSpan.appendTo( $iconsSpan );
			$iconsSpan.appendTo( $innerSectionDiv );

			$( '<span class="text-warning person_name"/>' ).text( val.person_name ).appendTo( $paraTag );
			$paraTag.append( ' was removed from Cadence: ' );

			$( '<span class="text-danger"/>' ).text( val.cadence_name ).appendTo( $paraTag );
			$paraTag.append( ( val.action_changes.indexOf( 'USER' ) != -1 ? ' (User Driven) ' : '' ) + ' by user ' );
			$( '<span class="text-primary"/>' ).text( val.userName ).appendTo( $paraTag );

			$paraTag.appendTo( $contentSectionDiv );

		} else if ( val.action_type == 'WAIT COMPLETED' ) {

			$iconsSpan.attr( 'class', 'icon' );
			$actionIconsSpan.attr( 'class', 'fas ' + val.action_icon );

			$actionIconsSpan.appendTo( $iconsSpan );
			$iconsSpan.appendTo( $innerSectionDiv );

			$( '<span class="text-warning person_name"/>' ).text( val.person_name ).appendTo( $paraTag );
			$paraTag.append( ' - Wait Completed for ' );
			$( '<span class="tounhtest"/>' ).text( 'Touch #' + val.touch_step_no ).appendTo( $paraTag );
			$paraTag.append( ( val.action_changes.indexOf( 'USER' ) != -1 ? ' (User Driven) ' : '' ) + ' by user ' );
			$( '<span class="text-primary"/>' ).text( ' (' + getValidTouchType( val, val.touch_type ) + ')' ).appendTo( $paraTag );
			$paraTag.append( ' of Cadence: ' );
			$( '<span class="text-danger"/>' ).text( val.cadence_name ).appendTo( $paraTag );

			$paraTag.appendTo( $contentSectionDiv );

		} else if ( val.action_type == 'EXIT CAMPAIGN' || val.action_type == 'EXIT CADENCE' ) {

			$iconsSpan.attr( 'class', val.touch_type == "EMAIL" ? 'icon bobble4' : 'icon' );
			if ( val.outcome != undefined && val.outcome != '' ) {
				/*Add Extra line item for exit campaign*/
				addExtraLineItem( val, 'Extra Activity' );

				$actionIconsSpan.attr( 'class', val.touch_type == "EMAIL" ? 'fas ' + getTouchTypeIconClass( val ) : val.touch_type == "LINKEDIN" ? 'fab fa-linkedin-in' : 'fas ' + val.action_icon );

				$actionIconsSpan.appendTo( $iconsSpan );
				$iconsSpan.appendTo( $innerSectionDiv );

				if ( val.touch_type == "EMAIL" ) {

					if ( val.outcome == "Opened" || val.outcome == "Replied" || val.outcome == "Bounced" ) {

						$( '<span class="text-success"/>' ).text( val.outcome ).appendTo( $paraTag );
						$paraTag.append( ' Email ' + val.current_touch_emails_for_review + ' - ' );
						$( '<span class="tounhtest"/>' ).text( 'Touch #' + val.touch_step_no ).appendTo( $paraTag );
						$( '<span class="text-primary">' ).text( ' (' + getValidTouchType( val, val.touch_type ) + ')' ).appendTo( $paraTag );
						$paraTag.append( ' of Cadence: ' );
						$( '<span class="text-danger">' ).text( val.cadence_name ).appendTo( $paraTag );

					} else {
						$paraTag.append( 'Sent ' );
						$( '<span class="text-primary"/>' ).text( val.touch_type + ' ' + val.customized_email_touch_info ).appendTo( $paraTag );
						$paraTag.append( ' to ' );
						$( '<span class="text-warning person_name"/>' ).text( val.person_name ).appendTo( $paraTag );
						$paraTag.append( ' with Outcome: ' );
						$( '<span class="text-success"/>' ).text( val.outcome ).appendTo( $paraTag );
						$paraTag.append( '</br>' )
						$( '<span class="tounhtest"/>' ).text( 'Touch #' + val.touch_step_no ).appendTo( $paraTag );
						$paraTag.append( ' of Cadence: ' );
						$( '<span class="text-danger"/>' ).text( val.cadence_name ).appendTo( $paraTag );
						$paraTag.append( '</br>' )
						$( '<span class="activity-note"/>' ).text( 'Template: ' + val.email_template_name ).appendTo( $paraTag );

					}

					$paraTag.appendTo( $contentSectionDiv );
				} else if ( val.touch_type == "CALL" || val.touch_type == "CALL_AND_VM" ) {

					$paraTag.append( 'Made ' );
					$( '<span class="text-primary"/>' ).text( ' Phone Call ' ).appendTo( $paraTag );
					$paraTag.append( ' to ' );
					$( '<span class="text-warning person_name"/>' ).text( val.person_name ).appendTo( $paraTag );
					$paraTag.append( ' with Outcome: ' );

					$( '<span class="text-success"/>' ).text( val.outcome ).appendTo( $paraTag );
					$paraTag.append( val.outcome_comments + '</br>' );
					$( '<span class="tounhtest"/>' ).text( 'Touch #' + val.touch_step_no ).appendTo( $paraTag );
					$paraTag.append( ' of Cadence: ' );
					$( '<span class="text-danger"/>' ).text( val.cadence_name ).appendTo( $paraTag );

					$paraTag.appendTo( $contentSectionDiv );

				} else if ( val.touch_type == "LINKEDIN" ) {

					$( '<span class="text-warning person_name"/>' ).text( +val.person_name ).appendTo( $paraTag );
					$paraTag.append( ' completed ' );
					$( '<span class="tounhtest"/>' ).text( 'Touch #' + val.touch_step_no ).appendTo( $paraTag );
					$( '<span class="text-primary"/>' ).text( getValidTouchType( val, val.touch_type ) ).appendTo( $paraTag );
					$paraTag.append( ' of Cadence: ' );
					$( '<span class="text-danger"/>' ).text( val.cadence_name ).appendTo( $paraTag );

					$paraTag.appendTo( $contentSectionDiv );
				} else if ( val.touch_type == "TEXT" ) {

					$paraTag.append( ( val.outcome.toLowerCase() == 'sent' ? 'Sent' : 'Received' ) + ' ' );
					$( '<span class="text-primary"/>' ).text( ' Text Message ' ).appendTo( $paraTag );
					// $paraTag.append( ( val.outcome.toLowerCase() == 'sent' ? ' to ' : ' from ' ) ); // Commented in V10.3 as per TRUC-5473
					$( '<span class="text-warning person_name"/>' ).text( val.person_name );
					$paraTag.append( ' with Outcome: ' );
					$( '<span class="text-success"/>' ).text( val.outcome ).appendTo( $paraTag );

					$paraTag.appendTo( $contentSectionDiv );
				}
			} else {
				$actionIconsSpan.attr( 'class', "fas fa-sign-out-alt" ).appendTo( $iconsSpan );
				$iconsSpan.appendTo( $innerSectionDiv );

				$( '<span class="text-warning person_name"/>' ).text( val.person_name ).appendTo( $paraTag );
				$paraTag.append( ' exited Cadence: ' );
				$( '<span class="text-danger"/>' ).text( val.cadence_name ).appendTo( $paraTag );

				$paraTag.appendTo( $contentSectionDiv );
			}

		} else if ( val.action_type == 'RESUME PROSPECT' || val.action_type == 'PAUSE PROSPECT' ) {

			var iconType = val.action_type == "PAUSE PROSPECT" ? "bg-danger" : "bg-success";

			$iconsSpan.attr( 'class', 'icon ' + iconType );
			$actionIconsSpan.attr( 'class', 'fas ' + val.action_icon );

			$actionIconsSpan.appendTo( $iconsSpan );
			$iconsSpan.appendTo( $innerSectionDiv );

			if ( val.action_type == 'PAUSE PROSPECT' ) {

				if ( $.trim( val.action_changes ).toLowerCase().endsWith( 'paused(ooto)' ) ) {
					$( '<span class="text-success"/>' ).text( 'Paused (Out of Office)' ).appendTo( $paraTag );
					$paraTag.append( ' prospect ' );
					$( '<span class="text-warning person_name"/>' ).text( val.person_name ).appendTo( $paraTag );
					$paraTag.append( ' in Cadence: ' );

				} else {

					$paraTag.append( val.userName + ' - ' );
					$( '<span class="text-success"/>' ).text( 'Paused (Manual) ' ).appendTo( $paraTag );
					$paraTag.append( ' the prospect ' );
					$( '<span class="text-warning person_name"/>' ).text( val.person_name ).appendTo( $paraTag );
					$paraTag.append( ' from ' );
					$( '<span class="tounhtest"/>' ).text( 'Touch #' + val.touch_step_no ).appendTo( $paraTag );
					$paraTag.append( ' of Cadence: ' );
				}
			} else {

				if ( $.trim( val.action_changes ).toLowerCase().endsWith( 'resumed(ooto)' ) ) {

					$( '<span class="text-success"/>' ).text( 'Resumed (Out of Office)' ).appendTo( $paraTag );
					$paraTag.append( ' prospect ' );
					$( '<span class="text-warning person_name"/>' ).text( val.person_name ).appendTo( $paraTag );
					$paraTag.append( ' in ' );

				} else {

					$paraTag.append( val.userName + ' - ' );
					$( '<span class="text-success"/>' ).text( 'Resumed' ).appendTo( $paraTag );
					$paraTag.append( ' the prospect ' );
					$( '<span class="text-warning person_name"/>' ).text( val.person_name ).appendTo( $paraTag );
					$paraTag.append( ' from ' );
				}
				$( '<span class="tounhtest"/>' ).text( 'Touch #' + val.touch_step_no ).appendTo( $paraTag );
				$paraTag.append( ' of Cadence: ' );
			}

			$( '<span class="text-danger">' ).text( val.cadence_name ).appendTo( $paraTag );
			$paraTag.appendTo( $contentSectionDiv );

		} else if ( val.action_type == 'MOVE TO ANOTHER CADENCE' || val.action_type == 'MOVE TO ANOTHER CAMPAIGN' ) {

			if ( val.action_changes.indexOf( 'USER' ) != -1 ) {
				addExtraLineFor = 'Fall Through';
			}

			$iconsSpan.attr( 'class', 'icon bg-warning' );
			$actionIconsSpan.attr( 'class', 'fas fa-phone' );

			$actionIconsSpan.appendTo( $iconsSpan );
			$iconsSpan.appendTo( $innerSectionDiv );

			$( '<span class="text-warning person_name"/>' ).text( val.person_name ).appendTo( $paraTag );
			$paraTag.append( ' was removed from Cadence: ' );
			$( '<span class="text-danger"/>' ).text( val.cadence_name ).appendTo( $paraTag );
			$paraTag.append( val.action_changes.indexOf( 'USER' ) != -1 ? ' (User Driven) ' : '' );

			if ( val.outcome != undefined && val.outcome != '' ) {
				$paraTag.append( ' with Outcome: ' );
				$( '<span class="text-success"/>' ).text( val.outcome + ' ' ).appendTo( $paraTag );
			}

			$paraTag.appendTo( $contentSectionDiv );

		} else if ( val.action_type == 'MOVE TO NEXT TOUCH' || val.action_type == 'MOVE TO NEXT STEP' ) {

			addExtraLineItem( val, 'Next Touch' );

			if ( val.action_changes.indexOf( 'SYSTEM' ) != -1 || val.action_changes.indexOf( 'MOVE TO NEXT TOUCH by Logged User' ) != -1 ) {
				addExtraLineFor = 'Fall Through';
			}

			if ( val.outcome != undefined && val.outcome != '' ) {

				var $emailTemplateName = '';

				if ( val.touch_type == "EMAIL" ) {

					$actionIconsSpan.attr( 'class', getTouchTypeIconClass( val ) ).appendTo( $iconsSpan );
					$iconsSpan.attr( 'class', 'icon bobble4' ).appendTo( $innerSectionDiv );

					$paraTag.append( ' Sent ' );
					$( '<span class="text-primary"/>' ).text( val.touch_type + ' ' + val.customized_email_touch_info ).appendTo( $paraTag );
					$paraTag.append( ' to ' );
					$( '<span class="text-warning person_name"/>' ).text( val.person_name ).appendTo( $paraTag );
					$paraTag.append( ' with Outcome: ' );
					$( '<span class="text-success"/>' ).text( val.outcome ).appendTo( $paraTag );

					getTouchStepNoElements( $paraTag, val );

					$emailTemplateName = $( '<span class="activity-note"/>' ).text( 'Template: ' + val.email_template_name );

				} else if ( val.touch_type == "CALL" || val.touch_type == "CALL_AND_VM" ) {
					$actionIconsSpan.attr( 'class', 'fas fa-phone' ).appendTo( $iconsSpan );
					$iconsSpan.attr( 'class', 'icon bobble' ).appendTo( $innerSectionDiv );
					$paraTag.append( 'Made ' );
					$( '<span class="text-primary"/>' ).text( ' Phone Call ' ).appendTo( $paraTag );
					$paraTag.append( ' to ' );

					$( '<span class="text-warning person_name"/>' ).text( val.person_name ).appendTo( $paraTag );
					$paraTag.append( ' with Outcome: ' );
					$( '<span class="text-success"/>' ).text( val.outcome ).appendTo( $paraTag );
					$paraTag.append( val.outcome_comments );

					getTouchStepNoElements( $paraTag, val );

				} else if ( val.touch_type == "SOCIAL" || val.touch_type == 'OTHERS' || val.touch_type == 'OTHER' ) {
					$actionIconsSpan.attr( 'class', 'fas fa-share-alt' ).appendTo( $iconsSpan );
					$iconsSpan.attr( 'class', 'icon bobble' ).appendTo( $innerSectionDiv );

					$( '<span class="text-warning person_name"/>' ).text( val.person_name ).appendTo( $paraTag );
					$paraTag.append( ' completed ' );
					$( '<span class="tounhtest"/>' ).text( 'Touch #' + val.touch_step_no ).appendTo( $paraTag );
					$( '<span class="text-primary"/>' ).text( ' (' + socialSubTouchTypes( val.other_current_touch_source_id ) + ') ' ).appendTo( $paraTag );
					$paraTag.append( ' of Cadence: ' );
					$( '<span class="text-danger"/>' ).text( val.cadence_name ).appendTo( $paraTag );

					$paraTag.append( val.outcome_comments );

				} else if ( val.touch_type == "LINKEDIN" || val.touch_type == "TEXT" ) {

					$actionIconsSpan.attr( 'class', val.touch_type == "LINKEDIN" ? 'fab fa-linkedin-in' : 'fas fa-comments' ).appendTo( $iconsSpan );
					$iconsSpan.attr( 'class', 'icon' ).appendTo( $innerSectionDiv );

					$( '<span class="text-warning person_name"/>' ).text( val.person_name ).appendTo( $paraTag );
					$paraTag.append( ' completed ' );
					$( '<span class="tounhtest"/>' ).text( 'Touch #' + val.touch_step_no ).appendTo( $paraTag );
					$( '<span class="text-primary"/>' ).text( ' (' + val.touch_type + ') ' ).appendTo( $paraTag );
					$paraTag.append( ' of Cadence: ' );
					$( '<span class="text-danger"/>' ).text( val.cadence_name ).appendTo( $paraTag );
				}

				$paraTag.appendTo( $contentSectionDiv );
				if ( emailTemplateName != '' )
					$emailTemplateName.appendTo( $contentSectionDiv );

			} else if ( val.touch_type == "LINKEDIN" && val.action_changes.indexOf( 'MOVE TO NEXT STEP by Logged User' ) != -1 ) {

				$actionIconsSpan.attr( 'class', 'fab fa-linkedin-in' ).appendTo( $iconsSpan );
				$iconsSpan.attr( 'class', 'icon' ).appendTo( $innerSectionDiv );

				$( '<span class="text-warning person_name"/>' ).text( val.person_name ).appendTo( $paraTag );
				$paraTag.append( ' completed ' );
				$( '<span class="tounhtest"/>' ).text( 'Touch #' + val.touch_step_no ).appendTo( $paraTag );
				$( '<span class="text-primary"/>' ).text( ' (' + val.linkedin_touch_type + ') ' ).appendTo( $paraTag );

				$paraTag.append( ' of Cadence: ' );
				$( '<span class="text-danger"/>' ).text( val.cadence_name ).appendTo( $paraTag );

				$paraTag.appendTo( $contentSectionDiv );
			}

		} else if ( val.action_type == 'DEFAULT ACTION' ) {

			$iconsSpan.attr( 'class', val.touch_type == "EMAIL" ? 'icon bobble4' : 'icon bobble' );
			$actionIconsSpan.attr( 'class', ( val.touch_type == "EMAIL" ) ? 'fas ' + getTouchTypeIconClass( val ) : 'fas fa-phone' );

			$actionIconsSpan.appendTo( $iconsSpan );
			$iconsSpan.appendTo( $innerSectionDiv );

			if ( val.touch_type == "EMAIL" ) {
				$( '<span class="text-success"/>' ).text( val.outcome ).appendTo( $paraTag );
				$paraTag.append( ' Email ' + val.current_touch_emails_for_review + ' - ' );

				$( '<span class="tounhtest"/>' ).text( 'Touch #' + val.touch_step_no ).appendTo( $paraTag );
				$( '<span class="text-primary"/>' ).text( ' (' + val.touch_type + ')' ).appendTo( $paraTag );
				$paraTag.append( ' of Cadence: ' );
				$( '<span class="text-danger">' ).text( val.cadence_name ).appendTo( $paraTag );

			} else if ( val.touch_type == "CALL" || val.touch_type == "CALL_AND_VM" ) {
				$paraTag.append( ' Made ' );
				$( '<span class="text-primary"/>' ).text( ' Phone Call ' ).appendTo( $paraTag );
				$paraTag.append( ' to ' );
				$( '<span class="text-warning person_name"/>' ).text( val.person_name ).appendTo( $paraTag );
				$paraTag.append( ' with Outcome: ' );
				$( '<span class="text-success"/>' ).text( val.outcome ).appendTo( $paraTag );
				$paraTag.append( val.outcome_comments + '</br>' );
				$( '<span class="tounhtest"/>' ).text( 'Touch #' + val.touch_step_no ).appendTo( $paraTag );
				$paraTag.append( ' of Cadence: ' );
				$( '<span class="text-danger"/>' ).text( val.cadence_name ).appendTo( $paraTag );
			}

			$paraTag.appendTo( $contentSectionDiv );
		} else if ( val.action_type == 'NO ACTION' ) {

			$iconsSpan.attr( 'class', val.touch_type == "EMAIL" ? 'icon bobble4' : 'icon bobble' );
			$actionIconsSpan.attr( 'class', ( val.touch_type == "EMAIL" ) ? 'fas ' + getTouchTypeIconClass( val ) : ( val.touch_type == "TEXT" ) ? 'fas fa-comments' : val.action_changes.startsWith( 'Task created manually' ) ? 'fas fa-tasks' : 'fas fa-phone' );

			$actionIconsSpan.appendTo( $iconsSpan );
			$iconsSpan.appendTo( $innerSectionDiv );

			if ( val.touch_type == "EMAIL" ) {
				$paraTag.append( val.outcome == 'Opened' ? ' Opened ' : ' Sent ' );
				$( '<span class="text-primary"/>' ).text( val.touch_type ).appendTo( $paraTag );
				$paraTag.append( val.outcome == 'Opened' ? ' (One-off) by ' : ' (One-off) to ' );
				$( '<span class="text-warning person_name"/>' ).text( val.person_name ).appendTo( $paraTag );

				if ( val.outcome == 'Sent' ) {
					$( '<span class="text-success"/>' ).text( ' Template: ' ).appendTo( $paraTag );
					$paraTag.append( ( ( $.trim( val.email_template_name ) == '' ) || val.email_template_name.startsWith( '-' ) ) ? 'N/A' : val.email_template_name );

				} else if ( val.outcome != 'Opened' ) {
					$paraTag.append( ' with Outcome: ' );
					$( '<span class="text-success"/>' ).text( val.outcome ).appendTo( $paraTag );

				}
			} else if ( val.touch_type == "CALL" || val.touch_type == "CALL_AND_VM" ) {

				val.outcome = val.outcome === "" ? "-" : val.outcome;

				if ( ( val.action_changes.startsWith( 'USER - Prospect' ) && val.action_changes.endsWith( 'by Logged User' ) ) == false ) {
					$paraTag.append( val.action_changes + ' - ' );
				} else {
					$paraTag.append( ' Made ' );
					$( '<span class="text-primary"/>' ).text( ' Phone Call ' ).appendTo( $paraTag );
					$paraTag.append( ' to ' );
				}

				if ( val.action_changes.startsWith( 'Task created manually' ) ) {

					$( '<span class="text-warning person_name"/>' ).text( val.person_name ).appendTo( $paraTag );
					$paraTag.append( ' Subject: ' );
					$( '<span class="text-success"/>' ).text( val.subject ).appendTo( $paraTag );

				} else {
					$( '<span class="text-warning person_name"/>' ).text( val.person_name ).appendTo( $paraTag );
					$paraTag.append( ' with Outcome: ' );
					$( '<span class="text-success"/>' ).text( val.outcome ).appendTo( $paraTag );
					$paraTag.append( val.outcome_comments );
				}
			} else if ( val.touch_type == "TEXT" ) {

				$paraTag.append( ( val.outcome.toLowerCase() == 'sent' ? 'Sent' : 'Received' ) + ' ' );
				$( '<span class="text-primary"/>' ).text( ' Text Message ' ).appendTo( $paraTag );
				$paraTag.append( ( val.outcome.toLowerCase() == 'sent' ? ' to ' : ' from ' ) );
				$( '<span class="text-warning person_name"/>' ).text( val.person_name );
				$paraTag.append( ' with Outcome: ' );
				$( '<span class="text-success"/>' ).text( val.outcome ).appendTo( $paraTag );

			}
			getTouchStepNoElements( $paraTag, val );
			$paraTag.appendTo( $contentSectionDiv );

		} else if ( val.action_type == 'SENT' ) {

			$iconsSpan.attr( 'class', 'icon bobble4' );
			$actionIconsSpan.attr( 'class', 'fas ' + val.action_icon );

			$actionIconsSpan.appendTo( $iconsSpan );
			$iconsSpan.appendTo( $innerSectionDiv );

			$paraTag.append( 'Sent ' );
			$( '<span class="text-primary"/>' ).text( val.touch_type + ' ' + val.customized_email_touch_info ).appendTo( $paraTag );
			$paraTag.append( ' to ' );
			$( '<span class="text-warning person_name"/>' ).text( val.person_name ).appendTo( $paraTag );
			$paraTag.append( ' with Outcome: ' );
			$( '<span class="text-success"/>' ).text( val.outcome );

			getTouchStepNoElements( $paraTag, val );
			$paraTag.appendTo( $contentSectionDiv );
		} else if ( val.action_type == 'MEETINGS' ) {

			$actionIconsSpan.attr( 'class', 'far fa-calendar-alt' );
			$actionIconsSpan.appendTo( $iconsSpan );
			$iconsSpan.appendTo( $innerSectionDiv );

			$( '<span class="text-warning person_name"/>' ).text( val.person_name ).appendTo( $paraTag );

			if ( val.action_changes == '' || val.action_changes == undefined ) {

				$paraTag.append( ' is added to TruCadence Meetings sechdule for the prospect ' );
			} else {
				$paraTag.append( ' is added to TruCadence - ' + val.action_changes.split( "," )[ 0 ] );
				$( '<span class="text-primary"/>' ).text( val.action_changes.split( "," )[ 1 ] ).appendTo( $paraTag );
				$paraTag.append( ' by ' );
			}

			$( '<span class="text-warning"/>' ).text( val.userName ).appendTo( $paraTag );
			$paraTag.appendTo( $contentSectionDiv );

		}


		// flagCheck used for accounts module
		if ( flagCheck == "accounts" ) {

			$('#loading').hide();
			var expandNo = ( parseInt( $offsetLimit ) + counter );
			var $paraTagExpand = $( '<p/>' );
			if ( val.touch_type == "EMAIL" && val.outcome == "Sent" ) {
				$paraTagExpand.append( val.acitivity_datetime );
				$( '<a/>' ).attr( {
					'class' : "btn btn-outline-primary in btn-sm",
					id : "expandemails_" + counter

				} ).appendTo( $paraTagExpand );

				$paraTagExpand.appendTo( $contentSectionDiv );
				$( '<section class="collapse"/>' ).attr( 'id', 'collapseemails_' + expandNo ).append( $( '<section class="card card-block"/>' ).append( $( '<p/>' ).append( val.email_content ) ) ).appendTo( $contentSectionDiv );
				$( '<aside class="clearfix"/>' ).appendTo( $contentSectionDiv );

			} else {
				$contentSectionDiv.append( $( '<p/>' ).append( val.acitivity_datetime ) );
			}

			$contentSectionDiv.appendTo( $innerSectionDiv );

			setTimeout( function() {

				addActivityHistory( $innerSectionDiv, flagCheck );
				Ext.getCmp( "account_activity" ).setHeight( Ext.getCmp( "account_activity" ).getHeight() + 1 );

			}, 1 );

			counter++;

		} else {
			var expandNo = ( parseInt( $offsetLimit ) + index );

			if ( ( val.touch_type == "EMAIL" && ( val.outcome == "Sent" || val.outcome == "Replied" ) ) || ( val.touch_type == "TEXT" && ( val.outcome == "Sent" || val.outcome == "Received" ) ) ) {
				var $paraTagExpand = $( '<p/>' );

				$paraTagExpand.append( val.acitivity_datetime );

				$paraTagExpand.appendTo( $contentSectionDiv );

				$( '<section class="collapse"/>' ).attr( 'id', 'collapseemail_' + expandNo ).append( $( '<section class="card card-block"/>' ).append( $( '<p/>' ).append( val.touch_type == "TEXT" ? 'Message: ' + val.text_content : val.email_content ) ) ).appendTo( $contentSectionDiv );
				$( '<aside class="clearfix"/>' ).appendTo( $contentSectionDiv );

			} else if ( $contentSectionDiv.html() != '' ) {
				$contentSectionDiv.append( $( '<p/>' ).append( val.acitivity_datetime ) );
			}

			if ( $contentSectionDiv.html() != '' ) {
				$contentSectionDiv.appendTo( $innerSectionDiv );
				addActivityHistory( $innerSectionDiv );
			}

			if ( addExtraLineFor != '' ) {
				addExtraLineItem( val, addExtraLineFor );
			}
		}

	} );

	if ( flagCheck != "accounts" ) {

		/*Enabling show more activity icon*/
		if ( $total_prospect_activity_count > $listed_activity_count ) {
			$( 'a[class=show-more]' ).show();
			$('#loading').hide();
		} else {
			$( 'a[class=show-more]' ).hide();
			$('#loading').hide();
		}

		if ( $total_prospect_activity_count == 0 ) {
			$activityHistory.addClass( "table-msg" ).text( "No records available" );
			$('#loading').hide();
		}

		/*Triggering expand hide*/
		/*expandHide();*/
	}
}

function addExtraLineItem( val, lineItemFor ) {

	if ( lineItemFor == '' )
		return;

	var $inSectionDiv = $( '<div class="inner-section"/>' );
	$inSectionDiv.append( $( '<div class="number-section"/>' ).text( val.duration == "" ? 'Now' : val.duration ) );
	var $icons = $( '<span class="icon bobble"/>' );
	var $actionIcons = $( '<span/>' );
	$actionIcons.attr( 'class', 'fas ' + val.action_icon );

	var $cnSection = $( '<div class="content-section"/>' );
	var $paragraphTag = $( '<p/>' );

	$( '<span class="text-warning person_name"/>' ).text( val.person_name ).appendTo( $paragraphTag );

	if ( 'Fall Through' == lineItemFor ) {

		$icons.attr( 'class', 'icon bg-primary' );
		$paragraphTag.append( ' Fall Through ' );
		$actionIcons.attr( 'class', 'fas fa-times-circle' );
		if ( ( val.action_type == 'MOVE TO NEXT TOUCH' || val.action_type == 'MOVE TO NEXT STEP' ) && ( val.action_changes.indexOf( 'SYSTEM' ) != -1 ) ) {
			$( '<span class="text-danger"/>' ).text( '(System Driven) from the Cadence: ' + val.cadence_name ).appendTo( $paragraphTag );
		} else if ( ( val.action_type == 'MOVE TO NEXT TOUCH' || val.action_type == 'MOVE TO NEXT STEP' ) && ( val.action_changes.indexOf( 'MOVE TO NEXT TOUCH by Logged User' ) != -1 ) ) {
			$( '<span class="text-danger"/>' ).text( '(User Driven) from the Cadence: ' + val.cadence_name ).appendTo( $paragraphTag );
		} else if ( ( val.action_type == 'MOVE TO ANOTHER CADENCE' || val.action_type == 'MOVE TO ANOTHER CAMPAIGN' ) && val.action_changes.indexOf( 'USER' ) != -1 ) {
			$( '<span class="text-danger"/>' ).text( '(User Driven) from the Cadence: ' + val.cadence_name ).appendTo( $paragraphTag );
		}
		$paragraphTag.appendTo( $cnSection );

	} else if ( 'Advanced' == lineItemFor ) {
		$actionIcons.attr( 'class', 'fas fa-fast-forward' );
		$paragraphTag.append( ' advanced to ' );

		var advanceTouchType = ( val.touch_type.toLocaleLowerCase() == 'social' || val.touch_type.toLocaleLowerCase() == 'other' ) ? socialSubTouchTypes( val.other_current_touch_source_id ) : ( val.touch_type == 'LINKEDIN' ) ? val.linkedin_touch_type : val.touch_type;

		$( '<span class="tounhtest"/>' ).text( 'Touch #' + val.touch_step_no ).appendTo( $paragraphTag );
		$( '<span class="text-primary"/>' ).text( ' (' + advanceTouchType + ') ' ).appendTo( $paragraphTag );

		$paragraphTag.append( ' of Cadence: ' );
		$( '<span class="text-danger">' ).text( val.cadence_name ).appendTo( $paragraphTag );

		$paragraphTag.appendTo( $cnSection );

	} else if ( 'Next Touch' == lineItemFor ) {
		$paragraphTag.append( ' advanced to ' );

		$( '<span class="tounhtest"/>' ).text( 'Touch #' + ( parseInt( val.touch_step_no ) + 1 ) ).appendTo( $paragraphTag );

		var nextTouchType = ( ( val.next_touch.toLocaleLowerCase() == 'social' || val.next_touch.toLocaleLowerCase() == 'other' ) ? socialSubTouchTypes( val.other_next_touch_source_id ) : val.next_touch == 'LINKEDIN' ? val.linkedin_next_touch_type : val.next_touch );

		$( '<span class="text-primary"/>' ).text( ' (' + nextTouchType + ') ' ).appendTo( $paragraphTag );
		$paragraphTag.append( ' of Cadence: ' );
		$( '<span class="text-danger">' ).text( val.cadence_name ).appendTo( $paragraphTag );
		$paragraphTag.append( ( val.action_changes.indexOf( 'User' ) != -1 && val.action_changes.indexOf( 'MOVE TO NEXT STEP by Logged User' ) == -1 ? ' (User Driven) ' : '' ) + '' );

		$paragraphTag.appendTo( $cnSection );
	} else if ( 'Extra Activity' == lineItemFor ) {
		$icons.attr( 'class', 'icon bg-warning' );
		$actionIcons.attr( 'class', 'fas fa-sign-out-alt' );
		$paragraphTag.append( ' exited Cadence: ' );
		$( '<span class="text-danger">' ).text( val.cadence_name ).appendTo( $paragraphTag );

		if ( val.touch_type != "TEXT" )
			$paragraphTag.append( val.outcome_comments );

		$paragraphTag.appendTo( $cnSection );

	}
	$( '<p/>' ).append( val.acitivity_datetime ).appendTo( $cnSection );

	$actionIcons.appendTo( $icons );
	$icons.appendTo( $inSectionDiv );
	$cnSection.appendTo( $inSectionDiv );

	addActivityHistory( $inSectionDiv );
}
function addActivityHistory( $innerSectionDiv, requestFrom ) {

	var $commonWrapDiv = $( '<div class="common-wrap"/>' );
	var $commonSectionDiv = $( '<div class="common-section"/>' );

	$innerSectionDiv.appendTo( $commonSectionDiv );
	$commonSectionDiv.appendTo( $commonWrapDiv );

	if ( requestFrom == 'accounts' ) {
		$commonWrapDiv.appendTo( $( '.account-member-list' ) );
	} else {
		$commonWrapDiv.appendTo( $activityHistory );
	}
}

function getTouchTypeIconClass( activityData ) {

	var iconClass = "fas fa-envelope";
	if ( activityData.outcome == "Opened" )
		iconClass = "far fa-envelope-open";
	else if ( activityData.outcome == "Replied" )
		iconClass = "fa-reply";
	else if ( activityData.outcome == "Links Clicked" )
		iconClass = "fas fa-link";
	else if ( activityData.outcome == "Opt-Out" )
		iconClass = "far fa-envelope-open";
	else if ( activityData.outcome == "Bounced" )
		iconClass = "fas fa-ban";
	return iconClass;
}


function getValidTouchType( val, touchType ) {

	if ( $.trim( touchType ).toLowerCase() == 'linkedin' && makeValidString( val.linkedin_touch_type ) != '' )
		return makeValidString( val.linkedin_touch_type );
	else
		return touchType;
}
function getTouchStepNoElements( $paraTag, val ) {

	if ( val.touch_step_no != undefined && val.touch_step_no != "" ) {
		$paraTag.append( '<br/> ' );
		$( '<span class="tounhtest"/>' ).text( 'Touch #' + val.touch_step_no ).appendTo( $paraTag );
		$paraTag.append( ' of Cadence: ' );
		$( '<span class="text-danger">' ).text( val.cadence_name ).appendTo( $paraTag );
	}
}

$( document ).on( 'click', '#filterActivity, .show-more', function( e ) {

	var getData = {};
	$('#loading').show();

	if ( $.trim( $( this ).attr( 'id' ) ) != '' ) {

		getData = {
			user_id : searchParams.get( 'userId' ),
			member_id : $( '#member_id' ).text(),
			filter_action : $( '#filterAction' ).val(),
			org_id : searchParams.get( 'orgId' )
		}

	} else {
		counter = counter + 1;
		getData = {
			user_id : searchParams.get( 'userId' ),
			member_id : $( '#member_id' ).text(),
			filter_action : $( '#filterAction' ).val(),
			org_id : searchParams.get( 'orgId' ),
			action_type : 'showMoreActivity',
			offset_val : counter
		}
	}

	getAllMemberActivity( getData );
} );
