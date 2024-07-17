import fs from "fs"

const userLog = (req, loggedInUser) => {


    const logs = `${loggedInUser.fullName} with ip ${req.ip} logged in on ${new Date().toLocaleString()}`

    fs.appendFile('./src/log/log.txt', `${logs}\n`, function (err) {
        if (err) {
            console.log(err);
        } 
    })

    fs.readFile("./src/log/totalVisits.txt", "utf-8", (err, data) => {
        if (err) {
            console.log("Error ", err);
           
        }

        const count = Number(data) + 1

        fs.writeFile("./src/log/totalVisits.txt", count.toString(), () => {
            if (err) {
                console.log("Error ", err);
               
            }
        })


    })
}


export { userLog }