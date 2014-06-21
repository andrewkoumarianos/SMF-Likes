/**
 * @package manifest file for Like Posts
 * @version 1.4
 * @author Joker (http://www.simplemachines.org/community/index.php?action=profile;u=226111)
 * @copyright Copyright (c) 2012, Siddhartha Gupta
 * @license http://www.mozilla.org/MPL/MPL-1.1.html
 */

/*
 * Version: MPL 1.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Initial Developer of the Original Code is
 *  Joker (http://www.simplemachines.org/community/index.php?action=profile;u=226111)
 * Portions created by the Initial Developer are Copyright (C) 2012
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 */

(function() {
	function likePostStats() {}

	likePostStats.prototype = function() {
		var currentUrlFrag = null,
			allowedUrls = {},
			tabsVisitedCurrentSession = {},

			init = function() {
				allowedUrls = {
					'messagestats': {
						'uiFunc': showMessageStats
					},
					'topicstats': {
						'uiFunc': showTopicStats
					},
					'boardstats': {
						'uiFunc': showBoardStats
					},
					'userstats': {
						'uiFunc': showUserStats
					}
				};
				checkUrl();
			},

			showSpinnerOverlay = function() {
				likePostStats.jQRef('#like_post_stats_overlay').show();
				likePostStats.jQRef('#lp_preloader').show();
			},

			hideSpinnerOverlay = function() {
				likePostStats.jQRef('#lp_preloader').hide();
				likePostStats.jQRef('#like_post_stats_overlay').hide();
			},

			highlightActiveTab = function() {
				likePostStats.jQRef('.like_post_stats_menu a').removeClass('active');
				likePostStats.jQRef('.like_post_stats_menu #' + currentUrlFrag).addClass('active');
			},

			checkUrl = function(url) {
				showSpinnerOverlay();

				likePostStats.jQRef(".message_title").off('mouseenter mousemove mouseout');
				if (typeof(url) === 'undefined' || url === '') {
					var currentHref = window.location.href.split('#');
					currentUrlFrag = (typeof(currentHref[1]) !== 'undefined') ? currentHref[1] : 'messagestats';
				} else {
					currentUrlFrag = url;
				}

				if (allowedUrls.hasOwnProperty(currentUrlFrag) === false) {
					currentUrlFrag = 'messagestats';
				}

				if (tabsVisitedCurrentSession.hasOwnProperty(currentUrlFrag) === false) {
					getDataFromServer({
						'url': currentUrlFrag,
						'uiFunc': allowedUrls[currentUrlFrag].uiFunc
					});
				} else {
					allowedUrls[currentUrlFrag].uiFunc();
				}
			},

			// Data/ajax functions from here
			getDataFromServer = function(params) {
				highlightActiveTab();

				likePostStats.jQRef.ajax({
					type: "POST",
					url: smf_scripturl + '?action=likepostsstats',
					context: document.body,
					dataType: "json",
					data: {
						'area': 'ajaxdata',
						'sa': params.url
					},
					success: function(resp) {
						if (resp.response) {
							tabsVisitedCurrentSession[currentUrlFrag] = resp.data;
							params.uiFunc();
						} else {
							//NOTE: Make an error callback over here
						}
					}
				});
			},

			showMessageStats = function() {
				// console.log(tabsVisitedCurrentSession[currentUrlFrag]);
				var data = tabsVisitedCurrentSession[currentUrlFrag],
					htmlContent = '',
					messageUrl = smf_scripturl +'?topic=' + data.id_topic + '.msg' + data.id_msg;

				console.log(JSON.stringify(data));
				// http://localhost/forum/smf2/index.php?topic=90.msg90#msg90

				likePostStats.jQRef('#like_post_current_tab').text('Most Liked Message');

				htmlContent += '<a class="message_title" href="'+ messageUrl +'"> Topic: ' + data.subject + '</a>'
							+ '<span class="display_none">' + data.body + '</span>';

				htmlContent += '<div class="poster_avatar" style="background-image: url('+ data.member_received.avatar +')"></div>'
							+ '<div class="poster_data">'
							+ '<a class="poster_details" href="'+ data.member_received.href +'" style="font-size: 20px;">'+ data.member_received.name +'</a>'
							+ '<div class="poster_details">Total posts: '+ data.member_received.total_posts +'</div>'
							+ '</div>';

				htmlContent += '<div class="users_liked">'
				htmlContent += '<p class="title">'+ data.member_liked_data.length +' users who liked this post</p>';
				for(var i = 0, len = data.member_liked_data.length; i < len; i++) {
					htmlContent += '<a class="poster_details" href="'+ data.member_liked_data[i].href +'"><div class="poster_avatar" style="background-image: url('+ data.member_liked_data[i].avatar +')" title="'+ data.member_liked_data[i].real_name +'"></div></a>';
				}
				htmlContent += '</div>';

				likePostStats.jQRef('.like_post_message_data').append(htmlContent).show();
				likePostStats.jQRef(".message_title").on('mouseenter', function(e) {
					e.preventDefault();
					var currText = likePostStats.jQRef(this).next().html();

					likePostStats.jQRef("<div class=\'subject_details\'></div>").html(currText).appendTo("body").fadeIn("slow");
				}).on('mouseout', function() {
					likePostStats.jQRef(".subject_details").fadeOut("slow");
					likePostStats.jQRef(".subject_details").remove();
				}).on('mousemove', function(e) {
					var mousex = e.pageX + 20,
						mousey = e.pageY + 10,
						width = likePostStats.jQRef("#wrapper").width() - mousex - 50;

					likePostStats.jQRef(".subject_details").css({
						top: mousey,
						left: mousex,
						width: width + "px"
					});
				});
				hideSpinnerOverlay();
			},

			showTopicStats = function(response) {
				console.log(response);
			},

			showBoardStats = function(response) {
				console.log(response);
			},

			showUserStats = function(response) {
				console.log(response);
			};

		return {
			init: init,
			checkUrl: checkUrl
		};
	}();

	this.likePostStats = likePostStats;
	if (typeof(likePostStats.jQRef) !== 'function' && typeof(likePostStats.jQRef) === 'undefined') {
		likePostStats.jQRef = jQuery.noConflict();
	}

	likePostStats.jQRef(document).ready(function() {
		likePostStats.prototype.init();
	});

	likePostStats.jQRef('.like_post_stats_menu a').on('click', function(e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		likePostStats.prototype.checkUrl(this.id);
	});
}());
