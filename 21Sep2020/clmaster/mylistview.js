/**
 * @author Sumanth
 */

$(window).load(function() {
	$('#loading').show();
});

$( document ).ready( function() {
	
	$('.ui-front').css('z-index','-1');
	$('#loading').show();

	var urlParams = new URLSearchParams( location.search );

	if($('#table_body').find('tr').length == 0){
		getDataList( urlParams.get( 'pageNumber' ) );
	}
	


	$( '#header_value' ).text( $( '#header_value' ).text() + " " + urlParams.get( 'clientName' ) + '(' + urlParams.get( 'id' ) + ')' );


	$( '#search_button' ).on( "click", function() {
		$( '.alert-danger' ).css( "display", "none" );
		$('#loading').show();
		$( '.navigation-bar input' ).val(1);
		getDataListByUserOrSearchList( 1 );
	} );
	
	$("#list_name_sort").bind('click', function() {

		$('#loading').show();
		var pageNumber = parseInt($('.navigation-bar input').val());
		var lstImgSrc = $("#list_name_asc").prop('src');
		var contextPath = lstImgSrc.split('images')[0];
		var lstIndex = lstImgSrc.lastIndexOf("/");
		var lstImgFile = lstImgSrc.substring(lstIndex + 1);
		if (lstImgFile == 'down.png') {
			//$( "#list_name_sort" ).attr( 'title', 'List Name - Sorted ascending' );
			$("#list_name_asc").attr('src', contextPath + 'images/up.png');
		} else {
			$("#list_name_asc").attr('src', contextPath + 'images/down.png');
			//$( "#list_name_sort" ).attr( 'title', 'List Name - Sorted descending' );
		}

		getDataListByUserOrSearchList(pageNumber);
	});


	$( '#step_forward' ).on( 'click', function() {
		
		$( '#backward' ).css( 'opacity', '1' );
		$( '#backward' ).css( 'pointer-events', 'visible' );
		$('#loading').show();

		$( '#step_backward' ).css( 'opacity', '1' );
		$( '#step_backward' ).css( 'pointer-events', 'visible' );


		if ( $( '#my_select' ).val() == "Select" ) {

			var pageNumber = parseInt( $( '.navigation-bar input' ).val() ) + parseInt( 1 );

			if ( pageNumber >= 1 && pageNumber < $( '#total_pages' ).text() ) {
				$( '#table_body' ).empty();
				$( '.navigation-bar input' ).val( pageNumber );
				getDataList( pageNumber );
			} if(pageNumber == $( '#total_pages' ).text() ) {
				$( '#table_body' ).empty();
				$( '.navigation-bar input' ).val( pageNumber );
				getDataList( pageNumber );
				$( '#step_forward' ).css( 'opacity', '0.6' );
				$( '#step_forward' ).css( 'pointer-events', 'none' );
				$( '#forward' ).css( 'opacity', '0.6' );
				$( '#forward' ).css( 'pointer-events', 'none' );
			}
		} else {
			 pageNumber = parseInt( $( '.navigation-bar input' ).val() ) + parseInt( 1 );

			if ( pageNumber == $( '#total_pages' ).text() ) {
				
				$( '.navigation-bar input' ).val( pageNumber );
				$( '#table_body' ).empty();
				getDataListByUserOrSearchList( pageNumber )

				$( '#forward' ).css( 'opacity', '0.6' );
				$( '#forward' ).css( 'pointer-events', 'none' );

				$( '#step_forward' ).css( 'opacity', '0.6' );
				$( '#step_forward' ).css( 'pointer-events', 'none' );
			}

			if(pageNumber >=1 && pageNumber < $( '#total_pages' ).text()  ) {

				$( '.navigation-bar input' ).val( pageNumber );
				$( '#table_body' ).empty();
				getDataListByUserOrSearchList( pageNumber )

			}


		}
	} );

	$( '#step_backward' ).on( 'click', function() {
		
		$( '#forward' ).css( 'opacity', '1' );
		$( '#forward' ).css( 'pointer-events', 'visible' );
		$('#loading').show();
		$( '#step_forward' ).css( 'opacity', '1' );
		$( '#step_forward' ).css( 'pointer-events', 'visible' );

		$( '.navigation-bar' ).show();

		if ( $( '#my_select' ).val() == "Select" ) {

			var pageNumber = parseInt( $( '.navigation-bar input' ).val() ) - parseInt( 1 );
			if ( pageNumber > 1 && pageNumber <= $( '#total_pages' ).text() ) {
				$( '#table_body' ).empty();
				$( '.navigation-bar input' ).val( pageNumber )
				getDataList( pageNumber );
			} if(pageNumber == 1 ) {
				$( '#table_body' ).empty();
				$( '.navigation-bar input' ).val( pageNumber )
				getDataList( pageNumber );
				$( '#step_backward' ).css( 'opacity', '0.6' );
				$( '#step_backward' ).css( 'pointer-events', 'none' );
				$( '#backward' ).css( 'opacity', '0.6' );
				$( '#backward' ).css( 'pointer-events', 'none' );
			}
		} else {
			var pageNumber = parseInt( $( '.navigation-bar input' ).val() ) - parseInt( 1 );

			if ( pageNumber == 1 ) {
				
				$( '.navigation-bar input' ).val( pageNumber );
				$( '#table_body' ).empty();
				getDataListByUserOrSearchList( pageNumber );
				$( '#backward' ).css( 'opacity', '0.6' );
				$( '#backward' ).css( 'pointer-events', 'none' );

				$( '#step_backward' ).css( 'opacity', '0.6' );
				$( '#step_backward' ).css( 'pointer-events', 'none' );
			} if(pageNumber > 1 && pageNumber <= $( '#total_pages' ).text() ) {
				$( '.navigation-bar input' ).val( pageNumber );
				$( '#table_body' ).empty();
				getDataListByUserOrSearchList( pageNumber );
			}
		}

	} );

	$( '#backward' ).on( 'click', function() {

		$( '#forward' ).css( 'opacity', '1' );
		$( '#forward' ).css( 'pointer-events', 'visible' );
		$('#loading').show();
		$( '#step_forward' ).css( 'opacity', '1' );
		$( '#step_forward' ).css( 'pointer-events', 'visible' );

		const pageNumber = 1;

		if ( $( '#my_select' ).val() == "Select" ) {

			if ( $( '.navigation-bar input' ).val() == 1 ) {
				$( '#backward' ).css( 'opacity', '0.6' );
				$( '#backward' ).css( 'pointer-events', 'none' );

				$( '#step_backward' ).css( 'opacity', '0.6' );
				$( '#step_backward' ).css( 'pointer-events', 'none' );
			} else {
				$( '.navigation-bar input' ).val( pageNumber );
				$( '#table_body' ).empty();
				getDataList( pageNumber );
				
				$( '#backward' ).css( 'opacity', '0.6' );
				$( '#backward' ).css( 'pointer-events', 'none' );

				$( '#step_backward' ).css( 'opacity', '0.6' );
				$( '#step_backward' ).css( 'pointer-events', 'none' );
			}
		} else {


			if ( $( '.navigation-bar input' ).val() == pageNumber ) {

				$( '#backward' ).css( 'opacity', '0.6' );
				$( '#backward' ).css( 'pointer-events', 'none' );

				$( '#step_backward' ).css( 'opacity', '0.6' );
				$( '#step_backward' ).css( 'pointer-events', 'none' );
			}

			else {

				$( '.navigation-bar input' ).val( pageNumber );
				$( '#table_body' ).empty();
				getDataListByUserOrSearchList( pageNumber );
				
				$( '#backward' ).css( 'opacity', '0.6' );
				$( '#backward' ).css( 'pointer-events', 'none' );

				$( '#step_backward' ).css( 'opacity', '0.6' );
				$( '#step_backward' ).css( 'pointer-events', 'none' );

			}


		}

	} );

	$( '#forward' ).on( 'click', function() {


		$( '#backward' ).css( 'opacity', '1' );
		$( '#backward' ).css( 'pointer-events', 'visible' );
		$('#loading').show();
		$( '#step_backward' ).css( 'opacity', '1' );
		$( '#step_backward' ).css( 'pointer-events', 'visible' );

		if ( $( '#my_select' ).val() == "Select" ) {

			const pageNumber = $( '#total_pages' ).text();

			if ( $( '.navigation-bar input' ).val() == pageNumber ) {

				$( '#forward' ).css( 'opacity', '0.6' );
				$( '#forward' ).css( 'pointer-events', 'none' );

				$( '#step_forward' ).css( 'opacity', '0.6' );
				$( '#step_forward' ).css( 'pointer-events', 'none' );
			}

			else {

				$( '.navigation-bar input' ).val( pageNumber );
				$( '#table_body' ).empty();
				getDataList( pageNumber );
				$( '#forward' ).css( 'opacity', '0.6' );
				$( '#forward' ).css( 'pointer-events', 'none' );

				$( '#step_forward' ).css( 'opacity', '0.6' );
				$( '#step_forward' ).css( 'pointer-events', 'none' );

			}
		} else {
			const pageNumber = $( '#total_pages' ).text();

			if ( $( '.navigation-bar input' ).val() == pageNumber ) {

				$( '#forward' ).css( 'opacity', '0.6' );
				$( '#forward' ).css( 'pointer-events', 'none' );

				$( '#step_forward' ).css( 'opacity', '0.6' );
				$( '#step_forward' ).css( 'pointer-events', 'none' );
			}

			else {

				$( '.navigation-bar input' ).val( pageNumber );
				$( '#table_body' ).empty();
				getDataListByUserOrSearchList( pageNumber );
				
				$( '#forward' ).css( 'opacity', '0.6' );
				$( '#forward' ).css( 'pointer-events', 'none' );

				$( '#step_forward' ).css( 'opacity', '0.6' );
				$( '#step_forward' ).css( 'pointer-events', 'none' );

			}


		}
	} );


	function makeTableBody( data, pageNumber ) {
		
		if ( data.totalrecords != 0 && !isNaN( data.totalrecords ) ) {

			$( '.navigation-bar' ).show();
			$('#loading').hide();

			$( '.alert-danger' ).css( "display", "none" );

			$.each( data.datalist, function( i, dataList ) {


				var $row = $( '<tr>' );

				$( '<td>' ).css({
					'padding': '6px 10px',
			    'max-width': '140px',
			    'overflow': 'hidden'
				}).appendTo( $row ).css({
					'text-overflow': 'ellipsis'
				}).attr('title', $.trim( dataList.listName )).text( $.trim( dataList.listName ));

				$( '<td>' ).appendTo( $row ).append( '<a class="btn-dialingmetadata" data_user_id="'+dataList.user.id+'" data_list_id = "'+dataList.dataListId+'" style="margin-left:1rem;cursor:pointer;font-size: x-large;" data-toggle="modal"><i class="fas fa-cog"></i></a>' );

				$( '<td>' ).appendTo( $row ).text( $.trim( dataList.listType ) );

				$( '<td>' ).appendTo( $row ).text( $.trim( dataList.recordType ) );

				$( '<td>' ).appendTo( $row ).text( $.trim( dataList.totalRecords ) );

				if ( dataList[ 'lastAttemptedDate' ] ) {
					var attemptedDate = dataList.lastAttemptedDate;
					$( '<td>' ).appendTo( $row ).text( attemptedDate[ 'monthValue' ] + '-' + attemptedDate[ 'dayOfMonth' ] + '-' + attemptedDate[ 'year' ] );
				} else{
					$( '<td>' ).appendTo( $row ).text( '' );
				}
					


				if ( dataList[ 'lastConnectedDate' ] ) {
					var connectedDate = dataList.lastConnectedDate;
					$( '<td>' ).appendTo( $row ).text( connectedDate[ 'monthValue' ] + '-' + connectedDate[ 'dayOfMonth' ] + '-' + connectedDate[ 'year' ] );
				} else{
					$( '<td>' ).appendTo( $row ).text( '' );

				}
				
				$( '<td>' ).appendTo( $row ).text( $.trim( dataList.totalDials ) );

				$( '<td>' ).appendTo( $row ).text( $.trim( dataList.totalConnects ) );
				
				$('<td>').attr({
					'class': 'more-info',
					'title': '',
					'ConnectRate': $.trim(dataList.connectRate),
					'BadData': $.trim(dataList.badData) + "%",
					'Averageattempts': $.trim(dataList.totalAverageAttempts) + "%",
					'Coverage': $.trim(dataList.coverage)
				}).appendTo($row).append('<i class="fas fa-info-circle" style="margin-left:1rem;font-size: x-large;" ></i>');

				populateToolTip();

				/*$( '<td>' ).appendTo( $row ).text( dataList.connectRate );

				$( '<td>' ).appendTo( $row ).text( $.trim( dataList.badData )+"%" );

				$( '<td>' ).appendTo( $row ).text( $.trim( dataList.totalAverageAttempts )+"%");

				$( '<td>' ).appendTo( $row ).text( $.trim( dataList.coverage ) );*/
				
				/*$( '<td>' ).appendTo( $row ).text( $.trim( dataList.uploadedDateTime ) );

				$( '<td>' ).appendTo( $row ).text( $.trim( dataList.refreshedDateTime ) );

*/
				$( '#table_body' ).append( $row );
				

			} );
			if ( Math.ceil( data.totalrecords / 20 ) <= 0 ){
				$( '#total_pages' ).text( 1 );
			} else {
				$( '#total_pages' ).text( Math.ceil( data.totalrecords / 20 ) );
			}
				
			$('#list_start').text(Math.ceil(((pageNumber - 1) * 20) + 1));
			if (Math.ceil((pageNumber * 20)) >= parseInt($.trim(data.totalrecords))) {
				$('#list_end').text($.trim(data.totalrecords));
			}
			else {
				$('#list_end').text(Math.ceil((pageNumber * 20)));
			}
			$('#total_list').text($.trim(data.totalrecords));
			
			if($('.navigation-bar input').val() == 1 && $('#total_pages').text() == 1 ){
				$( '#backward' ).css( 'opacity', '0.6' );
				$( '#backward' ).css( 'pointer-events', 'none' );
				$( '#step_backward' ).css( 'opacity', '0.6' );
				$( '#step_backward').css( 'pointer-events', 'none' );
				$( '#forward' ).css( 'opacity', '0.6' );
				$( '#forward' ).css( 'pointer-events', 'none' );
				$( '#step_forward' ).css( 'opacity', '0.6' );
				$( '#step_forward').css( 'pointer-events', 'none' );
			}
		} else {
			if ( $( '#table_body' ).find( 'tr' ).length == 0 ){
				$('#loading').hide();
				$( '#table_body' ).append( '<tr><td  class="alert alert-danger" role="alert" align="center" colspan = "15">' + "No records found " + '</td></tr>' );
			$( '.navigation-bar' ).hide();
		  }
        }
	 }

	function getDataList( pageNumber ) {
		
		$('#loading').show();
		var lstImgSrc = $("#list_name_asc").prop('src');
		var contextPath = lstImgSrc.split('images')[0];
		var lstIndex = lstImgSrc.lastIndexOf("/");
		var lstImgFile = lstImgSrc.substring(lstIndex + 1);
		if (lstImgFile == 'down.png') {
			$("#list_name_sort").attr('title', 'List Name - Sorted ascending');
			sort = "ASC";
		} else {
			$("#list_name_sort").attr('title', 'List Name - Sorted descending');
			sort = "DESC";
		}
		
		const urldata = "getDataList?orgId=" + urlParams.get( 'id' ) + "&pageNumber=" + pageNumber + "&sort=" + sort;
       
		$.ajax( {
			url : urldata,
			type : "GET",
			success : function( data) {

				makeTableBody( data, pageNumber );

			},
			error : function( data ) {
                alert('Internal Server Error');
			}
		} );


	}

	
	function getDataListByUserOrSearchList( pageNumber ) {
		
		$( '#forward' ).css( 'opacity', '1' );
		$( '#forward' ).css( 'pointer-events', 'visible' );
		$( '#backward' ).css( 'opacity', '1' );
		$( '#backward' ).css( 'pointer-events', 'visible' );
		$( '#step_backward' ).css( 'opacity', '1' );
		$( '#step_backward').css( 'pointer-events', 'visible' );
		$( '#step_forward').css( 'opacity', '1' );
		$( '#step_forward').css( 'pointer-events', 'visible' );
		$('#loading').show();
		
		if(pageNumber == 1){
			$( '#backward' ).css( 'opacity', '0.6' );
			$( '#backward' ).css( 'pointer-events', 'none' );
			$( '#step_backward' ).css( 'opacity', '0.6' );
			$( '#step_backward').css( 'pointer-events', 'none' );
		}
		
		
		if(pageNumber == parseInt($('#total_pages').text()) && pageNumber != 1){
			$( '#forward' ).css( 'opacity', '0.6' );
			$( '#forward' ).css( 'pointer-events', 'none' );
			$( '#step_forward' ).css( 'opacity', '0.6' );
			$( '#step_forward').css( 'pointer-events', 'none' );
		}
		
		var lstImgSrc = $("#list_name_asc").prop('src');
		var contextPath = lstImgSrc.split('images')[0];
		var lstIndex = lstImgSrc.lastIndexOf("/");
		var lstImgFile = lstImgSrc.substring(lstIndex + 1);
		if (lstImgFile == 'down.png') {
			$("#list_name_sort").attr('title', 'List Name - Sorted ascending');
			sort = "ASC";
		} else {
			$("#list_name_sort").attr('title', 'List Name - Sorted descending');
			sort = "DESC";
		}


		var urldata = "";

		if ( $( '#my_select' ).val() == "Select" && $( '#list_name' ).val().trim() == "" ){
			
			$( '#header_value' ).text( "Call List(s)"+ " - " + urlParams.get( 'clientName' ) + '(' + urlParams.get( 'id' ) + ')' );
			urldata = "getDataList?orgId=" + urlParams.get( 'id' ) + "&pageNumber=" + pageNumber + "&sort=" + sort;
			
		}else if ( $( '#my_select' ).val() != "Select" && $( '#list_name' ).val().trim() == "" ) {

			$( '#header_value' ).text( "User - " + $( "#my_select option:selected" ).text() + "(" + $( "#my_select option:selected" ).val() + ")" );
			urldata = "seachByListName" + "?userId=" + $( "#my_select option:selected" ).val() + "&orgId=" + urlParams.get( 'id' ) + "&pageNumber=" + pageNumber + "&sort=" + sort;
			
		}else if ( $( '#my_select' ).val() != "Select" && $( '#list_name' ).val().trim() != "" ) {
			$( '#header_value' ).text( "User - " + $( "#my_select option:selected" ).text() + "(" + $( "#my_select option:selected" ).val() + ")" );
			urldata = "seachByListName" + "?userId=" + $( "#my_select option:selected" ).val() + "&listName=" + btoa($( '#list_name' ).val()) + "&orgId=" + urlParams.get( 'id' ) + "&pageNumber=" + pageNumber + "&sort=" + sort;
		}else if ( $( '#my_select' ).val() == "Select" && $( '#list_name' ).val().trim() != "" ) {

			urldata = "seachByListName" + "?listName=" + btoa($( '#list_name' ).val()) + "&orgId=" + urlParams.get( 'id' ) + "&pageNumber=" + pageNumber + "&sort=" + sort;

		}else {
			urldata = "";
		}

		if ( urldata != "" ) {

			$( '#table_body' ).empty();
			
			$.ajax( {
				url : urldata,
				type : "GET",
				success : function( data ) {

					makeTableBody( data,pageNumber );
				},
				error : function( data, status ) {

					makeTableBody( status );
				}
			} );
		}


	}

	$(document).on("click" ,'.btn-dialingmetadata', function() {

		$.ajax({	
			url : "listSettingsData?"+"orgId="+urlParams.get('id')+"&userId="+$(this).attr('data_user_id')+"&dataListId="+$(this).attr('data_list_id') ,
			type : "GET",
			success:(data) =>{
				
				setDialingMetaData(data);
				setColumnMappingData(data);
			},
			error:(data) => {
				alert('Error occured while fetching the data!');
			}

		});
		
	   $('.model').show();
		
	});
	
	function setColumnMappingData(data){
		if($.trim(data.listSettingsData.mappingData) != ''){
			$('#mapping_table_body').empty();

			$('.column-mappings').show();
			var mappedData = JSON.parse(data.listSettingsData.mappingData);
			$.each(mappedData,function(key,value){
				
				$.each(data.listSettingsData.org.queryCatalogs,function(i,element){
					
					if($.trim(element.columnName) == key){
						var $tr = $('<tr>');
						var $td1 = $('<td>');
						var $td2 = $('<td>');
						$td1.text(element.displayColumnName);
						$td2.text(value);
						$td1.appendTo($tr);
						$td2.appendTo($tr);
						$('#mapping_table_body').append($tr);
					}
					
				});
				
		  });
		}else {
			$('.column-mappings').hide();

		}
	}
	
	function setDialingMetaData(data){
		
		$('.ui-front').css('z-index','1');
		
		if( data.listSettingsData.dialingMetaData != null && data.listSettingsData.dialingMetaData !="" && data.listSettingsData.dialingMetaData != undefined){
			
			var callerIdMode = $.trim(data.listSettingsData.dialingMetaData.caller_id_mode);
			$option = $('<option>');
			$option.val(callerIdMode);
			$option.text(callerIdMode);
			$option.attr('selected','selected');
			$('#input_group_select01').append($option);
			
			$('#caller_id_lists').val($.trim(data.listSettingsData.dialingMetaData.caller_id_list));
			
			$('#comment').val($.trim(data.listSettingsData.dialingMetaData.dialing_instructions));
			
			if(data.listSettingsData.dialingMetaData.allow_da_play_vm == true){
				$('#allow_da_play_vm').prop("checked",true);
			}else {
				$('#allow_da_play_vm').prop("checked",false);	
			}
			
			var voiceMessageName = $.trim(data.listSettingsData.dialingMetaData.voice_message_name);
			$option1 = $('<option>');
			$option1.val(voiceMessageName);
			$option1.text(voiceMessageName);
			$option1.attr('selected','selected');
			$('#input_group_select02').append($option1);
			
		    $('#phone_input_group').val($.trim(data.listSettingsData.dialingMetaData.dialer_phone_columns));

			if (data.listSettingsData.createdDate) {
				var createdDate = data.listSettingsData.createdDate;
				$('#created_date').val(createdDate['monthValue'] + '/' + createdDate['dayOfMonth'] + '/' + createdDate['year']);
			} else {
				$('#created_date').val('');

			}

			if (data.listSettingsData.updatedDate) {
				var updatedDate = data.listSettingsData.updatedDate;
				$('#updated_date').val(updatedDate['monthValue'] + '/' + updatedDate['dayOfMonth'] + '/' + updatedDate['year']);
			} else {
				$('#updated_date').val('');

			}
			
			
			var timeZones = $.trim(data.listSettingsData.dialingMetaData.timezone).split(",");
			
			 $.each(timeZones,function(j,timezone){
				 $('.form-check-input[value='+timezone+']').prop('checked', true);
			 });
	
			 var primarySortByColumn = $.trim(data.listSettingsData.dialingMetaData.primary_sort_by_column);
			 $option2 = $('<option>');
				$option2.val(primarySortByColumn);
				$option2.text(primarySortByColumn);
				$option2.attr('selected','selected');
				$('#input_group_select03').append($option2);
				
				var primarySortByDirection = $.trim(data.listSettingsData.dialingMetaData.primary_sort_by_direction);
				$option3 = $('<option>');
				$option3.val(primarySortByDirection);
				$option3.text(primarySortByDirection);
				$option3.attr('selected','selected');
				$('#input_group_select04').append($option3);
				
				var secondarySortByColumn = $.trim(data.listSettingsData.dialingMetaData.secondary_sort_by_column);
				$option4 = $('<option>');
				$option4.val(secondarySortByColumn);
				$option4.text(secondarySortByColumn);
				$option4.attr('selected','selected');
				$('#input_group_select05').append($option4);
				
				var secondarysortByDirection = $.trim(data.listSettingsData.dialingMetaData.secondary_sort_by_direction);
				$option5 = $('<option>');
				$option5.val(secondarysortByDirection);
				$option5.text(secondarysortByDirection);
				$option5.attr('selected','selected');
				$('#input_group_select06').append($option5);
				
				var tertiarySortByColumn = $.trim(data.listSettingsData.dialingMetaData.tertiary_sort_by_column);
				$option6 = $('<option>');
				$option6.val(tertiarySortByColumn);
				$option6.text(tertiarySortByColumn);
				$option6.attr('selected','selected');
				$('#input_group_select07').append($option6);
				
				var tertiarySortByDirection = $.trim(data.listSettingsData.dialingMetaData.tertiary_sort_by_direction);
				$option7 = $('<option>');
				$option7.val(tertiarySortByDirection);
				$option7.text(tertiarySortByDirection);
				$option7.attr('selected','selected');
				$('#input_group_select08').append($option7);
				
				var quatnarySortByColumn = $.trim(data.listSettingsData.dialingMetaData.quartnary_sort_by_column);
				$option8 = $('<option>');
				$option8.val(quatnarySortByColumn);
				$option8.text(quatnarySortByColumn);
				$option8.attr('selected','selected');
				$('#input_group_select09').append($option8);
				
				var quartanrySortByDirection = $.trim(data.listSettingsData.dialingMetaData.quartnary_sort_by_direction);
				$option9 = $('<option>');
				$option9.val(quartanrySortByDirection);
				$option9.text(quartanrySortByDirection);
				$option9.attr('selected','selected');
				$('#input_group_select10').append($option9);
				

		}
	} 
	
	$('#button_close').on("click",function(){
		
		$('.ui-front').css('z-index','-1');

		$('#model_content').find('input,select').each(function(){
			
			if(!$(this).is(':checkbox')){
				   $(this).val('');
			}
			
			});
		 $('#comment').val('');
		 $('.model').hide();
		 $('input[type=checkbox]').prop('checked',false);
		
		 $('.form-control').empty();
		 
		
		$('.model').hide();
	});
	
	$('#page_number').keyup(function(event) {
		
	    if (event.keyCode === 13) {
	    	var pNum = $('.navigation-bar input').val();
	    	
	    	if($.trim($('#list_name').val()) == ""){
			
			if(!isNaN(pNum) && parseInt(pNum) >=1 && parseInt(pNum) <= parseInt($( '#total_pages' ).text()) ){
				$( '.navigation-bar input' ).val( pNum );
				getDataListByUserOrSearchList( pNum);
			}else {
				$( '.navigation-bar input' ).val( $( '#total_pages' ).text() );
				getDataListByUserOrSearchList( $( '#total_pages' ).text() );
			 }
	    	}else {
	    		
	    		$( '.navigation-bar input' ).val( $( '#total_pages' ).text() );
				getDataListByUserOrSearchList( $( '#total_pages' ).text() );
	    	}
	    }
	});
	
	$("#list_name").keyup(function(event) {
	    if (event.keyCode === 13) {
	    	$( '.navigation-bar input' ).val(1);
			getDataListByUserOrSearchList( 1 );
	    }
	});
	
	if ( $( '.navigation-bar input' ).val() == 1  ) {
		
		$( '#backward' ).css( 'opacity', '0.6' );
		$( '#backward' ).css( 'pointer-events', 'none' );
		$( '#step_backward' ).css( 'opacity', '0.6' );
		$( '#step_backward').css( 'pointer-events', 'none' );
		
	}

} );

function populateToolTip() {

	$.each($('.more-info '), function(i, element) {

		$(element).tooltip({
			content: '<ul><li>Connect Rate: ' + $(this).attr('ConnectRate') + '</li><li>BadData: ' + $(this).attr('BadData') + '</li><li>Average attempts: ' + $(this).attr('Averageattempts') + '</li><li>Coverage: ' + $(this).attr('Coverage') + '</li></ul>',
			track: true,
			show: {
				effect: 'highlight',
				duration: 10000
			}

		});
	});

}
