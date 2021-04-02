/* $(document).ready(() => {
    // alert('spongebob');
});
 */

$('#postTextarea').keyup((event) => {
    const textbox = $(event.target);
    const value = textbox.val().trim();
    console.log(value);

    const submitButton = $('#submitPostButton');
    if (!submitButton.length) {
        return alert('No submit button found');
    }

    if (!value) {
        submitButton.prop('disabled', true);
        return;
    }
    submitButton.prop('disabled', false);
});

$('#submitPostButton').click((event) => {
    const button = $(event.target);
    const textbox = $('#postTextarea');

    const data = {
        content: textbox.val(),
    };

    $.post('/api/posts', data, (postData, status, xhr) => {
        const html = createPostHtml(postData);
        $('.postsContainer').prepend(html);
        textbox.val('');
        button.prop('disabled', true);
    });
});

$(document).on('click', '.likeButton', (event) => {
    const button = $(event.target);
    const postId = getPostIdFromElement(button);

    if (!postId) return;

    $.ajax({
        url: `/api/posts/${postId}/like`,
        type: 'PUT',
        success: (postData) => {
            console.log(postData);
            console.log(postData.likes);
            console.log(postData.likes.length);

            button.find('span').text(postData.likes.length || '');

            if (postData.likes.includes(userLoggedIn._id)) {
                button.addClass('active');
            } else {
                button.removeClass('active');
            }
        },
    });
});

$(document).on('click', '.retweetButton', (event) => {
    const button = $(event.target);
    const postId = getPostIdFromElement(button);

    if (!postId) return;

    $.ajax({
        url: `/api/posts/${postId}/retweet`,
        type: 'POST',
        success: (postData) => {
            button.find('span').text(postData.retweetUsers.length || '');

            if (postData.retweetUsers.includes(userLoggedIn._id)) {
                button.addClass('active');
            } else {
                button.removeClass('active');
            }
        },
    });
});

function getPostIdFromElement(element) {
    const isRoot = element.hasClass('post');
    const rootElement = isRoot ? element : element.closest('.post');
    const postId = rootElement.data().id;
    if (!postId) {
        return alert('Post is undefined');
    }
    return postId;
}

function createPostHtml(postData) {
    console.log(postData);

    const postedBy = postData.postedBy;

    if (!postedBy._id) {
        return console.log('User object not populated');
    }

    const displayName = postedBy.firstName + ' ' + postedBy.lastName;
    const timestamp = timeDifference(new Date(), new Date(postData.createdAt));

    const likeButtonActiveClass = postData.likes.includes(userLoggedIn._id) ? 'active' : '';

    return `<div class='post' data-id='${postData._id}'>
                <div class='mainContentContainer'>
                    <div class='userImageContainer'>
                        <img src='${postedBy.profilePic}' />
                    </div>
                    <div class='postContentContainer'>
                        <div class='header'>
                            <a class='displayName' href='/profile/${postedBy.username}'>
                                ${displayName}
                            </a>
                            <span class='username'>@${postedBy.username}</span>
                            <span class='date'>${timestamp}</span>
                        </div>
                        <div class='postBody'>
                            <span>${postData.content}</span>
                        </div>
                        <div class='postFooter'>
                            <div class='postButtonContainer'>
                                <button>
                                    <i class='far fa-comment'></i>
                                </button>
                            </div>
                            <div class='postButtonContainer green'>
                                <button class='retweetButton'>
                                    <i class='fas fa-retweet'></i>
                                    <span>${postData.retweetUsers.length || ''}</span>
                                </button>
                            </div>
                            <div class='postButtonContainer red'>
                                <button class='likeButton ${likeButtonActiveClass}'>
                                    <i class='far fa-heart'></i>
                                    <span>${postData.likes.length || ''}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
}

function timeDifference(current, previous) {
    let msPerMinute = 60 * 1000;
    let msPerHour = msPerMinute * 60;
    let msPerDay = msPerHour * 24;
    let msPerMonth = msPerDay * 30;
    let msPerYear = msPerDay * 365;

    let elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if (elapsed / 1000 < 30) {
            return 'Just now';
        }
        return Math.round(elapsed / 1000) + ' seconds ago';
    } else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' minutes ago';
    } else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + ' hours ago';
    } else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerDay) + ' days ago';
    } else if (elapsed < msPerYear) {
        return Math.round(elapsed / msPerMonth) + ' months ago';
    } else {
        return Math.round(elapsed / msPerYear) + ' years ago';
    }
}
