function doAdminSetup() {
    document.title = botData.svrnm + " Admin Console";
    document.getElementById("servername").innerHTML = botData.svrnm;
    document.getElementById("profilepic").src = botData.svricon;
    document.getElementById("botsince").innerHTML = botData.botnm + " added " + botData.joined + " ago";
    
    switchAdmins();
    switchBlocked();
    switchStrikes();
    switchRss();
    switchCommands();
    switchManage();
    switchTriviaSets();
    switchExtensions();
    
    destroyLoader();
}

function switchAdmins() {
    document.getElementById("adminstable").style.display = "";
    
    var blacklist = [];
    var adminstablebody = "";
    for(var i=0; i<botData.configs.admins.length; i++) {
        blacklist.push(botData.configs.admins[i][2]);
        adminstablebody += "<tr id=\"adminsentry-" + botData.configs.admins[i][2] + "\"><td><img class=\"profilepic\" width=25 src=\"" + botData.configs.admins[i][0] + "\" /></td><td>" + botData.configs.admins[i][1] + "</td><td>" + botData.configs.admins[i][2] + "</td><td><span class=\"removetool\" onclick=\"javascript:config('admins', this.parentNode.parentNode.id.substring(12), function() {switchAdmins();switchBlocked();switchStrikes();});\"><i>(remove)</i></span></td></tr>";
    }
    document.getElementById("adminstablebody").innerHTML = adminstablebody;
    if(botData.configs.admins.length==0) {
        document.getElementById("adminstable").style.display = "none";
    }
    
    for(var i=0; i<botData.configs.blocked.length; i++) {
        blacklist.push(botData.configs.blocked[i][2]);
    }
    filterMembers(blacklist, function(possibleAdmins) {
        var adminsselector = "<option value=\"\">Select Member</option>";
        for(var i=0; i<possibleAdmins.data.length; i++) {
            adminsselector += "<option value=\"" + possibleAdmins.data[i][1] + "\">" + possibleAdmins.data[i][0] + "</option>";
        }
        document.getElementById("adminsselector").innerHTML = adminsselector;
    });
}

function switchBlocked() {
    document.getElementById("blockedtable").style.display = "";
    
    var blacklist = [];
    var blockedtablebody = "";
    for(var i=0; i<botData.configs.blocked.length; i++) {
        blacklist.push(botData.configs.blocked[i][2]);
        blockedtablebody += "<tr id=\"blockedentry-" + botData.configs.blocked[i][2] + "\"><td><img class=\"profilepic\" width=25 src=\"" + botData.configs.blocked[i][0] + "\" /></td><td>" + botData.configs.blocked[i][1] + "</td><td>" + botData.configs.blocked[i][2] + "</td>" + (botData.configs.blocked[i][3] ? "" : "<td><span class=\"removetool\" onclick=\"javascript:config('blocked', this.parentNode.parentNode.id.substring(13), function() {switchAdmins();switchBlocked();switchStrikes();});\"><i>(remove)</i></span></td>") + "</tr>";
    }
    document.getElementById("blockedtablebody").innerHTML = blockedtablebody;
    if(botData.configs.blocked.length==0) {
        document.getElementById("blockedtable").style.display = "none";
    }
    
    for(var i=0; i<botData.configs.admins.length; i++) {
        blacklist.push(botData.configs.admins[i][2]);
    }
    filterMembers(blacklist, function(possibleBlocked) {
        var blockedselector = "<option value=\"\">Select Member</option>";
        for(var i=0; i<possibleBlocked.data.length; i++) {
            blockedselector += "<option value=\"" + possibleBlocked.data[i][1] + "\">" + possibleBlocked.data[i][0] + "</option>";
        }
        document.getElementById("blockedselector").innerHTML = blockedselector;
    });
}

function switchStrikes() {
    document.getElementById("strikestable").style.display = "";
    
    var blacklist = [];
    var strikestablebody = "";
    for(var i=botData.strikes.length-1; i>=0; i--) {
        blacklist.push(botData.strikes[i][0]);
        strikestablebody += "<tr id=\"strikesentry-" + botData.strikes[i][0] + "\"><td><img class=\"profilepic\" width=25 src=\"" + botData.strikes[i][1] + "\" /></td><td>" + botData.strikes[i][2] + "</td><td>" + botData.strikes[i][3].length + "</td><td><span class=\"removetool\" onclick=\"javascript:alert(getStrikes(this.parentNode.parentNode.id.substring(13)));\"><i>(view all)</i></span>&nbsp;<span class=\"removetool\" onclick=\"javascript:newStrike(this.parentNode.parentNode.id.substring(13));\"><i>(+1)</i></span>&nbsp;<span class=\"removetool\" onclick=\"javascript:removeStrike(this.parentNode.parentNode.id.substring(13));\"><i>(-1)</i></span></td></tr>";
    }
    document.getElementById("strikestablebody").innerHTML = strikestablebody;
    if(botData.strikes.length==0) {
        document.getElementById("strikestable").style.display = "none";
    }
    
    for(var i=0; i<botData.configs.admins.length; i++) {
        blacklist.push(botData.configs.admins[i][2]);
    }
    filterMembers(blacklist, function(possibleStrikes) {
        var strikesselector = "<option value=\"\">Select Member</option>";
        for(var i=0; i<possibleStrikes.data.length; i++) {
            strikesselector += "<option value=\"" + possibleStrikes.data[i][1] + "\">" + possibleStrikes.data[i][0] + "</option>";
        }
        document.getElementById("strikesselector").innerHTML = strikesselector;
    });
}

function newStrike(usrid) {
    var u = prompt("Enter reason for strike");
    if(u) {
        config("strikes", [usrid, u], function() {
            switchAdmins();
            switchBlocked();
            switchStrikes();
        });
    }
}

function getStrikes(usrid) {
    for(var i=0; i<botData.strikes.length; i++) {
        if(botData.strikes[i][0]==usrid) {
            var info = "Strikes for @" + botData.strikes[i][2];
            for(var j=0; j<botData.strikes[i][3].length; j++) {
                info += "\n   " + j + ": " + botData.strikes[i][3][j][1] + " from @" + botData.strikes[i][3][j][0];
            }
            return info;
        }
    }
    return;
}

function removeStrike(usrid) {
    var info = getStrikes(usrid);
    if(info) {
        var u = prompt(info + "\nEnter strike number to remove"); 
        if(!isNaN(u)) {
            config("strikes", [usrid, u], function() {
                switchAdmins();
                switchBlocked();
                switchStrikes();
            });
        } else {
            alert("Must be a number");
        }
    } else {
        alert("An error occurred");
    }
}

function switchRss() {
    document.getElementById("rsstable").style.display = "";
    
    var rsstablebody = "";
    for(var i=0; i<botData.configs.rss[1].length; i++) {
        rsstablebody += "<tr id=\"rssentry-" + i + "\"><td>" + botData.configs.rss[2][i] + "</td><td>" + botData.configs.rss[1][i] + "</td><td><span class=\"removetool\" onclick=\"javascript:config('rss', this.parentNode.parentNode.id.substring(9), switchRss);\"><i>(remove)</i></span></td></tr>";
    }
    document.getElementById("rsstablebody").innerHTML = rsstablebody;
    if(botData.configs.rss[1].length==0) {
        document.getElementById("rsstable").style.display = "none";
    }
}

function newRss() {
    if(!document.getElementById("rssnewname").value || !document.getElementById("rssnewurl").value) {
        alert("Provide both name and URL");
        return;
    }
    if(document.getElementById("rssnewname").value.indexOf(" ")>-1 || document.getElementById("rssnewurl").value.indexOf(" ")>-1) {
        alert("Name and URL cannot contain spaces");
        return;
    }
    config("rss", [document.getElementById("rssnewurl").value, document.getElementById("rssnewname").value], function() {
        document.getElementById("rssnewname").value = "";
        document.getElementById("rssnewurl").value = "";
        switchRss();
    });
}

function switchCommands() {
    var commands = "";
    for(var cmd in botData.configs) {
        if(["admins", "blocked", "extensions", "newgreeting", "nsfwfilter", "rss", "servermod", "spamfilter"].indexOf(cmd)==-1) {
            commands += "<label><input style=\"height: auto;\" id=\"commandsentry-" + cmd + "\" type=\"checkbox\" onclick=\"javascript:config(this.id.substring(14), this.checked, switchCommands);\" " + (botData.configs[cmd] ? "checked " : "") + "/>" + cmd + "</label><br>";
        }
    }
    document.getElementById("commands").innerHTML = commands;
}

function resetConfigs() {
    var u = confirm("All configs will be reset. Are you sure?");
    if(u) {
        config("preset", "default", function(err) {
            if(!err) {
                location.reload();
            }
        });
    }
}

function switchManage() {
    if(document.getElementById("manageentry-servermod").checked!=botData.configs.servermod) {
        document.getElementById("manageentry-servermod").checked = botData.configs.servermod;
    }
    document.getElementById("manageentry-membermsg").disabled = !botData.configs.servermod;
    document.getElementById("manageentry-spamfilter").disabled = !botData.configs.servermod;
    document.getElementById("manageentry-nsfwfilter").disabled = !botData.configs.servermod;
    if(document.getElementById("manageentry-membermsg").checked!=botData.configs.membermsg) {
        document.getElementById("manageentry-membermsg").checked = botData.configs.membermsg;
    }
    if(document.getElementById("manageentry-spamfilter").checked!=botData.configs.spamfilter) {
        document.getElementById("manageentry-spamfilter").checked = botData.configs.spamfilter;
    }
    if(document.getElementById("manageentry-nsfwfilter").checked!=botData.configs.nsfwfilter) {
        document.getElementById("manageentry-nsfwfilter").checked = botData.configs.nsfwfilter;
    }
    
    
    if(botData.configs.newgreeting && botData.configs.servermod) {
        document.getElementById("manageentry-newgreeting").innerHTML = "<textarea id=\"newgreetinginput\" style=\"float:left; height: 40; width: 400;\" placeholder=\"Message shown to new members, in markdown\">" + botData.configs.newgreeting + "</textarea>&nbsp;<span class=\"removetool\" id=\"newgreetingsubmit\" onclick=\"javascript:newNewgreeting();\"><i>(submit)</i></span><br>&nbsp;<span class=\"removetool\" id=\"newgreetingremove\" onclick=\"javascript:configNewgreeting();\"><i>(remove)</i></span>";
    } else if(!botData.configs.servermod) {
        document.getElementById("manageentry-newgreeting").innerHTML = "";
    } else {
        document.getElementById("manageentry-newgreeting").innerHTML = "<span class=\"removetool\" onclick=\"javascript:configNewgreeting();\"><i>Custom greeting for new members not set.</i></span>";
    }
    
    document.getElementById("closeall").innerHTML = "Close " + botData.closenum + " ongoing trivia game" + (botData.closenum==1 ? "" : "s") + " and/or poll" + (botData.closenum==1 ? "" : "s");
    if(botData.closenum==0) {
        document.getElementById("closeall").style.display = "none";
        document.getElementById("closeallspace").style.display = "none";
    } else {
        document.getElementById("closeall").style.display = "";
        document.getElementById("closeallspace").style.display = "";
    }
    
    document.getElementById("cleanselector").innerHTML = "<option value=\"\">Select Channel</option>";
    document.getElementById("archiveselector").innerHTML = "<option value=\"\">Select Channel</option>";
    for(var i=0; i<botData.channels.length; i++) {
        document.getElementById("cleanselector").innerHTML += "<option id=\"cleanentry-" + botData.channels[i][1] + "\" value=\"cleanentry-" + botData.channels[i][1] + "\">#" + botData.channels[i][0] + "</option>";
        document.getElementById("archiveselector").innerHTML += "<option id=\"cleanentry-" + botData.channels[i][1] + "\" value=\"archiveentry-" + botData.channels[i][1] + "\">#" + botData.channels[i][0] + "</option>";
    }
}

function configNewgreeting() {
    if(!document.getElementById("newgreetinginput")) {
        document.getElementById("manageentry-newgreeting").innerHTML = "<textarea id=\"newgreetinginput\" style=\"float:left; height: 40; width: 400;\" placeholder=\"Message shown to new members, in markdown\" onkeydown=\"if(event.keyCode==27){configNewgreeting()}\"></textarea>&nbsp<span class=\"removetool\" id=\"newgreetingsubmit\" onclick=\"javascript:newNewgreeting();\"><i>(submit)</i></span><br><br><br>";
        document.getElementById("newgreetinginput").focus();
    } else {
        config('newgreeting', "", function(err) {
            if(!err) {
                switchManage();
            }
        })
    }
}

function newNewgreeting() {
    if(!document.getElementById("newgreetinginput").value) {
        alert("New member greeting cannot be blank");
    } else {
        config('newgreeting', document.getElementById("newgreetinginput").value, function(err) {
            if(!err) {
                switchManage();
            }
        });
    }
}

function configCA(type) {
    var chid = document.getElementById(type + "selector").value.slice(0).substring(type.length + 6);
    var num = document.getElementById(type + "input").value.slice(0);
    if(!chid || !num) {
        alert("Select a channel and provide number of messages to " + type);
        return;
    }
    if(isNaN(num)) {
        alert("Number of messages must be a number");
        return;
    }
    
    showLoader();
    if(type=="clean") {
        config(type, [chid, parseInt(num)], function() {
            alert("Cleaned " + num + " messages in " + document.getElementById("cleanentry-" + chid).innerHTML);
        });
        destroyLoader();
    } else if(type=="archive") {
        alert("Enable pop-ups in your browser. Save archive by right clicking -> save as -> data.json");
        getJSON("/archive?auth=" + authtoken + "&type=" + authtype + "&svrid=" + JSON.parse(localStorage.getItem("auth")).svrid + "&chid=" + chid + "&num=" + num, function(archive) {
            window.open("data:text/json;charset=utf-8," + escape(JSON.stringify(archive)));
            destroyLoader();
            switchManage();
        });
    }
}

function switchTriviaSets() {
    document.getElementById("triviasetstable").style.display = "";
    
    var triviasetstablebody = "";
    for(var i=0; i<botData.configs.triviasets.length; i++) {
        triviasetstablebody += "<tr id=\"triviasetsentry-" + encodeURI(botData.configs.triviasets[i][0]) + "\"><td>" + botData.configs.triviasets[i][0] + "</td><td>" + botData.configs.triviasets[i][1] + "</td><td><span class=\"removetool\" onclick=\"javascript:config('triviasets', this.parentNode.parentNode.id.substring(16), switchTriviaSets);\"><i>(remove)</i></span></td></tr>";
    }
    document.getElementById("triviasetstablebody").innerHTML = triviasetstablebody;
    if(botData.configs.triviasets.length==0) {
        document.getElementById("triviasetstable").style.display = "none";
    }
}

function newTriviaSet(uploads) {
    if(!uploads) {
        alert("Upload a file and enter a name");
        return;
    }
    
    var reader = new FileReader();
    reader.onload = function(event) {
        try {
            var tset = JSON.parse(event.target.result);
            config("triviasets", tset, function(err) {
                if(err) {
                    alert("Error adding trivia set, see logs for details");
                } else {
                    switchTriviaSets();
                }
            });
        } catch(err) {
            alert("File must be JSON format");
        }
    };
    reader.readAsText(uploads[0]);
}

function switchExtensions() {
    document.getElementById("extensionstable").style.display = "";
    
    var extensionstablebody = "";
    for(var i=0; i<botData.configs.extensions.length; i++) {
        var info = "<tr id=\"extensionsentry-" + encodeURI(botData.configs.extensions[i][0]) + "\"><td>" + botData.configs.extensions[i][0] + "</td><td>" + botData.configs.extensions[i][1] + "</td><td>";
        if(botData.configs.extensions[i][2]) {
            var chinfo = "";
            for(var j=0; j<botData.configs.extensions[i][2].length; j++) {
                chinfo += "#" + botData.configs.extensions[i][2][j] + ", ";
            }
            info += chinfo.substring(0, chinfo.length-2);
        } else {
            info += "All";
        }
        info += "</td><td><span class=\"removetool\" onclick=\"javascript:config('extensions', this.parentNode.parentNode.id.substring(16), switchExtensions);\"><i>(remove)</i></span>&nbsp;<span class=\"removetool\" onclick=\"javascript:showExtension(" + i + ");\"><i>(view code)</i></span></td></tr>";
        extensionstablebody += info;
    }
    document.getElementById("extensionstablebody").innerHTML = extensionstablebody;
    if(botData.configs.extensions.length==0) {
        document.getElementById("extensionstable").style.display = "none";
    }
}

function showExtension(i) {
    window.open("data:text/json;charset=utf-8," + escape(JSON.stringify(botData.configs.extensions[i][3])));
}

function newExtension(uploads) {
    if(!uploads) {
        alert("Upload a file and enter a name");
        return;
    }
    
    var reader = new FileReader();
    reader.onload = function(event) {
        try {
            var extension = JSON.parse(event.target.result);
            config("extensions", extension, function(err) {
                if(err) {
                    alert("Error adding extension, see logs for details");
                } else {
                    switchExtensions();
                }
            });
        } catch(err) {
            alert("File must be JSON format");
        }
    };
    reader.readAsText(uploads[0]);
}

function leaveServer() {
    var u = confirm("Bot will leave this server. Are you sure?");
    if(u) {
        config("leave", true, function(err) {
            localStorage.removeItem("auth");
            document.location.replace("/");
        });
    }
}