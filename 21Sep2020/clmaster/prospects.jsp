<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>

<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">
<title>ConnectLeader Master</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="shortcut icon" href="<c:url value="/images/favicon.ico" />" />
<link rel="stylesheet" type="text/css" href="<c:url value="/css/bootstrap.min.v4.1.3.css" />" />
<link rel="stylesheet" type="text/css" href="<c:url value="/css/font-awesome.min.css" />" />
<link rel="stylesheet" type="text/css" href="<c:url value="/css/jquery-ui.min.css" />" />
<link rel="stylesheet" type="text/css" href="<c:url value="/css/style-v2.css" />" />
<link rel="stylesheet" type="text/css" href="<c:url value="/css/viewcadence.css" />" />
<script src="<c:url value="/scripts/jquery-1.10.2.min.js" />"></script>
<script src="<c:url value="/js/bootstrap.bundle.min.v4.1.3.js" />"></script>
<script src="<c:url value="/js/all.min.js" />"></script>
<script src="<c:url value="/scripts/jquery-ui.min.js" />"></script>
<script src="<c:url value="/js/common.js" />"></script>
<script src="<c:url value="/scripts/prospects.js" />"></script>

</head>
<body>

	<div class="wrapper">
		<div class="main-header">
			<div class="container-fluid">
				<div class="logo">
					<a href=<c:url value="/home.action"/>> <img src="<c:url value="/images/logo.gif" />" border="0" /></a>
				</div>
				<div class="clheader">
					<h1>Prospects</h1>
				</div>
				<div class="clheaderlinks">
					<span> Hi <c:out value="${sessionScope.user.displayName}" /> (<a href="<c:url value="/logoff.action"/>" style="font-size: -1;">Log Off</a>)
					</span>
				</div>
			</div>
		</div>
		<div class="p-3 graybg text-center" style="border-radius: 0px; margin-top: 8rem;">

			<span style="font-size: 20px; float: left;" id="all_prospects">All Prospects - Total</span>
			<div style=" float: right;position: relative;">
				<a id="cadence_url"> <i class="fas fa-angle-double-left"></i> &nbsp;Return to Cadence(s) Screen
				</a>
			</div>
			<div style="float: right; margin-bottom: 5px;margin-right:4rem;">
				<input id="my_input" style="width: 217px;" type="text" placeholder="ContactName Or Email"></input>
				<button type="submit" id="search_btn">
					<i class="fas fa-search"></i>
				</button>
			</div>
			<div class="table-responsive">
				<div style="overflow: auto; max-height: 400px; min-height: 400px;">
					<table class="table  table-bordered mb-0 table-hover" style="margin-bottom: 0px;" id="view_prospects_table">
						<thead>
							<tr>
								<th scope="col">Account Name</th>
								<th scope="col">Contact Name</th>
								<th scope="col">Title</th>
								<th scope="col">Current Touch</th>
								<th scope="col">Phone#</th>
								<th scope="col">Email</th>
								<th scope="col">Date/Time</th>
								<th scope="col">Last OutCome</th>
							</tr>
						</thead>
						<tbody id="prospect_tbody">

						</tbody>
					</table>

				</div>
				<nav class="navigation-bar" style="display: none;">

					<a class="pages-link" id="backward"><i class="fas fa-backward"></i></a> <a class="pages-link" id="step_backward"><i class="fas fa-step-backward"></i></a>
					<div id="page_box" style="padding: 0.27rem">
						<span>|</span> <label for="pageNumber" style="margin-right: 0.5rem">Page</label><input type="text" id="page_number" size="4" value="1"> <span>|</span> <span>of</span> <span id="total_pages"></span>
					</div>
					<a class="pages-link" id="step_forward"><i class="fas fa-step-forward"></i></a> <a class="pages-link" id="forward"><i class="fas fa-forward"></i></a>
				<strong style="padding-left: 41rem;" id="displaying_count"></strong>
				</nav>
			</div>
		</div>
		

		<div class="content-fluid" style="margin-top: 100px;">

			<div class="modal" id="myModal">
				<div class="modal-dialog" style="margin: 0px; max-width: 100%;">
					<div class="modal-content">

						<!-- Modal Header -->
						<div class="modal-header">
							<h2 class="modal-title">
								view&nbsp;<span id="contact_nameandaccount_name"></span>
							</h2>
							<button type="button" class="close" data-dismiss="modal" id="model_close">&times;</button>
						</div>

						<!-- Modal body -->
						<div class="modal-body">
							<div class="row">
								<div class="col-3">
									<div style="max-height: 83vh; overflow-y: auto;">
										<div style="display: grid; background: antiquewhite; padding-inline-start: 15px; border-radius: 15px; margin-bottom: 15px;">
											<div style="font-size: 25px; margin-bottom: 15px; margin-top: 12px;">
												<i class="fas fa-user" style="color: black;cursor: none;"></i> &nbsp;General Info
											</div>
											<div style="font-size: 15px; margin-bottom: 15px; margin-top: 12px;" id="contact_name"></div>
											<p id="account_name"></p>
											<p>
												Last Sync date/time: <span id="last_sync_datetime"></span>
											</p>
											<p>
												Prospect id: <span id="member_id"></span>
											</p>
											<p>
												Last Modified date: <span id="updated_date"></span>
											</p>
										</div>
										<div id="contact_info" style="display: grid; padding-inline-start: 15px; border-radius: 10px; margin-bottom: 15px; background: cornsilk;">
											<div style="font-size: 25px; margin-bottom: 15px; margin-top: 12px;">
												<img src="<c:url value="/images/contact-info.png" />"></img>&nbsp;Contact Info
											</div>
											<p>
												Email: <span id="email_id"></span>
											</p>

										</div>

										<div style="display: grid; padding-inline-start: 15px; border-radius: 15px; margin-bottom: 15px; background: aliceblue;">
											<div style="font-size: 25px; margin-bottom: 15px; margin-top: 12px;">
												<img src="<c:url value="/images/contact-info.png" />"></img>&nbsp; Stats
											</div>
											<ul style="display: flex; padding: 0px;">
												<li style="display: grid; padding: 0px 40px;"><span style="text-align: center;" id="email_count"></span><img src="<c:url value="/images/emailoverview-blue1.png" />" style="max-width: 220%"></li>
												<li style="display: grid; padding: 0 40px;"><span style="text-align: center;" id="call_count"></span><img src="<c:url value="/images/phone-call-green.png" />" style="max-width: 220%"></li>
												<li style="display: grid; padding: 0 40px;"><span style="text-align: center;" id="other_count"></span><img src="<c:url value="/images/other.png" />" style="max-width: 220%"></li>
											</ul>
										</div>
									</div>
								</div>
								<div class="col-4">
									<div class="membercenter-panel">
										<div class="prospectcustom-field">
											<div class="prospectcustom-contecn prospectcustom-form">
												<h2 style="padding: 10px 10px 10px;">Prospect Custom Fields</h2>
												<ul style="padding: 0; margin: 0;" id="ul_id">

												</ul>
											</div>
										</div>
									</div>
								</div>
								<div class="col-5">
									<div>
										<!-- height: 83vh; overflow: auto; -->
										<div class="member-block">
											<div class="memberwrapper-sup">
												<div class="table-responsive">
													<table class="table table-bordered">
														<tbody>
															<tr>
																<td>
																	<div class="blue">
																		<p>Current Cadence</p>
																		<span id="campaign_name"></span>
																	</div>
																</td>
																<td>
																	<div class="reed">
																		<p>Current touch</p>
																		<span id="current_touch_type"></span>
																	</div>
																</td>
																<td>
																	<div class="yellow">
																		<p>Last Touched on</p>
																		<span id="last_touch_date_time_1"></span>
																	</div>
																</td>
																<td>
																	<div class="green">
																		<p>Next Touch</p>
																		<span id="next_touch"></span>
																	</div>
																</td>
															</tr>
														</tbody>
													</table>
												</div>
											</div>
											<div>
												<aside class="filter-wraper" style="width: 35%; float: right; padding-top: 15px;">
													<aside class="form-group" style="display: flex;">
														<select name="callResult" class="form-control" id="filterAction">
															<option value="callemail">Calls & Emails</option>
															<option value="all">All</option>
															<option value="call">Calls</option>
															<option value="email">Emails</option>
															<option value="text">Texts</option>
														</select>
														<button type="button" class="btn btn-primary borderr2 ml-1" id="filterActivity">
															<i class="fas fa-search" style="margin-top: -1px" aria-hidden="true"></i>
														</button>

													</aside>
												</aside>
											</div>

											<aside class="memberlist-block">
												<div class="member-list" style="padding-top: 40px;">
													<ul id="activityList" class="stats-list" style="height: 66vh; overflow: auto;"></ul>
													<a href="javascript:;" class="show-more" style="font-size: 27px; color: black; text-align: center; position: relative; left: 361px; display: none;"><i class="fas fa-chevron-circle-down"></i></a>
												</div>
											</aside>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div id="loading" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: 100%; background: rgba(0, 0, 0, 0.75) no-repeat center center; z-index: 10000;">
				<span><i class="fas fa-spinner fa-spin" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 50px; display: table; color: grey;"></i></span>
			</div>

		<div class="content-block">

			<div class="main-footer">
				<spring:eval expression="@environment.getProperty('copyright.label')" />
			</div>
		</div>
	</div>
</body>
</html>
