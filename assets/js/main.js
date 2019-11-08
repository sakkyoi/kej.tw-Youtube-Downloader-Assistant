$(document).ready(() => {

    // Check if in youtube download page in kej.tw
    if (document.URL.match(/youtube.php/)) {
        
        chrome.runtime.sendMessage({url : $("#linkVideoInfoURL").attr("href")}); // Sent task to background (Due to CORS, it couldn't download file in front)

        // Get response from background if task finished
        chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
            
            $("#videoInfo").val(msg.content); // Fill content of get_video_info into field
            
            $("input[type=button]").click(); // Click "sent" button
            
        });

    }
    
});