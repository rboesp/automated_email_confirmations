const fs = require("fs")
const util = require("util")

const readFileAsync = util.promisify(fs.readFile)
const writeFileAsync = util.promisify(fs.writeFile)

const time_frame = 3

async function start() {
    const fileStr = await readFileAsync("upcoming_sessions.json", "utf8")
    let upcoming_sessions = []
    try {
        if (fileStr) upcoming_sessions = JSON.parse(fileStr)
    } catch (err) {
        throw new Error("File parse failed")
    }
    // console.log(upcoming_sessions)

    const sentFileStr = await readFileAsync("sent_sessions.json", "utf8")
    let sent_sessions = []
    try {
        if (sentFileStr) sent_sessions = JSON.parse(sentFileStr)
    } catch (err) {
        throw new Error("File parse failed")
    }
    // if (sent_sessions) console.log(sent_sessions)
    // else console.log("No sent sessions")

    //first get id's of sent seshs in array then use that one in line 32
    let sent_ids = []
    sent_sessions.forEach((session) => {
        sent_ids.push(session.id)
    })

    console.log(sent_ids)

    //if any upcoming sessions not in sent sessions
    let to_send = []
    upcoming_sessions.map((session) => {
        let time = diff_hours(new Date(), new Date(session.data.startTime)) / 24
        if (!sent_ids.includes(session.id)) {
            if (time < time_frame) {
                console.log(`Within ${time_frame}`)
                console.log("Putting session in to send file!")
                to_send.push(session)
            }
        } else console.log("Already sent reminder email!")
    })

    // console.log(to_send)
    await writeFileAsync("sessions_to_send.json", JSON.stringify(to_send))
    console.log("Put upcoming sessions in to-send file!")
}

start()

function diff_hours(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000
    diff /= 60 * 60
    return Math.abs(Math.round(diff))
}