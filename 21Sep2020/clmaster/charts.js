var clientDateRangeMap = {};
var clientBasedTalkerName = {};
var reportArray = [];
var clientNames;
var actualClients;
var testSiteClients;
var customTDExecReportValidation = "";
var dateRangeMilliseconds = {
	'1' : 2.678e+9,
	'2' : 5.27e+9,
	'3' : 7.949e+9,
	'4' : 1.054e+10,
	'5' : 1.322e+10,
	'6' : 1.581e+10
};


Ext.require( [ 'Ext.data.*', 'Ext.grid.*', 'Ext.chart.*', 'Ext.layout.container.Border', 'Ext.layout.container.Fit', 'Ext.window.MessageBox', 'Ext.toolbar.Toolbar', 'Ext.form.*' ] );

mTitle = [];
mTitle[ 1 ] = '';
mTitle[ 2 ] = '';
mTitle[ 3 ] = '';
mTitle[ 4 ] = '';
mTitle[ 5 ] = '';

Ext.Ajax.on( 'requestexception', function( conn, response, options, eOpts ) {

	$.console.log( "Error ===" + JSON.stringify( response ) );
} );


Ext.onReady( function() {

	var locations = [];
	var locationStore = Ext.create( 'Ext.data.JsonStore', {

		fields : [ 'location_value', 'location_name' ],
		data : locations
	} );


	Ext.Ajax.request( {
		params : {
			request_type : 'get_geo_locations',
		},
		method : 'POST',
		url : 'reportviewer',
		success : function( response ) {

			var jsonData = Ext.JSON.decode( response.responseText );

			Ext.each( jsonData.rowdata, function( element ) {

				locations.push( {
					location_value : element.region_id,
					location_name : element.region_name
				} );
			} );

			locationStore.loadData( locations );
			Ext.getCmp( 'location_id' ).bindStore( locationStore );

		}
	} );

	$.console = getConsole(); // new ConsoleBlank()
	Array.prototype.contains = function( s ) {

		for ( x in this ) {
			if ( x == s )
				return true;
		}
		return false;
	};

	Ext.tip.QuickTipManager.init();

	clientNames = getClientNames();

	if ( $.trim( clientNames.status ) == 'SUCCESS' ) {

		if ( clientNames.clients.length > 1 ) {

			$.each( clientNames.clients, function( index, value ) {

				reportArray.push( value.org_id );
			} );

		} else {
			reportArray.push( clientNames.clients[ 'org_id' ] );
		}

		actualClients = clientNames.actualClients;

		testSiteClients = clientNames.actualTestSites;

	} else {

		alert( clientNames.error );

		window.location.href = window.location.href.replace( 'report.action', '' );

	}

	$.each( clientNames.clients.length > 1 ? clientNames.clients : clientNames, function( index, value ) {

		clientDateRangeMap[ 'date_range_limit_' + value.org_id ] = value.lookup_value;

	} );

	var talkerNamesData = null;

	var teamNamesData = null;

	var listNamesData = null;

	var callDispositionData = null;

	var groupNamesData = [];

	if ( $( '#reportType' ).val() == "" ) {

		$( '#reportType' ).val( 'TDEXR' );

	}

	/*var groupStoreList = [ {
		group_name : 'ALL',
		user_list : []
	}, {
		group_name : 'NONE',
		user_list : []
	} ];*/

	Ext.define( 'cl.reports', {
		extend : 'Ext.data.Model',
		fields : [ {
			name : 'talker_name',
			type : 'string'
		} ]
	} );

	var reportsStore = Ext.create( 'Ext.data.JsonStore', {
		model : 'cl.reports',
		groupField : 'group_by_dates',
		groupDir : 'ASC',
		proxy : new Ext.data.HttpProxy( {
			type : 'ajax',
			noCache : false,
			timeout : 300000,
			actionMethods : {
				read : 'POST'
			},
			reader : {
				type : 'json',
				root : 'rowdata',
				fields : 'fields'
			},
			params : {
				request_type : $( '#reportType' ).val(),
				db_name : $( '#dbName' ).val(),
				org_id : $( '#orgId' ).val(),
				start_date : $( '#startdate' ).val(),
				end_date : $( '#enddate' ).val(),
				talker_ids : $( '#talkerIds' ).val(),
				list_names : $( '#listnames' ).val(),
				logical_type : $( '#dateRange' ).val(),
				call_disposition : $( '#calldisposition' ).val()
			},
			url : 'reportviewer',
			listeners : {
				exception : function( proxy, response, operation ) {

					$.console.log( JSON.stringify( response ) );
				}
			}

		} ),
		listeners : {
			'metachange' : function( store, meta ) {

				if ( store.data.items.length > 0 ) {
					for ( var i = 0; i < store.data.items.length; i++ ) {
						if ( store.data.items[ i ].data.list_names != null && store.data.items[ i ].data.list_names != undefined )
							store.data.items[ i ].data.list_names = Ext.String.htmlEncode( store.data.items[ i ].data.list_names );
					}
				}
				grid.reconfigure( store, meta.columns );
			}
		}
	} );

	var reportsStore1 = Ext.create( 'Ext.data.JsonStore', {
		model : 'cl.reports',
		groupField : 'group_by_dates',
		groupDir : 'ASC',
		proxy : new Ext.data.HttpProxy( {
			type : 'ajax',
			noCache : false,
			timeout : 300000,
			actionMethods : {
				read : 'POST'
			},
			reader : {
				type : 'json',
				root : 'rowdata1',
				fields : 'fields'
			},
			params : {
				request_type : $( '#reportType' ).val(),
				db_name : $( '#dbName' ).val(),
				org_id : $( '#orgId' ).val(),
				start_date : $( '#startdate' ).val(),
				end_date : $( '#enddate' ).val(),
				talker_ids : $( '#talkerIds' ).val(),
				list_names : $( '#listnames' ).val(),
				logical_type : $( '#dateRange' ).val(),
				call_disposition : $( '#calldisposition' ).val()
			},
			url : 'reportviewer',
			listeners : {
				exception : function( proxy, response, operation ) {

					$.console.log( JSON.stringify( response ) );
				}
			}

		} ),
		listeners : {
			'metachange' : function( store, meta ) {

				if ( $( '#reportType' ).val() == "COR" ) {
					delete meta.columns[ 1 ];
					delete meta.fields[ 1 ];
				}
				grid1.reconfigure( store, meta.columns );
			}
		}
	} );

	var grid = Ext.create( 'Ext.grid.Panel', {
		store : reportsStore,
		id : "gridPanel",
		top : '-31px',
		columns : [ {
			"text" : "Sales Rep",
			"width" : 150,
			"dataIndex" : "talker_name",
			"sortable" : true
		} ],
		tbar : {

			items : [ {
				xtype : 'radiogroup',
				id : 'radioOption',
				cls : 'btn btn1',
				hidden : true,
				items : [ {

					inputValue : 'count',
					boxLabel : 'Number &nbsp; &nbsp;',
					checked : true,
					name : 'radio'

				}, {

					inputValue : 'percentage',
					boxLabel : 'Percentage &nbsp; &nbsp;',
					name : 'radio'
				} ],
				listeners : {
					change : function( radiogroup, radio ) {

						$( "#viewTypeOfConnectsPerformanceReport" ).val( radio.radio );
						updateStoreData();
						Ext.getCmp( "chartPanel" ).setHeight( 0 );
						Ext.getCmp( "gridPanel" ).setHeight( 755 );
					}
				}

			}, {
				xtype : 'button',
				text : 'Export to Excel',
				listeners : {
					click : function() {

						var url = "exportreportviewer?";
						url += "db_name=" + $( '#dbName' ).val();
						url += "&org_id=" + $( '#orgId' ).val();
						url += "&request_type=" + $( '#reportType' ).val();
						url += "&start_date=" + $( '#startdate' ).val();
						url += "&end_date=" + $( '#enddate' ).val();
						url += "&talker_ids=" + $( '#talkerIds' ).val();
						url += "&logical_type=" + $( '#dateRange' ).val();
						url += "&call_disposition=" + btoa( ( $( '#calldisposition' ).val() ).replace( '>', '__GREATER__' ).replace( '<', '__LESSER__' ) );
						url += "&list_names=" + btoa( ( $( '#listnames' ).val() ).replace( '>', '__GREATER__' ).replace( '<', '__LESSER__' ) );
						url += "&out_type=export_excel";
						url += "&product_type=" + $( '#reportParamProductType' ).val();
						url += "&ViewTypeOfConnectsPerformanceReportData=" + $( '#viewTypeOfConnectsPerformanceReport' ).val();
						window.open( url, '_self' );

					}
				}
			}, {
				xtype : 'button',
				text : 'Export to CSV',
				listeners : {
					click : function() {

						var url = "exportreportviewer?";
						url += "db_name=" + $( '#dbName' ).val();
						url += "&org_id=" + $( '#orgId' ).val();
						url += "&request_type=" + $( '#reportType' ).val();
						url += "&start_date=" + $( '#startdate' ).val();
						url += "&end_date=" + $( '#enddate' ).val();
						url += "&talker_ids=" + $( '#talkerIds' ).val();
						url += "&logical_type=" + $( '#dateRange' ).val();
						url += "&call_disposition=" + btoa( ( $( '#calldisposition' ).val() ).replace( '>', '__GREATER__' ).replace( '<', '__LESSER__' ) );
						url += "&list_names=" + btoa( ( $( '#listnames' ).val() ).replace( '>', '__GREATER__' ).replace( '<', '__LESSER__' ) );
						url += "&out_type=export_csv";
						url += "&product_type=" + $( '#reportParamProductType' ).val();
						url += "&ViewTypeOfConnectsPerformanceReportData=" + $( '#viewTypeOfConnectsPerformanceReport' ).val();
						window.open( url, '_self' );

					}
				}
			} ],

		},
		features : [ {
			id : 'summaryfeature',
			ftype : 'summary',
			dock : 'bottom'
		}, {
			id : 'groupbyfeature',
			ftype : 'groupingsummary',
			groupHeaderTpl : [ '{name:this.readFormat}', {
				readFormat : function( date ) {

					if ( date.match( /^-{0,1}\d+$/ ) ) {
						return '';
					} else {
						date = new Date( date );
						if ( isNaN( date ) ) {
							return '';
						} else {
							return Ext.Date.format( date, 'F j, Y' ) + ' - ' + Ext.Date.format( Ext.Date.add( date, Ext.Date.DAY, 5 ), 'F j, Y' );
						}
					}
				}
			} ]
		} ],

		// renderTo : "grid-area",
		width : 1115,
		height : 355,
		split : true,
		region : 'north',
		viewConfig : {
			emptyText : 'No Records to Display',
			deferEmptyText : false
		},
		listeners : {

			selectionchange : function( model, records ) {

				var dom = Ext.dom.Query.select( '.x-grid-row-summary-selected' );

				for ( var k = 0; k < dom.length; k++ ) {
					var summaryRow = Ext.get( dom[ k ] );
					if ( summaryRow != null && summaryRow != undefined ) {
						summaryRow.removeCls( 'x-grid-row-summary-selected' );
						summaryRow.addCls( 'x-grid-row-summary' );
					}
				}

				if ( $( '#reportType' ).val() == "PDWSR" || $( '#reportType' ).val() == "TDEXR" || $( '#reportType' ).val() == "PDEXR" || $( '#reportType' ).val() == "CDEXR" || $( '#reportType' ).val() == "TDWSR" || $( '#reportType' ).val() == "CDWSR" || $( '#reportType' ).val() == "CTCWSR" || $( '#reportType' ).val() == "TDCR" || $( '#reportType' ).val() == "CLCR" ) {
					if ( records[ 0 ] ) {
						rec = records[ 0 ];
						updateRecord( rec );
					}

				}
			},
			click : {

				element : 'el',
				fn : function( ev, el ) {

					if ( $( '#reportType' ).val() == "PDCDR" || $( '#reportType' ).val() == "DACDR" || $( '#reportType' ).val() == "TKDAR" || $( '#reportType' ).val() == "TDCDR" || $( '#reportType' ).val() == "RCDR" || $( '#reportType' ).val() == "ILDR" || $( '#reportType' ).val() == "ILTSR" ) {
						Ext.dom.Query.select( '.x-grid-row-summary-selected' );
					} else {
						var parentNode = Ext.get( el ).findParent( 'tr', 3, true );
						if ( typeof ( parentNode != "undefined" ) && parentNode != null && parentNode.hasCls( 'x-grid-row-summary' ) ) {
							var dom = Ext.dom.Query.select( '.x-grid-row-summary-selected' );
							for ( var k = 0; k < dom.length; k++ ) {
								var summaryRow = Ext.get( dom[ k ] );
								if ( summaryRow != null && summaryRow != undefined ) {
									summaryRow.removeCls( 'x-grid-row-summary-selected' );
									summaryRow.addCls( 'x-grid-row-summary' );
								}
							}
							parentNode.removeCls( 'x-grid-row-summary' );
							parentNode.addCls( 'x-grid-row-summary-selected' );
							var gridSelectedSummaryId = parentNode.prev( 'tr' ).id;
							var groups = Ext.getCmp( "gridPanel" ).getStore().getGroups();
							for ( var k = 0; k < groups.length; k++ ) {
								var groupName = groups[ k ].name;
								if ( gridSelectedSummaryId.indexOf( groupName ) != -1 ) {
									var groupRecords = groups[ k ].children;
									var cdArray = new Array();
									for ( var l = 0; l < groupRecords.length; l++ ) {
										var gridCols = Ext.getCmp( "gridPanel" ).headerCt.getGridColumns();
										var rec = groupRecords[ l ];
										for ( var i = 0; i < gridCols.length; i++ ) {
											var field = gridCols[ i ].dataIndex;
											if ( field.indexOf( "cd_" ) != -1 ) {
												if ( cdArray.contains( gridCols[ i ].text ) ) {
													cdArray[ gridCols[ i ].text ] = parseInt( rec.get( field ), 10 ) + parseInt( cdArray[ gridCols[ i ].text ], 10 );
												} else {
													cdArray[ gridCols[ i ].text ] = rec.get( field );
												}
											} else if ( field === "valid_connects" || field === "valid_connects" || field === "total_problems" || field === "total_connects" || field === "positive_connects" ) {
												if ( cdArray.contains( gridCols[ i ].text ) ) {
													cdArray[ gridCols[ i ].text ] = parseInt( rec.get( field ), 10 ) + parseInt( cdArray[ gridCols[ i ].text ], 10 );
												} else {
													cdArray[ gridCols[ i ].text ] = rec.get( field );
												}
											}
										}

									}
									var json = [];
									for ( cd in cdArray ) {
										if ( cd.indexOf( "contains" ) === -1 && parseInt( cdArray[ cd ], 10 ) > 0 ) {
											json.push( {
												'Name' : ( cd == "" ? 'Unkown' : cd ),
												'Data' : parseInt( cdArray[ cd ], 10 )
											} );
										}
									}
									chartStore.loadData( json );

									break;
								}
							}

						}
					}
				}
			}
		}
	} );

	var grid1 = Ext.create( 'Ext.grid.Panel', {
		store : reportsStore1,
		id : "gridPanel1",
		title : 'Attempt Results',
		top : '-31px',
		hidden : true,
		columns : [ {
			"text" : "Sales Rep",
			"width" : 150,
			"dataIndex" : "talker_name",
			"sortable" : true
		} ],
		features : [ {
			id : 'summaryfeature1',
			ftype : 'summary',
			dock : 'bottom',
		} ],
		width : '100%',
		height : 350,
		split : true,
		region : 'north',
		viewConfig : {
			emptyText : '<p class="norecordtodisplay table-msg">No Records to Display</p>',
			deferEmptyText : false
		},
		listeners : {

			columnmove : function( container, coulmn, from, to ) {

				if ( from > to ) {
					Ext.getCmp( "gridPanel1" ).getView().refresh();
					return false;
				}
			}
		}

	} );


	updateRecord = function( rec ) {

		var json = [ {
			'Name' : '# Connects',
			'Data' : rec.get( 'total_connects' )
		} ];
		if ( rec.get( 'valid_connect_column' ) > 0 ) {
			json.push( {
				'Name' : '# Valid Connects',
				'Data' : rec.get( 'valid_connect_column' )
			} );
		}
		if ( rec.get( 'positive_connects' ) > 0 ) {
			json.push( {
				'Name' : '# Positive Connects',
				'Data' : rec.get( 'positive_connects' )
			} );
		}

		if ( rec.get( 'valid_connects' ) > 0 ) {
			json.push( {
				'Name' : '# Connects',
				'Data' : rec.get( 'total_connects' )
			} );
		}
		if ( rec.get( 'valid_connects' ) > 0 ) {
			json.push( {
				'Name' : '# Valid Connects',
				'Data' : rec.get( 'valid_connects' )
			} );
		}
		if ( rec.get( 'positive_connects' ) > 0 ) {
			json.push( {
				'Name' : '# Positive Connects',
				'Data' : rec.get( 'positive_connects' )
			} );
		}
		if ( rec.get( 'total_problems' ) > 0 ) {
			json.push( {
				'Name' : '# Problems',
				'Data' : rec.get( 'total_problems' )
			} );
		}
		var gridCols = Ext.getCmp( "gridPanel" ).headerCt.getGridColumns();

		for ( var i = 0; i < gridCols.length; i++ ) {

			var field = gridCols[ i ].dataIndex;

			if ( field.indexOf( "cd_" ) != -1 && gridCols[ i ].text != "" && rec.get( gridCols[ i ].dataIndex ) > 0 ) {
				json.push( {
					'Name' : gridCols[ i ].text,
					'Data' : rec.get( gridCols[ i ].dataIndex )
				} );

			}
		}

		chartStore.loadData( json );

		chartPanel.setTitle( "Dialing Session Details of " + rec.get( 'talker_name' ) );

	};

	Ext.define( 'LineChartStore', {
		extend : 'Ext.data.Model',
		fields : [ {
			name : 'talker_name',
			type : 'string'
		}, {
			name : 'total_dials',
			type : 'int',
		}, {
			name : 'total_connects',
			type : 'int',
		}, {
			name : 'total_positive_connects',
			type : 'int',
		} ]
	} );

	var lineChartStore = Ext.create( 'Ext.data.JsonStore', {
		model : 'LineChartStore',
		data : [ {
			'talker_name' : 'Talker 1',
			'total_dials' : 0,
			'total_connects' : 0,
			'total_positive_connects' : 0
		}, {
			'talker_name' : 'Talker 2',
			'total_dials' : 0,
			'total_connects' : 0,
			'total_positive_connects' : 0
		}, {
			'talker_name' : 'Talker 3',
			'total_dials' : 0,
			'total_connects' : 0,
			'total_positive_connects' : 0
		} ]
	} );

	Ext.define( 'LineChartNLStore', {
		extend : 'Ext.data.Model',
		fields : [ {
			name : 'time',
			type : 'string'
		}, {
			name : 'metrics1',
			type : 'int',
		}, {
			name : 'metrics2',
			type : 'int',
		}, {
			name : 'metrics3',
			type : 'int',
		}, {
			name : 'metrics4',
			type : 'int',
		}, {
			name : 'metrics5',
			type : 'int',
		} ]
	} );

	var lineChartNLStore = Ext.create( 'Ext.data.Store', {
		model : 'LineChartNLStore',
		data : [ 'metrics1', 'metrics2', 'metrics3', 'metrics4', 'metrics5' ]
	} );

	function updateChartData() {

		Ext.Ajax.request( {

			params : {
				request_type : $( '#reportType' ).val(),
				start_date : $( '#startdate' ).val(),
				end_date : $( '#enddate' ).val(),
				talker_ids : $( '#talkerIds' ).val(),
				list_names : $( '#listnames' ).val(),
				logical_type : $( '#dateRange' ).val(),
				call_disposition : $( '#calldisposition' ).val(),
				db_name : $( '#dbName' ).val(),
				org_id : $( '#orgId' ).val(),
				start_time : Ext.getCmp( 'reportParams' ).getForm().findField( "start_time" ).getRawValue(),
				end_time : Ext.getCmp( 'reportParams' ).getForm().findField( "end_time" ).getRawValue()
			},
			method : 'POST',
			url : 'reportviewer',
			success : function( response ) {

				// Ext.Msg.alert('Error','Please select the date range'+$('#orgId').val());
				var jsonResponse = Ext.JSON.decode( response.responseText );

				if ( $( '#reportType' ).val() == "NLR" ) {
					var excellent_value = ( jsonResponse.excellent_status_value == '' || jsonResponse.excellent_status_value == "null" ) ? 50 : jsonResponse.excellent_status_value;
					var good_value = ( jsonResponse.good_status_value == '' || jsonResponse.good_status_value == 'null' ) ? 100 : jsonResponse.good_status_value;
					var poor_value = ( jsonResponse.poor_status_value == '' || jsonResponse.poor_status_value == 'null' ) ? 150 : jsonResponse.poor_status_value;
					var weak_value = ( jsonResponse.weak_status_value == '' || jsonResponse.weak_status_value == 'null' ) ? 200 : jsonResponse.weak_status_value;

					Ext.getCmp( "clReportPannel" ).setTitle( Ext.getCmp( 'reportParams' ).getForm().findField( "report_type" ).getRawValue() + " &nbsp;&nbsp; <span style = 'font-size:12px;' > (<span style = ' color:#57bf12'>0-" + ( excellent_value - 1 ) + " = Excellent </span>, <span style = ' color:#ffc107'>" + excellent_value + "-" + ( good_value - 1 ) + " = Good </span>, <span style = ' color:#ff6b05'>" + good_value + "-" + ( poor_value - 1 ) + " = Poor </span> and <span style = ' color:#f8041c'>" + poor_value + "+ = Weak</span>) </span>" );
				}

				if ( jsonResponse.status == "SUCCESS" ) {
					var jArray = [];
					var jData = jsonResponse.rowdata;
					if ( $( '#reportType' ).val() == "NLR" ) {
						Ext.getCmp( "chartPanel" ).setWidth( 1800 );
						Ext.getCmp( "chartPanel" ).setHeight( 755 );
						var jMetaData = jsonResponse.metaData;

						mTitle[ 1 ] = '';
						mTitle[ 2 ] = '';
						mTitle[ 3 ] = '';
						mTitle[ 4 ] = '';
						mTitle[ 5 ] = '';

						for ( var i = 1; i < jMetaData.columns.length; i++ ) {
							mTitle[ i ] = jMetaData.columns[ i ].text;
						}

						if ( jData.constructor === Array ) {
							lineChartNLStore.loadData( jData );
						} else {
							jArray.push( jData );
							lineChartNLStore.loadData( jArray );
						}
						Ext.getCmp( 'lineChartNLR' ).redraw();
					} else if ( jData.constructor === Array ) {
						lineChartStore.loadData( jData );
					} else {
						jArray.push( jData );
						lineChartStore.loadData( jArray );
					}

				}
				Ext.getBody().unmask();
			}
		} );
	}


	var chartStore = Ext.create( 'Ext.data.JsonStore', {
		model : 'ChartStore',
		fields : [ 'Name', 'Data' ],
		data : [ {
			'Name' : '# Connects',
			'Data' : 100
		}, {
			'Name' : '# Valid Connects',
			'Data' : 100
		}, {
			'Name' : '# Positive Connects',
			'Data' : 100
		}, {
			'Name' : '# Problems',
			'Data' : 100
		} ]
	} );

	Ext.define( 'stackChartStore', {
		extend : 'Ext.data.Model',
		fields : [ {
			name : 'Name',
			type : 'string'
		}, {
			name : 'Leads Created',
			type : 'int',
		}, {
			name : 'Leads Processed',
			type : 'int',
		} ]
	} );

	var stackChartStore = Ext.create( 'Ext.data.Store', {
		model : 'stackChartStore',
		fields : [ 'Name', 'Leads Created', 'Leads Processed' ],
	} );

	var pieChart = Ext.create( 'Ext.chart.Chart', {

		xtype : 'chart',
		id : 'pieChart',
		cls : 'chart-refer',
		animate : true,
		store : chartStore,
		shadow : true,
		legend : {
			position : 'right',
			x : 100
		},
		insetPadding : 20,
		theme : 'Base:gradients',
		series : [ {
			type : 'pie',
			field : 'Data',
			showInLegend : true,
			tips : {
				trackMouse : true,
				width : 250,
				height : 50,
				renderer : function( storeItem, item ) {

					this.setTitle( storeItem.get( 'Name' ) + ': ' + storeItem.get( 'Data' ) );
				}
			},
			highlight : {
				segment : {
					margin : 20
				}
			},
			label : {
				field : 'Name',
				display : 'none',
				contrast : false,
				font : '12px Arial bold'
			},
			renderer : function( sprite, record, attr, index, store ) {

				var color = [ "#7fc54c", "#29abe2", "#ff0000", "#f7931e", "#ffd13e", "#7e335a", "#24ad9a", "#7c7474", "#a66111", "#94ae0a", "#115fa6", "#a61120", "#ff8809", "#ffd13e" ][ index ];
				return Ext.apply( attr, {
					fill : color,
					stroke : color
				} );
			},
			donut : 50
		} ]
	} );


	var barChart = Ext.create( 'Ext.chart.Chart', {
		xtype : 'chart',
		id : 'barChart',
		cls : 'chart-refer',
		animate : true,
		store : chartStore,
		shadow : true,
		theme : 'Base:gradients',
		axes : [ {
			type : 'Numeric',
			position : 'left',
			fields : [ 'Data' ],
			label : {
				renderer : Ext.util.Format.numberRenderer( '0' )
			},
			grid : true,
			minimum : 0,
			majorTickSteps : 2
		}, {
			type : 'Category',
			position : 'bottom',
			labels : {
				rotation : 270
			},
			fields : [ 'Name' ],
			title : 'Call Dispositions'
		} ],
		series : [ {
			type : 'column',
			axis : 'left',
			style : {
				width : '50',
			},
			highlight : true,
			tips : {
				trackMouse : true,
				width : 200,
				height : 40,
				renderer : function( storeItem, item ) {

					this.setTitle( storeItem.get( 'Name' ) + ': ' + storeItem.get( 'Data' ) );
				}
			},
			label : {
				display : 'insideEnd',
				field : [ 'Name', 'Data' ],
				renderer : Ext.util.Format.numberRenderer( '0' ),
				orientation : 'vertical',
				color : '#333',
				'text-anchor' : 'middle'
			},
			xField : 'Name',
			yField : [ 'Data' ],
			title : [ 'Call Disposition', 'Session Details' ],
			renderer : function( sprite, record, attr, index, store ) {

				var color = [ "#7fc54c", "#29abe2", "#ff0000", "#f7931e", "#ffd13e", "#7e335a", "#24ad9a", "#7c7474", "#a66111", "#94ae0a", "#115fa6", "#a61120", "#ff8809", "#ffd13e" ][ index ];
				return Ext.apply( attr, {
					fill : color
				} );
			}
		} ]
	} );

	var stackBarChart = Ext.create( 'Ext.chart.Chart', {
		id : 'stackBarChart',
		animate : true,
		cls : 'chart-refer',
		// renderTo : Ext.getBody(),
		width : 470,
		height : 300,
		store : stackChartStore,
		axes : [ {
			title : 'Count',
			type : 'Numeric',
			position : 'left',
			grid : true,
			fields : [ 'Leads Created', 'Leads Processed' ],
		}, {
			type : 'Category',
			position : 'bottom',
			fields : [ 'Name' ],
			// fields : [ 'Leads Created', 'Leads Processed' ],
			title : 'Date',
			label : {
				orientation : 'vertical',
				display : 'inside',
				'text-anchor' : 'middle',

			},
		} ],
		series : [ {
			type : 'bar',
			axis : 'left',
			highlight : true,
			column : true,
			stacked : true,
			xField : 'Name',
			yField : [ 'Leads Created', 'Leads Processed' ],
			xPadding : 1,
			yPadding : 0,
			tips : {

				label : {
					display : 'insideStart',
					field : [ 'Leads Created', 'Leads Processed' ]


				},
				trackMouse : true,
				renderer : function( storeItem, item ) {

					this.setTitle( item.yField + ' : ' + String( item.value[ 1 ] ) );

				}

			}
		} ]
	} );


	var lineChart = Ext.create( 'Ext.chart.Chart', {
		xtype : 'chart',
		id : 'lineChart',
		cls : 'chart-refer',
		animate : true,
		store : chartStore,
		shadow : true,
		theme : 'Base:gradients',
		axes : [ {
			type : 'Numeric',
			position : 'left',
			fields : [ 'Data' ],
			grid : true,
			minimum : 0,
		}, {
			type : 'Category',
			position : 'bottom',
			fields : [ 'Name' ],
			title : 'Call Dispositions',
			fontSize : 15,
		} ],
		series : [ {
			type : 'line',
			axis : 'left',
			highlight : true,
			tips : {
				trackMouse : true,
				width : 200,
				height : 40,
				renderer : function( storeItem, item ) {

					this.setTitle( storeItem.get( 'Name' ) + ': ' + storeItem.get( 'Data' ) );
				}
			},
			visibleRange : [ 0, 1 ],
			xField : 'Name',
			yField : [ 'Data' ],
			title : [ 'Call Disposition' ]
		} ]
	} );

	var lineChartNLR = Ext.create( 'Ext.chart.Chart', {
		xtype : 'chart',
		id : 'lineChartNLR',
		animate : true,
		width : 'auto',
		store : lineChartNLStore,
		cls : 'chart-refer',
		shadow : true,
		theme : 'Base:gradients',
		legend : {
			position : 'bottom'
		},
		axes : [ {
			type : 'Numeric',
			position : 'left',
			fields : [ 'metrics1', 'metrics2', 'metrics3', 'metrics4', 'metrics5' ],
			title : "Response Time ( Avg in Milliseconds )",
			// grid : true,
			minimum : 0,
			minorTickSteps : 1,

		}, {
			type : 'Category',
			position : 'bottom',
			fields : [ 'time' ],
			title : {
				text : 'Time',
				fontSize : 15
			},
			label : {
				orientation : 'vertical',
				rotate : {
					degrees : -90
				}
			}
		} ],
		series : [ {
			type : 'line',
			style : {
				lineWidth : 2
			},
			axis : "left",
			xField : 'time',
			yField : 'metrics5',
			tips : {
				renderer : function( storeItem, item ) {

					this.setTitle( storeItem.get( 'metrics5' ) );
				}
			},
			markerConfig : {
				type : 'circle',
				size : 4,
				radius : 4,
				'stroke-width' : 0
			},
			renderer : function( sprite, record, attributes, index, store ) {

				var color = '#94ae0a';

				if ( mTitle[ 5 ] == '' )
					color = '#ffffff';

				this.style.stroke = color;

				this.setTitle( mTitle[ 5 ] );
				if ( mTitle[ 5 ] == '' )
					this.showInLegend = false;

				return attributes;
			}

		}, {
			type : 'line',
			style : {
				lineWidth : 2
			},
			axis : "left",
			xField : 'time',
			yField : 'metrics4',
			tips : {
				renderer : function( storeItem, item ) {

					this.setTitle( storeItem.get( 'metrics4' ) );
				}
			},
			markerConfig : {
				type : 'circle',
				size : 4,
				radius : 4,
				'stroke-width' : 0
			},
			renderer : function( sprite, record, attributes, index, store ) {

				var color = '#115fa6';

				if ( mTitle[ 4 ] == '' )
					color = '#ffffff';

				this.style.stroke = color;
				this.setTitle( mTitle[ 4 ] );
				if ( mTitle[ 4 ] == '' )
					this.showInLegend = false;
				else
					this.showInLegend = true;

				return attributes;
			}
		}, {
			type : 'line',
			style : {
				lineWidth : 2
			},
			axis : "left",
			xField : 'time',
			yField : 'metrics3',
			tips : {
				renderer : function( storeItem, item ) {

					this.setTitle( storeItem.get( 'metrics3' ) );
				}
			},
			markerConfig : {
				type : 'circle',
				size : 4,
				radius : 4,
				'stroke-width' : 0
			},
			renderer : function( sprite, record, attributes, index, store ) {

				var color = '#a61120';

				if ( mTitle[ 3 ] == '' )
					color = '#ffffff';

				this.style.stroke = color;
				this.setTitle( mTitle[ 3 ] );
				if ( mTitle[ 3 ] == '' )
					this.showInLegend = false;
				else
					this.showInLegend = true;

				return attributes;
			}
		}, {
			type : 'line',
			style : {
				lineWidth : 2
			},
			axis : "left",
			xField : 'time',
			yField : 'metrics2',
			tips : {
				renderer : function( storeItem, item ) {

					this.setTitle( storeItem.get( 'metrics2' ) );
				}
			},
			markerConfig : {
				type : 'circle',
				size : 4,
				radius : 4,
				'stroke-width' : 0
			},
			renderer : function( sprite, record, attributes, index, store ) {

				var color = '#ff8809';

				if ( mTitle[ 2 ] == '' )
					color = '#ffffff';

				this.style.stroke = color;
				this.setTitle( mTitle[ 2 ] );
				if ( mTitle[ 2 ] == '' )
					this.showInLegend = false;
				else
					this.showInLegend = true;

				return attributes;
			}
		}, {
			type : 'line',
			style : {
				lineWidth : 2,
			},
			axis : "left",
			xField : 'time',
			yField : 'metrics1',
			tips : {
				renderer : function( storeItem, item ) {

					this.setTitle( storeItem.get( 'metrics1' ) );
				}
			},
			markerConfig : {
				type : 'circle',
				size : 4,
				radius : 4,
				'stroke-width' : 0
			},
			renderer : function( sprite, record, attributes, index, store ) {

				var color = '#ffd13e';

				if ( mTitle[ 1 ] == '' )
					color = '#ffffff';

				this.style.stroke = color;
				this.setTitle( mTitle[ 1 ] );
				if ( mTitle[ 1 ] == '' )
					this.showInLegend = false;
				else
					this.showInLegend = true;

				return attributes;
			}
		}, {
			type : 'line',
			showInLegend : false,
			style : {
				lineWidth : 2,
				stroke : '#ffffff'
			},
			axis : "left",
			xField : 'time',
			yField : 'metrics6'
		} ]
	} );

	var lineChartUTR = Ext.create( 'Ext.chart.Chart', {
		xtype : 'chart',
		id : 'lineChartUTR',
		animate : true,
		store : lineChartStore,
		shadow : true,
		cls : 'chart-refer',
		theme : 'Base:gradients',
		legend : {
			position : 'right'
		},
		axes : [ {
			type : 'Numeric',
			position : 'left',
			fields : [ 'total_dials', 'total_connects', 'total_positive_connects' ],
			grid : true,
			minimum : 0,
			minorTickSteps : 1
		}, {
			type : 'Category',
			position : 'bottom',
			fields : [ 'talker_name' ],
			title : 'Sales Representatives',
			label : {
				rotate : {
					degrees : 270
				}
			}
		} ],
		series : [ {
			type : 'line',
			axis : 'left',
			highlight : true,
			tips : {
				trackMouse : true,
				width : 190,
				height : 60,
				renderer : function( storeItem, item ) {

					this.setTitle( 'Sales Rep : ' + storeItem.get( 'talker_name' ) + ' <br/> ' + '# Dials : ' + storeItem.get( 'total_dials' ) );
					saleName = 'Sales Rep : ' + storeItem.get( 'talker_name' );
					this.setWidth( saleName.length * 7 );
				}
			},
			xField : 'talker_name',
			yField : [ 'total_dials' ],
			title : [ '# Dials' ]

		}, {
			type : 'line',
			axis : 'left',
			highlight : true,
			tips : {
				trackMouse : true,
				width : 190,
				height : 60,
				renderer : function( storeItem, item ) {

					this.setTitle( 'Sales Rep : ' + storeItem.get( 'talker_name' ) + ' <br/> ' + '# Connects : ' + storeItem.get( 'total_connects' ) );
					saleName = 'Sales Rep : ' + storeItem.get( 'talker_name' );
					this.setWidth( saleName.length * 7 );
				}
			},
			xField : 'talker_name',
			yField : [ 'total_connects' ],
			title : [ '# Connects' ]
		}, {
			type : 'line',
			axis : 'left',
			highlight : true,
			tips : {
				trackMouse : true,
				width : 190,
				height : 60,
				renderer : function( storeItem, item ) {

					this.setTitle( 'Sales Rep : ' + storeItem.get( 'talker_name' ) + '<br/> ' + '# Positive Connects : ' + storeItem.get( 'total_positive_connects' ) );
					saleName = 'Sales Rep : ' + storeItem.get( 'talker_name' );
					this.setWidth( saleName.length * 7 );
				}
			},
			xField : 'talker_name',
			yField : [ 'total_positive_connects' ],
			title : [ '# Positive Connects' ]
		} ]
	} );

	var chartPanel = Ext.create( 'widget.panel', {
		width : 1115,
		height : 400,
		id : 'chartPanel',
		title : 'Dialing Session Details',
		tbar : [ {
			xtype : 'button',
			text : 'Pie Chart',
			id : 'pieButton',
			handler : function() {

				var chartType = $( '#chartType' ).val();
				Ext.getCmp( 'chartPanel' ).remove( Ext.getCmp( chartType ), false );
				$( '#chartType' ).val( 'pieChart' );
				Ext.getCmp( 'chartPanel' ).add( Ext.getCmp( "pieChart" ) );
				Ext.getCmp( "pieChart" ).redraw();
			}
		}, {
			xtype : 'button',
			text : 'Bar Chart',
			id : 'barButton',
			handler : function() {

				var chartType = $( '#chartType' ).val();
				Ext.getCmp( 'chartPanel' ).remove( Ext.getCmp( chartType ), false );
				$( '#chartType' ).val( 'barChart' );
				Ext.getCmp( 'chartPanel' ).add( Ext.getCmp( "barChart" ) );
				Ext.getCmp( "barChart" ).redraw();
			}

		}, {
			xtype : 'button',
			text : 'Line Chart',
			id : 'lineButton',
			handler : function() {

				var chartType = $( '#chartType' ).val();
				Ext.getCmp( 'chartPanel' ).remove( Ext.getCmp( chartType ), false );
				$( '#chartType' ).val( 'lineChart' );
				Ext.getCmp( 'chartPanel' ).add( Ext.getCmp( "lineChart" ) );
				Ext.getCmp( "lineChart" ).redraw();
			}
		} ],
		renderTo : 'chart-area',
		layout : 'fit',
		viewConfig : {
			emptyText : 'No Records to Display',
			deferEmptyText : false,
			loadMask : true
		}
	} );

	var reportPanel = Ext.create( 'Ext.form.Panel', {
		id : 'clReportPannel',
		title : 'Reports',
		frame : true,
		bodyPadding : 1,
		width : 1130,
		height : 800,
		fieldDefaults : {
			labelAlign : 'left',
			msgTarget : 'side'
		},
		layout : {
			type : 'vbox'
		},
		items : [ grid, {
			xtype : 'splitter'
		}, grid1, {
			xtype : 'splitter'
		}, chartPanel ],
		renderTo : 'report-area'
	} );

	Ext.define( 'ClientNames', {
		extend : 'Ext.data.Model',
		fields : [ {
			name : 'client_name',
			type : 'string'
		}, {
			name : 'org_id',
			type : 'string'
		}, {
			name : 'lookup_value',
			type : 'string'
		} ]

	} );

	var clientTestsites = [ {
		org_id : "Clients",
		client_name : "Clients",
		lookup_value : ""
	}, {
		org_id : "TestSites",
		client_name : "TestSites",
		lookup_value : ""
	} ];
	var clientNamesStore = Ext.create( 'Ext.data.JsonStore', {
		model : 'ClientNames',
		storeId : 'ClientNames',
		data : ( clientNames != null && clientNames != undefined && clientNames != "" ) ? clientTestsites.concat( actualClients ) : clientTestsites
	} );

	Ext.define( 'TalkerNames', {
		extend : 'Ext.data.Model',
		fields : [ {
			name : 'talker_id',
			type : 'string'
		}, {
			name : 'talker_name',
			type : 'string'
		}, {
			name : 'is_active',
			type : 'string'
		} ]
	} );

	Ext.define( 'TeamNames', {
		extend : 'Ext.data.Model',
		fields : [ {
			name : 'team_id',
			type : 'string'
		}, {
			name : 'team_name',
			type : 'string'
		} ]
	} );

	Ext.define( 'GeoLocations', {
		extend : 'Ext.data.Model',
		fields : [ {
			name : 'location_name',
			type : 'string'
		}, {
			name : 'location_value',
			type : 'string'
		} ]
	} );


	var sampleData = '{"location_name":"NONE","location_id":"NONE"}';
	var geoLocationStore = Ext.create( 'Ext.data.JsonStore', {
		model : 'GeoLocations',
		storeId : 'GeoLocations',
		data : Ext.JSON.decode( sampleData )
	} );

	var sampleData = '{"talker_name":"ALL","talker_id":"ALL"}';
	var talkerNamesStore = Ext.create( 'Ext.data.JsonStore', {
		model : 'TalkerNames',
		storeId : 'TalkerNames',
		data : ( talkerNamesData != null && talkerNamesData != undefined && talkerNamesData != "" ) ? talkerNamesData.rowdata : Ext.JSON.decode( sampleData )
	} );


	sampleData = '{"team_name":"ALL","team_id":"ALL"}';
	var teamNameStore = Ext.create( 'Ext.data.JsonStore', {
		model : 'TeamNames',
		storeId : 'TeamNames',
		data : ( teamNamesData != null && teamNamesData != undefined && teamNamesData != "" ) ? teamNamesData.rowdata : Ext.JSON.decode( sampleData )
	} );

	Ext.define( 'ListNames', {
		extend : 'Ext.data.Model',
		fields : [ {
			name : 'list_name',
			type : 'string'
		} ]
	} );
	sampleData = '{"list_name":"ALL"}';
	var listNamesStore = Ext.create( 'Ext.data.JsonStore', {
		model : 'ListNames',
		storeId : 'ListNames',
		data : ( listNamesData != null && listNamesData != undefined && listNamesData != "" ) ? listNamesData.rowdata : Ext.JSON.decode( sampleData )

	} );

	Ext.define( 'TalkerCallDispositions', {
		extend : 'Ext.data.Model',
		fields : [ {
			name : 'call_disposition',
			type : 'string'
		}, {
			name : 'product_type',
			type : 'string'
		} ]
	} );

	Ext.define( 'DACallDispositions', {
		extend : 'Ext.data.Model',
		fields : [

		{
			name : 'call_disposition',
			type : 'string'
		}, {
			name : 'product_type',
			type : 'string'
		}

		]
	} );

	sampleData = '{"call_disposition":"ALL"}';

	var cdTalkerStore = Ext.create( 'Ext.data.JsonStore', {
		model : 'TalkerCallDispositions',
		storeId : 'TalkerCallDispositions',
		data : ( callDispositionData != null && callDispositionData != undefined && callDispositionData != "" ) ? callDispositionData.talker.rowdata : Ext.JSON.decode( sampleData )
	} );

	var cdDAStore = Ext.create( 'Ext.data.JsonStore', {
		model : 'DACallDispositions',
		storeId : 'DACallDispositions',
		data : ( callDispositionData != null && callDispositionData != undefined && callDispositionData != "" ) ? callDispositionData.da.rowdata : Ext.JSON.decode( sampleData )
	} );

	var cdPDTalkerStore = Ext.create( 'Ext.data.Store', {
		model : 'TalkerCallDispositions',
		data : ( callDispositionData != null && callDispositionData != undefined && callDispositionData != "" ) ? callDispositionData.pd_talker_cd : ""
	} );
	var cdCDTalkerStore = Ext.create( 'Ext.data.Store', {
		model : 'TalkerCallDispositions',
		data : ( callDispositionData != null && callDispositionData != undefined && callDispositionData != "" ) ? callDispositionData.cd_talker_cd : ""
	} );
	var reportParamPanel = Ext.create( 'Ext.form.Panel', {
		xtype : 'form',
		id : 'reportParams',
		title : 'Report Inputs',
		renderTo : 'param-area',
		bodyStyle : 'padding:5px 5px 0',
		labelStyle : 'white-space: nowrap;',
		width : 1130,
		layout : 'anchor',
		defaults : {
			anchor : '100%'
		},
		items : [ {
			xtype : 'fieldcontainer',
			defaultType : 'combo',
			layout : 'hbox',
			width : 1100,
			items : [ {
				xtype : 'combo',
				fieldLabel : 'Client Name',
				name : 'client_name',
				width : 510,
				displayField : 'client_name',
				valueField : 'org_id',
				store : clientNamesStore,
				queryMode : 'local',
				labelAlign : 'right',
				editable : true,
				listeners : {
					select : function( field ) {

						if ( !( field.value == 'TestSites' || field.value == 'Clients' ) ) {

							resetFields();
							groupNamesData = [];
							$( '#dbName' ).val( field.value );
							$( '#orgId' ).val( field.value );


							Ext.Ajax.request( {
								params : {
									request_type : 'get_team_names',
									db_name : field.value,
									org_id : field.value
								},
								method : 'POST',
								url : 'reportviewer',
								success : function( response ) {

									var jsonData = Ext.JSON.decode( response.responseText );
									var teamStore = Ext.data.StoreManager.lookup( 'TeamNames' );
									if ( jsonData.rowdata != null && jsonData.rowdata != undefined && jsonData.rowdata != "" ) {
										teamStore.loadData( jsonData.rowdata );
										$.each( jsonData.groupName, function( key, val ) {

											groupNamesData[ key ] = val;
										} );
									} else {
										var sampleData = '[{"team_name":"ALL","team_id":"ALL","time_zone":""}]';
										var jsonDatas = Ext.JSON.decode( sampleData );
										teamStore.loadData( jsonDatas );
									}


								}
							} );

							Ext.Ajax.request( {
								params : {
									request_type : 'get_talker_names',
									db_name : field.value,
									org_id : field.value
								},
								method : 'POST',
								url : 'reportviewer',
								success : function( response ) {

									var jsonData = Ext.JSON.decode( response.responseText );
									var talkerStore = Ext.data.StoreManager.lookup( 'TalkerNames' );
									if ( jsonData.rowdata != null && jsonData.rowdata != undefined && jsonData.rowdata != "" ) {
										talkerStore.loadData( jsonData.rowdata );
										clientBasedTalkerName = jsonData.rowdata;
									} else {
										var sampleData = '[{"talker_name":"ALL","talker_id":"ALL","time_zone":""}]';
										var jsonDatas = Ext.JSON.decode( sampleData );
										talkerStore.loadData( jsonDatas );
									}
								}
							} );

						} else if ( field.value == 'Clients' ) {

							var clientStore = Ext.data.StoreManager.lookup( 'ClientNames' );

							if ( actualClients != null && actualClients != undefined ) {

								clientStore.loadData( clientTestsites.concat( actualClients ) );

								Ext.getCmp( 'reportParams' ).getForm().findField( "client_name" ).reset();
							}

						} else {

							var clientStore = Ext.data.StoreManager.lookup( 'ClientNames' );

							if ( testSiteClients != null && testSiteClients != undefined ) {

								clientStore.loadData( clientTestsites.concat( testSiteClients ) );

								Ext.getCmp( 'reportParams' ).getForm().findField( "client_name" ).reset();
							}

						}

					}
				}
			}, {

				xtype : 'combo',
				fieldLabel : 'User(s)',
				name : 'talker_ids',
				width : 510,
				displayField : 'talker_name',
				valueField : 'talker_id',
				store : talkerNamesStore,
				multiSelect : true,
				queryMode : 'local',
				labelAlign : 'right',
				editable : false,
				listeners : {
					select : function( field ) {

						if ( field.value == "ALL" || field.value.indexOf( "ALL" ) != -1 ) {
							var comboStore = field.getStore();
							var selectedValues = "";
							comboStore.each( function( rec ) {

								if ( rec.get( 'talker_name' ) != "ALL" && rec.get( 'talker_name' ) != "NONE" && rec.get( 'talker_name' ) != "ALL ACTIVE USERS" && rec.get( 'talker_name' ) != "ALL INACTIVE USERS" ) {
									selectedValues += ( selectedValues == "" ) ? rec.get( 'talker_id' ) : "," + rec.get( 'talker_id' );
								}
							} );
							field.setValue( selectedValues.split( "," ) );
						} else if ( field.value == "NONE" || field.value.indexOf( "NONE" ) != -1 ) {
							Ext.getCmp( 'reportParams' ).getForm().findField( "list_names" ).reset();
							var comboStore = field.getStore();
							comboStore.each( function( rec ) {

								if ( rec.get( 'talker_name' ) != "NONE" ) {
									rec.set( '' );
								}
							} );
							field.setValue( '' );
						} else if ( field.value == "ALL ACTIVE USERS" || field.value.indexOf( "ALL ACTIVE USERS" ) != -1 ) {// Added new code darwin
							var comboStore = field.getStore();
							selectedValues = "";
							comboStore.each( function( rec ) {

								var isActive = rec.get( 'is_active' );
								if ( rec.get( 'talker_name' ) != "ALL" && rec.get( 'talker_name' ) != "NONE" && rec.get( 'talker_name' ) != "ALL ACTIVE USERS" && rec.get( 'talker_name' ) != "ALL INACTIVE USERS" ) {
									if ( isActive == "Y" ) {
										selectedValues += ( selectedValues == "" ) ? rec.get( 'talker_id' ) : "," + rec.get( 'talker_id' );
									}
								}
							} );
							field.setValue( selectedValues.split( "," ) );
						} else if ( field.value == "ALL INACTIVE USERS" || field.value.indexOf( "ALL INACTIVE USERS" ) != -1 ) {
							var comboStore = field.getStore();
							selectedValues = "";
							comboStore.each( function( rec ) {

								var isActive = rec.get( 'is_active' );
								if ( rec.get( 'talker_name' ) != "ALL" && rec.get( 'talker_name' ) != "NONE" && rec.get( 'talker_name' ) != "ALL ACTIVE USERS" && rec.get( 'talker_name' ) != "ALL INACTIVE USERS" ) {
									if ( isActive == "N" ) {
										selectedValues += ( selectedValues == "" ) ? rec.get( 'talker_id' ) : "," + rec.get( 'talker_id' );
									}
								}
							} );
							field.setValue( selectedValues.split( "," ) );
						} else if ( field.value != "NONE" ) {
							selectedValues = "";
							selectedValues = this.getValue();
						}

						/*var groupNameList = new Set();

						for ( var key in groupNamesData ) {

							var selUserCount = 0;
							var grpUserCount = 0;

							var value = groupNamesData[ key ];

							if ( Array.isArray( value ) ) {

								grpUserCount = value.length;

								$.each( value, function( inKey, inVal ) {

									if ( selectedValues.indexOf( inVal ) > -1 )
										++selUserCount;
								} );

							} else {

								if ( selectedValues.indexOf( value ) > -1 ) {
									++grpUserCount;
									++selUserCount
								}
							}
							if ( grpUserCount != 0 && selUserCount == grpUserCount ) {
								groupNameList.add( key );
							}
						}*/
						/*$.each( groupNamesData, function( key, value ) {

							var selUserCount = 0;
							var grpUserCount = 0;
							if ( Array.isArray( value ) ) {

								grpUserCount = value.length;

								$.each( value, function( inKey, inVal ) {

									if ( selectedValues.indexOf( inVal ) > -1 )
										++selUserCount;
								} );
							} else {

								if ( selectedValues.indexOf( value ) > -1 ) {
									++grpUserCount;
									++selUserCount
								}
							}
							if ( grpUserCount != 0 && selUserCount == grpUserCount ) {
								groupNameList.add( key );
							}
						} );

						if ( field.value != "ALL" ) {
							Ext.getCmp( 'reportParams' ).getForm().findField( "team_ids" ).setValue( Array.from( groupNameList ) );
						} else if ( field.value == "ALL" ) {
							Ext.getCmp( 'reportParams' ).getForm().findField( "team_ids" ).setValue( Object.keys( groupNamesData ).split( "," ) );
						}*/

						if ( $.trim( field.value.join( ',' ) ) != '' ) {

							Ext.Ajax.request( {
								params : {
									request_type : 'list_names',
									list_user_ids : field.value.join( ',' ),
									org_id : $( '#orgId' ).val()
								},
								method : 'POST',
								url : 'reportviewer',
								success : function( response ) {

									var jsonData = Ext.JSON.decode( response.responseText );
									var listStore = Ext.data.StoreManager.lookup( 'ListNames' );
									listStore.loadData( jsonData.rowdata );

									listStore.filterBy( function( record ) {

										record.data.list_name = Ext.String.htmlEncode( record.data.list_name );
										return record;
									} );

								}
							} );

							Ext.Ajax.request( {
								params : {
									request_type : 'user_location_names',
									list_user_ids : field.value.join( ',' ),
									org_id : $( '#orgId' ).val()
								},
								method : 'POST',
								url : 'reportviewer',
								success : function( response ) {

									var jsonData = Ext.JSON.decode( response.responseText );
									var locations = [];
									Ext.each( Ext.getCmp( 'location_id' ).getStore().getRange(), function( element ) {

										Ext.each( jsonData.rowdata, function( rec ) {

											if ( element.data.location_value == rec.region_id && !locations.includes( rec.region_id ) ) {
												locations.push( rec.region_id );
											}
										} );
									} );

									Ext.getCmp( 'location_id' ).select( locations );
								}
							} );

						}

					}
				}

			} ]
		}, {

			xtype : 'fieldcontainer',
			defaultType : 'combo',
			layout : 'hbox',
			width : 1100,
			items : [ {
				xtype : 'combo',
				fieldLabel : 'Teams',
				name : 'team_ids',
				width : 510,
				displayField : 'team_name',
				valueField : 'team_id',
				store : teamNameStore,
				multiSelect : true,
				queryMode : 'local',
				labelAlign : 'right',
				editable : false,
				listeners : {
					select : function( field ) {

						Ext.getCmp( 'reportParams' ).getForm().findField( "talker_ids" ).setValue( '' );
						if ( field.value == "ALL" || field.value.indexOf( "ALL" ) != -1 ) {
							var comboStore = field.getStore();
							var selectedValues = "";
							comboStore.each( function( rec ) {

								if ( rec.get( 'team_name' ) != "ALL" && rec.get( 'team_name' ) != "NONE" ) {
									selectedValues += ( selectedValues == "" ) ? rec.get( 'team_id' ) : "," + rec.get( 'team_id' );
								}
							} );
							field.setValue( selectedValues.split( "," ) );
						} else if ( field.value == "NONE" || field.value.indexOf( "NONE" ) != -1 ) {
							var comboStore = field.getStore();
							comboStore.each( function( rec ) {

								if ( rec.get( 'team_name' ) != "NONE" ) {
									rec.set( '' );
								}
							} );
							field.setValue( '' );
							Ext.getCmp( 'reportParams' ).getForm().findField( "talker_ids" ).setValue( '' );

							var talkerStore = Ext.data.StoreManager.lookup( 'TalkerNames' );
							talkerStore.loadData( clientBasedTalkerName );
						}
						var userIds = new Set();

						var tempGrpList = new Array();

						tempGrpList = field.value;

						$.each( tempGrpList, function( index, val ) {

							if ( Array.isArray( groupNamesData[ val ] ) ) {

								groupNamesData[ val ].forEach( function( rec ) {

									userIds.add( rec );

								} );

							} else {
								userIds.add( $.trim( groupNamesData[ val ] ) );
							}

						} );

						/*Ext.getCmp( 'reportParams' ).getForm().findField( "talker_ids" ).setValue( Array.from( userIds ) );*/

						if ( ( Ext.getCmp( 'reportParams' ).getForm().findField( "report_type" ).getValue() == "LPR" || Ext.getCmp( 'reportParams' ).getForm().findField( "report_type" ).getValue() == "TDCDR" || Ext.getCmp( 'reportParams' ).getForm().findField( "report_type" ).getValue() == "DACDR" || Ext.getCmp( 'reportParams' ).getForm().findField( "report_type" ).getValue() == "PDCDR" || Ext.getCmp( 'reportParams' ).getForm().findField( "report_type" ).getValue() == "TKDAR" || Ext.getCmp( 'reportParams' ).getForm().findField( "report_type" ).getValue() == "CDCDR" || Ext.getCmp( 'reportParams' ).getForm().findField( "report_type" ).getValue() == "PDWSR" || Ext.getCmp( 'reportParams' ).getForm().findField( "report_type" ).getValue() == "TDWSR" || Ext.getCmp( 'reportParams' ).getForm().findField( "report_type" ).getValue() == "CDWSR" ) && $.trim( field.value.join( ',' ) ) != '' ) {
							Ext.getCmp( 'reportParams' ).getForm().findField( "list_names" ).enable();
						} else {
							Ext.getCmp( 'reportParams' ).getForm().findField( "list_names" ).disable();
						}

						if ( !( field.value == "NONE" || field.value.indexOf( "NONE" ) != -1 ) && $.trim( field.value.join( ',' ) ) != '' ) {
							Ext.Ajax.request( {
								params : {
									request_type : 'team_talker_names',
									list_group_names : field.value.join( ',' ),
									org_id : $( '#orgId' ).val()
								},
								method : 'POST',
								url : 'reportviewer',
								success : function( response ) {

									var jsonData = Ext.JSON.decode( response.responseText );

									var talkerStore = Ext.data.StoreManager.lookup( 'TalkerNames' );

									var locations = [];
									talkerStore.loadData( jsonData.rowdata );

									Ext.each( Ext.getCmp( 'location_id' ).getStore().getRange(), function( element ) {

										Ext.each( jsonData.rowdata, function( rec ) {

											if ( element.data.location_value == rec.region_id && !locations.includes( rec.region_id ) ) {
												locations.push( rec.region_id );
											}
										} );
									} );

									Ext.getCmp( 'location_id' ).select( locations );
									selectedValues = "";
									talkerStore.each( function( rec ) {

										if ( rec.get( 'talker_name' ) != "ALL" && rec.get( 'talker_name' ) != "NONE" && rec.get( 'talker_name' ) != "ALL ACTIVE USERS" && rec.get( 'talker_name' ) != "ALL INACTIVE USERS" ) {
											selectedValues += ( selectedValues == "" ) ? rec.get( 'talker_id' ) : "," + rec.get( 'talker_id' );
										}
									} );
									Ext.getCmp( 'reportParams' ).getForm().findField( "talker_ids" ).setValue( selectedValues.split( "," ) );

								}
							} );
						}

						if ( $.trim( Array.from( userIds ).join( ',' ) ) != '' ) {

							Ext.Ajax.request( {
								params : {
									request_type : 'list_names',
									list_user_ids : Array.from( userIds ).join( ',' ),
									org_id : $( '#orgId' ).val()
								},
								method : 'POST',
								url : 'reportviewer',
								success : function( response ) {

									var jsonData = Ext.JSON.decode( response.responseText );
									var listStore = Ext.data.StoreManager.lookup( 'ListNames' );
									listStore.loadData( jsonData.rowdata );

									listStore.filterBy( function( record ) {

										record.data.list_name = Ext.String.htmlEncode( record.data.list_name );
										return record;
									} );
								}
							} );

						}
					}
				}
			}, {

				xtype : 'fieldcontainer',
				defaultType : 'combo',
				layout : 'hbox',
				width : 1100,
				items : [ {
					xtype : 'combo',
					fieldLabel : 'Geo Location',
					name : 'location_name',
					id : 'location_id',
					width : 510,
					displayField : 'location_name',
					valueField : 'location_value',
					store : geoLocationStore,
					multiSelect : true,
					queryMode : 'local',
					labelAlign : 'right',
					editable : false,
					listeners : {
						select : function( field ) {

							Ext.Ajax.request( {
								params : {
									request_type : 'location_talker_names',
									geo_location_names : field.value.join( ',' ),
									org_id : $( '#orgId' ).val()
								},
								method : 'POST',
								url : 'reportviewer',
								success : function( response ) {

									var selectedValues = "";
									var teamsSelected = "";
									var jsonData = Ext.JSON.decode( response.responseText );

									var talkerStore = Ext.data.StoreManager.lookup( 'TalkerNames' );
									var teamStore = Ext.data.StoreManager.lookup( 'TeamNames' );

									teamStore.loadData( jsonData.teamData );
									talkerStore.loadData( jsonData.rowdata );

									selectedValues = "";
									talkerStore.each( function( rec ) {

										// if ( rec.get( 'talker_name' ) != "ALL" && rec.get( 'talker_name' ) != "NONE" && rec.get( 'talker_name' ) != "ALL ACTIVE USERS" && rec.get( 'talker_name' ) != "ALL INACTIVE USERS" ) {
										selectedValues += ( selectedValues == "" ) ? rec.get( 'talker_id' ) : "," + rec.get( 'talker_id' );
										// }
									} );

									teamStore.each( function( rec ) {

										teamsSelected += ( teamsSelected == "" ) ? rec.get( 'team_id' ) : "," + rec.get( 'team_id' );
									} );
									Ext.getCmp( 'reportParams' ).getForm().findField( "talker_ids" ).setValue( selectedValues.split( "," ) );
									Ext.getCmp( 'reportParams' ).getForm().findField( "team_ids" ).setValue( teamsSelected.split( "," ) );


								}
							} );
						}
					}
				}, ]

			} ]

		}, {
			xtype : 'fieldcontainer',
			layout : 'hbox',
			width : 1100,
			items : [ {
				xtype : 'combo',
				width : 510,
				displayField : 'name',
				valueField : 'value',
				fieldLabel : 'Report Type',
				name : 'report_type',
				id : 'report_type',
				queryMode : 'local',
				labelAlign : 'right',
				store : Ext.create( 'Ext.data.Store', {
					fields : [ 'value', 'name' ],
					data : [ {
						"value" : "TDEXR",
						"name" : "Team Dialer - Executive Report"
					}, {
						"value" : "TDDR",
						"name" : "Team Dialer - Dials Report"
					}, {
						"value" : "TDWSR",
						"name" : "Team Dialer - Weekly Summary Report"
					}, {
						"value" : "TDCDR",
						"name" : "Team Dialer - Talker Call Disposition Report"
					}, {
						"value" : "ITDCDR",
						"name" : "Team Dialer - Internal Call Disposition Report"
					}, {
						"value" : "DACDR",
						"name" : "Team Dialer - DA Call Disposition Report"
					}, {
						"value" : "TKDAR",
						"name" : "Team Dialer - Talker and DA Disposition Report"
					}, {
						"value" : "TDUSR",
						"name" : "Team Dialer - Usage Report"
					}, {
						"value" : "TDIDR",
						"name" : "Team Dialer - International Dialing Report"
					}, {
						"value" : "TDISR",
						"name" : "Team Dialer - International Summary Report"
					}, {
						"id" : "TDCR",
						"value" : "TDCR",
						"name" : "Team Dialer - Connects Report"
					}, {
						"value" : "PDEXR",
						"name" : "Personal Dialer - Executive Report"
					}, {
						"value" : "PDWSR",
						"name" : "Personal Dialer - Weekly Summary Report"
					}, {
						"value" : "PDCDR",
						"name" : "Personal Dialer - Call Disposition Report"
					}, {
						"value" : "PDIDR",
						"name" : "Personal Dialer - International Dialing Report"
					}, {
						"value" : "PDUSR",
						"name" : "Personal Dialer - Usage Report"
					}, {
						"value" : "PDISR",
						"name" : "Personal Dialer - International Summary Report"
					}, {
						"value" : "CDEXR",
						"name" : "Click Dialer - Executive Report"
					}, {
						"value" : "CDWSR",
						"name" : "Click Dialer - Weekly Summary Report"
					}, {
						"value" : "CDCDR",
						"name" : "Click Dialer - Call Disposition Report"
					}, {
						"value" : "CDIDR",
						"name" : "Click Dialer - International Dialing Report"
					}, {
						"value" : "CDUSR",
						"name" : "Click Dialer - Usage Report"
					}, {
						"value" : "CDISR",
						"name" : "Click Dialer - International Summary Report"
					}, {
						"value" : "RCDR",
						"name" : "Remote Coach - Detail Report"
					}, {
						"value" : "RCWSR",
						"name" : "Remote Coach - Weekly Summary Report"
					}, {
						"value" : "CRR",
						"name" : "ConnectLeader - Call Rating Report"
					}, {
						"value" : "CLCR",
						"name" : "ConnectLeader - Connects Report"
					}, {
						"value" : "EXER",
						"name" : "ConnectLeader - Executive Report"
					}, {
						"value" : "FPUSR",
						"name" : "ConnectLeader - Follow up Report"
					}, {
						"value" : "REFUSR",
						"name" : "ConnectLeader - Referral Report"
					}, {
						"value" : "UTR",
						"name" : "ConnectLeader - Usage Trend Report"
					}, {
						"value" : "DERSR",
						"name" : "ConnectLeader - Data Enrichment Summary Report"
					}, {
						"value" : "DERDR",
						"name" : "ConnectLeader - Data Enrichment Detail Report"
					}, {
						"value" : "TCR",
						"name" : "ConnectLeader - TruCadence Usage Report"
					}, {
						"value" : "IMEXR",
						"name" : "Custom - Team Dialer Executive Report"
					}, {
						"value" : "IMDSR",
						"name" : "Custom - Data Sheet Report"
					}, {
						"id" : "ILDR",
						"value" : "ILDR",
						"name" : "ConnectLeader - Inbound Leads Detailed  Report"
					}, {
						"id" : "ILSR",
						"value" : "ILSR",
						"name" : "ConnectLeader - Inbound Leads Summary Report"
					}, {
						"id" : "ILTSR",
						"value" : "ILTSR",
						"name" : "ConnectLeader - Inbound Leads Talker Summary Report"
					}, {
						"id" : "CIAR",
						"value" : "CIAR",
						"name" : "Call Issue Analysis Report"
					}, {
						"id" : "REPCPR",
						"value" : "REPCPR",
						"name" : "Sales Rep - Connects Performance"
					}, {
						"id" : "OUSR",
						"value" : "OUSR",
						"name" : "Overall Usage Report"
					}, {
						"id" : "COR",
						"value" : "COR",
						"name" : "Call Outcomes Report"
					}, {
						"id" : "DNCR",
						"value" : "DNCR",
						"name" : "ConnectLeader - DNC Report"
					}, {
						"id" : "UMUMR",
						"value" : "UMUMR",
						"name" : "ConnectLeader - User Monthly Usage Metrics Report"
					}, {
						"id" : "NLR",
						"value" : "NLR",
						"name" : "ConnectLeader - Network Latency Report"
					}, {
						"id" : "LPR",
						"value" : "LPR",
						"name" : "List Performance Report"
					} ]
				} ),
				editable : false,
				listeners : {
					select : function( field ) {

						var form = this.up( 'form' ).getForm();
						if ( field.value == "NLR" ) {
							form.findField( "start_time" ).show();
							form.findField( "end_time" ).show();
							form.findField( "start_time" ).setValue( '6:00 am' );
							form.findField( "end_time" ).setValue( '10:00 am' );
							form.findField( "date_range" ).disable();
							form.findField( "date_range" ).setValue( 'Custom' );
							form.findField( "start_date" ).setWidth( 200 );
							form.findField( "end_date" ).setWidth( 200 );
							form.findField( "start_date" ).enable();
							form.findField( "end_date" ).enable();
							form.findField( "start_date" ).setValue( new Date() );
							form.findField( "end_date" ).setValue( new Date() );
						} else {
							form.findField( "product_type" ).setValue( '' );
							form.findField( "start_time" ).hide();
							form.findField( "end_time" ).hide();
							form.findField( "start_time" ).setValue( '' );
							form.findField( "end_time" ).setValue( '' );
							form.findField( "date_range" ).enable();
							/*form.findField( "date_range" ).setValue( '' );
							form.findField( "start_date" ).setValue( '' );
							form.findField( "end_date" ).setValue( '' );*/
							form.findField( "start_date" ).setWidth( 255 );
							form.findField( "end_date" ).setWidth( 255 );
							form.findField( "list_names" ).setValue( '' );
						}
						customTDExecReportValidation = "";
						if ( field.value == "TDCDR" || field.value == "DACDR" || field.value == "PDCDR" || field.value == "CDCDR" || field.value == "TKDAR" || field.value == "ILDR" || field.value == "PDWSR" || field.value == "TDWSR" || field.value == "CDWSR" ) {
							if ( $( '#groupName' ).val() != '' ) {
								form.findField( "list_names" ).enable();
							} else {
								form.findField( "list_names" ).disable();
							}
							Ext.Ajax.request( {
								params : {
									request_type : 'call_dispositions',
									db_name : $( '#dbName' ).val(),
									org_id : $( '#orgId' ).val()
								},
								method : 'POST',
								url : 'reportviewer',
								success : function( response ) {

									var cdData = Ext.JSON.decode( response.responseText );
									var cdTkrStore = Ext.data.StoreManager.lookup( 'TalkerCallDispositions' );
									cdTalkerStore.loadData( cdData.talker.rowdata );
									var cdDaStore = Ext.data.StoreManager.lookup( 'DACallDispositions' );
									cdDaStore.loadData( cdData.da.rowdata );
									form.findField( "call_disposition" ).setValue( "" );

									if ( field.value == "ITDCDR" ) {
										form.findField( "call_disposition" ).bindStore( cdTkrStore );
									} else if ( field.value == "TKDAR" ) {
										var data = [], i = 0;

										cdTkrStore.each( function( item, index ) {

											if ( item ) {

												if ( item.data.product_type == 'TD' || item.data.call_disposition == 'ALL' || item.data.call_disposition == 'NONE' ) {
													data[ i ] = item;
													i = i + 1;
												}
											}
										} );

										cdDaStore.each( function( item, index ) {

											if ( item.data.product_type == 'TD' ) {
												data[ i ] = item;
												i = i + 1;
											}

										} );


										cdTkrStore.removeAll();
										cdTkrStore.loadRawData( data );

										form.findField( "call_disposition" ).bindStore( cdTalkerStore );
									} else if ( field.value == "TDCDR" ) {

										var data = [], i = 0;

										cdTkrStore.each( function( item, index ) {

											if ( item ) {

												if ( item.data.product_type == 'TD' || item.data.call_disposition == 'ALL' || item.data.call_disposition == 'NONE' ) {
													data[ i ] = item;
													i = i + 1;

												}
											}
										} );
										cdTkrStore.removeAll();
										cdTkrStore.loadRawData( data );

										form.findField( "call_disposition" ).bindStore( cdTalkerStore );

									} else if ( field.value == "CDCDR" ) {
										var data = [], i = 0;

										cdTkrStore.each( function( item, index ) {

											if ( item ) {

												if ( item.data.product_type == 'CD' || item.data.call_disposition == 'ALL' || item.data.call_disposition == 'NONE' ) {
													data[ i ] = item;
													i = i + 1;

												}
											}
										} );

										cdTkrStore.removeAll();
										cdTkrStore.loadRawData( data );

										form.findField( "call_disposition" ).bindStore( cdTalkerStore );
									} else if ( field.value == "PDCDR" ) {

										var data = [], i = 0;


										cdTkrStore.each( function( item, index ) {

											if ( item ) {
												if ( item.data.product_type == 'PD' || item.data.call_disposition == 'ALL' || item.data.call_disposition == 'NONE' ) {
													data[ i ] = item;
													i = i + 1;
												}

											}
										} );
										cdTkrStore.removeAll();
										cdTkrStore.loadRawData( data );

										form.findField( "call_disposition" ).bindStore( cdTalkerStore );

									} else if ( field.value == "DACDR" ) {
										form.findField( "call_disposition" ).bindStore( cdDaStore );
									}
									// validation for Custom Team Dialer Executive Report - start
									else if ( field.value == "IMEXR" ) {
										checkCallDisposition( cdTkrStore );
									}
									// validation for Custom Team Dialer Executive Report - end
									form.findField( "call_disposition" ).enable();
									form.findField( "list_names" ).enable();
									if ( field.value == "ILDR" ) {

										var data = [], i = 0;


										cdTkrStore.each( function( item, index ) {

											if ( item ) {
												if ( item.data.product_type == 'PD' || item.data.call_disposition == 'ALL' || item.data.call_disposition == 'NONE' ) {
													data[ i ] = item;
													i = i + 1;
												}

											}
										} );
										cdTkrStore.removeAll();
										cdTkrStore.loadRawData( data );
										// form.findField( "list_names" ).disable();
										form.findField( "call_disposition" ).bindStore( cdTalkerStore );

									}
								}
							} );

						} else if ( field.value == "ILSR" || field.value == "ILTSR" ) {

							form.findField( "call_disposition" ).disable();
							form.findField( "list_names" ).disable();

						} else if ( $( '#reportType' ).val() == "COR" ) {
							Ext.getCmp( "gridPanel1" ).show();
							Ext.getCmp( "gridPanel" ).setHeight( 35 );
							Ext.getCmp( "gridPanel1" ).setHeight( 210 );
							// Ext.getCmp( "gridPanel" ).addCls( "grid1Height" );
							Ext.getCmp( "gridPanel" ).setTitle( 'Conversation Results' );
							Ext.getCmp( "chartPanel" ).setHeight( 0 );
							Ext.getCmp( 'pieButton' ).hide();
							Ext.getCmp( 'barButton' ).hide();
							Ext.getCmp( 'lineButton' ).hide();
							$( '#chartPanel-bodyWrap' ).hide();

						} else {

							form.findField( "call_disposition" ).disable();
							form.findField( "list_names" ).disable();
							form.findField( "list_names" ).setValue( '' );
							form.findField( "call_disposition" ).setValue( '' );
							form.findField( "product_type" ).disable();

						}

						if ( field.value == "REPCPR" || field.value == "OUSR" || field.value == "LPR" || field.value == "UMUMR" ) {

							form.findField( "product_type" ).enable();
							form.findField( "call_disposition" ).disable();
							if ( field.value == "LPR" )
								form.findField( "list_names" ).enable();
							else
								form.findField( "list_names" ).disable();

						} else {
							form.findField( "product_type" ).disable();
							form.findField( "product_type" ).setValue( '' );
						}

						if ( field.value != "COR" )
							Ext.getCmp( "gridPanel1" ).hide()

					}
				}
			}, {
				xtype : 'combo',
				fieldLabel : 'Product Type',
				name : 'product_type',
				width : 510,
				displayField : 'product_name',
				valueField : 'product_value',
				store : Ext.create( 'Ext.data.Store', {
					fields : [ 'product_name', 'product_value' ],
					data : [ {
						"product_name" : "ALL",
						"product_value" : "ALL"
					}, {
						"product_name" : "Team Dialer",
						"product_value" : "TD"
					}, {
						"product_name" : "Personal Dialer",
						"product_value" : "PD"
					}, {
						"product_name" : "Click Dialer",
						"product_value" : "CD"
					} ]
				} ),
				multiSelect : true,
				queryMode : 'local',
				labelAlign : 'right',
				editable : false,
				listeners : {
					select : function( field ) {

						if ( field.value == "ALL" || field.value.indexOf( "ALL" ) != -1 ) {
							var comboStore = field.getStore();
							var selectedValues = "";
							comboStore.each( function( rec ) {

								if ( rec.get( 'product_value' ) != "ALL" ) {
									selectedValues += ( selectedValues == "" ) ? Ext.String.htmlDecode( rec.get( 'product_value' ) ) : "_DEL_" + Ext.String.htmlDecode( rec.get( 'product_value' ) );
									$( '#reportParamProductType' ).val( selectedValues ); // nivetha
								}
							} );
							field.setValue( selectedValues.split( "_DEL_" ) );
						}
						if ( field.value != "ALL" ) {
							var comboStore1 = field.getStore();
							var selectedValues1 = "";
							for ( var i = 0; i < field.value.length; i++ ) {
								comboStore1.each( function( rec ) {

									if ( rec.get( 'product_value' ) == field.value[ i ] ) {
										selectedValues1 += ( selectedValues1 == "" ) ? Ext.String.htmlDecode( rec.get( 'product_value' ) ) : "_DEL_" + Ext.String.htmlDecode( rec.get( 'product_value' ) );
										$( '#reportParamProductType' ).val( selectedValues1 );
										return false;
									}
								} );
							}
							if ( selectedValues1 == "" ) {
								$( '#reportParamProductType' ).val( '' );
							}
							field.setValue( selectedValues1.split( "_DEL_" ) );
						}
					}
				}
			} ]
		}, {
			xtype : 'fieldcontainer',
			defaultType : 'combo',
			layout : 'hbox',
			width : 1100,
			items : [ {
				xtype : 'combo',
				fieldLabel : 'Date Range',
				name : 'date_range',
				displayField : 'name',
				valueField : 'value',
				width : 510,
				store : talkerNamesStore,
				queryMode : 'local',
				labelAlign : 'right',
				store : Ext.create( 'Ext.data.Store', {
					fields : [ 'value', 'name' ],
					data : [ {
						"value" : "Today",
						"name" : "Today"
					}, {
						"value" : "Yesterday",
						"name" : "Yesterday"
					}, {
						"value" : "Current Week",
						"name" : "Current Week"
					}, {
						"value" : "Last Week",
						"name" : "Last Week"
					}, {
						"value" : "Current Month",
						"name" : "Current Month"
					}, {
						"value" : "Last Month",
						"name" : "Last Month"
					}, {
						"value" : "Current Quarter",
						"name" : "Current Quarter"
					}, {
						"value" : "Last Quarter",
						"name" : "Last Quarter"
					}, {
						"value" : "Custom",
						"name" : "Custom"
					} ]
				} ),
				editable : false,
				listeners : {
					select : function( field ) {

						var form = this.up( 'form' ).getForm();
						if ( field.value != "Custom" ) {
							var getDates = Ext.Ajax.request( {
								params : {
									request_type : 'getdates',
									db_name : $( '#dbName' ).val(),
									org_id : $( '#orgId' ).val(),
									logical_type : field.value
								},
								method : 'POST',
								url : 'reportviewer',
								success : function( response ) {

									var jsonResponse = Ext.decode( response.responseText );
									if ( jsonResponse.status == "SUCCESS" ) {
										form.findField( "start_date" ).setValue( jsonResponse.start_date );
										form.findField( "end_date" ).setValue( jsonResponse.end_date );
										form.findField( "start_date" ).disable();
										form.findField( "end_date" ).disable();
									}
								}
							} );
						} else {
							form.findField( "start_date" ).enable();
							form.findField( "end_date" ).enable();
						}
					}
				}
			}, {
				xtype : 'fieldcontainer',
				defaultType : 'textfield',
				layout : 'hbox',
				width : 1020,
				items : [ {
					xtype : 'datefield',
					fieldLabel : 'Start Date',
					name : 'start_date',
					cls : 'startdate',
					value : 'readonly',
					emptyText : 'mm/dd/yyyy',
					format : 'm/d/Y',
					width : 255,
					labelAlign : 'right'
				}, {
					xtype : 'timefield',
					id : 'myReports_startTime',
					fieldLabel : '',
					cls : 'starttime',
					name : 'start_time',
					minValue : '12:00 am',
					maxValue : '11:30 pm',
					increment : 30,
					width : 100,
					labelAlign : 'right',
					hidden : true,
					format : "g:i a"
				}, {
					xtype : 'datefield',
					fieldLabel : 'End Date',
					width : 255,
					cls : 'startdate',
					name : 'end_date',
					format : 'm/d/Y',
					emptyText : 'mm/dd/yyyy',
					labelAlign : 'right'
				}, {
					xtype : 'timefield',
					id : 'myReports_endTime',
					fieldLabel : '',
					width : 100,
					cls : 'starttime',
					name : 'end_time',
					minValue : '12:00 am',
					maxValue : '11:30 pm',
					increment : 30,
					labelAlign : 'right',
					hidden : true,
					format : "g:i a"
				} ]
			} ]
		}, {
			xtype : 'fieldcontainer',
			layout : 'hbox',
			width : 1100,
			items : [ {
				xtype : 'combo',
				fieldLabel : 'Call Disposition',
				name : 'call_disposition',
				width : 510,
				displayField : 'call_disposition',
				valueField : 'call_disposition',
				store : cdTalkerStore,
				multiSelect : true,
				queryMode : 'local',
				labelAlign : 'right',
				editable : false,
				listeners : {
					select : function( field ) {

						if ( field.value == "ALL" || field.value.indexOf( "ALL" ) != -1 ) {
							var comboStore = field.getStore();
							var selectedValues = "";
							comboStore.each( function( rec ) {

								if ( rec.get( 'call_disposition' ) != "ALL" && rec.get( 'call_disposition' ) != "NONE" ) {
									selectedValues += ( selectedValues == "" ) ? Ext.String.htmlDecode( rec.get( 'call_disposition' ) ) : "_DEL_" + Ext.String.htmlDecode( rec.get( 'call_disposition' ) );
									$( '#calldisposition' ).val( selectedValues );

								}
							} );
							field.setValue( selectedValues.split( "_DEL_" ) );
						} else if ( field.value == "NONE" || field.value.indexOf( "NONE" ) != -1 ) {
							var comboStore = field.getStore();
							comboStore.each( function( rec ) {

								if ( rec.get( 'list_name' ) != "NONE" ) {
									rec.set( '' );
								}
							} );
							field.setValue( '' );
							$( '#calldisposition' ).val( '' );
						}
						var comboStore1 = field.getStore();
						var selectedValues1 = "";
						for ( var i = 0; i < field.value.length; i++ ) {
							comboStore1.each( function( rec ) {

								if ( rec.get( 'call_disposition' ) == field.value[ i ] ) {
									selectedValues1 += ( selectedValues1 == "" ) ? Ext.String.htmlDecode( rec.get( 'call_disposition' ) ) : "_DEL_" + Ext.String.htmlDecode( rec.get( 'call_disposition' ) ); // Nivetha. Used Ext.String.htmlDecode to escape html characters from conversion
									$( '#calldisposition' ).val( selectedValues1 );
									return false;
								}
							} );
						}
						if ( selectedValues1 == "" ) {
							$( '#calldisposition' ).val( '' );
						}

						field.setValue( selectedValues1.split( "_DEL_" ) );
					}
				}
			}, {
				xtype : 'combo',
				fieldLabel : 'List Name',
				name : 'list_names',
				width : 510,
				displayField : 'list_name',
				valueField : 'list_name',
				store : listNamesStore,
				multiSelect : true,
				queryMode : 'local',
				labelAlign : 'right',
				editable : false,
				getDisplayValue : function() {

					return Ext.String.htmlDecode( this.value );
				},
				listeners : {

					select : function( field ) {

						if ( field.value == "ALL" || field.value.indexOf( "ALL" ) != -1 ) {
							var comboStore = field.getStore();
							var selectedValues = "";
							var encodedValues = "";
							comboStore.each( function( rec ) {

								if ( rec.get( 'list_name' ) != "ALL" && rec.get( 'list_name' ) != "NONE" ) {
									selectedValues += ( selectedValues == "" ) ? Ext.String.htmlDecode( rec.get( 'list_name' ) ) : "_DEL_" + Ext.String.htmlDecode( rec.get( 'list_name' ) );
									encodedValues += ( encodedValues == "" ) ? rec.get( 'list_name' ) : "_DEL_" + rec.get( 'list_name' );
									$( '#listnames' ).val( selectedValues );
								}
							} );
							field.setValue( encodedValues.split( "_DEL_" ) );
						} else if ( field.value == "NONE" || field.value.indexOf( "NONE" ) != -1 ) {
							var comboStore = field.getStore();
							comboStore.each( function( rec ) {

								if ( rec.get( 'list_name' ) != "NONE" ) {
									rec.set( '' );
								}
							} );
							field.setValue( '' );
						}
					}
				}
			} ]
		}, {
			xtype : 'fieldcontainer',
			layout : 'hbox',
			width : 1100,
			items : [ {
				xtype : 'button',
				margin : '0 0 0 550',
				text : 'Run Report',
				cls : 'x-button',
				name : 'run_report',
				handler : function() {

					var form = this.up( 'form' ).getForm();

					mTitle = [];

					if ( form.findField( "report_type" ).getValue() == "NLR" ) {

						if ( form.findField( "talker_ids" ).getValue().length > 5 ) {
							Ext.Msg.alert( 'Error', 'You cannot select more than 5 users' );
							return;
						} else if ( ( ( Date.parse( form.findField( "end_date" ).lastValue ) - Date.parse( form.findField( "start_date" ).lastValue ) ) > 0 ) && form.findField( "report_type" ).getValue() == "NLR" ) {
							Ext.Msg.alert( 'Error', 'You cannot select more than 4 hours' );
							return;
						} else if ( ( ( ( form.findField( "end_time" ).getRawValue().replace( " am", "" ).replace( " pm", "" ).replace( ":", "." ) ) - ( form.findField( "start_time" ).getRawValue().replace( "am", "" ).replace( "pm", "" ).replace( ":", "." ) ) ) > 4 ) && form.findField( "report_type" ).getValue() == "NLR" ) {
							Ext.Msg.alert( 'Error', 'You cannot select more than 4 hours' );
							return;
						}
					}


					if ( form.findField( "client_name" ).getValue() == '' || form.findField( "client_name" ).getValue() == null ) {
						Ext.Msg.alert( 'Error', 'Please select the Client Name' );
						return;
					}
					// validation for Custom Team Dialer Executive Report - start
					else if ( form.findField( "client_name" ).getValue() != '' && form.findField( "report_type" ).getValue() == 'IMEXR' && customTDExecReportValidation != '' ) {
						Ext.Msg.alert( 'Error', customTDExecReportValidation );
						return;
					}
					// validation for Custom Team Dialer Executive Report - end
					var isValidClient = false;

					$.each( reportArray, function( index, value ) {

						if ( ( $.trim( form.findField( "client_name" ).getValue() ) == value ) ) {
							isValidClient = true;
							return false;
						}

					} );

					if ( isValidClient == false ) {
						Ext.Msg.alert( 'Error', 'Please select the valid Client Name' );
						return;
					} else if ( form.findField( "report_type" ).getValue() == null || form.findField( "report_type" ).getValue() == "" || form.findField( "report_type" ).getValue() == undefined ) {
						Ext.Msg.alert( 'Error', 'Please select the Report Type' );
						Ext.getCmp( "gridPanel" ).setHeight( 355 );
						Ext.getCmp( "chartPanel" ).setHeight( 400 );
						Ext.getCmp( 'pieButton' ).enable();
						Ext.getCmp( 'barButton' ).enable();
						return;
					} else if ( form.findField( "talker_ids" ).getValue() == "" && form.findField( "report_type" ).getValue() != "ILSR" ) {
						Ext.Msg.alert( 'Error', 'Please select the Users' );
						Ext.getCmp( "gridPanel" ).setHeight( 355 );
						Ext.getCmp( "chartPanel" ).setHeight( 400 );
						Ext.getCmp( 'pieButton' ).enable();
						Ext.getCmp( 'barButton' ).enable();
						return;
					} else if ( form.findField( "date_range" ).getRawValue() == "" ) {
						Ext.Msg.alert( 'Error', 'Please select the date range' );
						Ext.getCmp( "gridPanel" ).setHeight( 355 );
						Ext.getCmp( "chartPanel" ).setHeight( 400 );
						Ext.getCmp( 'pieButton' ).enable();
						Ext.getCmp( 'barButton' ).enable();
						return;
					} else if ( Date.parse( form.findField( "start_date" ).lastValue ) > Date.parse( form.findField( "end_date" ).lastValue ) ) {
						Ext.Msg.alert( 'Error', 'End date should be greater than Start date' );
						Ext.getCmp( "gridPanel" ).setHeight( 355 );
						Ext.getCmp( "chartPanel" ).setHeight( 400 );
						Ext.getCmp( 'pieButton' ).enable();
						Ext.getCmp( 'barButton' ).enable();
						return;
					} else if ( form.findField( "date_range" ).getRawValue() == "Custom" && ( Date.parse( Ext.getCmp( 'reportParams' ).getForm().findField( "end_date" ).lastValue ) - Date.parse( Ext.getCmp( 'reportParams' ).getForm().findField( "start_date" ).lastValue ) > ( dateRangeMilliseconds[ clientDateRangeMap[ 'date_range_limit_' + $( '#orgId' ).val() ] + '' ] ) ) ) {
						Ext.Msg.alert( 'Error', 'You have selected a timeframe greater than ' + clientDateRangeMap[ 'date_range_limit_' + $( '#orgId' ).val() ] + ' months. Please choose a lesser date range to continue.' );
						Ext.getCmp( "gridPanel" ).setHeight( 355 );
						Ext.getCmp( "chartPanel" ).setHeight( 400 );
						Ext.getCmp( 'pieButton' ).enable();
						Ext.getCmp( 'barButton' ).enable();
						return;
					}


					Ext.getCmp( 'pieButton' ).show();
					Ext.getCmp( 'barButton' ).show();
					Ext.getCmp( 'lineButton' ).show();
					Ext.getCmp( "chartPanel" ).setWidth( 1115 );
					Ext.getCmp( "chartPanel" ).setHeight( 400 );

					// $( '#chartPanel-body' ).css( 'background-image', "url('images/ajaxload1.gif')" );

					if ( form.findField( "report_type" ).getValue() == "UTR" ) { // If your user selects report type Usage Trend Report this statements will be executed.
						$( '#reportType' ).val( form.findField( "report_type" ).getValue() );
						$( '#startdate' ).val( form.findField( "start_date" ).getRawValue() );
						$( '#enddate' ).val( form.findField( "end_date" ).getRawValue() );
						$( '#talkerIds' ).val( form.findField( "talker_ids" ).getValue() );
						$( '#listnames' ).val( form.findField( "list_names" ).getValue() );
						$( '#dateRange' ).val( form.findField( "date_range" ).getValue() );
						$( '#dbName' ).val( form.findField( "client_name" ).getValue() );
						$( '#orgId' ).val( form.findField( "client_name" ).getValue() );
						$( '#chartType' ).val( 'lineChartUTR' );
						Ext.getCmp( "gridPanel" ).setHeight( 0 );
						$( '#gridPanel-bodyWrap' ).hide();
						Ext.getCmp( "chartPanel" ).setHeight( 755 );

						Ext.getCmp( "chartPanel" ).setTitle( "Usage Trend Report" );
						Ext.getCmp( 'chartPanel' ).remove( Ext.getCmp( 'chartPanel' ).items.getAt( 0 ), false );
						Ext.getCmp( 'chartPanel' ).add( Ext.getCmp( "lineChartUTR" ) );

						Ext.getCmp( 'pieButton' ).disable();
						Ext.getCmp( 'barButton' ).disable();
						updateChartData();
					} else if ( form.findField( "report_type" ).getValue() == "NLR" ) {
						Ext.getBody().mask( "Please wait..." );
						// Ext.getCmp( 'chartPanel' ).mask( "Please wait..." );
						// If your user selects report type Usage Trend Report this statements will be executed.
						$( '#reportType' ).val( form.findField( "report_type" ).getValue() );
						$( '#startdate' ).val( form.findField( "start_date" ).getRawValue() );
						$( '#enddate' ).val( form.findField( "end_date" ).getRawValue() );
						$( '#talkerIds' ).val( form.findField( "talker_ids" ).getValue() );
						// $( '#listnames' ).val( form.findField( "list_names" ).getValue() ); // nivetha
						$( '#dateRange' ).val( form.findField( "date_range" ).getValue() );
						$( '#chartType' ).val( 'lineChartNLR' );
						Ext.getCmp( "gridPanel" ).setHeight( 0 );// Hiding the grid area.
						// Ext.getCmp( "gridPanel" ).setDisabled( true );// Hiding the grid area.
						$( '#gridPanel-bodyWrap' ).hide();

						Ext.getCmp( "clReportPannel" ).setTitle( "Network Latency Report -" );
						Ext.getCmp( "chartPanel" ).setTitle( "" );// For setting the title in the chart window
						Ext.getCmp( 'chartPanel' ).remove( Ext.getCmp( 'chartPanel' ).items.getAt( 0 ), false );// For displaying only line chart bar chart and pie chart is been removed in the display.
						Ext.getCmp( 'chartPanel' ).add( Ext.getCmp( "lineChartNLR" ) );

						Ext.getCmp( 'pieButton' ).hide();
						Ext.getCmp( 'barButton' ).hide();
						Ext.getCmp( 'lineButton' ).hide();
						updateChartData();

					} else if ( form.findField( "report_type" ).getValue() == "RCDR" || form.findField( "report_type" ).getValue() == "RCWSR" || form.findField( "report_type" ).getValue() == 'REPCPR' ) {
						Ext.getCmp( "chartPanel" ).setHeight( 0 );// Hiding the grid area.
						Ext.getCmp( "gridPanel" ).setHeight( 755 );// Elaborating the chart area.
						$( '#reportType' ).val( form.findField( "report_type" ).getValue() );
						$( '#startdate' ).val( form.findField( "start_date" ).getRawValue() );
						$( '#enddate' ).val( form.findField( "end_date" ).getRawValue() );
						$( '#talkerIds' ).val( form.findField( "talker_ids" ).getValue() );
						$( '#listnames' ).val( form.findField( "list_names" ).getValue() ); // benjamin
						$( '#dateRange' ).val( form.findField( "date_range" ).getValue() );
						$( '#calldisposition' ).val( form.findField( "call_disposition" ).getValue() ); // benjamin
						Ext.getCmp( "clReportPannel" ).setTitle( form.findField( "report_type" ).getRawValue() );
						updateStoreData();
					} else if ( form.findField( "report_type" ).getValue() == "DERDR" || form.findField( "report_type" ).getValue() == "DERSR" ) {

						$( '#reportType' ).val( form.findField( "report_type" ).getValue() );
						$( '#startdate' ).val( form.findField( "start_date" ).getRawValue() );
						$( '#enddate' ).val( form.findField( "end_date" ).getRawValue() );
						$( '#talkerIds' ).val( form.findField( "talker_ids" ).getValue() );
						$( '#listnames' ).val( form.findField( "list_names" ).getValue() );
						$( '#dateRange' ).val( form.findField( "date_range" ).getValue() );
						$( '#calldisposition' ).val( form.findField( "call_disposition" ).getValue() );
						$( '#dbName' ).val( form.findField( "client_name" ).getValue() );
						$( '#orgId' ).val( form.findField( "client_name" ).getValue() );
						updateStoreData();
					} else if ( form.findField( "report_type" ).getValue() == "CDUSR" || form.findField( "report_type" ).getValue() == "PDUSR" || form.findField( "report_type" ).getValue() == "TDUSR" || form.findField( "report_type" ).getValue() == "TDDR" ) {

						$( '#reportType' ).val( form.findField( "report_type" ).getValue() );
						$( '#startdate' ).val( form.findField( "start_date" ).getRawValue() );
						$( '#enddate' ).val( form.findField( "end_date" ).getRawValue() );
						$( '#talkerIds' ).val( form.findField( "talker_ids" ).getValue() );
						$( '#listnames' ).val( form.findField( "list_names" ).getValue() );
						$( '#dateRange' ).val( form.findField( "date_range" ).getValue() );
						$( '#calldisposition' ).val( form.findField( "call_disposition" ).getValue() );
						$( '#dbName' ).val( form.findField( "client_name" ).getValue() );
						$( '#orgId' ).val( form.findField( "client_name" ).getValue() );
						Ext.getCmp( "clReportPannel" ).setTitle( form.findField( "report_type" ).getRawValue() );
						Ext.getCmp( "gridPanel" ).setHeight( 755 );
						updateStoreData();
					} else if ( form.findField( "report_type" ).getValue() == "OUSR" || form.findField( "report_type" ).getValue() == "REPCPR" || form.findField( "report_type" ).getValue() == 'TDIDR' || form.findField( "report_type" ).getValue() == 'PDIDR' || form.findField( "report_type" ).getValue() == 'CDIDR' || form.findField( "report_type" ).getValue() == 'IMEXR' ) {

						$( '#reportType' ).val( form.findField( "report_type" ).getValue() );
						$( '#startdate' ).val( form.findField( "start_date" ).getRawValue() );
						$( '#enddate' ).val( form.findField( "end_date" ).getRawValue() );
						$( '#talkerIds' ).val( form.findField( "talker_ids" ).getValue() );
						$( '#dateRange' ).val( form.findField( "date_range" ).getValue() );
						$( '#product_type' ).val( form.findField( "product_type" ).getValue() );
						$( '#dbName' ).val( form.findField( "client_name" ).getValue() );
						$( '#orgId' ).val( form.findField( "client_name" ).getValue() );
						Ext.getCmp( "clReportPannel" ).setTitle( form.findField( "report_type" ).getRawValue() );
						updateStoreData();
						Ext.getCmp( "chartPanel" ).setHeight( 0 );
						Ext.getCmp( "gridPanel" ).setHeight( 355 );


					} else if ( form.findField( "report_type" ).getValue() == "COR" ) {

						$( '#reportType' ).val( form.findField( "report_type" ).getValue() );
						$( '#startdate' ).val( form.findField( "start_date" ).getRawValue() );
						$( '#enddate' ).val( form.findField( "end_date" ).getRawValue() );
						$( '#talkerIds' ).val( form.findField( "talker_ids" ).getValue() );
						$( '#dateRange' ).val( form.findField( "date_range" ).getValue() );
						Ext.getCmp( "clReportPannel" ).setTitle( form.findField( "report_type" ).getRawValue() );
						Ext.getCmp( "gridPanel" ).setTitle( 'Conversation Results' );

						updateStoreData();
						Ext.getCmp( "chartPanel" ).setHeight( 0 );
						Ext.getCmp( "gridPanel" ).setHeight( 355 );
						Ext.getCmp( "gridPanel1" ).show();
					} else {
						$( '#reportType' ).val( form.findField( "report_type" ).getValue() );
						$( '#startdate' ).val( form.findField( "start_date" ).getRawValue() );
						$( '#enddate' ).val( form.findField( "end_date" ).getRawValue() );
						$( '#talkerIds' ).val( form.findField( "talker_ids" ).getValue() );
						$( '#listnames' ).val( form.findField( "list_names" ).getValue() );
						$( '#dateRange' ).val( form.findField( "date_range" ).getValue() );
						$( '#dbName' ).val( form.findField( "client_name" ).getValue() );
						$( '#orgId' ).val( form.findField( "client_name" ).getValue() );

						$( '#chartType' ).val( 'pieChart' );
						Ext.getCmp( "clReportPannel" ).setTitle( form.findField( "report_type" ).getRawValue() );
						Ext.getCmp( "gridPanel" ).setHeight( 355 );
						Ext.getCmp( "chartPanel" ).setHeight( 400 );
						Ext.getCmp( 'pieButton' ).enable();
						Ext.getCmp( 'barButton' ).enable();
						Ext.getCmp( 'chartPanel' ).remove( Ext.getCmp( 'chartPanel' ).items.getAt( 0 ), false );
						if ( !$( '#reportType' ).val() == "ILDR" && !$( '#reportType' ).val() == "ILTSR" && $( '#reportType' ).val() == "ILSR" ) {
							Ext.getCmp( 'chartPanel' ).add( Ext.getCmp( "pieChart" ) );
						}
						if ( $( '#reportType' ).val() == "ILDR" || $( '#reportType' ).val() == "ILTSR" ) {
							$( '#chartType' ).val( 'barChart' );
						} else if ( $( '#reportType' ).val() == "ILSR" ) {
							$( '#chartType' ).val( 'stackBarChart' );
						}


						updateStoreData();
					}

				}
			}, {
				xtype : 'button',
				cls : 'x-button',
				margin : '0 0 0 10',
				text : 'Reset',
				name : 'reset',
				handler : function() {

					this.up( 'form' ).getForm().reset();
					if ( Ext.getCmp( 'reportParams' ).getForm().findField( "talker_ids" ).getStore().getCount() <= 3 ) {
						Ext.getCmp( 'reportParams' ).getForm().findField( "talker_ids" ).setValue( $( '#talkerIds' ).val().split( "," ) );
						Ext.getCmp( "gridPanel" ).setHeight( 355 );
						Ext.getCmp( "chartPanel" ).setHeight( 400 );
						Ext.getCmp( 'pieButton' ).enable();
						Ext.getCmp( 'barButton' ).enable();
					}

				}
			} ]
		} ]
	} );

	function resetFields() {

		Ext.getCmp( 'reportParams' ).getForm().findField( "talker_ids" ).reset();
		Ext.getCmp( 'reportParams' ).getForm().findField( "list_names" ).reset();
		Ext.getCmp( 'reportParams' ).getForm().findField( "team_ids" ).reset();
		Ext.getCmp( 'reportParams' ).getForm().findField( "report_type" ).reset();
		customTDExecReportValidation = "";
	}

	function updateStoreData() {

		var gridPanelStore = Ext.getCmp( "gridPanel" ).getStore();
		gridPanelStore.proxy.extraParams = {
			request_type : $( '#reportType' ).val(),
			start_date : $( '#startdate' ).val(),
			end_date : $( '#enddate' ).val(),
			talker_ids : $( '#talkerIds' ).val(),
			list_names : $( '#listnames' ).val(),
			logical_type : $( '#dateRange' ).val(),
			call_disposition : $( '#calldisposition' ).val(),
			product_type : $( '#reportParamProductType' ).val(),
			ViewTypeOfConnectsPerformanceReportData : $( "#viewTypeOfConnectsPerformanceReport" ).val(),
			db_name : $( '#dbName' ).val(),
			org_id : $( '#orgId' ).val()
		};
		gridPanelStore.reload();

		if ( $( '#reportType' ).val() == "COR" ) {

			var gridPanelStore1 = Ext.getCmp( "gridPanel1" ).getStore();
			gridPanelStore1.proxy.extraParams = {
				request_type : $( '#reportType' ).val(),
				start_date : $( '#startdate' ).val(),
				end_date : $( '#enddate' ).val(),
				talker_ids : $( '#talkerIds' ).val(),
				list_names : $( '#listnames' ).val(),
				logical_type : $( '#dateRange' ).val(),
				call_disposition : $( '#calldisposition' ).val(),
				product_type : $( '#reportParamProductType' ).val(),
				ViewTypeOfConnectsPerformanceReportData : $( "#viewTypeOfConnectsPerformanceReport" ).val(),
				db_name : $( '#dbName' ).val(),
				org_id : $( '#orgId' ).val()
			};
			gridPanelStore1.reload();

		}

		gridPanelStore.on( 'load', function() {

			if ( gridPanelStore.getCount() > 0 ) {
				var grid = Ext.getCmp( 'gridPanel' );
				grid.getSelectionModel().select( 0 );
				grid.fireEvent( 'rowclick', grid, 0 );
				var callDisposition = false
				if ( $( '#reportType' ).val() == "TDCDR" || $( '#reportType' ).val() == "ITDCDR" || $( '#reportType' ).val() == "PDCDR" || $( '#reportType' ).val() == "CDCDR" || $( '#reportType' ).val() == "DACDR" || $( '#reportType' ).val() == "CTCCDR" || $( '#reportType' ).val() == "ILDR" || $( '#reportType' ).val() == "TKDAR" ) {
					var cdArray = new Array();
					gridPanelStore.each( function( r ) {

						if ( cdArray.contains( r.get( 'call_disposition_edit' ) ) || cdArray.contains( r.get( 'call_disposition' ) ) ) {
							if ( callDisposition )
								cdArray[ r.get( 'call_disposition' ) ] = ( parseInt( cdArray[ r.get( 'call_disposition' ) ], 10 ) + 1 );
							else
								cdArray[ r.get( 'call_disposition_edit' ) ] = ( parseInt( cdArray[ r.get( 'call_disposition_edit' ) ], 10 ) + 1 );
						} else {
							if ( $.trim( r.get( 'call_disposition' ) ) != '' ) {
								cdArray[ r.get( 'call_disposition' ) ] = 1;
								callDisposition = true;
							} else {
								cdArray[ r.get( 'call_disposition_edit' ) ] = 1;
							}
						}
					} );
					var json = [];
					for ( cd in cdArray ) {
						if ( cd.indexOf( "contains" ) == -1 ) {
							json.push( {
								'Name' : Ext.String.htmlDecode( ( cd == "" ? 'Unkown' : cd ) ),
								'Data' : Ext.String.htmlDecode( parseInt( cdArray[ cd ], 10 ) )
							} );
						}
					}

					chartStore.loadData( json );
					chartPanel.setTitle( 'Call Disposition Summary' );


				} else if ( $( '#reportType' ).val() == "ILSR" ) {
					var json = [];
					gridPanelStore.each( function( r ) {

						json.push( {
							'Name' : r.get( 'date' ),
							'Leads Created' : parseInt( r.get( 'total_leads_created' ) ),
							'Leads Processed' : parseInt( r.get( 'total_leads_processed' ) )
						} );
					} );

					stackChartStore.loadData( json );
					chartPanel.setTitle( 'Inbound Leads Summary' );


				} else if ( $( '#reportType' ).val() == "ILTSR" ) {
					var talkerArray = new Array();
					gridPanelStore.each( function( r ) {

						if ( talkerArray.contains( r.get( 'talker' ) ) ) {

							talkerArray[ r.get( 'talker' ) ] = ( parseInt( talkerArray[ r.get( 'talker' ) ], 10 ) + parseInt( r.get( 'total_leads_processed' ) ) );
						} else {
							talkerArray[ r.get( 'talker' ) ] = parseInt( r.get( 'total_leads_processed' ) );
						}
					} );
					var json = [];
					for ( talker in talkerArray ) {
						if ( talker.indexOf( "contains" ) == -1 ) {
							json.push( {
								'Name' : ( talker == "" ? 'Unkown' : talker ),
								'Data' : parseInt( talkerArray[ talker ], 10 )
							} );
						}
					}
					chartStore.loadData( json );
					chartPanel.setTitle( 'Inbound Leads Talker Summary' );


				} else if ( $( '#reportType' ).val() == "CIAR" ) {

					var cdArray = new Array();
					gridPanelStore.each( function( r ) {

						cdArray[ r.get( 'problem_value' ) ] = parseInt( r.get( 'problem_count' ), 10 );
					} );
					var json = [];
					for ( cd in cdArray ) {
						if ( cd.indexOf( "contains" ) == -1 ) {
							json.push( {
								'Name' : Ext.String.htmlDecode( ( cd == "" ? 'Unkown' : cd ) ),
								'Data' : Ext.String.htmlDecode( parseInt( cdArray[ cd ], 10 ) )
							} );
						}
					}
					chartStore.loadData( json );
					chartPanel.setTitle( 'Call Issue Analysis' );
					/*
										if ( typeof ( Ext.getCmp( "barChart" ).axes ) != "undefined" && Ext.getCmp( "barChart" ).axes != null ) {
											Ext.getCmp( "barChart" ).axes[ 0 ].setTitle( 'Count' );
										}

										if ( typeof ( Ext.getCmp( "lineChart" ).axes ) != "undefined" && Ext.getCmp( "lineChart" ).axes != null ) {
											Ext.getCmp( "lineChart" ).axes[ 0 ].setTitle( 'Count' );
										}
					*/

				} else if ( $( '#reportType' ).val() == "DERDR" || $( '#reportType' ).val() == "DERSR" ) {
					var cdArray = new Array();
					gridPanelStore.each( function( r ) {

						if ( cdArray.contains( r.get( 'data_vendor_id' ) ) ) {
							cdArray[ r.get( 'data_vendor_id' ) ] += r.get( 'credits_used' );
						} else {
							cdArray[ r.get( 'data_vendor_id' ) ] = r.get( 'credits_used' );
						}
					} );
					var json = [];
					for ( cd in cdArray ) {
						if ( cd.indexOf( "contains" ) == -1 ) {
							json.push( {
								'Name' : ( cd == "" ? 'Unkown' : cd ),
								'Data' : parseInt( cdArray[ cd ], 10 )
							} );
						}
					}
					chartStore.loadData( json );
					chartPanel.setTitle( 'Data Enrichment Detail Report' );
				} else {
					grid.getSelectionModel().select( 0 );
					grid.fireEvent( 'rowclick', grid, 0 );
					Ext.getCmp( 'chartPanel' ).remove( Ext.getCmp( 'chartPanel' ).items.getAt( 0 ), false );
					Ext.getCmp( 'chartPanel' ).add( Ext.getCmp( "tasks_no_data" ) );
				}
				if ( $( '#reportType' ).val() == "ILDR" || $( '#reportType' ).val() == "ILTSR" ) {
					Ext.getCmp( 'chartPanel' ).remove( Ext.getCmp( 'chartPanel' ).items.getAt( 0 ), false );
					Ext.getCmp( 'chartPanel' ).add( Ext.getCmp( "barChart" ) );
					Ext.getCmp( "barChart" ).redraw();
				} else if ( $( '#reportType' ).val() == "ILSR" ) {
					Ext.getCmp( 'chartPanel' ).remove( Ext.getCmp( 'chartPanel' ).items.getAt( 0 ), false );
					Ext.getCmp( 'chartPanel' ).add( Ext.getCmp( "stackBarChart" ) );
					Ext.getCmp( "stackBarChart" ).redraw();
				} else {
					Ext.getCmp( 'chartPanel' ).remove( Ext.getCmp( 'chartPanel' ).items.getAt( 0 ), false );
					Ext.getCmp( 'chartPanel' ).add( Ext.getCmp( "pieChart" ) );
					Ext.getCmp( "pieChart" ).redraw();
				}
			} else {
				Ext.getCmp( 'chartPanel' ).remove( Ext.getCmp( 'chartPanel' ).items.getAt( 0 ), false );
				Ext.getCmp( 'chartPanel' ).add( Ext.getCmp( "tasks_no_data" ) );
			}
		}, this, {
			single : true
		} );
		if ( $( '#reportType' ).val() == 'UMUMR' || $( '#reportType' ).val() == "LPR" || $( '#reportType' ).val() == "PDISR" || $( '#reportType' ).val() == "TDISR" || $( '#reportType' ).val() == "CDISR" || $( '#reportType' ).val() == "TCR" || $( '#reportType' ).val() == "IMEXR" || $( '#reportType' ).val() == "TDEXR" || $( '#reportType' ).val() == "PDEXR" || $( '#reportType' ).val() == "CDEXR" || $( '#reportType' ).val() == "TDUSR" || $( '#reportType' ).val() == "TDDR" || $( '#reportType' ).val() == "PDUSR" || $( '#reportType' ).val() == "CDUSR" || $( '#reportType' ).val() == "CLCR" || $( '#reportType' ).val() == "EXER" || $( '#reportType' ).val() == "REFUSR" || $( '#reportType' ).val() == 'DNCR' ) {
			Ext.getCmp( "gridPanel" ).getView().getFeature( 'groupbyfeature' ).disable();
			Ext.getCmp( "gridPanel" ).getView().getFeature( 'summaryfeature' ).enable();
			Ext.getCmp( 'reportParams' ).getForm().findField( "call_disposition" ).disable();
			Ext.getCmp( 'reportParams' ).getForm().findField( "list_names" ).disable();

			if ( $( '#reportType' ).val() == "LPR" && $( '#groupName' ).val() != '' ) {
				Ext.getCmp( 'reportParams' ).getForm().findField( "list_names" ).enable();
			} else {
				Ext.getCmp( 'reportParams' ).getForm().findField( "list_names" ).disable();
			}

		} else if ( $( '#reportType' ).val() == "ILSR" || $( '#reportType' ).val() == "ILTSR" || $( '#reportType' ).val() == "TDWSR" || $( '#reportType' ).val() == "PDWSR" || $( '#reportType' ).val() == "CDWSR" || $( '#reportType' ).val() == "PDIDR" || $( '#reportType' ).val() == "TDIDR" || $( '#reportType' ).val() == "CDIDR" || $( '#reportType' ).val() == "CTCWSR" || $( '#reportType' ).val() == "PDISR" || $( '#reportType' ).val() == "TDISR" || $( '#reportType' ).val() == "CDISR" || $( '#reportType' ).val() == "RCWSR" || $( '#reportType' ).val() == "RCDR" || $( '#reportType' ).val() == "TCR" ) {// Added by benjamin
			Ext.getCmp( "gridPanel" ).getView().getFeature( 'groupbyfeature' ).enable();
			Ext.getCmp( "gridPanel" ).getView().getFeature( 'summaryfeature' ).disable();
			Ext.getCmp( 'reportParams' ).getForm().findField( "call_disposition" ).disable();
			if ( $( '#reportType' ).val() == "TDWSR" || $( '#reportType' ).val() == "PDWSR" || $( '#reportType' ).val() == "CDWSR" && $( '#groupName' ).val() != '' ) {
				Ext.getCmp( 'reportParams' ).getForm().findField( "list_names" ).enable();
			} else {
				Ext.getCmp( 'reportParams' ).getForm().findField( "list_names" ).disable();
			}
		} else if ( $( '#reportType' ).val() == "PDCDR" || $( '#reportType' ).val() == "DERSR" || $( '#reportType' ).val() == "DERDR" ) {
			Ext.getCmp( "gridPanel" ).getView().getFeature( 'summaryfeature' ).enable();
			Ext.getCmp( "gridPanel" ).getView().getFeature( 'groupbyfeature' ).disable();
		} else if ( $( '#reportType' ).val() == "CLCR" || $( '#reportType' ).val() == "TDCR" ) {
			Ext.getCmp( "gridPanel" ).getView().getFeature( 'groupbyfeature' ).disable();
			Ext.getCmp( "gridPanel" ).getView().getFeature( 'summaryfeature' ).enable();
			Ext.getCmp( 'reportParams' ).getForm().findField( "call_disposition" ).disable();
			Ext.getCmp( 'reportParams' ).getForm().findField( "list_names" ).disable();
		} else if ( $( '#reportType' ).val() == "IMDSR" || $( '#reportType' ).val() == "ITDCDR" || $( '#reportType' ).val() == "PDCDR" || $( '#reportType' ).val() == "DERSR" || $( '#reportType' ).val() == "DERDR" || $( '#reportType' ).val() == "CDCDR" || $( '#reportType' ).val() == "TDCDR" || $( '#reportType' ).val() == "TKDAR" || $( '#reportType' ).val() == "DACDR" ) {
			Ext.getCmp( "gridPanel" ).getView().getFeature( 'summaryfeature' ).enable();
			Ext.getCmp( "gridPanel" ).getView().getFeature( 'groupbyfeature' ).disable();
		} else if ( $( '#reportType' ).val() == "PDCDR" || $( '#reportType' ).val() == "CDCDR" || $( '#reportType' ).val() == "DACDR" || $( '#reportType' ).val() == "FPUSR" || $( '#reportType' ).val() == "CTCCDR" ) {
			Ext.getCmp( "gridPanel" ).getView().getFeature( 'summaryfeature' ).disable();
			Ext.getCmp( "gridPanel" ).getView().getFeature( 'groupbyfeature' ).disable();
		} else if ( $( '#reportType' ).val() == "ILDR" ) {
			Ext.getCmp( "gridPanel" ).getView().getFeature( 'groupbyfeature' ).enable();
			Ext.getCmp( "gridPanel" ).getView().getFeature( 'summaryfeature' ).disable();
			Ext.getCmp( 'reportParams' ).getForm().findField( "list_names" ).disable();
		}
		if ( $( '#reportType' ).val() == "LPR" || $( '#reportType' ).val() == "UMUMR" ) {
			Ext.getCmp( 'reportParams' ).getForm().findField( "product_type" ).enable();
		}

		if ( $( '#reportType' ).val() == 'RCWSR' || $( '#reportType' ).val() == "LPR" || $( '#reportType' ).val() == "CDUSR" || $( '#reportType' ).val() == "PDUSR" || $( '#reportType' ).val() == "TDUSR" || $( '#reportType' ).val() == "TDDR" || $( '#reportType' ).val() == "TDISR" || $( '#reportType' ).val() == "PDISR" || $( '#reportType' ).val() == "CDISR" || $( '#reportType' ).val() == "CDIDR" || $( '#reportType' ).val() == "TCR" || $( '#reportType' ).val() == "CRR" || $( '#reportType' ).val() == "IMDSR" || $( '#reportType' ).val() == "REFUSR" || $( '#reportType' ).val() == "FPUSR" || $( '#reportType' ).val() == 'DNCR' || $( '#reportType' ).val() == "UMUMR" ) {
			Ext.getCmp( "gridPanel" ).setHeight( 600 )
			Ext.getCmp( "chartPanel" ).setHeight( 0 );
			Ext.getCmp( 'pieButton' ).hide();
			Ext.getCmp( 'barButton' ).hide();
			Ext.getCmp( 'lineButton' ).hide();
			$( '#chartPanel-bodyWrap' ).hide();
		} else if ( $( '#reportType' ).val() == "ILDR" || $( '#reportType' ).val() == "ILSR" || $( '#reportType' ).val() == "ILTSR" ) {
			$( '#chartPanel-bodyWrap' ).show();
			Ext.getCmp( "gridPanel" ).setHeight( 355 );
			Ext.getCmp( "chartPanel" ).setHeight( 400 );
			Ext.getCmp( 'pieButton' ).hide();
			Ext.getCmp( 'barButton' ).enable();
			Ext.getCmp( 'lineButton' ).hide();
		} else {
			$( '#chartPanel-bodyWrap' ).show();
			Ext.getCmp( "gridPanel" ).setHeight( 355 );
			Ext.getCmp( "chartPanel" ).setHeight( 400 );
			Ext.getCmp( 'pieButton' ).enable();
			Ext.getCmp( 'barButton' ).enable();
			Ext.getCmp( 'lineButton' ).enable();
		}
		if ( $( '#reportType' ).val() != "REPCPR" ) {

			Ext.getCmp( "radioOption" ).hide();
		} else {
			Ext.getCmp( "radioOption" ).show();
		}
		Ext.getCmp( 'reportParams' ).getForm().findField( "list_names" ).setValue( $( '#listnames' ).val().split( "_DEL_" ) );
		Ext.getCmp( 'pieButton' ).enable();
		Ext.getCmp( 'barButton' ).enable();
	}


} );

function checkCallDisposition( callDispositionData ) {

	customTDExecReportValidation = "";
	var flag = 0;
	callDispositionData.each( function( item, index ) {

		if ( item ) {
			if ( $.trim( item.data.call_disposition ).includes( 'Interest' ) ) {
				flag++;
			}
		}
	} );
	if ( flag == 0 ) {
		customTDExecReportValidation = 'This report can be run only if the call dispositions start with Interest or No Interest';

	}
}
