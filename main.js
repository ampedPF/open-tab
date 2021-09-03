const TAGS = {
    comment: ["{c:", "{comment:"],
    title: ["{t:", "{title:"],
    subtitle: ["{st:", "{subtitle:"]
};

function lineToArray(text) {

    return text.split(/(\[.*?])/)
        .filter(function (el) {
            return el != null && el != "";
        });
}

function arrayToGroup(arr) {
    let res = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].includes('[')) {
            if (i < arr.length - 1) {
                res.push([cleanChord(arr[i]), arr[i + 1]])
                i++;
            } else {
                res.push([cleanChord(arr[i]), '']);
            }
        } else {
            res.push(['', arr[i]]);
        }
    }
    return res;
}

function cleanChord(chord) {
    return chord.substring(1, chord.length - 1);
}

function cleanTag(tag) {
    let res = "";
    let t = tag.match(/^{.*?:\s*(.*?)\s*}/);
    if (t.length > 0) {
        res = t[1];
    }
    return res;
}

function clearAll() {
    document.getElementById("title").innerHTML = "";
    document.getElementById("subtitle").innerHTML = "";
    document.getElementById("tablature").innerHTML = "";
}

function convert() {
    clearAll();
    var area = document.getElementById("area");
    var lines = area.value.replace(/\r\n/g, "\n").split("\n");

    for (line of lines) {
        //console.log("line", line);
        if (line.startsWith(TAGS.title[0]) || line.startsWith(TAGS.title[1])) {
            document.getElementById("title").innerHTML = cleanTag(line);
        } else if (line.startsWith(TAGS.subtitle[0]) || line.startsWith(TAGS.subtitle[1])) {
            document.getElementById("subtitle").innerHTML = cleanTag(line);
        } else {
            let table = document.createElement('table');
            if (line.startsWith(TAGS.comment[0]) || line.startsWith(TAGS.comment[1])) {
                var commentRow = table.insertRow();
                commentRow.className = "comment";
                let newComment = commentRow.insertCell();
                newComment.textContent = cleanTag(line);
            } else if (line.length == 0) {
                var emptyRow = table.insertRow();
                emptyRow.className = "empty";
                let emptyComment = emptyRow.insertCell();
                emptyComment.textContent = "";
            } else {
                var l = arrayToGroup(lineToArray(line));

                var chordRow = table.insertRow();
                chordRow.className = "chords";
                var textRow = table.insertRow();
                textRow.className = "text"
                for (let col of l) {
                    let newChord = chordRow.insertCell();
                    newChord.textContent = col[0];
                    let newText = textRow.insertCell();
                    newText.textContent = col[1];
                }
            }
            document.getElementById("tablature").appendChild(table);
        }
    }
}