<?php

/**
* @package manifest file for Like Posts
* @version 1.0 Alpha
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

if (!defined('SMF'))
	die('Hacking attempt...');

/*
 *This function is accessible using ?action=likeposts
 */
function LP_mainIndex() {
	global $context, $txt, $scripturl;

	$default_action_func = 'LP_defaultFunc';
	$subActions = array(
		// Main views.
		'like_post' => 'LP_likePosts',
		'unlike_post' => 'LP_unlikePosts',
	);

	if (isset($_REQUEST['sa']) && isset($subActions[$_REQUEST['sa']]) && function_exists($subActions[$_REQUEST['sa']]))
		return $subActions[$_REQUEST['sa']]();

	// At this point we can just do our default.
	$default_action_func();
}

function LP_defaultFunc() {
	global $context, $txt, $scripturl;

	echo 'we are in default func';
}

function LP_likePosts() {
	global $user_info, $sourcedir;

	// Lets get and sanitize the data first
	$board_id = isset($_REQUEST['board']) && !empty($_REQUEST['board']) ? (int) ($_REQUEST['board']) : 0;
	$topic_id = isset($_REQUEST['topic']) && !empty($_REQUEST['topic']) ? (int) ($_REQUEST['topic']) : 0;
	$msg_id = isset($_REQUEST['msg']) && !empty($_REQUEST['msg']) ? (int) ($_REQUEST['msg']) : 0;

	if(empty($board_id) || empty($topic_id) || empty($msg_id)) {
		fatal_lang_error('lp_cannot_like_posts');
	} elseif ($user_info['is_guest']) {
		die();
	}

	//  All good lets proceed
	require_once($sourcedir . '/Subs-LikePosts.php');
	//echo $board_id . ' : ' . $topic_id . ' : ' . $msg_id;
	$data = array(
		'board_id' => $board_id,
		'topic_id' => $board_id,
		'msg_id' => $board_id,
		'id_member' => $user_info['id']
		//'rating' => 1,
	);

	$result = LP_insertLikePost();
	if($result) {
		echo 'all done check DB';	
	} else {
		echo 'somwthing is wrong';
	}
	
	die();
}

?>