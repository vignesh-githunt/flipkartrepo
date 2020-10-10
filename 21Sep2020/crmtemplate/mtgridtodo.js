var customizedColumnList = [];
var todoFieldsList = [];
var todoFieldsMapObj = {};
var selectedColumnsByRecType = {};
var resetClicked = false;
var is_open = false;
var selectedProspectsCount = 0;
var selectedRowIndex;
var activateScrollBar = false;
var userId = 0;

// multitouch home todo list gird logic and code
Ext.define( 'calling_mode', {
	extend : 'Ext.data.Model',
	fields : [ 'short_name', 'description' ]
} );
Ext.define( 'MultiTouches', {
	extend : 'Ext.data.Model',
	fields : [ 'multi_touch_id', 'multi_touch_name', 'status', 'owner_id' ]
} );
Ext.define( 'users', {
	extend : 'Ext.data.Model',
	fields : [ {
		type : 'string',
		name : 'talker_id'
	}, {
		type : 'string',
		name : 'talker_name'
	} ]
} );

var todoCadenceSearchStore = Ext.create( 'Ext.data.JsonStore', {
	model : 'MultiTouches',
	autoLoad : true,
	// remoteSort : true,
	proxy : {
		url : 'multitouch',
		type : 'ajax',
		actionMethods : {
			read : 'POST'
		},
		extraParams : {
			rt : 'get_todo_cadences',
			talker_id : ''

		},
		reader : {
			type : 'json',
			root : 'cadences'
		}
	}
} );

var talkerListStoreData = Ext.create( 'Ext.data.Store', {
	model : 'users',
	autoLoad : false,

	proxy : {
		type : 'ajax',
		url : 'viewcampaign_data',
		extraParams : {
			rt : 'get_users',
			is_manager : $( '#is_manager' ).val()
		},
		actionMethods : {
			create : 'POST',
			read : 'POST',
			update : 'POST',
			destroy : 'POST'
		},
		reader : {
			type : 'json',
			rootProperty : 'users'
		}
	}
} );
talkerListStoreData.load();

talkerListStoreData.filterBy( function( record ) {

	if ( record.get( 'talker_name' ) != 'ALL' && record.get( 'talker_name' ) != 'NONE' && record.get( 'is_active' ) == 'Y' )
		return record;
} );

var users_combo = {
	xtype : 'combo',
	labelSeparator : "",
	editable : false,
	typeAhead : false,
	autoSelect : false,
	scrollable : true,
	queryMode : 'local',
	width : '300px !important',
	typeAheadDelay : 500,
	emptyText : '',
	enableKeyEvents : true,
	fieldLabel : 'User(s)',
	id : 'talker_id_combo',
	name : ( 'talker_ids__DEL__' + new Date().getTime() ),
	cls : 'users',
	displayField : 'talker_name',
	valueField : 'talker_id',
	store : talkerListStoreData,
	listeners : {

		specialkey : function( field, event ) {

			if ( event.getKey() == event.ENTER ) {// if you press enter key after focus on prospects, it will initiate search operation
				event.preventDefault();
				common_search_prospects();
			}
		},
		select : function( field, event ) {

			if ( $.trim( $( '#displayName' ).val() ) == $.trim( Ext.getCmp( 'talker_id_combo' ).getRawValue() ) ) {

				// Ext.getCmp( 'view_touch_info' ).setDisabled( false );

				Ext.getCmp( 'complete_social_touch' ).setDisabled( false );

				Ext.getCmp( 'zipwhip_touch' ).setDisabled( false );
			} else {

				// Ext.getCmp( 'view_touch_info' ).setDisabled( true );

				Ext.getCmp( 'complete_social_touch' ).setDisabled( true );

				Ext.getCmp( 'zipwhip_touch' ).setDisabled( true );
			}

			getUserTodoCadences();
		}
	}
};

function common_search_gridtodo() {


	var m_id = $.trim( Ext.getCmp( 'campaign_id' ).getValue() );

	var v_touch_type_id = $.trim( Ext.getCmp( 'touch_type_dd' ).getValue() );
	userId = Ext.getCmp( 'talker_id_combo' ).getValue();

	if ( m_id != '' || v_touch_type_id != '' ) {

		// storetodo.removeAll();
		// storetodo.currentPage = 1;
		storetodo.load( {
			params : {
				touch_type : v_touch_type_id,
				multi_touch_id : m_id,
				resetClicked : resetClicked,
				start : 0,
				talker_id : Ext.getCmp( 'talker_id_combo' ).getValue()
			}
		} );
		grid.reconfigure( storetodo );
	} else {
		storetodo.load( {
			params : {
				touch_type : '',
				multi_touch_id : '',
				start : 0,
				resetClicked : resetClicked,
				talker_id : Ext.getCmp( 'talker_id_combo' ).getValue()
			}
		} );
		grid.reconfigure( storetodo );
		resetClicked = false;

	}


}

var storetodo;
var grid;

function getToDoGridPanel() {

	ajaxFn( 'getcustomizedtrucadcolumns', {
		pageName : 'to_todo',
		reqType : 'get',
		recordType : 'Default'
	} ).done( function( responseData ) {

		customizedColumnList = $.trim( responseData.selected_columns.selected_columns_metadata ) == '' ? [] : $.trim( responseData.selected_columns.selected_columns_metadata ).split( '~' );
		var allTypeList = responseData.sel_cols_by_rec_type.record_type;
		if ( allTypeList == undefined || allTypeList == null || allTypeList == '' ) {
			allTypeList = [];
		}
		for ( var j = 0; j < allTypeList.length; j++ ) {
			selectedColumnsByRecType[ allTypeList[ j ].record_type ] = [];
			var tempppList = allTypeList[ j ].selected_columns_array;
			for ( var k = 0; k < tempppList.length; k++ ) {
				selectedColumnsByRecType[ allTypeList[ j ].record_type ].push( $.trim( tempppList[ k ].field_name ) );
			}
		}
		var isZipwhipEnabled = $( '#text_touch_enabled' ).val() == 'true' && $( '#zipWhipKey' ).val() != '' ? true : false;

		todoFieldsMapObj = {
			'multi_touch_member_id' : {
				dataIndex : 'multi_touch_member_id',
				hidden : true,
				sortable : false,
				hideable : false,
				resizable : false,

			},
			'selectedRow' : {
				xtype : 'checkcolumn',
				id : 'todo_select_all_prospects_checkbox',
				headerCheckbox : true,
				dataIndex : 'selectedRow',
				menuDisabled : true,
				hideable : false,
				resizable : false,
				sortable : false,
				width : 30,
				text : '&#160;',
				selModel : {
					selType : 'checkboxmodel',
					showHeaderCheckbox : true
				},
				listeners : [ {

					headerCheckchange : function( column, checked, e, eOpts ) {

						// code for whatever on checkchange here
						var grid = Ext.getCmp( 'to_do_list_grid' );
						store = grid.getStore();
						if ( checked ) {
							selectAll = true;
							for ( var i = 0; i < store.getCount(); i++ ) {
								var rec = store.getAt( i );
								var c = rec.get( 'selectedRow' );
								c.checked;
							}
						} else {

							store.rejectChanges();
							selectAll = false;
						}
					}
				} ]
			},
			'account_name' : {
				sortable : true,
				menuDisabled : true,
				id : 'todo_sort_account_name',
				dataIndex : 'account_name',
				field : {
					xtype : 'textfield'
				},
				renderer : function( v, meta, rec ) {

					var accountName = Ext.String.htmlEncode( $.trim( v ) );
					if ( !Ext.isEmpty( v ) ) {
						meta.tdAttr = 'data-qtip="' + Ext.String.htmlEncode( accountName ) + '"';
					}
					accountName = '<div class="prospectcontactname"><a href="javascript:void(0)" name="accountAnchor" >' + accountName + '</a></div>';
					return accountName;
				}
			},
			'contact_name' : {
				sortable : true,
				menuDisabled : true,
				id : 'todo_sort_contact_name',
				dataIndex : 'contact_name',
				field : {
					xtype : 'textfield'
				},
				renderer : function( v, meta, rec ) {

					v = Ext.util.Format.htmlEncode( v );
					var crmIcons = '';

					if ( !rec.data.crm_id.startsWith( 'crmgenkey' ) ) {
						crmIcons = $( '<img/>' ).attr( 'src', 'image/icons/crm-green.png' ).css( {
							'padding-right' : '10px',
							'cursor' : 'pointer'
						} ).attr( 'onclick', "openCrmWindowWithPkAndRecordType( '" + rec.data.crm_id + "','" + rec.data.record_type + "' );" )[ 0 ].outerHTML;
					}

					if ( !Ext.isEmpty( v ) ) {
						meta.tdAttr = 'data-qtip="' + Ext.util.Format.htmlEncode( v ) + '"';
					}

					var contactName = v;

					if ( isValidURL( v ) ) {
						contactName = '<div class="prospectcontactname">' + crmIcons + '<a href="' + contactName + '" target="_blank" name="contactAnchor" >' + contactName + '</a></div>';
					} else {
						contactName = '<div class="prospectcontactname">' + crmIcons + '<a href="javascript:void(0)" name="contactAnchor" >' + contactName + '</a></div>';
					}
					return ( rec.data.optout == 'false' || rec.data.optout == false ) ? contactName : contactName + " <span title='This Prospect opted out '  ><img src='../../i/mt/opt-out.png' style='width:14px; margin-top:-2px;' /></span>";
				}
			},
			'title' : {
				sortable : true,
				menuDisabled : true,
				id : 'todo_sort_title',
				dataIndex : 'title',
				field : {
					xtype : 'textfield'
				}
			},
			'phone' : {
				sortable : true,
				menuDisabled : true,
				id : 'todo_sort_phone',
				dataIndex : 'phone',
				field : {
					xtype : 'textfield'
				},
				renderer : function( value, metaData, record ) {

					value = Ext.util.Format.htmlEncode( $.trim( value ) );
					if ( !Ext.isEmpty( value ) ) {
						metaData.tdAttr = 'data-qtip="' + Ext.util.Format.htmlEncode( value ) + '"';
					}

					var member_id = record.data.multi_touch_member_id;

					if ( member_id ) {

						var formatedText = '';

						if ( Ext.isEmpty( value ) || value == 'undefined' || value == '-' ) {

							return formatedText;
						} else if ( isZipwhipEnabled && record.data.touch_type == "TEXT" ) {

							formatedText = '<div class="prospectcontactname h-a" >' + value + '  <span class="fas fa-phone phone-contact" style="display: inline; color: #3ca00f; cursor: pointer;"  onclick="viewTodoProspectsDetails(' + metaData.recordIndex + ',\'' + value + '\')"></span>&nbsp;';

							formatedText = formatedText + '<span onclick="triggerTextCompleteAction(' + metaData.recordIndex + ',\'' + value + '\')" title="Send Text" class="fas fa-comments" style="color: #FFC300; cursor: pointer;"></span></div>';
						} else if ( Ext.getCmp( 'talker_id_combo' ).getRawValue() != '' //
								&& Ext.getCmp( 'talker_id_combo' ).getRawValue() != $.trim( $( '#displayName' ).val() ) ) {

							return value;
						} else {

							formatedText = value + ' <span class="fas fa-phone phone-contact" style="display: inline; color: #3ca00f; cursor: pointer;"  onclick="viewTodoProspectsDetails(' + metaData.recordIndex + ',\'' + value + '\')"></span>';
						}

						return formatedText;
					}
				},
			},
			'email_id' : {
				sortable : true,
				menuDisabled : true,
				id : 'todo_sort_email_id',
				dataIndex : 'email_id',
				field : {
					xtype : 'textfield'
				},
				renderer : function( value, metaData, rec ) {

					value = Ext.util.Format.htmlEncode( $.trim( value ) );
					if ( !Ext.isEmpty( value ) ) {
						metaData.tdAttr = 'data-qtip="' + Ext.util.Format.htmlEncode( value ) + '"';
					}

					if ( rec.get( 'send_same_email_flag' ) == false ) {

						var hrsArray = $.trim( rec.get( 'remaining_hours' ) ).split( ' ' );
						if ( hrsArray.length > 10 )
							value = '<span class="fa fa-exclamation-circle" title="' + ( $.trim( hrsArray ) == '' ? ( '' ) : ( hrsArray[ 6 ] + ' ' + hrsArray[ 7 ] + ' ' + hrsArray[ 8 ] + ' ' + hrsArray[ 9 ] ) ) + '"></span>' + value;
					}

					return value;
				}
			},
			'due_date' : {
				sortable : true,
				text : 'Due',
				menuDisabled : true,
				id : 'todo_sort_due_date',
				dataIndex : 'due_date',
				field : {
					xtype : 'textfield',
				},
				renderer : function( value, metaData, rec ) {

					value = Ext.util.Format.htmlEncode( value );
					if ( !Ext.isEmpty( value ) ) {
						metaData.tdAttr = 'data-qtip="' + Ext.util.Format.htmlEncode( value ) + '"';
					}
					return value;
				}
			},
			'multi_touch_name' : {
				sortable : true,
				menuDisabled : true,
				id : 'todo_sort_current_cadence',
				dataIndex : 'multi_touch_name',
				field : {
					xtype : 'textfield'
				}
			},
			'touch' : {
				sortable : true,
				menuDisabled : true,
				id : 'todo_sort_current_touch',
				dataIndex : 'touch',
				field : {
					xtype : 'textfield'
				},
				renderer : function( value, metaData, record ) {

					value = Ext.util.Format.htmlEncode( value );
					if ( value == undefined || value == 'undefined' || value == '' ) {
						return '';
					} else if ( value.toLowerCase().includes( 'social' ) ) {
						value = value.replace( 'SOCIAL', OtherTouchName[ 'SOCIAL' ] );
						metaData.tdAttr = 'data-qtip="' + value + '"';
						return value;
					} else {
						if ( !Ext.isEmpty( value ) ) {
							metaData.tdAttr = 'data-qtip="' + Ext.util.Format.htmlEncode( value ) + '"';
						}
						var temp = '';
						if ( value.toLowerCase().includes( 'email' ) )
							temp = "<span title='Personalize Email'><img src='../../i/mt/email-icon.png' style='width:16px; margin-left:5px; margin-top:-3px;'/></span>";

						return value + temp;
					}

				}
			}
		};
		var tempColumnList = customizedColumnList;
		todoFieldsList = [];
		todoFieldsList.push( todoFieldsMapObj[ 'multi_touch_member_id' ] );
		todoFieldsList.push( todoFieldsMapObj[ 'selectedRow' ] );
		var llen = tempColumnList.length;
		if ( llen >= 10 )
			llen = 9;
		for ( var j = 0; j < llen; j++ ) {
			var currentCustColumn = $.trim( tempColumnList[ j ] ).split( ':' );
			if ( currentCustColumn == null || currentCustColumn.length == 0 || currentCustColumn == undefined || currentCustColumn == '' ) {
				continue;
			}
			var currentColumnName = $.trim( currentCustColumn[ 0 ] );
			var currentColumnText = $.trim( currentCustColumn[ 5 ] );
			var currentColumnWidth = parseInt( $.trim( currentCustColumn[ 2 ] ).replace( 'px', '' ) );
			var currentColumnAlign = $.trim( currentCustColumn[ 3 ] );

			if ( currentColumnName.includes( '__DEL__' ) )
				currentColumnName = currentColumnName.split( '__DEL__' )[ 0 ];

			if ( todoFieldsMapObj[ currentColumnName ] != undefined ) {

				todoFieldsMapObj[ currentColumnName ].menuDisabled = true;
				todoFieldsMapObj[ currentColumnName ].draggable = false;
				todoFieldsMapObj[ currentColumnName ].width = currentColumnWidth;
				todoFieldsMapObj[ currentColumnName ].align = currentColumnAlign;
				todoFieldsMapObj[ currentColumnName ].text = currentColumnText;

				if ( todoFieldsMapObj[ currentColumnName ].renderer == undefined ) {
					todoFieldsMapObj[ currentColumnName ].renderer = function( value, metaData, rec ) {

						var columnValue = $.trim( Ext.util.Format.htmlEncode( value ) );
						if ( !Ext.isEmpty( value ) ) {
							metaData.tdAttr = 'data-qtip="' + Ext.util.Format.htmlEncode( columnValue ) + '"';
						}
						if ( isValidURL( value ) ) {
							columnValue = '<div><a href="' + columnValue + '" target="_blank" name="' + columnValue + '_Anchor" >' + columnValue + '</a></div>';
						} else {
							columnValue = '<div> ' + columnValue + ' </div>';
						}
						return columnValue;
					}
				}
				todoFieldsList.push( todoFieldsMapObj[ currentColumnName ] );
			} else if ( currentColumnName == 'cadences' ) {

				todoFieldsMapObj[ 'multi_touch_name' ].menuDisabled = true;
				todoFieldsMapObj[ 'multi_touch_name' ].draggable = false;
				todoFieldsMapObj[ 'multi_touch_name' ].width = currentColumnWidth;
				todoFieldsMapObj[ 'multi_touch_name' ].align = currentColumnAlign;
				todoFieldsMapObj[ 'multi_touch_name' ].text = currentColumnText;
				todoFieldsMapObj[ 'multi_touch_name' ].id = 'todo_grid_sort' + currentColumnName;
				if ( todoFieldsMapObj[ 'multi_touch_name' ].renderer == undefined ) {
					todoFieldsMapObj[ 'multi_touch_name' ].renderer = function( value, metaData, rec ) {

						var columnValue = $.trim( Ext.util.Format.htmlEncode( value ) );
						if ( !Ext.isEmpty( value ) ) {
							metaData.tdAttr = 'data-qtip="' + Ext.util.Format.htmlEncode( columnValue ) + '"';
						}
						if ( isValidURL( value ) ) {
							columnValue = '<div><a href="' + columnValue + '" target="_blank" name="' + columnValue + '_Anchor" >' + columnValue + '</a></div>';
						} else {
							columnValue = '<div> ' + columnValue + ' </div>';
						}
						return columnValue;

					}
				}

				todoFieldsList.push( todoFieldsMapObj[ 'multi_touch_name' ] );
			} else if ( currentColumnName == 'current_touch_type' ) {
				todoFieldsMapObj[ 'touch' ].menuDisabled = true;
				todoFieldsMapObj[ 'touch' ].draggable = false;
				todoFieldsMapObj[ 'touch' ].width = currentColumnWidth;
				todoFieldsMapObj[ 'touch' ].align = currentColumnAlign;
				todoFieldsMapObj[ 'touch' ].text = currentColumnText;
				todoFieldsMapObj[ 'touch' ].id = 'todo_grid_sort' + currentColumnName;
				todoFieldsList.push( todoFieldsMapObj[ 'touch' ] );

			} else if ( currentColumnName.startsWith( 'custom_boolean' ) || currentColumnName == 'optout_flag' ) {

				todoFieldsList.push( {

					field : {
						xtype : 'textfield',
					},
					text : currentColumnText,
					dataIndex : currentColumnName,
					id : 'todo_grid_sort' + currentColumnName,
					menuDisabled : true,
					resizable : false,
					sortable : true,
					align : currentColumnAlign,
					width : currentColumnWidth,
					renderer : function( value ) {

						return value == true ? '<span class="x-grid-checkcolumn x-grid-checkcolumn-checked" />' : '<span class="x-grid-checkcolumn" />'
					}

				} );

			} else {
				var newField = {
					text : currentColumnText,
					align : currentColumnAlign,
					width : currentColumnWidth,
					dataIndex : currentColumnName,
					id : 'todo_grid_sort' + currentColumnName,
					menuDisabled : true,
					sortable : true,
					// draggable : false,
					field : {
						xtype : 'textfield'
					}
				};
				if ( currentColumnName.includes( 'custom_phone_' ) ) {

					newField.renderer = todoFieldsMapObj[ 'phone' ].renderer;
				} else {

					newField.renderer = function( value, metaData, rec ) {

						var columnValue = $.trim( Ext.util.Format.htmlEncode( value ) );
						if ( !Ext.isEmpty( value ) ) {
							metaData.tdAttr = 'data-qtip="' + Ext.util.Format.htmlEncode( columnValue ) + '"';
						}
						if ( isValidURL( value ) ) {
							columnValue = '<div><a href="' + columnValue + '" target="_blank" name="' + columnValue + '_Anchor" >' + columnValue + '</a></div>';
						} else {
							columnValue = '<div> ' + columnValue + ' </div>';
						}
						return columnValue;
					}
				}
				todoFieldsList.push( newField );
			}
		}
		todoFieldsList.push( todoFieldsMapObj[ 'due_date' ] );

		/*cadenceSearchStore.filterBy( function( record ) {

			if ( record.get( 'status' ) != 'NEW' && record.get( 'status' ) != 'INACTIVE' ) {

				return true;
			}
			return false;

		} );
		*/
		var touch_type_store = Ext.create( 'Ext.data.JsonStore', {
			model : 'calling_mode',
			data : [ {
				"short_name" : "",
				"description" : ""
			}, {
				"short_name" : "EMAIL",
				"description" : "EMAIL"
			}, {
				"short_name" : OtherTouchName[ "SOCIAL" ],
				"description" : OtherTouchName[ "SOCIAL" ]
			}, {
				"short_name" : "LINKEDIN",
				"description" : "LINKEDIN"
			}, {
				"short_name" : "TEXT",
				"description" : "TEXT"
			}, ]
		} );


		var touch_type_drop_down = {
			xtype : 'combo',
			id : 'touch_type_dd',
			store : touch_type_store,
			displayField : 'description',
			valueField : 'short_name',
			queryMode : 'local',
			labelSeparator : "",
			width : 450,
			fieldLabel : 'Touches',
			emptyText : '',
			enableKeyEvents : true,
			listeners : [ {
				specialkey : function( field, event ) {

					if ( event.getKey() == event.ENTER ) {// if you press enter key after focus on tag, it will initiate search operation


						event.preventDefault();

						common_search_gridtodo();


					}
				},
				afterrender : function( f, e ) {

					var assign = $( '#filter_pending_email' ).val();
					var assignText = $( '#filter_pending_text' ).val();
					var assignOther = $( '#filter_pending_other' ).val();
					if ( assign == true || assign == 'true' ) {
						this.setValue( 'EMAIL' );
						$( '#filter_pending_email' ).val( '' )
					} else if ( assignText == true || assignText == 'true' ) {
						this.setValue( 'TEXT' );
						$( '#filter_pending_text' ).val( '' )
					} else if ( assignOther == true || assignOther == 'true' ) {
						this.setValue( 'OTHER,LINKEDIN' );
						$( '#filter_pending_other' ).val( '' )
					}
				}
			} ]

		};
		var compaign_view = {
			xtype : 'combo',
			id : 'campaign_id',
			displayField : 'multi_touch_name',
			fieldLabel : 'Cadence',
			labelSeparator : "",
			editable : true,
			typeAhead : false,
			autoSelect : false,
			scrollable : true,
			queryMode : 'local',
			name : ( 'multi_touch_name__DEL__' + new Date().getTime() ), // to block auto fill we are naming the "name" attribute dynamically
			width : 450,
			typeAheadDelay : 500,
			emptyText : '',
			valueField : 'multi_touch_id',
			store : todoCadenceSearchStore,
			enableKeyEvents : true,
			listeners : {
				specialkey : function( field, event ) {

					if ( event.getKey() == event.ENTER ) {// if you press enter key after focus on tag, it will initiate search operation


						event.preventDefault();

						common_search_gridtodo();


					}
				}
			},

		};

		var actionFormFilters = Ext.create( 'Ext.form.Panel', {
			layout : 'anchor',
			cls : 'prospects-groupsbtn clearfix',
			defaults : {
				anchor : '100%'
			},
			id : 'action-form-filters',
			border : false,
			items : [ {

				xtype : 'fieldcontainer',
				width : '100%',
				layout : 'hbox',
				cls : 'importfrom-wrapper',
				items : [
				/*{
				id : 'sendemail_prospect',
				xtype : 'clbuttonokaymedium',
				value : 'One-off Email',
				cls : 'prospects-list none',
				text : '<span class="fas fa-envelope"></span> One-off Email',
				listeners : {
					afterrender : function( f, e ) {

						$( '#' + f.id ).attr( 'data-qtip', 'One-off Email' );
					},
					'click' : function( combo, record, eOpts ) {

						// if ( !is_open ) {
						triggerAction( combo );
						// is_open = true;
						// }
					}
				}
				},*/
				{
					id : 'view_touch_info',
					xtype : 'clbuttonokaymedium',
					cls : 'prospects-list none',
					value : 'View Touch Info',
					text : '<i class="far fa-eye"></i> View Touch Info',
					listeners : {
						afterrender : function( f, e ) {

							$( '#' + f.id ).attr( 'data-qtip', 'View Touch Info' );
						},
						'click' : function( combo, record, eOpts ) {

							if ( !is_open ) {
								triggerAction( combo );
								is_open = true;
							}
						}
					}
				}, {
					id : 'complete_social_touch',
					xtype : 'clbuttonokaymedium',
					value : 'Complete Social Touch',
					cls : 'prospects-list none',
					text : '<i class="fas fa-share-alt"></i> Complete Touch',
					listeners : {
						afterrender : function( f, e ) {

							$( '#' + f.id ).attr( 'data-qtip', 'Complete Touch' );
						},
						'click' : function( combo, record, eOpts ) {

							if ( !is_open ) {
								triggerAction( combo );
								is_open = true;
							}
						}
					}
				}, {
					id : 'zipwhip_touch',
					xtype : 'clbuttonokaymedium',
					value : 'Complete ZipWhip Touch',
					cls : 'prospects-list none',
					hidden : $( '#text_touch_enabled' ).val() == 'true' ? false : true && $( '#zipWhipKey' ).val() == '' ? true : false,
					text : '<i class="fas fa-comments"></i> Send a Text',
					listeners : {
						afterrender : function( f, e ) {

							$( '#' + f.id ).attr( 'data-qtip', 'Complete Zipwhip Touch' );
						},
						'click' : function( combo, record, eOpts ) {

							triggerAction( combo );

						}
					}
				} ]
			} ]
		} );

		var formfilter = Ext.create( 'Ext.form.Panel', {
			layout : 'anchor',
			cls : 'todo-wrapper-form',
			defaults : {
				anchor : '100%'
			},
			id : 'filterform',
			items : [ {
				xtype : 'fieldcontainer',
				layout : 'hbox',
				items : [ users_combo, {
					xtype : 'displayfield',
					width : 50

				}, compaign_view, {
					xtype : 'displayfield',
					width : 50

				}, touch_type_drop_down ]
			}, {
				xtype : 'fieldcontainer',
				layout : 'hbox',
				cls : 'todo-wrapper-form-btn float-left',
				items : [ {
					xtype : 'displayfield',
					width : 400
				}, {
					xtype : 'clbuttonokaymedium',
					name : 'search',
					text : '<i class="fas fa-search" aria-hidden="true"></i> Search',
					id : 'search_prospects_todo',
					cls : 'btn btn-outline-primary left0',
					listeners : {
						'click' : function() {

							common_search_gridtodo();
						},
						specialkey : function( f, e ) {

							if ( e.getKey() == e.ENTER ) {
								event.preventDefault();
								common_search_gridtodo();
							}
						}
					}
				} /*, {xtype : 'displayfield',width : 30}, {xtype : 'clbuttonwarningmedium',name : 'reset',cls : 'btn btn-outline-danger left0 ml-3',text : '<i class="fas fa-sync-alt" aria-hidden="true"></i> Reset',handler : function() {resetClicked = true;formfilter.reset();}}*/
				]
			},// field container ends
			{
				xtype : 'fieldcontainer',
				layout : 'hbox',
				margin : '10px 0 0 0',
				cls : 'pois',
				// width : 1300,
				items : [ {
					xtype : 'displayfield',
					width : 1080

				}, {
					xtype : 'clbuttonokaymedium',
					name : 'search_criteria',
					text : '<span class="fas fa-pencil-alt trucolor"></span> Personalize Emails',
					id : 'send_one_off_mail_todo',
					cls : 'normal-btn previewemails',
					// style : { 'margin' : '5px !important' },
					handler : function() {

						var memberCount = 0;
						var memberId = '0';
						var campaignId = '0';
						var emailType;

						var grid = Ext.getCmp( 'to_do_list_grid' );
						store = grid.getStore();
						selectAll = true;
						for ( var i = 0; i < store.getCount(); i++ ) {
							var rec = store.getAt( i );
							var isSelected = rec.get( 'selectedRow' );
							if ( isSelected ) {
								memberCount++;
							}
						}

						var sortByField = grid.getStore().sorters.getAt( 0 ).getProperty();
						var sortByDirection = grid.getStore().sorters.getAt( 0 ).getDirection();
						// memberId = grid.store.getAt( 0 ).data.multi_touch_member_id;
						// campaignId = grid.store.getAt( 0 ).data.multi_touch_id;

						if ( memberCount == 0 ) {

							var form = Ext.getCmp( 'filterform' ).getForm();
							// var campaignId = form.findField( "campaign_id" ).getValue();
							if ( form.findField( "campaign_id" ).getValue() != null ) {
								campaignId = grid.store.getAt( 0 ).data.multi_touch_id;
								memberId = grid.store.getAt( 0 ).data.multi_touch_member_id;

							}

							/*Below logic for show personalize email remaining email count*/
							toToEmailsIncremetCount = 1;
							// showInterActiveEmail( campaignId, sortByField, sortByDirection );
							emailType = 'personalize_email';

						} else {
							emailType = 'personalize_email_selected';
						}

						if ( parseInt( userId ) <= 0 && parseInt( Ext.getCmp( 'talker_id_combo' ).getValue() ) > 0 )
							userId = parseInt( Ext.getCmp( 'talker_id_combo' ).getValue() );
						else {
							if ( userId > 0 == false )
								userId = undefined;
						}

						loadEmailTemplates( memberId, 'sendEmailTodo', campaignId, sortByField, sortByDirection, 0, 0, emailType, userId );
						$( '#sendoneoffemaildone' ).text( '' );
						$( '<i>' ).addClass( 'fas' ).addClass( 'fa-check' ).attr( 'aria-hidden', 'true' ).appendTo( $( '#sendoneoffemaildone' ) );
						$( '#sendoneoffemaildone' ).append( ' Send and Next' );

					}
				}, {
					xtype : 'displayfield',
					width : 50

				}, {
					xtype : 'clbuttonokaymedium',
					name : 'search_criteria',
					text : 'Start Dialing Session',
					id : 'todo_start_dialing_session',
					hidden : true,
					handler : function() {

						var m_id = Ext.getCmp( 'campaign_id' ).getValue();
						if ( m_id == '' || m_id == -1 || m_id == null || m_id == undefined ) {
							m_id = '';
						}

						var touch_type_id = Ext.getCmp( 'touch_type_dd' ).getValue();
						if ( touch_type_id == '' || touch_type_id == -1 || touch_type_id == null || touch_type_id == undefined ) {
							touch_type_id = '';
						}
						if ( touch_type == 'CALL' ) {


							Ext.Ajax.request( {
								url : 'multitouch.action',
								params : {
									rt : 'start_call_touch',
									multi_touch_id : m_id,
									dialing_mode : '',
									clear_dialing_rec : 'YES',
									todo : false,

								},
								success : function( response, data ) {

									formSubmit( 'mysession.action' );
								}
							} );
						}

					}
				} ]
			} // field container ends

			// ]
			// }
			],// , date_exp_view ],
			editable : false,

			border : false

		} );


		storetodo = Ext.create( 'Ext.data.JsonStore', {
			model : 'todo',
			pageSize : 50,
			remoteSort : true,
			autoLoad : true,
			proxy : {
				type : 'ajax',
				url : 'listtodos.action',
				actionMethods : {
					read : 'POST'
				},
				headers : {
					'X-CSRF' : csrfToken + ''
				},
				extraParams : {

					multi_touch_id : '',
					dialing_mode : '',
					talker_id : Ext.getCmp( 'talker_id_combo' ).getValue()

				},
				reader : {
					type : 'json',
					rootProperty : 'data',
					totalProperty : 'total'
				}
			},
			sorters : [ {
				property : 'due_date',
				direction : 'ASC'
			} ],
			listeners : {
				beforeLoad : function() {

					var v_touch_type_id = ( Ext.getCmp( 'touch_type_dd' ).getValue() ? Ext.getCmp( 'touch_type_dd' ).getValue() : '' );
					if ( v_touch_type_id == '' || v_touch_type_id == -1 || v_touch_type_id == null || v_touch_type_id == undefined ) {
						v_touch_type_id = '';
					}

					var m_id = ( Ext.getCmp( 'campaign_id' ).getValue() ? Ext.getCmp( 'campaign_id' ).getValue() : '' );
					if ( m_id == '' || m_id == -1 || m_id == null || m_id == undefined ) {
						m_id = '';
					}
					this.getProxy().extraParams = {
						touch_type : v_touch_type_id,
						multi_touch_id : m_id,
						talker_id : Ext.getCmp( 'talker_id_combo' ).getValue()
					};

				},
				load : function() {

					if ( activateScrollBar )
						enableCustomScrollBar( true );
				}
			}

		} );

		grid = Ext.create( 'Ext.grid.Panel', {
			store : storetodo,
			margin : '15px 0 0 0 ',
			width : '100%',
			border : true,
			id : 'to_do_list_grid',
			minHeight : 250,
			emptyText : '<div class="table-msg">No To-Do Found</div>',
			viewConfig : {
				deferEmptyText : false,
			},
			defaults : {
				menuDisabled : true
			},
			header : {
				items : [ {
					id : 'prospects_customize',
					xtype : 'button',
					cls : 'normal-btn btn-customize',
					text : '<i class="fas fa-cog trucolor" aria-hidden="true"></i> Customize',
					handler : function() {

						customizePopup( 'to_todo' );
					}
				} ]
			},
			listeners : {
				cellclick : 'prospectaccounts',
				afterrender : function() {

					if ( activateScrollBar == false )
						enableCustomScrollBar( true );
				}
			},
			columns : todoFieldsList,
			autoScroll : true,
			autoHeight : true,
			stripeRows : true,
			resizable : {
				handles : 's'
			},
			title : 'To-Do',
			cls : 'todo-wrapper',
			dockedItems : [ {
				xtype : 'pagingtoolbar',
				store : storetodo, // same store GridPanel is using
				dock : 'bottom',
				displayInfo : true,
				id : 'todo_pagination_elements',
				pageSize : 10,
				inputItemWidth : 60,
				emptyMsg : "",
			}, {
				items : [ formfilter, actionFormFilters ],
				xtype : 'toolbar',
				dock : 'top',
				ui : 'footer',
				style : {
					'background-color' : '#FFFFFF',
				},
			} ],
			viewConfig : {
				stripeRows : true,
				enableTextSelection : true
			}
		} );


		Ext.create( 'Ext.Panel', {
			cls : 'content-area-black',
			border : false,
			lbar : [ Ext.create( 'mtleftpane', {
				selectedMenuItem : 'TODO',
				width : 200
			} ) ],

			layout : {
				type : 'vbox',
				align : 'left'
			},
			renderTo : Ext.get( 'leftMenu' ),
			items : [ {
				xtype : 'inboundleadspanel'
			}, grid, commonAlertPanel, viewAccountPanel, viewCadencePanel ],
			controller : 'mtaccounts-ViewController',
			listeners : {
				afterRender : function() {


					if ( ( gCrmType == 'salesforce' && enableInboundLeads == 'true' ) ) {
						$( '.inbound-leads-block' ).show();
						$( '.inbound-leads-content' ).show();
						renderInbounLeadsTableHeaders();
						// getInboundLeadRecords();
					}
				}
			}
		} );
	} );

	return grid;
}


/**
 * @author Krishnakumar
 * @purpose - To get selected prospect ids and its count
 */
function getSelectedProspectIds( propstore ) {

	var i = 0;
	var selectedProspectIds = '';
	for ( ; i < propstore.getCount(); i++ ) {
		var rec = propstore.getAt( i );
		var c = rec.get( 'selectedRow' );
		if ( c ) {
			if ( selectedProspectsCount == 0 ) {
				selectedProspectIds = selectedProspectIds + rec.get( 'multi_touch_member_id' );
			} else {
				selectedProspectIds = selectedProspectIds + ',' + rec.get( 'multi_touch_member_id' );
			}
			selectedProspectsCount = parseInt( selectedProspectsCount ) + 1;
			selectedRowIndex = i;
		}
	}
	return selectedProspectIds;
}

/**
 * @author Krishnakumar
 * @purpose - To show alert message
 */
function showAlert( alertMsg ) {

	popup.msg( {
		title : 'Alert',
		msgTxt : '<i class="fas fa-exclamation-circle yollowcolor" aria-hidden="true"></i> ' + alertMsg,
		rightBtnTxt : '<i class="fas fa-check" aria-hidden="true"></i> OK',
		constrain : true,
		modal : true,
		alwaysOnTop : true,
		rightBtnHandler : function() {

			is_open = false;
		},
		listeners : {
			beforeclose : function( window, eOpts ) {

				is_open = false;
			},
			beforehide : function( window, eopts ) {

				is_open = false;
			},
			beforeremove : function( window, eopts ) {

				is_open = false;
			},
			beforedestroy : function( window, eopts ) {

				is_open = false;
			}
		}
	} );
}

/**
 * @author Krishnakumar
 * @purpose - To trigger action like View touch info, Send Mail and Completed Social Touch for selected prospect
 */
function triggerAction( combo ) {

	var grid = Ext.getCmp( 'to_do_list_grid' );
	var propstore = grid.getStore();
	var selectedProspectIds = '';
	selectedRowIndex = undefined;
	selectedProspectsCount = 0;
	selectedProspectIds = getSelectedProspectIds( propstore );

	if ( selectedProspectIds == '' || $.trim( selectedProspectIds ).split( ',' ).length != 1 || selectedRowIndex == undefined ) {
		showAlert( selectedProspectsCount > 1 ? ' Please select only 1 prospect and try again.' : ( $.trim( selectedProspectIds ) == '' || selectedRowIndex == undefined ) ? ' Please select a prospect and try again.' : '' );
		is_open = false;
		return;
	}

	if ( combo.getValue() == "View Touch Info" ) {

		var rec = storetodo.getAt( selectedRowIndex );

		Ext.Ajax.request( {
			url : 'multitouch.action',
			params : {
				rt : 'view_touch_info',
				multi_touch_id : rec.data.multi_touch_id,
				step_no : rec.get( 'current_touch_id' ),
				touch_type : rec.data.mts_touch_type,
				talker_id : Ext.getCmp( 'talker_id_combo' ).getValue()
			},
			success : function( response, data ) {

				var win;
				var obj = Ext.JSON.decode( response.responseText );
				var tt = rec.data.mts_touch_type.toLowerCase();
				var time_to_complete = '';
				var unit = obj.data.time_period_unit;
				if ( obj.data.time_period_to_complete == 1 ) {
					time_to_complete = '<span class="valuecolor">' + obj.data.time_period_to_complete + ' ' + unit.substr( 0, unit.length - 1 ) + '</span>';
				} else {
					time_to_complete = '<span class="valuecolor">' + obj.data.time_period_to_complete + ' ' + obj.data.time_period_unit + '</span>';
				}
				var contactName = rec.data.contact_name;
				var cadenceName = rec.data.multi_touch_name;
				var touch = rec.data.touch;
				if ( touch.endsWith( '(SOCIAL)' ) ) {
					touch = touch.replace( '(SOCIAL)', '(' + OtherTouchName[ 'OTHER' ] + ')' );
				}
				// (SOCIAL)
				is_open = false;
				switch ( tt ) {
				case 'call':
				case 'call & vm':
				case 'CALL AND VM':
				case 'call_and_vm':
					var newdialog = Ext.create( 'Ext.form.Panel', {
						width : '300px',
						maxHeight : '300px',
						layout : 'fit',
						border : false,
						items : [ {
							xtype : 'fieldset',
							border : false,
							defaultType : 'displayfield',
							defaults : {
								anchor : '100%',
								labelSeparator : '',
								labelWidth : 150
							},
							items : [ {
								fieldLabel : 'Time to Complete',
								name : 'pass',
								value : time_to_complete
							}, {
								fieldLabel : 'Product',
								name : 'pass',
								value : '<span class="valuecolor">' + obj.data.product + '</span>'
							}, ]
						} ]
					} );
					win = Ext.create( 'Ext.window.Window', {
						title : 'Call Touch Info',
						// maxHeight : 350,
						// width : 370,
						cls : 'deleteprospect-wrapper popup-250',
						layout : 'fit',

						constrain : true,
						modal : true,
						alwaysOnTop : true,
						closeToolText : 'Close',
						border : false,
						bodyStyle : {
							padding : '10px 10px 10px 10px',
						},
						items : [ newdialog ],
						buttons : [ {
							xtype : 'clbuttonokaymedium',
							text : '<i class="fas fa-times" aria-hidden="true"></i> Close',
							handler : function() {

								win.hide();
							}
						} ],
						listeners : {
							beforeclose : function( window, eOpts ) {

								is_open = false;
							},
							beforehide : function( window, eopts ) {

								is_open = false;
							},
							beforeremove : function( window, eopts ) {

								is_open = false;
							},
							beforedestroy : function( window, eopts ) {

								is_open = false;
							},
						},
					} ).show();

				break;
				case 'text':
					var newdialogText = Ext.create( 'Ext.form.Panel', {
						width : '300px',
						maxHeight : '300px',
						layout : 'fit',
						border : false,
						items : [ {
							xtype : 'fieldset',
							border : false,
							defaultType : 'displayfield',
							defaults : {
								anchor : '100%',
								labelSeparator : '',
								labelWidth : 150
							},
							items : [ {
								fieldLabel : 'Contact Name',
								name : 'contact_anme',
								value : '<span class="valuecolor">' + Ext.util.Format.htmlEncode( contactName ) + '</span>'
							}, {
								fieldLabel : 'Cadence',
								name : 'cadence',
								value : '<span class="valuecolor">' + Ext.util.Format.htmlEncode( cadenceName ) + '</span>'
							}, {
								fieldLabel : 'Touch',
								name : 'touch',
								value : '<span class="valuecolor">' + touch + '</span>'
							}, {
								fieldLabel : 'Time to Complete',
								name : 'pass',
								value : time_to_complete
							} /*, { fieldLabel : 'Product', name : 'pass', value : '<span class="valuecolor">' + obj.data.product + '</span>' },*/
							]
						} ]
					} );
					win = Ext.create( 'Ext.window.Window', {
						title : 'ZipWhip Touch Info',
						// maxHeight : 350,
						// width : 370,
						cls : 'deleteprospect-wrapper popup-250',
						layout : 'fit',

						constrain : true,
						modal : true,
						alwaysOnTop : true,
						closeToolText : 'Close',
						border : false,
						bodyStyle : {
							padding : '10px 10px 10px 10px',
						},
						items : [ newdialogText ],
						buttons : [ {
							xtype : 'clbuttonokaymedium',
							text : '<i class="fas fa-times" aria-hidden="true"></i> Close',
							handler : function() {

								win.hide();
							}
						} ],
						listeners : {
							beforeclose : function( window, eOpts ) {

								is_open = false;
							},
							beforehide : function( window, eopts ) {

								is_open = false;
							},
							beforeremove : function( window, eopts ) {

								is_open = false;
							},
							beforedestroy : function( window, eopts ) {

								is_open = false;
							},
						},
					} ).show();

				break;
				case 'email':
					var newdialog1 = Ext.create( 'Ext.form.Panel', {
						width : '300px',
						// height : '300px',
						layout : 'fit',
						border : false,
						items : [ {
							xtype : 'fieldset',
							border : false,
							defaultType : 'displayfield',
							defaults : {
								anchor : '100%',
								labelSeparator : '',
								labelWidth : 150
							},
							items : [ {
								fieldLabel : 'Contact Name',
								name : 'contact_anme',
								value : '<span class="valuecolor">' + Ext.util.Format.htmlEncode( contactName ) + '</span>'
							}, {
								fieldLabel : 'Cadence',
								name : 'cadence',
								value : '<span class="valuecolor">' + Ext.util.Format.htmlEncode( cadenceName ) + '</span>'
							}, {
								fieldLabel : 'Touch',
								name : 'touch',
								value : '<span class="valuecolor">' + touch + '</span>'
							}, {
								fieldLabel : 'Email Template',
								name : 'user',
								value : '<span class="valuecolor">' + Ext.util.Format.htmlEncode( obj.data.email_template_name ) + '</span>'
							}, {
								fieldLabel : 'Time to Complete',
								name : 'time_to',
								value : time_to_complete
							} ]
						} ]
					} );
					win = Ext.create( 'Ext.window.Window', {
						title : 'Email Touch Info',
						// width : 370,
						cls : 'deleteprospect-wrapper popup-250',
						layout : 'fit',
						constrain : true,
						modal : true,
						alwaysOnTop : true,
						closeToolText : 'Close',

						border : false,
						bodyStyle : {
							padding : '10px 10px 10px 10px',
						},
						items : [ newdialog1 ],
						buttons : [ {
							xtype : 'clbuttonokaymedium',
							text : '<i class="fas fa-times" aria-hidden="true"></i> Close',
							handler : function() {

								win.hide();
							}
						} ],
						listeners : {
							beforeclose : function( window, eOpts ) {

								is_open = false;
							},
							beforehide : function( window, eopts ) {

								is_open = false;
							},
							beforeremove : function( window, eopts ) {

								is_open = false;
							},
							beforedestroy : function( window, eopts ) {

								is_open = false;
							},
						},
					} ).show();

				break;
				case 'others':
					var source = '';
					switch ( obj.data.source_id ) {
					case '1':
						source = 'Other-Google';
					break;
					case '2':
						source = 'Other-Facebook';
					break;
					case '3':
						source = 'Other-Twitter';
					break;
					case '4':
						source = 'Other-Tumblr';
					break;
					case '5':
						source = 'Other-Instagram';
					break;
					case '6':
						source = 'Other-Zoominfo';
					break;
					case '7':
						source = 'Other-Custom';
					break;
					default:
						source = '';

					}
					var newdialog2 = Ext.create( 'Ext.form.Panel', {
						width : '300px',
						// height : '300px',
						layout : 'fit',
						border : false,
						items : [ {
							xtype : 'fieldset',
							border : false,
							defaultType : 'displayfield',
							defaults : {
								anchor : '100%',
								labelSeparator : '',
								labelWidth : 150
							},
							items : [ {
								fieldLabel : 'Contact Name',
								name : 'contact_anme',
								value : '<span class="valuecolor">' + Ext.util.Format.htmlEncode( contactName ) + '</span>'
							}, {
								fieldLabel : 'Cadence',
								name : 'cadence',
								value : '<span class="valuecolor">' + Ext.util.Format.htmlEncode( cadenceName ) + '</span>'
							}, {
								fieldLabel : 'Touch',
								name : 'touch',
								value : '<span class="valuecolor">' + touch + '</span>'
							}, {
								fieldLabel : OtherTouchName[ 'Social' ] + ' Touch',// Social
								name : 'source_id',
								value : '<span class="valuecolor">' + source + '</span>'
							}, {
								fieldLabel : 'Time to Complete',
								name : 'time_to',
								value : time_to_complete
							}, ]
						} ]
					} );
					win = Ext.create( 'Ext.window.Window', {
						title : OtherTouchName[ 'Social' ] + ' Touch Info',
						// height : 350,
						// width : 370,
						cls : 'deleteprospect-wrapper popup-250',
						constrain : true,
						modal : true,
						alwaysOnTop : true,
						closeToolText : 'Close',
						layout : 'fit',
						border : false,
						bodyStyle : {
							padding : '10px 10px 10px 10px',
						},
						items : [ newdialog2 ],
						buttons : [ {
							text : '<i class="fas fa-times" aria-hidden="true"></i> Close',
							xtype : 'clbuttonokaymedium',
							handler : function() {

								win.hide();
							}
						} ],
						listeners : {
							beforeclose : function( window, eOpts ) {

								is_open = false;
							},
							beforehide : function( window, eopts ) {

								is_open = false;
							},
							beforeremove : function( window, eopts ) {

								is_open = false;
							},
							beforedestroy : function( window, eopts ) {

								is_open = false;
							},
						},
					} ).show();

				break;
				case 'linkedin':

					var linkedinDialog = Ext.create( 'Ext.form.Panel', {
						width : '300px',
						layout : 'fit',
						border : false,
						items : [ {
							xtype : 'fieldset',
							border : false,
							defaultType : 'displayfield',
							defaults : {
								anchor : '100%',
								labelSeparator : '',
								labelWidth : 150
							},
							items : [ {
								fieldLabel : 'Contact Name',
								name : 'contact_anme',
								value : '<span class="valuecolor">' + Ext.util.Format.htmlEncode( contactName ) + '</span>'
							}, {
								fieldLabel : 'Cadence',
								name : 'cadence',
								value : '<span class="valuecolor">' + Ext.util.Format.htmlEncode( cadenceName ) + '</span>'
							}, {
								fieldLabel : 'Touch',
								name : 'touch',
								value : '<span class="valuecolor">' + touch + '</span>'
							}, {
								fieldLabel : 'Time to Complete',
								name : 'time_to',
								value : time_to_complete
							}, ]
						} ]
					} );
					win = Ext.create( 'Ext.window.Window', {
						title : 'Linkedin Touch Info',
						cls : 'deleteprospect-wrapper popup-250',
						constrain : true,
						modal : true,
						alwaysOnTop : true,
						closeToolText : 'Close',
						layout : 'fit',
						border : false,
						bodyStyle : {
							padding : '10px 10px 10px 10px',
						},
						items : [ linkedinDialog ],
						buttons : [ {
							text : '<i class="fas fa-times" aria-hidden="true"></i> Close',
							xtype : 'clbuttonokaymedium',
							handler : function() {

								win.hide();
							}
						} ],
						listeners : {
							beforeclose : function( window, eOpts ) {

								is_open = false;
							},
							beforehide : function( window, eopts ) {

								is_open = false;
							},
							beforeremove : function( window, eopts ) {

								is_open = false;
							},
							beforedestroy : function( window, eopts ) {

								is_open = false;
							},
						},
					} ).show();

				break;
				case 'wait':

					var newdialog3 = Ext.create( 'Ext.form.Panel', {
						width : '340px',
						// height : '300px',
						layout : 'fit',
						border : false,
						items : [ {
							xtype : 'fieldset',
							border : false,
							defaultType : 'displayfield',
							defaults : {
								anchor : '100%',
								labelSeparator : '',
								labelWidth : 150
							},
							items : [ {
								fieldLabel : 'Wait Period (Days)',
								name : 'time_da',
								value : '<b>' + obj.data.wait_period_days + '</b>'
							}, {
								fieldLabel : 'Wait Period (Hours)',
								name : 'time_ho',
								value : '<b>' + obj.data.wait_period_hours + '</b>'
							}, {
								fieldLabel : 'Wait Period (Minutes)',
								name : 'time_mi',
								value : '<b>' + obj.data.wait_period_minutes + '</b>'
							}, ]
						} ]
					} );
					win = Ext.create( 'Ext.window.Window', {
						title : 'Wait Touch Info',
						cls : 'deleteprospect-wrapper popup-250',
						constrain : true,
						modal : true,
						alwaysOnTop : true,
						closeToolText : 'Close',
						border : false,
						bodyStyle : {
							padding : '10px 10px 10px 10px',
						},
						layout : 'fit',
						items : [ newdialog3 ],
						buttons : [ {
							xtype : 'clbuttonokaymedium',
							text : '<i class="fas fa-times" aria-hidden="true"></i> Close',
							handler : function() {

								win.hide();
							}
						} ],
						listeners : {
							beforeclose : function( window, eOpts ) {

								is_open = false;
							},
							beforehide : function( window, eopts ) {

								is_open = false;
							},
							beforeremove : function( window, eopts ) {

								is_open = false;
							},
							beforedestroy : function( window, eopts ) {

								is_open = false;
							},
						}
					} ).show();
				break;
				}
			}
		} );

	} else if ( combo.getValue() == "One-off Email" ) {

		var record = grid.getStore().getAt( selectedRowIndex );

		if ( 'email' != $.trim( record.get( 'touch_type' ) ).toLowerCase() ) {
			showAlert( ' Selected Prospect(s) not belong to Email Touch' );
			is_open = false;
			return;
		}

		var form = Ext.getCmp( 'filterform' ).getForm();
		var campaignId = form.findField( "campaign_id" ).getValue();
		var sortByField = grid.getStore().sorters.getAt( 0 ).getProperty();
		var sortByDirection = grid.getStore().sorters.getAt( 0 ).getDirection();

		var record = grid.getStore().getAt( selectedRowIndex );
		var memberId = record.get( 'multi_touch_member_id' );
		// showInterActiveEmail( campaignId, sortByField, sortByDirection, 0, memberId, selectedRowIndex );
		/*$( '#sendoneoffemaildone' ).text( '' );
		$( '<i>' ).addClass( 'fas' ).addClass( 'fa-check' ).attr( 'aria-hidden', 'true' ).appendTo( $( '#sendoneoffemaildone' ) );
		$( '#sendoneoffemaildone' ).append( ' Send' );
		loadEmailTemplates( memberId, 'sendEmailTodo', campaignId, sortByField, sortByDirection, 0, selectedRowIndex, 'so_email' );*/

	} else if ( combo.getValue() == "Complete Social Touch" ) {
		var record = grid.getStore().getAt( selectedRowIndex );

		if ( 'social' != $.trim( record.get( 'touch_type' ) ).toLowerCase() && 'others' != $.trim( record.get( 'touch_type' ) ).toLowerCase() && ( !$.trim( record.get( 'touch_type' ) ).toLowerCase().startsWith( 'linkedin' ) ) ) {
			showAlert( 'Selected Prospect(s) does not belong to ' + OtherTouchName[ 'Social' ] + ' or LinkedIn Touch' );
			is_open = false;
			return;
		}

		if ( $.trim( record.get( 'touch_type' ) ).toLowerCase().startsWith( 'linkedin' ) ) {

			linkedInTouchWindow( record );

		} else {
			var member_id = record.get( 'multi_touch_member_id' );
			var multi_touch_id = record.get( 'multi_touch_id' );
			var touch_type = record.get( 'mts_touch_type' );
			var current_touch_id = record.get( 'current_touch_id' );
			var source_id = record.get( 'source_id' ) ? record.get( 'source_id' ) : '0';
			var source = '';
			switch ( source_id ) {
			case '1':
				source = 'Other-Google';
			break;
			case '2':
				source = 'Other-Facebook';
			break;
			case '3':
				source = 'Other-Twitter';
			break;
			case '4':
				source = 'Other-Tumblr';
			break;
			case '5':
				source = 'Other-Instagram';
			break;
			case '6':
				source = 'Other-Zoominfo';
			break;
			case '7':
				source = 'Other-Custom';
			break;
			default:
				source = 'N/A';
			}
			var count = 0;
			var other_touch_window = Ext.create( 'Ext.window.Window', {
				id : 'Other_touch_window',
				title : 'Complete Touch - ' + OtherTouchName[ 'Social' ] + '',// Social
				cls : 'completetouch-other',
				height : 500,
				width : 600,
				modal : true,
				listeners : {
					beforehide : function( ev, opt ) {

						is_open = false;
					},
					beforeclose : function( ev, opt ) {

						is_open = false;
					},
				},
				alwaysOnTop : true,
				constrain : true,
				items : [ {
					xtype : 'displayfield',
					value : record.get( 'account_name' ),
					width : '500px',
					height : '20px',
					padding : '20px',
					labelSeparator : '',
					fieldLabel : '<b>Account Name</b>',

				}, {
					xtype : 'displayfield',
					value : Ext.util.Format.htmlEncode( record.get( 'contact_name' ) ),
					width : '500px',
					height : '20px',
					padding : '20px',
					labelSeparator : '',
					fieldLabel : '<b>Contact Name</b>',
				}, {
					xtype : 'displayfield',
					value : Ext.util.Format.htmlEncode( record.get( 'multi_touch_name' ) ),
					width : '500px',
					height : '20px',
					padding : '20px',
					labelSeparator : '',
					fieldLabel : '<b>Cadence</b>',
				}, {
					xtype : 'displayfield',
					width : '500px',
					height : '20px',
					padding : '20px',
					labelSeparator : '',
					value : 'Touch ' + record.get( 'current_touch_id' ) + ' (' + OtherTouchName[ record.get( 'touch_type' ) ] + ')',
					fieldLabel : '<b>Touch</b>',
				}, {
					xtype : 'displayfield',
					width : '500px',
					height : '20px',
					padding : '20px',
					labelSeparator : '',
					value : $.trim( record.get( 'touch_description' ) ) == '' ? '-' : '<div style="max-height: 100px;overflow: auto;">' + record.get( 'touch_description' ) + '</div>',
					fieldLabel : '<b>Touch Description</b>',
				}, {
					xtype : 'displayfield',
					width : '500px',
					height : '20px',
					padding : '20px',
					labelSeparator : '',
					value : Ext.util.Format.htmlEncode( source ),
					fieldLabel : '<b>' + OtherTouchName[ 'Social' ] + ' Network</b>',// Social
				}, {
					xtype : 'textarea',
					name : 'outcome_comments',
					maxLength : 1000,
					enforceMaxLength : true,
					id : 'outcome_comments',
					width : '555px',
					fieldLabel : '<b>Comments</b>',
					labelSeparator : '',
					height : '150px',
					emptyText : 'Type Comments here',
					padding : '20px 30px 20px 20px'
				} ],
				buttons : [ '->', {
					xtype : 'clbuttonokaymedium',
					id : 'other_touch_save',
					cls : 'btn btn-success',
					text : '<i class="fas fa-check" aria-hidden="true"></i> Complete Touch',
					handler : function() {

						var outcome_comments = Ext.getCmp( 'outcome_comments' ).getValue();

						if ( count == 0 ) {
							count++;
							outcome_comments = outcome_comments.trim();
							if ( outcome_comments != '' && outcome_comments.length > 0 ) {
								other_touch_window.mask( 'wait' );
								Ext.getCmp( 'other_touch_save' ).disable();
								Ext.Ajax.request( {
									url : 'completeotherstouch.action',
									headers : {
										'X-CSRF' : csrfToken + ''
									},
									params : {
										member_id : member_id,
										multi_touch_id : multi_touch_id,
										current_touch_id : current_touch_id,
										touch_type : touch_type,
										outcome : 'Social Touch-' + source,
										outcome_comments : outcome_comments
									},
									success : function( response, data ) {

										other_touch_window.unmask();
										count = 0;
										var obj = Ext.JSON.decode( response.responseText );
										messageBox( obj.message, successMsg );
										grid.getStore().reload( {
											callback : function( records, operation, success ) {

											}
										} );
										other_touch_window.close();
										is_open = false;
									},
									failure : function() {

										Ext.getCmp( "Other_touch_window" ).unmask();
										messageBox( 'Invalid input data.', errorMsg );
										other_touch_window.unmask();
										other_touch_window.close();
										is_open = false;
									}
								} );
							} else {
								count = 0;
								popup.msg( {
									type : 'alert',
									title : 'Alert',
									msgTxt : '<i class="fas fa-exclamation-circle yollowcolor" aria-hidden="true"></i> Please enter valid comments',
									rightBtnTxt : '<i class="fas fa-check" aria-hidden="true"></i> OK',
									constrain : true,
									modal : true,
									alwaysOnTop : true,
									listeners : {
										beforeclose : function( window, eOpts ) {

											is_open = false;
										},
										beforehide : function( window, eopts ) {

											is_open = false;
										},
										beforeremove : function( window, eopts ) {

											is_open = false;
										},
										beforedestroy : function( window, eopts ) {

											is_open = false;
										},
										focusleave : function( cmp ) {

											cmp.close();
										}
									},
									rightBtnHandler : function() {

										other_touch_window.unmask();
									}
								} );
							}
						}
					}
				} ]
			} ).show();
		}
	} else if ( combo.getValue() == "Complete ZipWhip Touch" ) {
		var record = grid.getStore().getAt( selectedRowIndex );

		if ( 'TEXT' != $.trim( record.get( 'touch_type' ) ) ) {
			showAlert( '  Selected Prospect(s) do not belong to Text Touch.' );
			is_open = false;
			return;
		}

		is_open = false;
		if ( $.trim( record.get( 'touch_type' ) ).toLowerCase().startsWith( 'text' ) ) {
			zipwhipTouchWindow( record, record.get( 'phone' ) );
			is_open = false;
		}

	} else {
		showAlert( ' Invalid action.' );
		is_open = false;
		return;
	}
}

function viewTodoProspectsDetails( rowIndex, dialingNo ) {

	viewMemberActivity( storetodo, rowIndex, null, 'to_todo', dialingNo );
}

/**
 * @author Krishnakumar (GB864)
 * @purpose/@reason : previously enabling the custom-scroll bar functionality will work only on afterrender listener of GRID will work only after loading the page and will not work when ever we refresh the grid. And if we have this function in load listener in STORE it will not work on first time(when the page is getting loaded) if network is slow since we have set time out with 2 seconds. And so it has been handled with the help of this function
 * @returns : none
 */
function enableCustomScrollBar( isActive ) {

	setTimeout( function() {

		if ( $( ".x-panel-body.x-grid-with-row-lines" ).length > 0 ) {
			$( '.x-panel-body.x-grid-with-row-lines' ).addClass( 'tablescroll' );
			var windowheight = $( window ).height();
			var prospets = $( '.x-panel-body.x-grid-with-row-lines' ).offset().top;
			var prospettotal = windowheight - prospets - 95;
			$( '.x-panel-body.x-grid-with-row-lines' ).css( 'max-height', prospettotal );
		}
		$( ".x-panel-body.x-grid-with-row-lines.tablescroll" ).mCustomScrollbar( {
			scrollButtons : {
				enable : true
			},
			advanced : {
				autoScrollOnFocus : false,
				updateOnContentResize : true,
				updateOnBrowserResize : true
			},
			theme : "dark-thick"
		} );
		$( ".x-panel-body.x-grid-with-row-lines.tablescroll" ).mCustomScrollbar( "update" );
		activateScrollBar = isActive;
	}, 200 );
}

function triggerTextCompleteAction( rowIndex, phoneNumber ) {

	selectedRowIndex = rowIndex;
	var grid = Ext.getCmp( 'to_do_list_grid' );
	store = grid.getStore();
	zipwhipTouchWindow( store.data.items[ rowIndex ], phoneNumber );

}

Ext.override( Ext.grid.column.Column, {
	listeners : {
		resize : function() {

			if ( activateScrollBar )
				enableCustomScrollBar( true );
		}
	}
} );

function getUserTodoCadences() {

	todoCadenceSearchStore.load( {
		params : {
			rt : 'get_todo_cadences',
			talker_id : Ext.getCmp( 'talker_id_combo' ).getValue()
		}
	} );
	// common_search_gridtodo();
}
