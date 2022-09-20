chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (["png","web"].includes(request.type)) {
        start(request.type);
    }
    sendResponse({});
});

function send(request) {
    chrome.extension.sendMessage(request, function(response) {});
}



function start(saveMethod) {
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function demo() {
        let selectedElement = document.querySelectorAll(".panel-element-row");
        window.scrollTo(0,0);
        var BORDER_THICKNESS = 4;
        for (let i = 0; i < selectedElement.length; i++) {
            var overlay, outline;
            if (!overlay) {
                overlay = document.createElement("div");
                overlay.id = "el_capture_overlay";
                overlay.style.position = "absolute";
                overlay.style.top = "0px";
                overlay.style.left = "0px";
                overlay.style.width = "100%";
                overlay.style.height = "100%";
                overlay.style.pointerEvents = "none";
                outline = document.createElement("div");
                outline.style.position = "fixed";
                outline.style.zIndex = "9";
                outline.style.border = BORDER_THICKNESS + "px dotted rgb(244, 67, 54)";
                overlay.appendChild(outline);
            }
            if (!overlay.parentNode) {
                document.body.appendChild(overlay);
                var element, dimensions = {};
                mousemove(selectedElement[i])
                mouseup()
            }
            await sleep(1000);
            window.scrollTo(window.scrollX, window.scrollY+selectedElement[i].offsetHeight);
        }
        console.log('Done');
        function mousemove(e) {
            if (element !== e) {
                element = e;
                dimensions.top = -window.scrollY;
                dimensions.left = -window.scrollX;
                var elem = e;
                console.log(elem);
                while (elem !== document.body && elem !== null) {
                    dimensions.top += elem.offsetTop;
                    dimensions.left += elem.offsetLeft;
                    elem = elem.offsetParent;
                }
                dimensions.width = element.offsetWidth;
                dimensions.height = element.offsetHeight
                dimensions.title = element.querySelector("h3").innerHTML;
                dimensions.saveMethod = saveMethod;

                outline.style.top = (dimensions.top - BORDER_THICKNESS) + "px";
                outline.style.left = (dimensions.left - BORDER_THICKNESS) + "px";
                outline.style.width = dimensions.width + "px";
                outline.style.height = dimensions.height + "px";
            }
        }
        function mouseup() {
            document.body.removeChild(overlay);
            dimensions.devicePixelRatio = window.devicePixelRatio;
            setTimeout(function() { send({ type: "up", dimensions: dimensions }); }, 100);
        }
    }
    demo();
}

send({ type: "enable" });
