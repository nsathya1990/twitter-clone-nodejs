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

    console.log(data);
    $.post('/api/posts', data, (postData, status, xhr) => {
        const html = createPostHtml(postData);
        $('.postsContainer').prepend(html);
        textbox.val('');
        button.prop('disabled', true);
    });
});

function createPostHtml(postData) {
    console.log(postData);

    const postedBy = postData.postedBy;
    const displayName = postedBy.firstName + ' ' + postedBy.lastName;
    const timestamp = postData.createdAt; // 'To Do Later';
    return `<div class='post'>

                <div class='mainContentContainer'>
                    <div class='userImageContainer'>
                        <img src='${postedBy.profilePic}' />
                    </div>
                    <div class='postContentContainer'>
                        <div class='header'>
                            <a href='/profile/${postedBy.username}'>${displayName}</a>
                            <span class='username'>@${postedBy.username}</span>
                            <span class='date'>${timestamp}</span>
                        </div>
                        <div class='postBody'>
                            <span>${postData.content}</span>
                        </div>
                        <div class='postFooter'>
                        </div>
                    </div>
                </div>
            </div>`;
    // return postData.content;
}
