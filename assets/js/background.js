var urlPattern = [
    "*://kej.tw/*"
];

// Get task from front
chrome.runtime.onMessage.addListener(

    (arg, sender, sendResponse) => {

        var url = arg.url; // get_video_info
        var dateTime = new Date().getTime(); // Time now
        var timestamp = Math.floor(dateTime / 1000); // Time to timestamp
        var fname = timestamp + ".ytdler"; // get_video_info temp file name
        
        // Download
        downloadSequentially([url], fname, (id) => {

            // Search download task from chrome download
            chrome.downloads.search({
                query: [fname],
            }, (r) => {

                $.ajax({
                    type: "GET",
                    url: "file://" + r[0].filename,
                    success: (response) => {

                        chrome.tabs.sendMessage(sender.tab.id, {content: response}); // Sent response to front when task finished
                        chrome.downloads.removeFile(id); // Delete temp file get_video_info
                        chrome.downloads.erase({
                            query: [fname]
                        }); // Delete download task
                        
                    }
                });
                
            });
        });
    }

);

// Download function
var downloadSequentially = (urls, filename, callback) => {

    let index = 0; // Counter
    let currentId; // Download task ID

    // Listen download task
    onChanged = ({id, state}) => {

        if (id === currentId && state && state.current !== 'in_progress') {

            next();

        }

    }

    // Create listener
    chrome.downloads.onChanged.addListener(onChanged);

    // Loop function
    next = () => {

        // If loop finished, finish loop
        if (index == urls.length) {

            chrome.downloads.onChanged.removeListener(onChanged); // Remove listener
            callback(currentId); // Return ID
            return; // return

        }

        const url = urls[index]; // URL to proccess
        index++; // Counter + 1
        
        // Download file
        chrome.downloads.download({
            url: url,
            filename: filename
        }, id => {

            currentId = id;

        });
        
    }
    
    // Call loop function
    next();

}