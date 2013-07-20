/**
* @package manifest file for Like Posts
* @version 1.0
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

var likePosts = function() {
    this.timeoutTimer = null
}

likePosts.prototype.likeUnlikePosts = function(mId, tId, bId) {
    // Lets try JS validations
    msgId = (mId != undefined) ? parseInt(mId) : 0;
    topicId = (tId != undefined) ? parseInt(tId) : 0;
    boardId = (bId != undefined) ? parseInt(bId) : 0;
    var rating = ($('#like_' + msgId).text().toLowerCase() == 'like') ? 1 : 0;

    if (isNaN(msgId) || isNaN(topicId) || isNaN(boardId)) {
        return false;
    }

    $.ajax({
        type: "POST",
        url: smf_scripturl + '?action=likeposts;sa=like_post',
        context: document.body,
        dataType : "json",
        data: {
            msg: msgId,
            topic: topicId,
            board: boardId,
            rating: rating,
        },

        success: function(resp) {
            if (resp.response) {
                var params = {
                    msgId: msgId,
                    count: (resp.count !== undefined) ? resp.count : '',
                    newText: resp.newText,
                    likeText: resp.likeText,
                    image_path: resp.image_path
                };
                lpObj.onLikeSuccess(params);
            } else {
                //NOTE: Make an error callback over here
            }
        },
    });
    return true;
}

likePosts.prototype.onLikeSuccess = function(params) {
    var count = parseInt(params.count);
    if(isNaN(count)) return false;

    var buttonRef = $('#like_' + params.msgId),
        likeText = params.likeText.replace(/&amp;/g, '&');

    $(buttonRef).animate({
        left: '-40px',
        opacity: 'toggle'
    }, 1000, '', function() {
        $(buttonRef).text(params.newText);

        $(buttonRef).animate({
            left: '0px',
            opacity: 'toggle'
        }, 1000);
    });

    if($('#like_count_' + params.msgId).length) {
        if(likeText === '') {
            $('#like_count_' + params.msgId).remove();
        } else {
            $('#like_count_' + params.msgId).text('(' + likeText + ')');
        }
    } else {
        $('#like_post_info_' + params.msgId).append('<span id="like_count_' + params.msgId +'">('+ likeText + ')</span>');
    }

    this.timeoutTimer = setTimeout(function() {
        lpObj.removeOverlay();
    }, 3000);
}

likePosts.prototype.showMessageLikedInfo = function(messageId) {
    if(isNaN(messageId)) return false;

    $.ajax({
        type: "GET",
        url: smf_scripturl + '?action=likeposts;sa=get_message_like_info',
        context: document.body,
        dataType : "json",
        data: {
            msg_id: messageId,
        },

        success: function(resp) {
            if (resp.response) {
                if(resp.data.length <= 0) return false;

                var data = resp.data;
                var memberInfo = '';
                for(i in data) {
                    memberInfo += '<div class="like_posts_member_info"><img class="avatar" src="'+ data[i].avatar.href +'" /><div class="like_posts_member_info_details"><a href="'+ data[i].href +'">' + data[i].name + '</a></div></div>';
                }
                var completeString = '<div class="like_posts_overlay"><div class="like_posts_member_info_box">' + memberInfo + '</div></div>';
                $('body').append(completeString);
                $(document).one('click keyup', lpObj.removeOverlay);

                $('.like_posts_member_info_box').click(function(e){
                    e.stopPropagation();
                });
            } else {
                //NOTE: Make an error callback over here
                return false;
            }
        },
    });
}

likePosts.prototype.removeOverlay = function (e) {
    var _this = this;
    if(typeof(e) === undefined && this.timeoutTimer === null) return false;
    else if (this.timeoutTimer !== null || ((e.type == 'keyup' && e.keyCode == 27) || e.type == 'click')) {
        clearTimeout(_this.timeoutTimer);
        _this.timeoutTimer = null;
        $('.like_posts_overlay').remove();
        $('.like_posts_overlay').unbind('click');
        $(document).unbind('click', lpObj.removeOverlay);
        $(document).unbind('keyup', lpObj.removeOverlay);
    }
}

var lpObj = window.lpObj = new likePosts();