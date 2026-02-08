// This updates the candidate banner logos. Taken from 1992 - Moonbeam
let imgUrl = "https://i.imgur.com/A1674e8.png";

const customStyling = document.createElement("style");
document.head.appendChild(customStyling);

function updateStyling(url) {
    customStyling.textContent = `
        #campaign_sign {
            background-image: url("${url}");
            background-size: cover;
            background-position: center;
            border-color: #c9c9c9;
            border-width: .01em;
            width: 100%;
            height: 92px;
            margin-left: -0.07em;
            font-size: 0;
        }
    `;
}

// initial render
updateStyling(imgUrl);

function changeImage(newImgUrl) {
    imgUrl = newImgUrl;
    console.log("Banner changed");
    updateStyling(newImgUrl);
}
