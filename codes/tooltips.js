// The dynamic tooltips from The Major Legaues
// with design from 2021DE
const tooltipStyles = document.createElement('style');
tooltipStyles.innerHTML = `
  #inner_window_question h3 .mytooltip,
  inner_window_question h3 .mytooltip {
      background-color: lightskyblue;
  }

  .mytooltip {
      position: relative;
      display: inline-block;
      cursor: pointer;
      background-color: lightblue;
      padding: 0 0.15em;
      border-radius: 0.2em;
  }

  .mytooltip .mytooltiptext {
      width: 240px;
      background-color: lightblue;
      color: black;
      text-align: center;
      border-radius: 6px;
      padding: 10px;
      position: absolute;
      z-index: 999;
      bottom: calc(100% + 6px);
      left: 50%;
      transform: translateX(-50%);
      opacity: 0;
      transition: opacity 0.3s;
      border: 1px solid black;
      pointer-events: none;
      font-size: 13px !important;
      line-height: 1.5em !important;
      font-weight: normal !important;
      font-style: normal !important;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  }

  .mytooltip .mytooltiptext img {
      max-width: 240px;
      height: auto;
      display: block;
      margin: 0 auto 8px auto;
      border-radius: 4px;
  }

  .mytooltip .mytooltiptext .annotation {
      display: block;
  }

  .mytooltip:hover .mytooltiptext {
      opacity: 1;
      transition-delay: 0.5s;
  }

  /* for flips */
  .mytooltip .mytooltiptext.flip-bottom {
      bottom: auto;
      top: calc(100% + 6px);
  }

  #visit_window .mytooltiptext {
      padding: 0.8em 1em;
  }
`;
document.head.appendChild(tooltipStyles);

// tooltip data
const tooltipList = [
  { searchString: "Obama", image: "https://i.pinimg.com/1200x/83/3a/3a/833a3aa1382f73a6cffe17e3193101a5.jpg", text: "The devil." },
  { searchString: "Donald Trump", image: "https://i.pinimg.com/1200x/d6/18/30/d61830629dd489745396d1eefc5ca4d5.jpg", text: "Nerd." },
  { searchString: "Patty", image: "https://i.pinimg.com/1200x/22/cb/d0/22cbd081d3bc2e7306f29803cb9d7a67.jpg", text: "Ah, heavens…" },
  { searchString: "Lucy", image: "https://i.pinimg.com/1200x/40/d6/45/40d64580f6da559e27862d50810be0c7.jpg", text: "Linus’s terrifying older sister. Also known as Baphomet, she runs the school’s social hierarchy with an iron fist." },
  { searchString: "Lucy Van Pelt", image: "https://i.pinimg.com/1200x/6f/f2/ea/6ff2ea684968657b4b7319baa6eae0ee.jpg", text: "Same." },
  { searchString: "Marcie", image: "https://i.pinimg.com/1200x/38/39/b8/3839b8a8087408dfdfe5204465db6ed7.jpg", text: "A modern day Cleopatra, she’s the editor of the school paper. What if I told you her favorite author is Dennis Cooper?" },
  { searchString: "Schroeder", image: "https://i.pinimg.com/1200x/f9/29/e1/f929e18099f43154a6ae2d93e4ff499c.jpg", text: "Supposedly the reincarnation of Beethoven. He’s more <i>nouveau rich</i> than old money, though." },
  { searchString: "Snoopy", image: "https://i.pinimg.com/1200x/fa/5e/f9/fa5ef929605e697568af58c09fa2ae35.jpg" },
  { searchString: "Sally", image: "https://i.pinimg.com/1200x/4f/94/72/4f9472bf689e41439e9822a84b43af29.jpg", text: "Your very kind and loving sister." },
  { searchString: "Pig-Pen", image: "https://i.pinimg.com/1200x/43/98/e9/4398e9861682555d3f2e7bcc5f18356c.jpg", text: "Some things just don’t change." },
  { searchString: "Little Red-Haired Girl", image: "https://i.pinimg.com/1200x/6f/8f/6a/6f8f6a6fafb6dd7aa93b1be52b741352.jpg", text: "Maybe you two could be royals." },
  { searchString: "Franklin", image: "https://i.pinimg.com/1200x/8a/be/3d/8abe3d131ec5b11c1644f6103cd2c851.jpg", text: "If only you were like him." },
  { searchString: "Othmar", image: null, text: "The Bastard. Not even worthy of an image." },
  { searchString: "Principal Othmar", image: null, text: "Worse than Hitler. Not even worthy of an image." },
  { searchString: "Roy", image: "https://i.pinimg.com/1200x/16/15/08/161508a3e30144c8dbd83bb2c06fc952.jpg", text: "An angel." },
  { searchString: "Great Pumpkin", image: "https://i.pinimg.com/1200x/5b/2e/88/5b2e887851a61a142436b34a3d86b283.jpg", text: "A childish myth repackaged as pseudo-intellectual campaign rhetoric. Great job, Linus." },
  { searchString: "Thibault", image: "https://i.pinimg.com/1200x/4a/84/3d/4a843dbc40cbb50ac6820404d56cb57e.jpg", text: "Marcie’s enforcer. Being infatuated with him has been a real pleasure." },
  { searchString: "Cormac", image: "https://i.pinimg.com/1200x/5a/e6/66/5ae66660555befcde65c29f7996c23c8.jpg", text: "More popular in some corners than you’d think he is." },
  { searchString: "Shermy", image: "https://i.pinimg.com/1200x/d8/29/14/d82914cc5d15f876c4c48402b0977aee.jpg", text: "Like Moses, only keeping it real. Peaked in elementary school but still kicking around." },
  { searchString: "Five", image: "https://i.pinimg.com/originals/09/c3/3a/09c33aaf8ec90828066caeef33c586b5.gif", text: "Wait, his parents actually named him that!?" },
  { searchString: "Floyd", image: "https://i.pinimg.com/1200x/37/b1/6d/37b16d01ef6955e530ef3b009c58c07c.jpg", text: "The student body treasurer. He doesn’t know how worse it can get." },
  { searchString: "Maynard", image: "https://file.garden/aNtAfG887DiA_7lO/TML_2000/maynard.jpg", text: "Marcie’s cousin. His part-time job is being school paper’s photographer; his pastime is being her lapdog." },
  { searchString: "Sparky High", image: null, text: "Sparky Memorial High, presumably named after the creator himself. Essentially, a microcosm of the world’s decay." },
  { searchString: "Brownites", image: null, text: "A nickname for your supporters." },
  { searchString: "Charlie Brown", image: "https://i.pinimg.com/1200x/c4/fd/a5/c4fda5921388916b2523f87962463eda.jpg", text: "Despite everything, it’s still you." },
  { searchString: "your campaign", image: "https://i.pinimg.com/1200x/0f/a6/fe/0fa6fe4fc973a3ee8d38c370f35f5a36.jpg", text: "A disaster." },
  { searchString: "Al Gore", image: "https://i.pinimg.com/1200x/9e/2c/16/9e2c160a080bca989d5db92537b34faa.jpg", text: "Ballin’." },
  { searchString: "Stevenson", image: "https://i.pinimg.com/1200x/57/14/5c/57145ca004175da428d7391e6718f35b.jpg", text: "An egghead of style." },
  { searchString: "Stanford Experiment", image: "https://images.newscientist.com/wp-content/uploads/2018/10/08143156/00011117_master_004.jpg", text: "Too risqué for this election." },
  { searchString: "MTV", image: "https://i.pinimg.com/1200x/d3/0f/c1/d30fc12836f8047042fb07caa08cd32c.jpg", text: "*He means Daria." },
  { searchString: "Dewey", image: "https://i.redd.it/old-photos-of-everyone-v0-ao2xb3ytcvpe1.jpg?width=395&format=pjpg&auto=webp&s=f2cc450a61fb4145cde84aba312b3346228853b9", text: "Oooh, shiny." },
  { searchString: "Aaron Carter", image: "https://media.gettyimages.com/id/171534201/pt/foto/hollywood-ca-singer-aaron-carter-attends-the-rugrats-in-paris-hollywood-premiere-on-november-5.jpg?s=612x612&w=0&k=20&c=Vp-O3WPewyaL51GExtlUSYmGsLJmVsPnLCxFiKVwTZg=", text: "He just beat Shaq, dawg." }
];

function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const compiledTooltips = tooltipList.map((tooltip, index) => ({
    index,
    regex: new RegExp(
        `(?<=\\b|\\s|^|")${escapeRegExp(tooltip.searchString)}(?=[.,;!?]?\\b|\\s|"|$)`,
        'g'
    ),
}));

function getTooltips(str) {
    const matches = [];

    for (const { index, regex } of compiledTooltips) {
        regex.lastIndex = 0;
        let match;
        while ((match = regex.exec(str)) !== null) {
            matches.push({ start: match.index, end: match.index + match[0].length, tooltipIndex: index });
        }
    }

    matches.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));

    for (let i = 0; i < matches.length - 1;) {
        if (matches[i + 1].start < matches[i].end) matches.splice(i + 1, 1);
        else i++;
    }

    return matches;
}

function applyTooltips(str) {
    const matches = getTooltips(str);
    let result = '';
    let lastIndex = 0;

    for (const match of matches) {
        const { image, text, searchString } = tooltipList[match.tooltipIndex];
        result += str.slice(lastIndex, match.start);
        result += `<span class='mytooltip'>${searchString}<span class='mytooltiptext'>${
            image ? `<img src='${image}'>` : ''
        }${
            text ? `<span class='annotation'>${text}</span>` : ''
        }</span></span>`;
        lastIndex = match.end;
    }

    return result + str.slice(lastIndex);
}

function applyTooltipsToObject(obj) {
    for (const key of Object.keys(obj)) {
        const val = obj[key];
        if (typeof val === 'string') {
            // pre-process the initial string
            let stored = applyTooltips(val);

            // hijack the property so future assignments are automatically processed
            Object.defineProperty(obj, key, {
                get: () => stored,
                set: (newVal) => { stored = typeof newVal === 'string' ? applyTooltips(newVal) : newVal; },
                configurable: true,
                enumerable: true,
            });
        } else if (val && typeof val === 'object') {
            // recursively travel down the object tree
            applyTooltipsToObject(val);
        }
    }
}

// intercept the properties being set by Code 2 so we can apply tooltips instantly
for (const prop of ['questions_json', 'answers_json', 'answer_feedback_json']) {
    let stored = campaignTrail_temp[prop];
    Object.defineProperty(campaignTrail_temp, prop, {
        get: () => stored,
        set: (newVal) => {
            if (newVal) applyTooltipsToObject(newVal);
            stored = newVal;
        },
        configurable: true,
        enumerable: true,
    });
}

// check tooltip position on hover
document.addEventListener('mouseover', function(e) {
    const tooltip = e.target.closest('.mytooltip');
    if (!tooltip) return;

    if (tooltip.contains(e.relatedTarget)) return;

    const tooltipText = tooltip.querySelector('.mytooltiptext');
    if (!tooltipText) return;

    tooltipText.classList.remove('flip-bottom');

    const parentRect = tooltip.getBoundingClientRect();
    const textRect = tooltipText.getBoundingClientRect();

    if (parentRect.top - textRect.height - 15 < 0) {
        tooltipText.classList.add('flip-bottom');
    }
});