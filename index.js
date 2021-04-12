const bodyparser = require("body-parser")
const mongoose = require("mongoose")
const express = require("express")
const fs = require("fs")
const { setInterval } = require("timers")
const app = express()
const xmpp_app = express()
const PORT = process.env.PORT || 3000;

const logging = require(`${__dirname}/structs/logs`)
const config = require(`${__dirname}/config.json`)

require("./xmpp")

//i know global isn't the best practice, but it works good enough
global.exchangeCodes = {}
global.clientTokens = []
global.accessTokens = []
global.xmppClients = {}
global.parties = []
global.invites = []
global.pings = []

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))

//db
mongoose.connect("mongodb://GD:Tjlovetj12@cluster0-shard-00-00.j2kbj.mongodb.net:27017,cluster0-shard-00-01.j2kbj.mongodb.net:27017,cluster0-shard-00-02.j2kbj.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-13grh5-shard-0&authSource=admin&retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true}, async e => {
    if (e) throw e
    logging.fdev(`Connected to Mongo DB`)
})

app.use(require(`${__dirname}/routes`))

//services
app.use("/waitingroom", require(`${__dirname}/routes/services/waitingroom`))
app.use("/lightswitch", require(`${__dirname}/routes/services/lightswitch`))
app.use("/datarouter", require(`${__dirname}/routes/services/datarouter`))
app.use("/fortnite", require(`${__dirname}/routes/services/fortnite`))
app.use("/presence", require(`${__dirname}/routes/services/presence`))
app.use("/content", require(`${__dirname}/routes/services/content`))
app.use("/account", require(`${__dirname}/routes/services/account`))
app.use("/friends", require(`${__dirname}/routes/services/friends`))
app.use("/party", require(`${__dirname}/routes/services/party`))
app.use(require(`${__dirname}/routes/services/misc`))

setInterval(() => {
    parties.forEach(party => {
        party.members.forEach(member => {
            //this should delete member from party and then check if party size is 1 or smaller
            if (!xmppClients[member]) {
                let index = party.members.indexOf(member);
                if (!index) {
                    party.members.splice(index, 1);
                }
            }
        })

        if (party.members.length <= 0) {
            let index = parties.indexOf(party)
            if (!index) {
                parties.splice(index, 1)
            }
        }
    })
}, 3000)

global.serverversion = "1.5"

app.listen(PORT, () => {
    logging.fdev(`Listening on port \x1b[36m${process.env.port}`)
})
