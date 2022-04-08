// Globals
var original = null;
var story = [];
var replacements = [];
var modified = null;
var replaceIndex = -1;
var storyView = 2;

/* Function indexSetup  (index.html)
  * Set up index.html dashboard with body onload
  * @param none
  * @returns none
  * Note: avoids getElementById for existing ids
  */
function indexSetup() {
    let description = document.createElement("div");
    description.innerHTML = "<p><strong>Mad Libs</strong> are stories with words removed and replaced by blank spaces. Fill in the blanks for a fun story! Make sure to think outside the box. The wackier the better!</p>";
    window.header.appendChild(description);
    let instructions = document.createElement("div");
    instructions.innerHTML = "<p><strong>Setup:</strong> paste a story, poem or long quote here.  You'll then decide which words to replace, with what parts of speech.</p>";
    instructions.setAttribute("id", "instructions");
    window.actionbox.appendChild(instructions);
    let storyinput = document.createElement("textarea");
    storyinput.setAttribute("id", "storyInput");
    window.actionbox.appendChild(storyinput);
    let pastestory = document.createElement("button");
    pastestory.addEventListener("click", pasteStory);
    pastestory.innerText = ("Paste Story");
    window.actionbox.appendChild(pastestory);
}

/* Function Paste Story (changes.html)
  * Creates story array from textarea, puts in local storage, loads changes.html
  * @param none
  * @returns none
  */
function pasteStory() {
    let storyinput = document.getElementById("storyInput")
    original = storyinput.value;
    localStorage.setItem('original', original);
    story = original.split(" ");
    localStorage.setItem('story', JSON.stringify(story));
    location.assign("changes.html");
}

/* Function changesSetup (changes.html)
  * Set up changes.html dashboard with body onload
  * @param none
  * @returns none
  * Note: pulls story from local storage and calls makeNumberedString to fill storyShow
  */
function changesSetup() {
    window.header.innerHTML = "<h1>Mad Libs</h1><h2></h2><p></p>";
    instructions = header.getElementsByTagName("h2")[0];
    instructions.innerHTML = ("Program Word Substitutions");
    instructions = header.getElementsByTagName("p")[0];
    instructions.innerHTML = ("Enter word number, retype the word, and say the part of speech.");
    let storyshow = document.getElementById("storyShow");
    story = JSON.parse(localStorage.getItem("story"));
    storyshow.innerHTML = makeNumberedString();
    let done = document.createElement("button");
    done.id = "done";
    done.innerText = "done";
    actionbox.appendChild(done);
    done.setAttribute("onclick", "donePOS()");
}

/* Function Make Numbered String  (changes.html)
  * Creates a string that numbers each word in story
  * @param array story
  * @returns string modified
  * Note: adds CSS spans to make index numbers superscripted
  */
function makeNumberedString() {
    modified = "";
    for (let word = 0; word < story.length; word++) {
        modified += story[word] + "<span>" + word + "</span> ";
    }
    return modified;
}

/* Function Next Part of Speech (changes.html)
  * Pulls data from form and populates replacements array, fills storyShow with makeReplacedString
  * @param none
  * @returns none
  * Note: OrigWord is for error checking, but error check not yet implemented
  */
function nextPOS() {
    let Index = document.getElementById("index").value;
    let OrigWord = document.getElementById("origWord").value;
    let pOS = document.getElementById("pos").value;
    let metaWord = [Index, OrigWord, pOS];
    // Check if word matches before adding. 
    if (story[Index].includes(".")) metaWord.push(".");
    if (story[Index].includes(",")) metaWord.push(",");
    if (story[Index].includes("?")) metaWord.push("?");
    if (story[Index].includes("!")) metaWord.push("!");
    replacements.push(metaWord);
    localStorage.setItem('replacements', JSON.stringify(replacements));
    modified = makeReplacedString();
    let storyshow = document.getElementById("storyShow");
    storyshow.innerHTML = modified;
}
/* Done with part of speech entry
 * Go to player page
 * @param none
 * @return none
 */

/* Function Make Replaced String  (changes.html)
  * Integrates POS substitutions into modified string
  * @param array story
  * @returns string modified
  * Note: adds strong tags to highlight replacements.
  */
function makeReplacedString() {
    modified = "";
    for (let w = 0; w < story.length; w++) {
        replaced = false;
        for (let r = 0; r < replacements.length; r++) {
            if (replacements[r][0] == w) {
                modified += "<strong>" + replacements[r][2] + "</strong><span>" + w + "</span> ";
                replaced = true;
            }
        }
        if (replaced == false) {
            modified += story[w] + "<span>" + w + "</span> ";
        }
    }
    return modified;
}

/* For reference
 * localStorage.setItem('original', original);
 * localStorage.setItem('story', JSON.stringify(story));
 * localStorage.setItem('replacements', JSON.stringify(replacements));
 * story = JSON.parse(localStorage.getItem("story"));
 * replacements = JSON.parse(localStorage.getItem('replacements'));
 * original = localStorage.getItem("original");
 */

function donePOS() {
    localStorage.setItem("replacements", JSON.stringify(replacements));
    document.location = "player.html";
}

/* Function playerSetup (player.html)
 * set player.html dashboard with body.onload
 * @param none
 * @return none
 */

function playerSetup() {
    let description = document.createElement("div");
    description.id = "description";
    description.innerHTML = "Enter replacement word";
    window.header.appendChild(description);
    let instructions = document.createElement("div");
    instructions.innerHTML = "Find a crazy word that matches the parts of speech displayed and click next.";
    window.actionbox.appendChild(instructions);
    let pOS = document.createElement("div");
    pOS.setAttribute("id", "POS");
    window.actionbox.appendChild(pOS);
    let newWord = document.createElement("input");
    newWord.setAttribute("id", "replacement");
    window.actionbox.appendChild(newWord);
    let nextButton = document.createElement("button");
    nextButton.setAttribute("onclick", "replaceWord()");
    nextButton.innerText = "Next";
    nextButton.style.margin = "10px";
    window.actionbox.appendChild(nextButton);
    replacements = JSON.parse(localStorage.getItem("replacements"));
    story = JSON.parse(localStorage.getItem("story"));
    nextReplacement();
}

/* Function nextReplacement (player.html)
 * The page prompts the player for the part of speech. Once inputed, the input box will empty and the prompt will move on to the next word. Once done, the page will display the madlib.
 * @param 
 * @return none
 */
function nextReplacement() {
    let newWord = document.getElementById("replacement");
    newWord.value = "";
    replaceIndex++;
    if (replaceIndex < replacements.length) {
        let pOS = document.getElementById("POS");
        pOS.innerText = replacements[replaceIndex][2];
    }
    else{
        document.getElementById("actionbox").remove();
        let description = document.getElementById("description");
        description.innerText = "Here is your new story:";
        let madlib = document.createElement("p");
        madlib.id = "madlib";
        madlib.innerText = story.join(" ");
        document.getElementById("dashboard").appendChild(madlib);
        let swapStory = document.createElement("button");
        swapStory.id = "swapStory";
        swapStory.innerText = "View original story";
        document.getElementById("dashboard").appendChild(swapStory);
        swapStory.setAttribute("onclick","swap()");
    }
}

function replaceWord(){
    let newWord = document.getElementById("replacement");
    story[replacements[replaceIndex][0]] = newWord.value;
    switch(replacements[replaceIndex][3]){
        case ".":
            story[replacements[replaceIndex][0]] += ".";
            break;
        case ",":
            story[replacements[replaceIndex][0]] += ",";
            break;
        case "?":
            story[replacements[replaceIndex][0]] += "?";
            break;
        case "!":
            story[replacements[replaceIndex][0]] += "!";
            break;
    }
    nextReplacement();
}

function swap(){
    let description = document.getElementById("description");
    let madlib = document.getElementById("madlib");
    let swapStory = document.getElementById("swapStory");
    if (storyView == 2){
        storyView --;
        description.innerText = "This is the original story:";
        madlib.innerText = localStorage.getItem("original");
        swapStory.innerText = "View madlib";
    }
    else{
        storyView++;
        description.innerText = "Here is your new story:";
        madlib.innerText = story.join(" ");
        swapStory.innerText = "View original story";
    }
}