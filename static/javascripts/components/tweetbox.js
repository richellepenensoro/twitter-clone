(() => {

    const tweetBtn = $('.tweetbox .tweet-btn');

    $('.tweetbox .tweet-input').addEventListener('input', e => {
        tweetBtn.disabled = e.target.value.trim().length === 0;
    });

})();
