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
    return postData.content;
}
