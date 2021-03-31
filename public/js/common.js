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
    alert('button clicked');
});

function createPostHtml(postData) {
    console.log(postData);

    const postedBy = postData.postedBy;

    if (!postedBy._id) {
        return console.log('User object not populated');
    }

    const displayName = postedBy.firstName + ' ' + postedBy.lastName;
    const timestamp = timeDifference(new Date(), new Date(postData.createdAt));
    return `<div class='post'>
                <div class='mainContentContainer'>
                    <div class='userImageContainer'>
                        <img src='${postedBy.profilePic}' />
                    </div>
                    <div class='postContentContainer'>
                        <div class='header'>
                            <a class='displayName' href='/profile/${postedBy.username}'>${displayName}</a>
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
                            <div class='postButtonContainer'>
                                <button>
                                    <i class='fas fa-retweet'></i>
                                </button>
                            </div>
                            <div class='postButtonContainer'>
                                <button class='likeButton'>
                                    <i class='far fa-heart'></i>
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
